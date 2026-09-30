# raywooler.online

V1 is the professional portfolio and AI-powered services platform defined in [`docs/architecture/v1-specification.md`](docs/architecture/v1-specification.md), with repository and release authority recorded in [`docs/architecture/v1-baseline.md`](docs/architecture/v1-baseline.md). This repository is its only source of truth. Development checkouts and deployments must be reproducible from the tracked source.

## Gate status

Gate 1 and Gate 2 are accepted and merged to `main`. Gate 3 persistence and owner identity are being implemented on `feat/gate-3-persistence-admin`. Content editing, enquiry submission and AI services remain later gates. See [`docs/operations/gate-1-acceptance.md`](docs/operations/gate-1-acceptance.md), [`docs/operations/gate-2-acceptance.md`](docs/operations/gate-2-acceptance.md), and [`docs/operations/gate-3-acceptance.md`](docs/operations/gate-3-acceptance.md).

## Local foundation setup

Requirements: Node.js 22 LTS, pnpm 11.25+, and Docker Compose v2.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d db
pnpm db:migrate
pnpm admin:create
pnpm dev
```

The Postgres development container uses trust authentication and is bound to loopback only. It is for a local workstation and must never be exposed or reused in staging or production. Set `DATABASE_URL` in `.env` before migrations or owner provisioning. The first owner command requires a terminal and does not echo password input. Do not commit `.env`.

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

CI applies tracked migrations to ephemeral PostgreSQL 16 before tests. Integration tests require `TEST_DATABASE_URL`. End-to-end tests require a successful production build and Chromium (`pnpm exec playwright install chromium`); CI seeds a disposable owner in its loopback-only database for sign-in and session tests.

## Database workflow

Drizzle manages the owner identity, session, login-throttle and audit schema added in Gate 3. Generate migrations from tracked schema changes with `pnpm db:generate`, review the SQL, then apply with `pnpm db:migrate`. Never modify production schema manually. Owner account provisioning and recovery are host-mediated; see `DATA-MODEL.md` and `SECURITY.md`.

## Repository authority and release

The canonical remote is `git@github.com:Ray-Wooler/raywooler.online.git`. `main` is intended to be the protected integration branch; GitHub currently reports it as unprotected, so do not merge further feature work until that governance gap is corrected. Implementation work uses bounded branches and verified pull requests. Production deployment and DNS changes require Ray’s explicit release authorization.

## Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`docs/architecture/`](docs/architecture/)
- [`SECURITY.md`](SECURITY.md)
- [`DATA-MODEL.md`](DATA-MODEL.md)
- [`BACKUP-RESTORE.md`](BACKUP-RESTORE.md) and [`INCIDENT-RESPONSE.md`](INCIDENT-RESPONSE.md)
- [`AI-BOUNDARY.md`](AI-BOUNDARY.md)
- [`AGENTS.md`](AGENTS.md)
