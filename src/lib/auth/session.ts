import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db/client";
import { auditEvents, sessions, users } from "@/db/schema";
import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/auth/constants";

export type AuthenticatedOwner = {
  id: string;
  email: string;
  sessionId: string;
};

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function getAuthenticatedOwner(): Promise<AuthenticatedOwner | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token || token.length > 128) return null;
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const [row] = await getDatabase()
    .select({
      id: users.id,
      email: users.email,
      sessionId: sessions.id,
      lastSeenAt: sessions.lastSeenAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now), eq(users.isActive, true)),
    )
    .limit(1);
  if (!row) return null;
  if (now.getTime() - row.lastSeenAt.getTime() > 5 * 60 * 1000) {
    await getDatabase()
      .update(sessions)
      .set({ lastSeenAt: now })
      .where(eq(sessions.id, row.sessionId));
  }
  return { id: row.id, email: row.email, sessionId: row.sessionId };
}

export async function requireAdmin(): Promise<AuthenticatedOwner> {
  const owner = await getAuthenticatedOwner();
  if (!owner) redirect("/admin/login");
  return owner;
}

export async function issueSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const sessionId = await getDatabase().transaction(async (tx) => {
    const [session] = await tx
      .insert(sessions)
      .values({ userId, tokenHash: hashSessionToken(token), expiresAt })
      .returning({ id: sessions.id });
    if (!session) throw new Error("Could not establish administrative session");
    await tx.insert(auditEvents).values({ eventType: "LOGIN_SUCCESS", actorUserId: userId });
    return session.id;
  });
  return { token, expiresAt, sessionId };
}

export async function revokeSessionByToken(token: string): Promise<string | null> {
  return getDatabase().transaction(async (tx) => {
    const [session] = await tx
      .delete(sessions)
      .where(eq(sessions.tokenHash, hashSessionToken(token)))
      .returning({ userId: sessions.userId });
    if (!session) return null;
    await tx.insert(auditEvents).values({ eventType: "LOGOUT", actorUserId: session.userId });
    return session.userId;
  });
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await getDatabase().transaction(async (tx) => {
    await tx.delete(sessions).where(eq(sessions.userId, userId));
    await tx.insert(auditEvents).values({ eventType: "LOGOUT_ALL", actorUserId: userId });
  });
}

export async function removeExpiredSessions(): Promise<void> {
  await getDatabase().delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
