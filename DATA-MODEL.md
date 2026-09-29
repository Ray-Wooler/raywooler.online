# Data model baseline

Gate 1 creates no domain tables. The schema entry point and Drizzle migration configuration are in place, but no migration is generated until a later feature gate defines a real data contract. This follows the V1 rule: do not create speculative tables before they are needed.

Expected V1 domains are identity/session records; projects and project versions; services; skills and project/service relationships; experience; testimonials; pages and revisions; media; navigation/site settings; enquiries and events; AI sessions/messages/usage; and audit events. Detailed field constraints, retention periods, relationships and migration rules must be recorded with the persistence/content gates before implementation.

PostgreSQL is the system of record. Production schema changes must be generated from repository-owned Drizzle schema, reviewed as SQL, committed as migrations and applied through a documented release step. Manual production table creation is prohibited.
