# Gate 3 — Persistence & Admin Identity Evidence

**Status:** Automated gates passed; owner acceptance pending
**Branching:** Based on accepted Gate 2 merge `2cce3aa1a90e70eeae9b1150049343544e9539c6`; planned PR targets `main`. `main` is unprotected, so the PR must remain unmerged until repository governance is restored.

## Intended scope

- PostgreSQL identity/session/throttle/audit tables and a committed Drizzle migration.
- One explicitly provisioned owner account; no public registration.
- Password sign-in, same-origin auth mutations, HTTP-only session cookie, server-side admin authorization, logout and logout-all.
- Security audit events and explicit host-mediated password recovery.

## Verification evidence

- `pnpm install --frozen-lockfile`: PASS.
- `pnpm check`: PASS — format, lint, TypeScript, 10 unit tests passed (the integration file is skipped in this generic local run), and optimized production build.
- Migration generation: PASS — Drizzle generated the owner identity/session/audit schema and the single-owner constraint migration from repository schema.
- `git diff --check`: PASS.
- Local Node is v24.19.0; supported project/CI runtime is Node 22.
- GitHub Actions run `36651863441` passed on commit `5481128ef50e2579233f1733c7b889adb29aa616`: migration apply; format; lint; typecheck; unit suite (10 passed, 1 skipped); PostgreSQL integration test (1 passed); build; guarded ephemeral owner seed; and all 8 Chromium E2E tests (including unauthenticated denial, successful sign-in, cookie properties, sign-out-all, origin rejection and throttling).

## Exclusions and remaining release work

Content editing belongs to Gate 4. Public enquiry and AI paths belong to Gate 5. TOTP, reverse-proxy network rate limiting, security headers/CSP, dependency/security review, production backup/restore, and live credentials remain separate hardening or release work. No production service or account has been modified.
