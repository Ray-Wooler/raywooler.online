# Incident response

This procedure is the initial V1 response record. The operator records incident times in UTC, preserves relevant evidence, limits access to the response group, and updates this document or a restricted incident record with actions and decisions.

## Administrative account or session compromise

1. Confirm authority to administer the host and database. Avoid disclosing secrets or personal data in GitHub issues, CI output, or chat.
2. Use an interactive trusted host session to run `pnpm admin:reset-password`. This changes the owner verifier and revokes all active sessions atomically.
3. Review `audit_events` around the suspected time; export and preserve relevant records before any cleanup. Do not edit or delete evidence to make the timeline appear cleaner.
4. Inspect host, reverse-proxy, CI, database and repository access for unexpected changes. Rotate any potentially exposed host/database credentials through the relevant owner-authorized channel.
5. Verify the new password through `/admin`, confirm old sessions are denied, and record the verification result without recording the credential.
6. Assess disclosure obligations and affected parties with the owner. Document scope, impact, containment, recovery and follow-up work.

## Database or application compromise

- Restrict affected service access at the infrastructure boundary; do not perform destructive cleanup before evidence is preserved.
- Compare running images, environment references and migrations with the authoritative GitHub commit and release record.
- Restore only from a verified backup through the documented restore process. Validate integrity in an isolated environment before returning traffic.
- Preserve the original incident state and record any emergency repository backport.

## Reporting

The production owner is Raymond Wooler. This baseline does not configure on-call alerting or third-party incident services. Add those only when a production operating model is accepted.
