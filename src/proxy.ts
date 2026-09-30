import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { getEnv } from "@/lib/env";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }
  if (!request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(new URL("/admin/login", getEnv().APP_URL));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
