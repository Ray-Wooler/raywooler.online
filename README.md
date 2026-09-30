# raywooler.online

V1 is the professional portfolio and AI-powered services platform defined in [`docs/architecture/v1-specification.md`](docs/architecture/v1-specification.md), with repository and release authority recorded in [`docs/architecture/v1-baseline.md`](docs/architecture/v1-baseline.md). This repository is its only source of truth. Development checkouts and deployments must be reproducible from the tracked source.

## Gate status

Gate 1 is accepted and merged to `main`. The current development branch implements Gate 2, the public portfolio core. It adds no authentication, database-backed content, enquiry submission or AI service; those remain later gates. See [`docs/operations/gate-1-acceptance.md`](docs/operations/gate-1-acceptance.md) and [`docs/operations/gate-2-acceptance.md`](docs/operations/gate-2-acceptance.md).

## Local foundation setup

Requirements: Node.js 22 LTS, pnpm 11.25+, and Docker Compose v2.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d db
pnpm dev
```

The Postgres development container uses trust authentication and is bound to loopback only. It is for a local workstation and must never be exposed or reused in staging or production. `DATABASE_URL` can be omitted for framework-only work; database operations fail with a clear configuration error when it is missing. Do not commit `.env`.

## Quality checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
```

Integration tests require `TEST_DATABASE_URL`. End-to-end tests require a successful production build and a Chromium browser (`pnpm exec playwright install chromium`). CI runs all checks against Node 22 and PostgreSQL 16.

## Database workflow

Drizzle configuration and schema entry point are established. No application tables or migration are created at Gate 1: the accepted architecture says not to create speculative tables. Domain schema and its first migration belong to the persistence gate. Generate migrations from tracked schema changes with `pnpm db:generate`, review the SQL, then apply with `pnpm db:migrate`.

## Repository authority and release

The canonical remote is `git@github.com:Ray-Wooler/raywooler.online.git`. `main` is intended to be the protected integration branch; GitHub currently reports it as unprotected, so do not merge further feature work until that governance gap is corrected. Implementation work uses bounded branches and verified pull requests. Production deployment and DNS changes require Ray’s explicit release authorization.

## Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`docs/architecture/`](docs/architecture/)
- [`SECURITY.md`](SECURITY.md)
- [`DATA-MODEL.md`](DATA-MODEL.md)
- [`AI-BOUNDARY.md`](AI-BOUNDARY.md)
- [`AGENTS.md`](AGENTS.md)
