# ADR 0002: PostgreSQL and repository-owned migrations

- **Status:** Accepted for V1 baseline
- **Decision date:** 2026-09-28

## Context

The portfolio, admin, audit, enquiries and assistant usage need durable relational storage. Production must be reconstructable without undocumented manual schema changes.

## Decision

Use PostgreSQL as the source of application data and Drizzle ORM for typed access, schema definition and committed SQL migrations. Keep the V1 schema minimal and introduce tables only with the gate that implements the feature.

## Consequences

Gate 1 configures tooling but creates no domain schema migration. First schema and migrations arrive with the persistence gate, where they will receive integration coverage against PostgreSQL.
