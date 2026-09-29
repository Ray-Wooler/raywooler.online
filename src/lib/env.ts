import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.url().optional(),
  ),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: Readonly<Record<string, string | undefined>> = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid application environment: ${fields}`);
  }
  return parsed.data;
}

export function requireDatabaseUrl(
  source: Readonly<Record<string, string | undefined>> = process.env,
): string {
  const url = getEnv(source).DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL must be configured for this operation");
  return url;
}
