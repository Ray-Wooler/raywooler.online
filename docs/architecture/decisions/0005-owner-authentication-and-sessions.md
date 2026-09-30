# ADR 0005: Owner authentication and opaque database sessions

- Status: Proposed on the Gate 3 stacked branch; acceptance follows code review.
- Date: 2026-09-30

## Context

Gate 3 requires private owner administration, password authentication, session handling, throttling, audit events, portability, and no public registration. The site is a single-owner portfolio and does not need a third-party identity service or distributed session infrastructure.

## Decision

Use a single owner account provisioned from an interactive host command; store a scrypt password verifier in PostgreSQL; issue a random 256-bit opaque session cookie and store only its SHA-256 digest with a 12-hour absolute expiry. Keep session validation and authorization in server-only application code. Require an exact same-origin `Origin` header on authentication mutations and use HTTP-only, SameSite=Lax cookies with Secure on HTTPS. Store login throttles keyed by a digest of normalized email. Record security events without credentials or raw failed-login addresses. Revoke sessions on sign-out-all and operator password reset.

## Alternatives rejected

- Public registration/email recovery: unnecessary owner attack surface and depends on an email delivery service not established by this gate.
- Self-contained signed JWTs: revocation and sign-out-all would require additional token version/denylist design while providing no useful benefit for one owner account.
- Third-party identity SaaS: adds a runtime provider dependency and operating cost when local identity is sufficient.
- Persistent raw session tokens: increases impact of a database disclosure.

## Consequences

The application requires PostgreSQL for administration. Host access and encrypted backups become part of account recovery. A single owner role is enforced until a later accepted requirement justifies role expansion. The email-keyed throttle does not replace reverse-proxy network rate limits. The schema intentionally does not store an MFA secret. To satisfy the V1 preparation requirement before production authentication, define a separate protected credential model with application-level encryption/key custody before enabling TOTP; TOTP is not active in this gate.
