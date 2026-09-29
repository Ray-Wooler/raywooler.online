import "server-only";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema } from "@/db/schema";
import { requireDatabaseUrl } from "@/lib/env";

let sql: ReturnType<typeof postgres> | undefined;
let database: PostgresJsDatabase<typeof schema> | undefined;

export function getDatabase(): PostgresJsDatabase<typeof schema> {
  if (database) return database;
  sql = postgres(requireDatabaseUrl(), {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  database = drizzle(sql, { schema });
  return database;
}

export async function closeDatabase(): Promise<void> {
  if (!sql) return;
  const client = sql;
  sql = undefined;
  database = undefined;
  await client.end({ timeout: 5 });
}
