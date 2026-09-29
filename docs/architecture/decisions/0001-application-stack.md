# ADR 0001: Portable application stack

- **Status:** Accepted for V1 baseline
- **Decision date:** 2026-09-28

## Context

V1 must be portable from OpenAI development surfaces to a self-managed VPS, with a small and maintainable operational footprint.

## Decision

Use current stable Next.js App Router, React, strict TypeScript and Tailwind; PostgreSQL and Drizzle; Docker Compose and Caddy. Do not introduce Kubernetes, Redis, queues, a separate vector database or other services without a demonstrated V1 requirement.

## Consequences

The repository owns schema and migrations. The application can run on a VPS independent of Sites hosting. PostgreSQL and media persistence/backups become operator responsibilities. Add only dependencies that serve an accepted requirement.
