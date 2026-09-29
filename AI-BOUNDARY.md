# AI boundary baseline

Gate 1 does not implement or call an AI provider. It only establishes the repository and configuration foundation.

For V1, OpenAI access must be server-side behind an application service. The public assistant may use only approved published portfolio context; private admin content, authentication/session data and enquiries must never enter its retrieval boundary. Model choice, quotas, per-request limits, daily AUD ceiling and privacy disclosure must be configured and testable before enabling the assistant.

AI may draft, summarise, retrieve, classify and recommend. It may not publish, delete, change identity/access, deploy, edit audit history, send external messages or purchase services. Administrative AI output remains a draft until a human acts.
