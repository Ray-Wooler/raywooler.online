# ADR 0004: Patch Drizzle Kit's vulnerable esbuild path

- **Status:** Accepted for Gate 1
- **Decision date:** 2026-09-28

## Context

`pnpm audit` identified a moderate esbuild advisory in the transitive path `drizzle-kit → @esbuild-kit/esm-loader → @esbuild-kit/core-utils → esbuild@0.18.20`. The advisory affects versions through 0.24.2. Drizzle Kit also declares a patched direct esbuild dependency.

## Decision

Use a narrowly scoped pnpm override to resolve the legacy core-utils esbuild dependency to 0.25.12, the patched range, without overriding the separate current esbuild used by Vite/Vitest.

## Verification and consequences

`pnpm why esbuild` confirms the legacy path resolves to 0.25.12; `pnpm audit` reports no known vulnerabilities. The transitive loader packages remain deprecated upstream, so revisit and remove the override when Drizzle Kit no longer requires them. Migration generation must be rechecked after the override.
