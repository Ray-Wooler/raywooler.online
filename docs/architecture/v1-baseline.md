# raywooler.online V1 architecture baseline

**Owner:** Raymond Wooler\
**Architecture authority:** Frank\
**Implementation executor:** Codex\
**Accepted specification:** `raywooler.online V1.md`, dated 28 September 2026\
**Canonical repository:** `git@github.com:Ray-Wooler/raywooler.online.git`

## Objective and positioning

Build Ray Wooler’s professional proof system: an evidence-aware portfolio, services presentation, contact/lead intake, bounded public portfolio assistant, and authenticated administration. Positioning: **Applied AI, Systems Architecture & Practical Technology**. Portfolio claims must reflect actual maturity, evidence and disclosure approval.

## Product limits

V1 is not a generic CMS, full CRM, autonomous sales agent, general-purpose agent platform, NDIS operational system, invoicing/e-commerce product or replacement for LinkedIn/GitHub. No Kubernetes or unnecessary infrastructure.

## System and deployment context

- Development and review occur in Codex/Sites as convenient; neither is a source of truth.
- GitHub repository above is authoritative for source, migrations, tests, configuration templates, architecture, operational procedures and release history.
- Target deployment is a self-managed VPS: Caddy terminates TLS and reverse-proxies to Next.js; PostgreSQL and persistent media remain private. Docker Compose is sufficient for V1.
- OpenAI is accessed only by server-side services. No browser-held provider secret.

## Stack

- Current stable Next.js App Router, React, strict TypeScript and Tailwind CSS.
- PostgreSQL with Drizzle ORM and committed migrations.
- Server-side authentication with secure HTTP-only sessions; auth library/implementation decision recorded before Gate 3.
- Docker Compose and Caddy for portable VPS staging and production.
- Local filesystem media in development and persistent mounted storage on VPS, behind an abstraction suitable for future S3-compatible storage.

## Data and authority principles

- Public pages return only records in `PUBLISHED`; projects additionally require public visibility.
- Project maturity uses Concept, Research, Prototype, Pilot, Active Development, Operational, Production or Archived.
- Public metrics require provenance and disclosure approval.
- Authenticated human authority is required for consequential changes. AI can recommend or draft; it cannot publish, delete, change access, send external messages, deploy or modify audit history.
- Migrations and backups, not manual production edits, reconstruct persistence.

## Governance and budget

Ray is product owner and final production authority. Frank is architecture authority. Codex implements within the active gate. The autonomous engineering budget has AUD $300 hard ceiling and AUD $225 review threshold; these are limits, not targets. No production DNS/deploy, paid vendor, or destructive production migration without explicit owner authorization.

## Gate boundary

Gate 1 establishes repository and runtime foundation only. Gate 2 public portfolio implementation does not begin until Gate 1 has evidence and is reviewed/accepted. Subsequent work follows the accepted V1 roadmap and is recorded in this repository.
