# Security baseline

## Repository and infrastructure

- `.env` and `.env.*` are ignored; `.env.example` contains names and development-only values.
- Zod validates runtime configuration; error messages name fields without printing values. A non-loopback production `APP_URL` must use HTTPS; HTTP is accepted only for loopback development and CI preview.
- PostgreSQL development binds to loopback. Production database access must remain private to the application network.
- Migrations are repository-controlled. Do not edit production schema manually.
- CI verifies Node 22, PostgreSQL 16, lint, types, tests, migrations, build, and browser paths.

## Gate 3 authentication boundary

- There is no public registration. `pnpm admin:create` creates the first owner from a controlled interactive host terminal; creation is refused once an account exists.
- Passwords are hashed with Node.js `scrypt` (N=32768, r=8, p=1, 64-byte output, random 16-byte salt). Password input for provisioning and recovery is not echoed.
- Session tokens contain 256 bits of random entropy. Only SHA-256 token digests are stored. Cookies are HTTP-only, SameSite=Lax, path `/`, and Secure for HTTPS application origins. Sessions have a 12-hour absolute expiry.
- All auth mutations reject requests without an exact same-origin `Origin` header. The application uses same-origin routes; do not add permissive CORS.
- Login failures receive one generic response for unknown, inactive, or incorrect accounts. Per-normalized-email throttling blocks after five failures within 15 minutes for 15 minutes. Digests are removed after 24 hours; raw email/IP/password values are not logged.
- Admin pages perform server-side session and active-owner checks. `src/proxy.ts` is a coarse unauthenticated-request redirect only; it is not an authorization decision. Route handlers and server components must continue to authorize independently.
- Audit records cover owner creation, successful/failed login, sign-out, sign-out-all, and operator password recovery. Never record passwords, cookie tokens, or recovery secrets.
- Recovery is host-mediated: verify operator authority, reset via `pnpm admin:reset-password`, invalidate sessions, inspect audit records, and document the incident. There is no email reset flow.

## Security limits and follow-up

The account-keyed throttle limits guessing against the single owner identity. It is not a network-level denial-of-service control. Configure and verify request-rate limits at the trusted reverse proxy before public production. A restore test, audit retention schedule, security headers/CSP, dependency review, and deployment-level abuse tests remain staging/production gates. TOTP is not enabled in Gate 3. Before production authentication, define encrypted MFA-secret storage and key custody as a reviewed extension; do not place raw TOTP seeds in the user row.

No production secret, database, DNS, or deployment setting has been changed by this code gate.
