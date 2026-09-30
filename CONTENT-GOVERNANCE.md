# Content governance

Portfolio records are private drafts until they move through the explicit `DRAFT → REVIEW → APPROVED → PUBLISHED` workflow. Only the owner account can approve or publish. Unpublishing returns content to draft; archiving removes published content from public queries. Each content edit and workflow transition writes a before/after revision and append-oriented audit event in one database transaction.

Projects have a constrained maturity label and public/private visibility. Metrics include disclosure/evidence metadata; a metric marked approved for public disclosure must carry an evidence reference. Treat evidence references as internal notes unless they are independently safe to publish. Never enter private client, participant, advocacy, health or credential information into public-facing fields.

Pages are rendered as escaped plain text paragraphs. HTML is not executed. Media accepts PNG, JPEG and WebP images up to 8 MiB. Upload names are replaced by random storage identifiers, MIME is checked from file signatures, and media stays private until the owner approves and publishes it as public. Add accurate alternative text before publication. Review images for location metadata and other private information before publishing; V1 stores uploaded image bytes without rewriting metadata.

Initial migration does not automatically publish or overwrite the existing reviewed source portfolio. The public site keeps its reviewed source content until managed records are published. From then on, each managed public section displays only published database records.
