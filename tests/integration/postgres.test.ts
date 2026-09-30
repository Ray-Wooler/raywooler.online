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

  it("applies the identity and Gate 4 portfolio content schema", async () => {
    if (!sql) throw new Error("PostgreSQL client was not initialised");
    const rows = await sql`select
      to_regclass('public.users') is not null as users,
      to_regclass('public.sessions') is not null as sessions,
      to_regclass('public.auth_login_limits') is not null as login_limits,
      to_regclass('public.audit_events') is not null as audit_events`;
    const content = await sql`select
      to_regclass('public.projects') is not null as projects,
      to_regclass('public.services') is not null as services,
      to_regclass('public.skills') is not null as skills,
      to_regclass('public.experience') is not null as experience,
      to_regclass('public.pages') is not null as pages,
      to_regclass('public.content_revisions') is not null as revisions,
      to_regclass('public.media_assets') is not null as media`;
    expect(rows[0]).toEqual({
      users: true,
      sessions: true,
      login_limits: true,
      audit_events: true,
    });
    expect(content[0]).toEqual({
      projects: true,
      services: true,
      skills: true,
      experience: true,
      pages: true,
      revisions: true,
      media: true,
    });
  });
});
