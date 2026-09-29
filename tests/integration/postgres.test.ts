import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.TEST_DATABASE_URL;
const suite = databaseUrl ? describe : describe.skip;
let sql: ReturnType<typeof postgres> | undefined;

suite("PostgreSQL development service", () => {
  beforeAll(() => {
    if (!databaseUrl) throw new Error("TEST_DATABASE_URL is required for this integration test");
    sql = postgres(databaseUrl, { max: 1, prepare: false, connect_timeout: 5 });
  });

  afterAll(async () => {
    await sql?.end({ timeout: 2 });
  });

  it("accepts a connection and executes a query", async () => {
    if (!sql) throw new Error("PostgreSQL client was not initialised");
    const rows = await sql`select 1::int as connected`;
    expect(rows[0]?.connected).toBe(1);
  });
});
