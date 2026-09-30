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

## Gate 4 portfolio content

| Table | Purpose | Retention / handling |
| --- | --- | --- |
| `projects` | Evidence-aware project records, maturity, visibility, metrics, links and SEO | Public queries select only `PUBLISHED` and `PUBLIC`; project maturity is constrained to the V1 vocabulary. |
| `services` | Service problem, audience, deliverables and engagement | Public queries select only published records. |
| `skills` | Evidence-linked capabilities and categories | Public queries select only published records. |
| `experience` | Role, organisation, period and capability context | Public queries select only published records. |
| `pages` | Owner-managed page content and metadata | Public route renders only published records as escaped text paragraphs; no stored HTML is interpreted. |
| `content_revisions` | Before/after JSON snapshots by entity and version | Created in the same transaction as edits and lifecycle transitions; actor can become null when an account is removed. |
| `media_assets` | Metadata/checksum and private storage key for images | PNG/JPEG/WebP, maximum 8 MiB, generated storage key, private until published and marked public. Raw bytes live under `MEDIA_DIR`, outside PostgreSQL. |

Migration `0002_naive_vivisector.sql` creates the core content tables. Migration `0003_lying_dark_beast.sql` adds database checks for lifecycle, project maturity/visibility and supported media MIME/size. Migrations are append-only. Content updates and transitions write an audit event and revision in the same database transaction. Media file bytes are stored on the application host; back up `MEDIA_DIR` alongside PostgreSQL and keep it on persistent storage in production.

Public project, service, skill and experience pages read managed published records when present and fall back to the reviewed source portfolio until the owner publishes managed records. Pages created in the admin console are served at `/pages/{slug}`. Private drafts and media are never returned by public query routes.

## Future domains

Enquiries, AI session data, navigation, testimonials, and site settings are introduced only when their owning gates define fields, validation, retention, and authorization. Speculative tables remain absent.
