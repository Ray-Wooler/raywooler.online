# Gate 2 — Public Portfolio Core Evidence

**Status:** Accepted by owner and merged to `main`
**Pull request:** #2 — merged
**Merge commit:** `2cce3aa1a90e70eeae9b1150049343544e9539c6`
**Verification:** GitHub Actions run `36622587079` passed on the final PR head.
**Scope:** Public portfolio pages and statically rendered content only.

## Implemented

- Responsive home, about, projects and project details, services, skills, experience, AI/systems principles, and contact shell.
- Shared navigation/footer, visible focus styles, skip link, reduced-motion handling, system light/dark presentation, metadata, canonical URLs, OpenGraph metadata, Person JSON-LD, sitemap, robots policy, and 404 state.
- Explicit project maturity and owner-disclosure review markers; private client work and unsupported metrics are excluded. Experience is represented at role-family level pending verified employment details.
- Contact is informational and disabled: it sends and stores no data. Authentication, persistent content, enquiry submission, and AI endpoints are outside this gate.

## Verification

- `pnpm check`: PASS (format, lint, TypeScript, unit tests, production build).
- Unit tests: 7 passed; 1 database integration test skipped because no `TEST_DATABASE_URL` was configured locally.
- `pnpm test:integration`: test skipped for the same reason.
- GitHub Actions run `36621984225`: format, lint, typecheck, unit tests, PostgreSQL integration test, production build, and Chromium installation passed. E2E reported 4 passed and 1 failed because the sitemap omitted project detail URLs. A follow-up commit restored project detail URLs. Run `36622324843` succeeded on commit `b90c60338911b759952add080d32c23ed884e28f`, including all five Chromium E2E tests and the PostgreSQL integration test.
- Local Node is v24.19.0 while the project and CI target Node 22; CI provides the supported runtime verification.

## Acceptance conditions

Owner acceptance is recorded by the PR merge. GitHub still reports `main` as unprotected and no rulesets as configured; this governance gap remains open for subsequent integration. Production release remains a separate owner-authorized action.
