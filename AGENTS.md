# Repository working rules

## Source-of-truth boundary

- The only authoritative repository is `git@github.com:Ray-Wooler/raywooler.online.git`.
- Do not treat Sites, generated archives, temporary worktrees or another checkout as source of truth.
- Confirm the current branch and worktree before changes. Use `feat/*`, `fix/*`, `security/*`, `refactor/*`, `docs/*`, or `chore/*` branches.
- `main` is the protected integration branch. Never force-push it, rewrite shared history, bypass failing CI or deploy directly from a workspace.
- Keep secrets out of Git. `.env.example` contains names and disposable local-development values only.

## Scope and gates

- Read `docs/architecture/v1-baseline.md` and `docs/operations/gate-1-acceptance.md` before work.
- Implement only the active, owner-authorized gate. Gate 1 is repository/application foundation; do not start Gate 2 portfolio features until Gate 1 is reviewed and accepted.
- Do not add speculative database tables, paid services or infrastructure. Record material decisions as ADRs under `docs/architecture/decisions/`.
- Production deploys, DNS, credentials and destructive production migrations require Ray’s explicit authorization.

## Quality

- Use strict TypeScript, server-side secrets and authorization, schema validation and tests at the relevant boundary.
- Run formatting, lint, typecheck, unit/integration tests and production build before proposing a commit.
- Preserve unrelated work. Inspect the full staged diff and confirm no secrets before commit or push.
- Do not describe scaffolding as a completed product feature or declare a gate passed without evidence.

## Next.js version note

This project uses the installed current Next.js version. Before using framework APIs, check the relevant guides under `node_modules/next/dist/docs/`; the generated Next.js agent notes may change with upgrades.
