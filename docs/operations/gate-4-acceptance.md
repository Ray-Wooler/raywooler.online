# Gate 4 — Content Management Acceptance Evidence

**Status:** Automated Gate 4 acceptance passed; owner review pending.
**Branch:** `feat/gate-4-content-management` from merged Gate 3 main `cbf15f8e2fe34c54c2b1edaa87afb57cae17f58f`.
**Verified code commit:** `ab1a7729bf0706b839feceab7f6f025e1ef15d8e`.

## Scope delivered

- Drizzle schema and migrations for projects, services, skills, experience, pages, media metadata, and content revisions.
- Owner-authenticated CRUD APIs for five core content types, with server-side Zod validation, request size limits, and same-origin mutation checks.
- Draft, review, approve, publish, unpublish, archive and restore transition rules. Approval/publishing actions are owner-only; published public data is selected server-side.
- Transactional content revision and audit records for create, edit and lifecycle actions.
- Admin content workspace with validated record editing and revision history.
- Image upload/library for PNG, JPEG and WebP (8 MiB maximum), signature verification, random storage names, private-by-default publication and public serving only after publication.
- Public projects, services, skills and experience render published managed records when any are present; source-reviewed portfolio remains the initial display until managed content is published. Published managed pages render at `/pages/{slug}` as escaped text.

## Verification evidence

- `pnpm db:generate`: passed; created migration `0002_naive_vivisector.sql` and the database-check migration `0003_lying_dark_beast.sql`.
- `pnpm format:check`: passed locally.
- `pnpm lint`: passed locally.
- `pnpm typecheck`: passed locally.
- `pnpm test`: passed locally (10 passed, one PostgreSQL integration suite skipped because Docker/PostgreSQL are not available locally).
- `pnpm build`: passed locally on Node 24; project CI pins Node 22.
- `git diff --check`: passed locally.
- GitHub Actions run [#35](https://github.com/Ray-Wooler/raywooler.online/actions/runs/36720144716): PASS on Node 22 — migrations, formatting, lint, typecheck, unit suite (10 passed, one skipped), PostgreSQL integration (1 passed), production build, disposable owner provisioning, and all 9 Chromium end-to-end tests passed.
- The browser acceptance flow created and edited a project, confirmed its draft stayed private, submitted it for review, approved and published it, verified its stored `PUBLIC`/`PUBLISHED` state, and opened it from the public project listing.

## Known limits

- Admin content fields use a validated JSON editor; no rich-text or WYSIWYG editor is included.
- Media uses local filesystem storage behind the `MEDIA_DIR` setting. Production requires persistent mounted storage and backup of the directory with PostgreSQL.
- Existing static portfolio content is preserved and remains visible until managed records are added and published. The first published managed records replace that section's static collection, so content must be migrated/entered deliberately before production cutover.
- No production service or database has been changed.

## Gate result

**Gate 4 automated acceptance: PASS.** The V1 acceptance scenario is covered in CI. PR review/merge remains subject to repository governance; `main` was unprotected at the time of verification and this change is intentionally unmerged.
