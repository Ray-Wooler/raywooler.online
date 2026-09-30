import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDatabase } from "@/db/client";
import { getEnv } from "@/lib/env";
import { auditEvents, users } from "@/db/schema";
import { hasTrustedOrigin } from "@/lib/auth/csrf";
import {
  clearLoginFailures,
  emailDigest,
  isLoginBlocked,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import {
  issueSession,
  removeExpiredSessions,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth/session";
import { normalizeEmail, verifyPassword } from "@/lib/auth/password";

const genericFailurePath = "/admin/login?error=1";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > 8_192)
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });

  let body: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 8_192) {
        await reader.cancel();
        return NextResponse.json({ error: "Request is too large." }, { status: 413 });
      }
      chunks.push(chunk.value);
    }
    body = await new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: Buffer.concat(chunks),
    }).formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }
  const emailValue = body.get("email");
  const passwordValue = body.get("password");
  if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
    return NextResponse.redirect(new URL(genericFailurePath, getEnv().APP_URL), 303);
  }
  const email = normalizeEmail(emailValue);
  const digest = emailDigest(email);
  if (await isLoginBlocked(digest)) {
    return NextResponse.redirect(new URL(genericFailurePath, getEnv().APP_URL), 303);
  }

  const owner = await getDatabase().query.users.findFirst({ where: eq(users.email, email) });
  const passwordValid = await verifyPassword(passwordValue, owner?.passwordHash ?? null);
  if (!owner?.isActive || owner.role !== "owner" || !passwordValid) {
    await recordLoginFailure(digest);
    await getDatabase().insert(auditEvents).values({ eventType: "LOGIN_FAILURE" });
    return NextResponse.redirect(new URL(genericFailurePath, getEnv().APP_URL), 303);
  }

  await clearLoginFailures(digest);
  await removeExpiredSessions();
  const session = await issueSession(owner.id);
  const response = NextResponse.redirect(new URL("/admin", getEnv().APP_URL), 303);
  response.cookies.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: new URL(getEnv().APP_URL).protocol === "https:",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
    maxAge: SESSION_DURATION_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
