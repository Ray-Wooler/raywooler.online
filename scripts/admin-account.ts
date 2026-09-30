import { loadEnvConfig } from "@next/env";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db/connection";
import { auditEvents, sessions, users } from "@/db/schema";
import { hashPassword, normalizeEmail, validEmail, validPassword } from "@/lib/auth/password";

async function askEmail(prompt: string): Promise<string> {
  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    return normalizeEmail(await terminal.question(prompt));
  } finally {
    terminal.close();
  }
}

async function askSecret(prompt: string): Promise<string> {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function")
    throw new Error("Run this command in an interactive terminal so the password is not echoed.");
  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const finish = (error?: Error) => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (buffer: Buffer) => {
      for (const char of buffer.toString("utf8")) {
        if (char === "\u0003") return finish(new Error("Cancelled."));
        if (char === "\r" || char === "\n") return finish();
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else if (char >= " " && char <= "~") value += char;
      }
    };
    stdin.on("data", onData);
  });
}

loadEnvConfig(process.cwd());

async function main() {
  const command = process.argv[2];
  if (command !== "create" && command !== "reset-password")
    throw new Error("Usage: pnpm admin:create | pnpm admin:reset-password");
  const email = await askEmail("Owner email: ");
  if (!validEmail(email)) throw new Error("Enter a valid email address.");
  const db = getDatabase();
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (command === "create" && existing)
    throw new Error("An account already exists for that email.");
  if (command === "reset-password" && !existing)
    throw new Error("No account exists for that email.");
  if (command === "create" && (await db.select({ id: users.id }).from(users).limit(1)).length > 0) {
    throw new Error("An owner account already exists. Use the recovery command instead.");
  }
  const password = await askSecret("New password (input hidden): ");
  const confirmation = await askSecret("Confirm password (input hidden): ");
  if (password !== confirmation) throw new Error("Passwords do not match.");
  if (!validPassword(password))
    throw new Error("Password must be at least 14 characters and at most 1024 UTF-8 bytes.");
  const passwordHash = await hashPassword(password);

  if (command === "create") {
    await db.transaction(async (tx) => {
      const [owner] = await tx
        .insert(users)
        .values({ email, passwordHash, role: "owner" })
        .returning({ id: users.id });
      if (!owner) throw new Error("Could not create owner account.");
      await tx.insert(auditEvents).values({
        eventType: "OWNER_CREATED_BY_OPERATOR",
        metadata: { targetUserId: owner.id, actor: "host-operator" },
      });
    });
    stdout.write(
      "Owner account created. Remove the initial credential record from any local notes and keep host access restricted.\n",
    );
    return;
  }

  if (!existing) throw new Error("Account disappeared during password recovery.");
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, existing.id));
    await tx.delete(sessions).where(eq(sessions.userId, existing.id));
    await tx.insert(auditEvents).values({
      eventType: "OWNER_PASSWORD_RESET_BY_OPERATOR",
      metadata: { targetUserId: existing.id, actor: "host-operator" },
    });
  });
  stdout.write("Password reset. All existing sessions were revoked.\n");
}

main()
  .catch((error: unknown) => {
    stdout.write(`${error instanceof Error ? error.message : "Account operation failed."}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { closeDatabase } = await import("@/db/connection");
    await closeDatabase();
  });
