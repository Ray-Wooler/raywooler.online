# Architecture overview

The complete accepted V1 specification is [`docs/architecture/v1-specification.md`](docs/architecture/v1-specification.md); repository and release authority are summarized in [`docs/architecture/v1-baseline.md`](docs/architecture/v1-baseline.md). The architecture remains portable: the application runs on a self-managed VPS behind Caddy, with PostgreSQL and persistent media on the same host/network boundary. GitHub source, migrations and operational documentation remain authoritative.

```text
Public browser → Caddy → Next.js application → PostgreSQL
                                ├────────────→ persistent media
                                └────────────→ OpenAI API (optional, server side)

Admin browser → same-origin owner session → server-side authorization → PostgreSQL identity/audit data
```

## Gate 1 runtime foundation

- Next.js App Router, React and strict TypeScript under `src/`.
- Zod-based environment parsing under `src/lib/env.ts`.
- Drizzle ORM with PostgreSQL JS driver, config and a schema entry point under `src/db/`.
- PostgreSQL 16 local development service defined in `docker-compose.yml`.
- Vitest unit/integration harness, Playwright smoke-test harness, Biome lint/format and GitHub Actions CI.

Gate 2 public routes render static repository content. Gate 3 introduces only the schema required for a single owner account, opaque sessions, login throttling and audit events. Content-management domains remain deferred to Gate 4.

## Deployment boundary

Production topology is Caddy → Next.js app → private PostgreSQL and persistent media. Docker Compose is the V1 orchestration surface; Kubernetes, Redis, queues and a separate vector database are out of scope. Deployment, backup and restore procedures must be repository controlled before staging acceptance.
