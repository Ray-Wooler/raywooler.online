# Data model

PostgreSQL is the system of record. Schema is defined in `src/db/schema/index.ts`; migrations are generated, reviewed, and committed under `drizzle/`. Apply migrations with `pnpm db:migrate`. Never create production tables manually.

## Gate 3 identity schema

| Table | Purpose | Retention / handling |
| --- | --- | --- |
| `users` | Owner account email, scrypt password verifier, owner role, active flag, timestamps | One owner initially; no public registration. Passwords are never stored in plaintext. |
| `sessions` | User reference, SHA-256 digest of a random 256-bit opaque cookie token, absolute expiry, creation and last-seen timestamps | 12-hour absolute expiry; sign-out and password reset delete rows. Raw cookie token is never stored. |
| `auth_login_limits` | Digest of normalized email, rolling 15-minute failure count, block expiry | Cleared after successful sign-in; expired records removed during login checks. Raw email and IP are not recorded in this table. |
| `audit_events` | Optional actor, event type, small allowlisted metadata object, occurrence time | Security events omit passwords, session tokens, and raw email. Operator provisioning/recovery records identify the target user without falsely attributing the action to that user. Retention/deletion procedure must be established before production. |

Only the owner role is accepted by the schema constraint in Gate 3. Authorization remains enforced in server layouts and route handlers; role visibility in UI is not a control.

## Migration and recovery

- Migration `0000_simple_gorilla_man.sql` creates the identity, session, login-throttle, and audit tables.
- CI applies the migration to an ephemeral PostgreSQL 16 database before tests.
- To provision the initial owner on a controlled host, run `pnpm admin:create` in an interactive terminal. Password input is not echoed. The command refuses if an owner already exists.
- For owner recovery, verify host/database authority out of band, run `pnpm admin:reset-password` interactively, then investigate and preserve relevant audit evidence. The command changes the verifier and revokes every active session in one transaction. No email recovery or public registration endpoint exists.
- Backups must include PostgreSQL data and be encrypted and access-controlled. Production restore testing and retention schedules remain later operational gates.

## Future domains

Projects/content revisions, enquiries, media, and AI session data are introduced only when their owning feature gates define fields, validation, retention, and authorization. The empty speculative tables are intentionally absent.
