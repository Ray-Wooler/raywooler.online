# Security baseline

## Gate 1 controls

- `.env` and all `.env.*` files are ignored; only `.env.example` is tracked.
- Environment configuration is parsed and validated with Zod. Error messages name invalid fields and do not print values.
- PostgreSQL development service binds to loopback only and uses disposable local-only credentials.
- The production architecture places PostgreSQL behind the private application network and keeps OpenAI keys server-side.
- CI runs on a supported Node.js LTS major; application source uses strict TypeScript.

## Planned controls in later gates

Authentication, password/session handling, CSRF, role checks, rate limiting, audit events, privacy/retention, safe media upload and AI boundaries are requirements, not implemented Gate 1 features. They must be reviewed and tested in their own gates before staging.

## Operational risks

No auth endpoints exist yet, so there is no admin surface to secure. Do not configure production secrets or expose this foundation as the finished portfolio. The local Postgres password is public and must never be used outside a developer workstation or CI ephemeral service. Production hardening, dependency review, browser security headers and backup restore drill remain required.
