import { eq } from "drizzle-orm";
import { closeDatabase, getDatabase } from "@/db/connection";
import { users } from "@/db/schema";
import { hashPassword, normalizeEmail, validEmail, validPassword } from "@/lib/auth/password";

async function main() {
  if (process.env.CI !== "true" || process.env.NODE_ENV !== "test") {
    throw new Error("The test owner may only be seeded by CI in test mode.");
  }
  const databaseUrl = new URL(process.env.DATABASE_URL ?? "");
  if (!["localhost", "127.0.0.1", "::1"].includes(databaseUrl.hostname)) {
    throw new Error("The test owner may only be seeded into a loopback database.");
  }
  const email = normalizeEmail(process.env.E2E_ADMIN_EMAIL ?? "");
  const password = process.env.E2E_ADMIN_PASSWORD ?? "";
  if (!validEmail(email) || !validPassword(password))
    throw new Error("E2E owner credentials are not valid.");
  const db = getDatabase();
  const current = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (current) {
    await db
      .update(users)
      .set({ passwordHash: await hashPassword(password), isActive: true })
      .where(eq(users.id, current.id));
  } else {
    await db
      .insert(users)
      .values({ email, passwordHash: await hashPassword(password), role: "owner" });
  }
}

main()
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : "Test seed failed."}\n`);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
