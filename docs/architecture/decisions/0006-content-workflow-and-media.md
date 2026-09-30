# ADR 0006 — Content workflow and media storage

**Status:** Proposed in Gate 4; accepted by merge after review.

## Context

Gate 4 needs owner-managed portfolio records, explicit publication authority, revision traceability and a portable media backend without introducing a full generic CMS or third-party storage dependency.

## Decision

Persist the bounded portfolio content domains in PostgreSQL through Drizzle migrations. Keep publication state in the database and validate every mutation in server routes. Only the owner may approve/publish. Store before/after JSON revisions and audit events in the same transaction as content updates. Store image files under configurable `MEDIA_DIR`, use generated identifiers and signature-verified allowlisted formats, and serve only explicitly published public media. Render page bodies as escaped text rather than interpreting HTML.

## Consequences

- Public portfolio content can be managed without application source edits.
- Database migrations and revision history are reproducible and auditable.
- The file store can move to an S3-compatible backend later without changing content records or route contracts.
- PostgreSQL and media files must be backed up and restored together.
- A validated JSON editor has more authoring friction than a WYSIWYG editor, but reduces rich-text/XSS scope for V1.
