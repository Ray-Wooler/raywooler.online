import { describe, expect, it } from "vitest";
import {
  hashPassword,
  normalizeEmail,
  validEmail,
  validPassword,
  verifyPassword,
} from "../../../src/lib/auth/password";

describe("owner credential validation", () => {
  it("normalizes email and validates basic address shape", () => {
    expect(normalizeEmail("  Ray@Example.COM ")).toBe("ray@example.com");
    expect(validEmail("ray@example.com")).toBe(true);
    expect(validEmail("not-an-email")).toBe(false);
  });

  it("requires strong passwords and stores only a scrypt verifier", async () => {
    expect(validPassword("short")).toBe(false);
    const password = "correct horse battery staple 2026";
    const encoded = await hashPassword(password);
    expect(encoded).toMatch(/^scrypt\$32768\$8\$1\$/);
    expect(await verifyPassword(password, encoded)).toBe(true);
    expect(await verifyPassword("incorrect password 2026", encoded)).toBe(false);
    expect(await verifyPassword(password, null)).toBe(false);
  });
});
