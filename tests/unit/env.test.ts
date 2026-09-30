import { describe, expect, it } from "vitest";
import { getEnv, requireDatabaseUrl } from "../../src/lib/env";

describe("application environment", () => {
  it("supplies safe local defaults when optional values are absent", () => {
    expect(getEnv({})).toEqual({
      NODE_ENV: "development",
      APP_URL: "http://localhost:3000",
      DATABASE_URL: undefined,
      LOG_LEVEL: "info",
    });
  });

  it("rejects malformed URLs with field names only", () => {
    expect(() => getEnv({ APP_URL: "not a URL" })).toThrow("APP_URL");
    expect(() => getEnv({ DATABASE_URL: "not a URL" })).toThrow("DATABASE_URL");
  });

  it("requires HTTPS for production application URLs", () => {
    expect(() => getEnv({ NODE_ENV: "production", APP_URL: "http://raywooler.online" })).toThrow(
      "APP_URL",
    );
    expect(getEnv({ NODE_ENV: "production", APP_URL: "https://raywooler.online" }).APP_URL).toBe(
      "https://raywooler.online",
    );
    expect(getEnv({ NODE_ENV: "production", APP_URL: "http://127.0.0.1:3000" }).APP_URL).toBe(
      "http://127.0.0.1:3000",
    );
  });

  it("requires an explicit database URL for database operations", () => {
    expect(() => requireDatabaseUrl({})).toThrow("DATABASE_URL must be configured");
    expect(requireDatabaseUrl({ DATABASE_URL: "postgres://app:app@localhost:5432/app" })).toBe(
      "postgres://app:app@localhost:5432/app",
    );
  });
});
