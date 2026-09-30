# Gate 3 — Persistence & Admin Identity Evidence

**Status:** Implemented locally; remote CI pending; not accepted
**Branching:** Based on accepted Gate 2 merge `2cce3aa1a90e70eeae9b1150049343544e9539c6`; planned PR targets `main`. `main` is unprotected, so the PR must remain unmerged until repository governance is restored.

## Intended scope

- PostgreSQL identity/session/throttle/audit tables and a committed Drizzle migration.
- One explicitly provisioned owner account; no public registration.
- Password sign-in, same-origin auth mutations, HTTP-only session cookie, server-side admin authorization, logout and logout-all.
- Security audit events and explicit host-mediated password recovery.

## Verification evidence

- `pnpm install --frozen-lockfile`: PASS.
- `pnpm check`: PASS — format, lint, TypeScript, 10 unit tests passed (1 integration suite skipped without local PostgreSQL), and optimized production build.
- Migration generation: PASS — Drizzle generated both the identity schema and the single-owner constraint migration from repository schema.
- `git diff --check`: PASS.
- Local database migration/integration and Playwright E2E: not executed; this workspace has no PostgreSQL/Docker service and no Playwright browser binary. CI is configured to apply migrations, run integration tests, seed a loopback-only disposable owner, and run browser tests for unauthenticated denial, sign-in, session attributes, sign-out-all and login throttling.
- Local Node is v24.19.0; supported project/CI runtime is Node 22.

## Exclusions and remaining release work

Content editing belongs to Gate 4. Public enquiry and AI paths belong to Gate 5. TOTP, reverse-proxy network rate limiting, security headers/CSP, dependency/security review, production backup/restore, and live credentials remain separate hardening or release work. No production service or account has been modified.
