# ADR 0003: Authentication decision deferred to Gate 3

- **Status:** Accepted deferral
- **Decision date:** 2026-09-28

## Context

The V1 baseline requires secure server-side owner authentication, session revocation, rate limits, recovery and audit evidence. The product has a single owner initially; optional future editor access must not weaken this boundary.

## Decision

Do not implement authentication in Gate 1. Before Gate 3, compare a maintained auth library with a narrowly scoped custom session implementation against the requirements, supported framework version, recovery flow and deployment model. Record the selection and security consequences in a superseding ADR.

## Consequences

No admin routes, user tables, login UI or credentials belong in the Gate 1 foundation. The future auth boundary is explicitly captured without prematurely selecting or implementing a mechanism.
