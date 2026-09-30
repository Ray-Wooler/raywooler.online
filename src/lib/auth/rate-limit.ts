import "server-only";
import { createHash } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { authLoginLimits } from "@/db/schema";
import { normalizeEmail } from "@/lib/auth/password";

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_BLOCK_MS = 15 * 60 * 1000;

export function emailDigest(email: string): string {
  return createHash("sha256").update(normalizeEmail(email)).digest("hex");
}

export async function isLoginBlocked(digest: string, now = new Date()): Promise<boolean> {
  const db = getDatabase();
  await db
    .delete(authLoginLimits)
    .where(lt(authLoginLimits.windowStartedAt, new Date(now.getTime() - 24 * 60 * 60 * 1000)));
  const row = await db.query.authLoginLimits.findFirst({
    where: and(eq(authLoginLimits.emailDigest, digest), gt(authLoginLimits.blockedUntil, now)),
  });
  return Boolean(row);
}

export async function recordLoginFailure(digest: string, now = new Date()): Promise<void> {
  const db = getDatabase();
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${digest}, 0))`);
    const previous = await tx.query.authLoginLimits.findFirst({
      where: eq(authLoginLimits.emailDigest, digest),
    });
    const windowValid =
      previous && now.getTime() - previous.windowStartedAt.getTime() < LOGIN_WINDOW_MS;
    const attempts = windowValid ? previous.attempts + 1 : 1;
    const blockedUntil =
      attempts >= LOGIN_MAX_FAILURES ? new Date(now.getTime() + LOGIN_BLOCK_MS) : null;
    await tx
      .insert(authLoginLimits)
      .values({
        emailDigest: digest,
        attempts,
        windowStartedAt: windowValid ? previous.windowStartedAt : now,
        blockedUntil,
      })
      .onConflictDoUpdate({
        target: authLoginLimits.emailDigest,
        set: {
          attempts,
          windowStartedAt: windowValid ? previous.windowStartedAt : now,
          blockedUntil,
        },
      });
  });
}

export async function clearLoginFailures(digest: string): Promise<void> {
  await getDatabase().delete(authLoginLimits).where(eq(authLoginLimits.emailDigest, digest));
}
