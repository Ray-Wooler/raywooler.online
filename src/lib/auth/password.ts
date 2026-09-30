import { randomBytes, scrypt as scryptCallback, scryptSync, timingSafeEqual } from "node:crypto";

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      KEY_LENGTH,
      { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION, maxmem: MAX_MEMORY },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}
const COST = 32_768;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;
const DUMMY_SALT = Buffer.from("raywooler-auth-dummy-salt", "utf8");
const DUMMY_HASH = scryptSync("invalid-placeholder-only", DUMMY_SALT, KEY_LENGTH, {
  N: COST,
  r: BLOCK_SIZE,
  p: PARALLELIZATION,
  maxmem: MAX_MEMORY,
}).toString("base64url");

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validEmail(value: string): boolean {
  return value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validPassword(value: string): boolean {
  return Array.from(value).length >= 14 && Buffer.byteLength(value, "utf8") <= 1024;
}

export async function hashPassword(password: string): Promise<string> {
  if (!validPassword(password)) throw new Error("Password must be between 14 and 1024 UTF-8 bytes");
  const salt = randomBytes(16);
  const derived = await deriveKey(password, salt);
  return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLELIZATION}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export async function verifyPassword(password: string, encoded: string | null): Promise<boolean> {
  const parts = encoded?.split("$") ?? [];
  const validFormat =
    parts.length === 6 &&
    parts[0] === "scrypt" &&
    parts[1] === String(COST) &&
    parts[2] === String(BLOCK_SIZE) &&
    parts[3] === String(PARALLELIZATION) &&
    parts[4] !== undefined &&
    parts[5] !== undefined;
  const salt = validFormat ? Buffer.from(parts[4] ?? "", "base64url") : DUMMY_SALT;
  const expected = validFormat
    ? Buffer.from(parts[5] ?? "", "base64url")
    : Buffer.from(DUMMY_HASH, "base64url");
  const candidate =
    Buffer.byteLength(password, "utf8") <= 1024 ? password : "invalid-password-input";
  if (expected.length !== KEY_LENGTH || salt.length < 16 || !validFormat) {
    await deriveKey(candidate, DUMMY_SALT);
    return false;
  }
  const actual = await deriveKey(candidate, salt);
  return timingSafeEqual(actual, expected);
}
