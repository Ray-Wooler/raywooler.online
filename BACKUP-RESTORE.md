# Backup and restore

## Scope

PostgreSQL is the system of record. Repository migrations reconstruct schema; authorised encrypted backups reconstruct operational data. Production backup credentials and archives must never be stored in Git or CI artifacts.

## Backup requirements before staging

- Use `pg_dump` in custom format over the private database network with a dedicated least-privilege backup identity.
- Encrypt backups before transfer and store at least one copy off-host with access logging and retention controls.
- Protect encryption keys separately from backup storage and restrict restore privileges.
- Record backup timestamps, application commit, migration version, and verification checksum in the restricted operations record.
- Define approved RPO, RTO, retention, data-hold and deletion requirements before production data is accepted.

Example operator command (run only in an approved environment with credentials provided through the process environment):

```sh
pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" > raywooler-$(date -u +%Y%m%dT%H%M%SZ).dump
```

Encrypt and move the resulting file to approved off-host storage immediately; the example does not itself encrypt or transfer it.

## Restore procedure

1. Select a verified backup and obtain the separate decryption key through the approved custody process.
2. Restore into an isolated PostgreSQL instance using a compatible major version.
3. Check database connectivity, apply any repository migrations newer than the backup, and verify critical tables and row counts.
4. Start the matching repository commit in an isolated environment and test public routes, admin authentication, and logout-all.
5. Record checksums, migration state, observed loss window, test results, and owner approval before any production recovery.

A successful restore drill is required before production readiness. No production backup or restore has been run as part of Gate 3.
