import "server-only";
import { getEnv } from "@/lib/env";

export function hasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(getEnv().APP_URL).origin;
  } catch {
    return false;
  }
}
