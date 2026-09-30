import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { hasTrustedOrigin } from "@/lib/auth/csrf";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getAuthenticatedOwner, revokeAllSessions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  await revokeAllSessions(owner.id);
  const response = NextResponse.redirect(new URL("/admin/login?revoked=1", getEnv().APP_URL), 303);
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: new URL(getEnv().APP_URL).protocol === "https:",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
