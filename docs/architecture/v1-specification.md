# raywooler.online V1
## Professional Portfolio & AI-Powered Services Platform

**Document status:** Proposed V1 Baseline\
**Owner:** Raymond Wooler\
**Chief of Staff / Architecture Authority:** Frank\
**Development Executor:** OpenAI Codex\
**Initial Development Surface:** ChatGPT Sites / OpenAI development environment\
**Source Control:** GitHub\
**Production Target:** Self-managed VPS\
**Domain:** raywooler.online\
**Specification date:** 28 September 2026

---

# 1. Executive Objective

Rebuild `raywooler.online` as Ray Wooler's authoritative professional presence and operating portfolio.

The application must demonstrate, rather than merely assert, capability in:

- AI systems and agentic architecture
- AI consulting and practical AI adoption
- systems architecture
- workflow automation
- web application development
- backend systems and APIs
- technical infrastructure
- IT support and troubleshooting
- business process improvement
- data and operational systems
- property/NDIS-related technology experience where appropriate for public disclosure
- digital design and technical communication

The platform must combine:

**Public portfolio + professional services + project evidence + lead generation + AI interaction + authenticated administration.**

It must be credible to at least four audiences:

1. prospective employers and recruiters;
2. consulting/service clients;
3. technical peers and collaborators;
4. organisations assessing Ray's ability to design and execute AI-enabled operational systems.

The site must not exaggerate maturity, implementation status, results or qualifications.

---

# 2. Product Principle

The core positioning becomes:

> **Ray Wooler — Applied AI, Systems Architecture & Practical Technology**

Supporting proposition:

> I design and build practical systems that connect AI, software, workflows, infrastructure and people to solve real operational problems.

The existing IT-support capability remains part of the portfolio, but it no longer defines the entire identity.

The hierarchy becomes:

**Applied AI & Systems → Software & Automation → Technical Operations → Traditional IT Support**

rather than:

**IT Support → everything else.**

---

# 3. V1 Definition

V1 is a production-capable professional portfolio platform.

It is **not**:

- a generic CMS;
- a full CRM;
- an autonomous sales agent;
- a general-purpose AI agent platform;
- a social network;
- a complete FrankAI implementation;
- an NDIS operational system;
- an invoicing platform;
- an e-commerce system;
- a replacement for LinkedIn;
- a replacement for GitHub.

V1 must remain small enough to build, verify and deploy safely.

---

# 4. System Context

```text
                     PUBLIC INTERNET
                           │
                           ▼
                 ┌────────────────────┐
                 │   raywooler.online │
                 │   Public Web App   │
                 └─────────┬──────────┘
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
     Portfolio        AI Assistant       Contact /
      Content          "Frank"           Lead Intake
          │                │                 │
          └────────────────┼─────────────────┘
                           ▼
                 Application Service
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
      PostgreSQL        Media Store       OpenAI API
          │
          ▼
      Audit/Event
        Records

================ AUTHENTICATION BOUNDARY ================

                           │
                           ▼
                  /admin authentication
                           │
                           ▼
                Administration Console
                           │
        ┌──────────────────┼─────────────────────┐
        ▼                  ▼                     ▼
     Content            Enquiries             AI Drafting
    Management          Management             Assistance
        │                  │                     │
        └──────────────────┼─────────────────────┘
                           ▼
                    Database / Audit
```

---

# 5. Development and Production Architecture

## Development plane

ChatGPT / Sites / Codex provide:

- specification development;
- prototype development;
- UI iteration;
- code generation;
- review;
- test execution;
- refactoring;
- architectural assistance.

## Source-of-truth plane

GitHub becomes the authoritative source for deployable application code.

Recommended repository:

`raywooler-online`

Protected primary branch:

`main`

Development branches:

`feat/*`\
`fix/*`\
`chore/*`\
`security/*`

No production implementation should exist solely inside an AI conversation or transient Site environment.

## Production plane

Recommended VPS topology:

```text
Internet
   │
   ▼
Caddy
   │
   ├── TLS termination
   ├── security headers
   ├── compression
   └── reverse proxy
          │
          ▼
   raywooler-web
          │
          ├── PostgreSQL
          │
          ├── Persistent media
          │
          └── OpenAI API
```

Docker Compose is sufficient for V1.

Kubernetes is explicitly excluded.

---

# 6. Recommended Technical Stack

## Application

- Next.js, current stable release
- React
- TypeScript with strict mode
- App Router
- server components where appropriate
- server actions/API routes only where justified
- Tailwind CSS
- accessible component primitives
- responsive design
- progressive enhancement

## Persistence

- PostgreSQL
- Drizzle ORM
- schema migrations committed to Git
- no application dependence on manually-created production tables

## Authentication

Standards-based authenticated session architecture.

V1 requirements:

- email/password or secure passwordless owner authentication;
- password hashing using an accepted modern algorithm;
- secure HTTP-only cookies;
- CSRF protection where applicable;
- session rotation;
- rate limiting;
- login-event logging;
- logout-all-sessions capability;
- recovery procedure;
- optional TOTP prepared architecturally.

Only authenticated administrative users may mutate portfolio data.

## Media

Use a storage abstraction.

Development:

`local filesystem / development storage`

VPS:

`persistent mounted storage`

Future:

`S3-compatible object storage`

Business logic must not depend directly on any one storage provider.

## AI

OpenAI API integration behind an application service abstraction.

Do not call OpenAI directly from browser code with server credentials.

Architecture:

```text
Browser
   ↓
raywooler.online server
   ↓
AI service layer
   ↓
OpenAI API
```

Model selection must be configuration-driven rather than hard-coded throughout the application.

---

# 7. Public Information Architecture

## Primary navigation

- Home
- About
- Projects
- Services
- Skills
- AI & Systems
- Experience
- Contact

Secondary:

- GitHub
- LinkedIn

Optional future:

- Insights
- Lab
- Resume

---

# 8. Homepage Specification

The homepage must answer five questions quickly:

### Who is Ray?

Applied AI / systems / technology practitioner.

### What does he actually do?

Designs, builds, integrates and improves systems.

### Can he prove it?

Projects and evidence.

### What problems can he solve?

Services and capabilities.

### What should I do next?

Contact, explore work or ask Frank.

Recommended structure:

1. Hero
2. Professional positioning
3. Core capability pillars
4. Selected work
5. AI/systems capability
6. Evidence/results
7. Current technology stack
8. Career/experience snapshot
9. Frank AI interaction
10. Services
11. Contact CTA

---

# 9. Portfolio Evidence Model

Every project must have an explicit maturity classification.

Allowed states:

- Concept
- Research
- Prototype
- Pilot
- Active Development
- Operational
- Production
- Archived

Never imply production status merely because code exists.

Each project record should support:

```text
title
slug
summary
problem
context
solution
role
responsibilities
architecture
technologies[]
capabilities[]
status
visibility
startedAt
completedAt?
currentState
outcomes[]
metrics[]
evidence[]
screenshots[]
links[]
repositoryVisibility
featured
sortOrder
createdAt
updatedAt
publishedAt
```

Metrics must support provenance.

Example:

```text
Metric:
- statement
- value
- unit
- evidenceStatus
- evidenceReference
- publicDisclosureApproved
```

This prevents unsupported marketing numbers appearing as facts.

---

# 10. Initial Featured Portfolio

Subject to public-disclosure review, the new site should prominently represent:

- FrankAI Platform
- FrankAI Agent Registry
- Private Advocacy Intelligence Platform — anonymised appropriately
- Amma Care Connect / CareEpoch — disclosure-safe version
- MultiStream
- Local & Private AI infrastructure
- raywooler.online itself
- technical support/system workflow work

The portfolio should distinguish:

**built**, **operational**, **pilot**, **active development**, **research**, and **conceptual** work.

---

# 11. Services Architecture

V1 services:

### AI Consulting & Agentic Systems

AI opportunity assessment, system design, controlled automation, agent architectures and AI workflow implementation.

### Systems Architecture & Workflow Automation

Process discovery, architecture, integration and automation.

### Custom Applications & Internal Tools

Dashboards, operational systems and data-backed applications.

### AI Knowledge & Document Systems

Search, summarisation, extraction, classification and human-reviewed document workflows.

### Technical Infrastructure & Self-Hosted AI

Docker, Linux, local models, deployment environments and hybrid AI infrastructure.

### Data, Reporting & Operational Improvement

Data cleanup, operational reporting, information architecture and workflow redesign.

### IT Consulting & Technical Support

Troubleshooting, diagnostics, hardware/software support and infrastructure advice.

Each service receives:

- problem;
- target customer;
- deliverables;
- typical engagement;
- related capabilities;
- associated projects;
- CTA.

---

# 12. Skills Model

Skills are evidence-linked rather than represented as arbitrary percentage bars.

Bad:

`Python ████████ 85%`

Good:

```text
Systems Architecture
Evidence:
• FrankAI architecture
• ACC architecture
• Advocacy platform
• workflow governance

Used in:
3 operational systems
4 active builds
```

Skill categories:

- AI / LLM systems
- Agentic architecture
- systems architecture
- software development
- frontend development
- backend/API development
- databases
- automation
- Linux/infrastructure
- Docker
- cybersecurity
- IT support
- business operations
- stakeholder communication
- property systems

---

# 13. Experience Model

Experience must connect employment history to capability.

Instead of a traditional CV dump:

```text
Role
Organisation
Period
Responsibilities
Systems / technologies
Problems solved
Transferable capabilities
```

A downloadable résumé may be added later.

---

# 14. Backend Administration Console

Route:

`/admin`

Unauthenticated access redirects to login.

## Dashboard

Display:

- published projects;
- drafts;
- enquiries awaiting response;
- recent site changes;
- AI usage;
- recent logins;
- content requiring review;
- portfolio health warnings.

## Content

CRUD management for:

- pages;
- projects;
- services;
- skills;
- experience;
- testimonials;
- technology tags;
- media;
- SEO metadata;
- navigation;
- site configuration.

## Publishing workflow

Content states:

```text
DRAFT
   ↓
REVIEW
   ↓
APPROVED
   ↓
PUBLISHED
   ↓
ARCHIVED
```

Public pages may only display `PUBLISHED`.

---

# 15. Content Versioning

Important portfolio records must retain revision history.

A content revision records:

```text
entityType
entityId
version
before
after
changedBy
changeReason
createdAt
```

V1 does not require Git-level history for every text edit because database revision history already provides operational traceability.

Git remains authoritative for application code.

---

# 16. Administration Authority Model

## Owner

Raymond Wooler.

Authority:

- all administrative functionality;
- publish/unpublish;
- manage administrator identities;
- configure site;
- approve AI-generated material;
- delete/archive records;
- control integrations.

## Editor

Optional future role.

May:

- edit content;
- upload media;
- prepare drafts.

May not:

- alter security settings;
- manage administrators;
- publish without approval;
- delete audit history.

## AI Assistant

AI receives **no standing authority** to publish.

AI may:

- draft;
- classify;
- summarize;
- propose;
- rewrite;
- detect inconsistencies;
- identify stale information.

AI may not autonomously:

- publish;
- delete;
- send correspondence;
- modify credentials;
- change access control;
- deploy production;
- alter billing;
- modify audit history.

---

# 17. Frank — Public Portfolio Assistant

The site should contain a bounded version of Frank.

Purpose:

> Help visitors understand Ray's capabilities, projects, services and suitability for a problem.

Frank may answer questions such as:

- What AI systems has Ray worked on?
- Does Ray work with self-hosted AI?
- What technologies does Ray use?
- Which projects demonstrate workflow automation?
- How could Ray help my business?
- What does Ray mean by governed AI?
- Which project best demonstrates backend systems?

Frank's knowledge source should be the approved **public portfolio corpus**, not arbitrary private memory.

---

# 18. AI Retrieval Boundary

Recommended flow:

```text
Question
   ↓
input validation
   ↓
retrieve approved public portfolio records
   ↓
construct bounded context
   ↓
OpenAI model
   ↓
response validation
   ↓
visitor
```

Frank must not have access to:

- admin passwords;
- session data;
- unpublished content by default;
- private advocacy evidence;
- private participant information;
- private email;
- private connected accounts;
- infrastructure secrets.

---

# 19. AI Behaviour Contract

Public Frank must:

- clearly identify itself as an AI assistant;
- distinguish known portfolio facts from interpretation;
- avoid inventing qualifications, metrics or project status;
- say when evidence is unavailable;
- direct visitors to Ray where human judgement is required;
- never imply that AI responses constitute contractual commitments.

---

# 20. Administrative AI Functions

Authenticated AI tools may assist Ray with:

### Content drafting

"Turn these development notes into a project update."

### Consistency checking

"Find claims that conflict with project maturity."

### Portfolio gap analysis

"What capabilities are claimed without supporting project evidence?"

### Lead triage

Categorise enquiries into:

- employment;
- AI consulting;
- software;
- automation;
- IT support;
- collaboration;
- other.

### SEO assistance

Generate:

- titles;
- descriptions;
- summaries;
- structured-data drafts.

All remain human-approved.

---

# 21. Contact and Lead System

Public contact form fields:

```text
name
email
organisation?
reason
serviceInterest?
message
consent
```

Server-side protections:

- validation;
- rate limiting;
- honeypot;
- spam detection;
- request-size limits;
- sanitisation;
- logging.

Lead lifecycle:

```text
NEW
↓
REVIEWED
↓
CONTACTED
↓
QUALIFIED / CLOSED
```

V1 does not become a CRM.

---

# 22. Privacy Model

Collect only what is required.

V1 should avoid unnecessary visitor profiling.

Do not store:

- sensitive medical information;
- financial credentials;
- authentication secrets in logs;
- arbitrary AI conversations indefinitely.

Required public documents:

- Privacy Policy
- Terms / Site Notice where appropriate
- AI disclosure
- cookie notice if non-essential cookies are used

AI conversation retention must have a defined purpose and duration.

---

# 23. Security Baseline

Required before production:

- HTTPS only
- HSTS
- CSP
- secure cookies
- HTTP-only cookies
- SameSite policy
- CSRF mitigation
- XSS protection through framework-safe rendering
- SQL injection prevention through parameterised ORM
- rate limiting
- authentication throttling
- no secrets committed to Git
- environment-variable validation
- dependency vulnerability scan
- container runs as non-root where practical
- database inaccessible from public Internet
- production admin route protected
- audit logging
- regular database backup
- restore procedure tested

---

# 24. Secrets Architecture

Secrets reside outside source control.

Examples:

```text
DATABASE_URL
AUTH_SECRET
OPENAI_API_KEY
SMTP_*
STORAGE_*
```

Provide:

`.env.example`

Never:

`.env`

in Git.

Production secrets live on the VPS using restricted filesystem/environment secret management.

---

# 25. Audit Model

Security-sensitive actions create audit events.

Examples:

```text
LOGIN_SUCCESS
LOGIN_FAILURE
LOGOUT
PASSWORD_CHANGED
CONTENT_CREATED
CONTENT_UPDATED
CONTENT_PUBLISHED
CONTENT_UNPUBLISHED
CONTENT_ARCHIVED
CONFIG_CHANGED
AI_DRAFT_CREATED
AI_ACTION_APPROVED
AI_ACTION_REJECTED
```

Audit records should be append-oriented.

Ordinary administrators must not modify historic audit events.

---

# 26. Observability

V1 operational endpoints:

`/api/health`

and optionally:

`/api/ready`

Monitor:

- application health;
- DB connectivity;
- AI provider errors;
- failed contact submissions;
- authentication failures;
- uncaught server errors.

Do not expose secrets or internal stack traces publicly.

---

# 27. SEO Architecture

Every public entity supports:

- title
- meta description
- canonical URL
- OpenGraph metadata
- social image
- schema metadata where appropriate

Generate:

- sitemap.xml
- robots.txt
- structured Person data
- ProfessionalService or appropriate service markup
- project/article markup where appropriate

Avoid keyword stuffing.

---

# 28. Accessibility

Target:

**WCAG 2.2 AA**

Required:

- keyboard navigation;
- visible focus states;
- semantic headings;
- form labels;
- contrast compliance;
- image alt text;
- reduced-motion respect;
- appropriate ARIA only when semantic HTML is insufficient.

---

# 29. Performance Budget

Target production measurements:

- responsive image optimisation;
- sensible JavaScript payload;
- no unnecessary client components;
- lazy-load noncritical UI;
- cached public portfolio content where safe.

Targets:

- Lighthouse Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

These are acceptance targets, not marketing claims.

---

# 30. Design Direction

Visual identity:

**technical, professional, understated, modern and credible.**

Avoid:

- cyberpunk clichés;
- glowing AI brains;
- excessive gradients;
- fake terminal interfaces;
- stock-photo corporate handshakes;
- gratuitous animation;
- visual noise.

Prefer:

- strong typography;
- dark/light theme support;
- structured information hierarchy;
- diagrams;
- architecture imagery;
- actual project screenshots;
- restrained animation;
- technical evidence.

The interface should look like somebody capable of building serious operational systems owns it.

---

# 31. Recommended Homepage Identity

Primary:

**Ray Wooler**

Descriptor:

**Applied AI · Systems Architecture · Automation · Technology**

Hero:

> **I build practical systems that turn complex operational problems into software, automation and controlled AI workflows.**

Supporting copy:

> My work spans AI-assisted systems, web applications, workflow automation, infrastructure and hands-on technical operations—combining technical execution with an understanding of how systems actually have to work in the real world.

CTA:

**Explore my work**

Secondary:

**Discuss a project**

Tertiary:

**Ask Frank**

---

# 32. Database Domains

Core tables:

```text
users
sessions
accounts
verification_tokens

projects
project_versions
services
skills
project_skills
service_skills
experience
testimonials

pages
content_revisions
media_assets
navigation_items
site_settings

enquiries
enquiry_events

ai_sessions
ai_messages
ai_usage

audit_events
```

Do not create speculative tables before a feature requires them.

---

# 33. API / Application Boundaries

Logical modules:

```text
auth
portfolio
projects
services
skills
experience
content
media
enquiries
ai
audit
admin
system
```

Each module owns its validation and authorization rules.

---

# 34. Authorization Rule

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to perform this action?

Every mutation must perform server-side authorization.

Hiding an admin button is not authorization.

---

# 35. AI Cost Controls

Every AI request records:

- operation;
- model;
- input size where available;
- output size;
- user/admin/public origin;
- result status;
- estimated/provider cost where obtainable.

Limits:

- public Frank session quota;
- per-IP throttling;
- maximum message size;
- maximum conversation depth;
- server-side timeout;
- configurable daily AI spend ceiling.

The site must degrade gracefully if AI is disabled.

The portfolio must remain fully usable without AI.

---

# 36. Portability Contract

The application must survive migration away from Sites.

Therefore:

- business content must have an export format;
- schema must be documented;
- no unexplained platform-specific state;
- source must live in GitHub;
- environment configuration documented;
- database migrations committed;
- media paths portable;
- OpenAI integration isolated;
- infrastructure reproducible.

A platform feature may be used where useful, but it may not become an undocumented dependency.

---

# 37. Repository Structure

Recommended:

```text
raywooler-online/
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── api/
│   └── auth/
├── components/
├── features/
│   ├── ai/
│   ├── auth/
│   ├── enquiries/
│   ├── portfolio/
│   └── admin/
├── db/
│   ├── schema/
│   ├── migrations/
│   └── seed/
├── lib/
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture/
│   ├── operations/
│   ├── security/
│   └── decisions/
├── infra/
│   ├── docker/
│   └── caddy/
├── scripts/
├── .github/
│   └── workflows/
├── AGENTS.md
├── README.md
├── SECURITY.md
├── .env.example
└── docker-compose.yml
```

---

# 38. Required Documentation

Before production:

```text
README.md
AGENTS.md
ARCHITECTURE.md
SECURITY.md
DEPLOYMENT.md
BACKUP-RESTORE.md
DATA-MODEL.md
AI-BOUNDARY.md
CONTENT-GOVERNANCE.md
INCIDENT-RESPONSE.md
CHANGELOG.md
```

Architecture decisions:

`docs/architecture/adr-XXXX-*.md`

---

# 39. Testing Strategy

## Unit

Test:

- validation;
- formatting;
- authorization helpers;
- AI context construction;
- content-state transitions.

## Integration

Test:

- database operations;
- authentication;
- enquiries;
- admin mutations;
- AI provider abstraction;
- audit logging.

## End-to-end

Minimum scenarios:

1. anonymous visitor navigates site;
2. visitor opens project;
3. visitor submits valid enquiry;
4. spam/invalid enquiry rejected;
5. visitor asks Frank portfolio question;
6. AI outage does not break site;
7. unauthenticated visitor cannot access `/admin`;
8. owner logs in;
9. owner creates project draft;
10. draft does not appear publicly;
11. owner publishes project;
12. project becomes public;
13. owner edits project;
14. revision history created;
15. unauthorized mutation rejected;
16. owner logs out;
17. previous protected session no longer grants access.

---

# 40. Backup / Recovery

Minimum:

### PostgreSQL

Automated daily backup.

Retention initially:

- 7 daily
- 4 weekly
- 3 monthly

### Media

Daily incremental backup.

### Repository

GitHub remote.

### Recovery objective

For a portfolio V1:

**RPO:** ≤24 hours\
**RTO:** ≤4 hours

A restore test is required before Gate 6.

---

# 41. Governed Execution Model

Development authority is separated into four functions.

```text
RAY
Owner / Product Authority
        │
        ▼
FRANK
Chief of Staff / Architecture Authority
        │
        ▼
CODEX
Implementation Executor
        │
        ▼
AUDIT / TEST GATE
Evidence of correctness
        │
        ▼
RAY
Production approval
```

---

# 42. Authority Matrix

## Ray

Final authority over:

- product purpose;
- public identity;
- personal claims;
- publication;
- production deployment;
- external spending beyond approved budget;
- destructive operations.

## Frank

Delegated authority over:

- technical architecture;
- implementation sequencing;
- scope control;
- work decomposition;
- engineering standards;
- acceptance criteria;
- Codex task specification;
- reasonable implementation decisions within the accepted baseline.

## Codex

May autonomously:

- create code;
- create tests;
- refactor;
- create migrations;
- write documentation;
- run tests;
- lint;
- format;
- build;
- inspect local repository state;
- create bounded implementation commits/branches.

Codex must not autonomously:

- deploy production;
- purchase services;
- change DNS;
- disclose secrets;
- weaken security requirements;
- delete production data;
- merge failed work;
- expand scope substantially;
- remove audit controls;
- bypass failed acceptance gates.

---

# 43. Decision Hierarchy

When instructions conflict:

```text
1. Security / safety requirements
2. Accepted architecture baseline
3. Explicit owner decision
4. Gate acceptance criteria
5. Current implementation task
6. Convenience
```

Codex must not solve implementation difficulty by silently changing architecture.

---

# 44. Development Budget

## Approved V1 autonomous engineering budget

**AUD $300 maximum external AI/API/agent execution expenditure.**

This is a **hard ceiling**, not a spending target.

Budget stages:

### AUD $0–100
Normal implementation.

No intervention required.

### AUD $100–200
Continue only against accepted roadmap items.

Eliminate exploratory branches that do not serve a gate.

### AUD $200–225
Chief-of-Staff review.

Remaining tasks must be prioritised against launch-critical criteria.

### AUD $225
**Soft stop.**

Codex must generate:

- spend summary;
- completed scope;
- remaining scope;
- blocker report;
- estimated remaining execution.

No significant new subsystem begins beyond this point without review.

### AUD $300
**Hard stop.**

No additional paid execution without explicit owner authorization.

Excluded from this ceiling:

- already-owned VPS costs;
- existing ChatGPT subscription;
- existing domain registration;
- unavoidable production hosting already budgeted elsewhere.

Third-party paid SaaS must not be added merely because budget remains.

---

# 45. Scope Guard

Any task that would increase one of the following materially requires architecture review:

- infrastructure count;
- persistent services;
- third-party vendors;
- authentication methods;
- personal data collection;
- AI tools with write authority;
- database domains;
- recurring hosting expense;
- operational burden.

Default response to uncontrolled complexity:

**defer to V2.**

---

# 46. Implementation Gates

## Gate 0 — Architecture Acceptance

Required:

- objective accepted;
- positioning accepted;
- V1 boundaries accepted;
- authority model accepted;
- budget accepted;
- stack selected;
- security baseline accepted.

Deliverable:

`docs/architecture/v1-baseline.md`

---

## Gate 1 — Repository Foundation

Required:

- GitHub repository;
- application skeleton;
- TypeScript strict;
- lint;
- formatting;
- tests;
- CI;
- environment validation;
- architecture docs;
- Docker development environment.

No feature work until foundation passes.

---

## Gate 2 — Public Portfolio Core

Implement:

- navigation;
- homepage;
- About;
- Projects;
- Services;
- Skills;
- Experience;
- Contact shell;
- responsive layout;
- theme;
- SEO baseline.

Acceptance:

site usable without JavaScript-dependent gimmicks or AI.

---

## Gate 3 — Persistence & Admin Identity

Implement:

- PostgreSQL;
- migrations;
- owner authentication;
- `/admin`;
- authorization middleware;
- secure session handling;
- audit events.

Test:

unauthorized access paths explicitly.

---

## Gate 4 — Content Management

Implement:

- projects;
- services;
- skills;
- experience;
- pages;
- media;
- draft/review/publish lifecycle;
- content revisions.

Acceptance:

Ray can administer core portfolio without editing source code.

---

## Gate 5 — Contact & AI

Implement:

- enquiry system;
- anti-spam controls;
- Frank public assistant;
- portfolio retrieval layer;
- AI usage controls;
- administrative AI drafting.

Acceptance:

AI has no autonomous publishing authority.

---

## Gate 6 — Hardening

Required:

- authorization attack tests;
- security headers;
- rate limits;
- dependency audit;
- accessibility audit;
- performance audit;
- error handling;
- backup job;
- restore test;
- documentation.

---

## Gate 7 — Staging

Deploy to VPS staging environment.

Verify:

- DNS independent staging hostname;
- HTTPS;
- persistent DB;
- backups;
- AI configuration;
- admin login;
- contact system;
- production build;
- logging;
- restart behaviour.

---

## Gate 8 — Production Readiness

Checklist:

- content reviewed;
- claims reviewed;
- private data absent;
- privacy policy;
- AI disclosure;
- responsive QA;
- browsers tested;
- backups confirmed;
- restore confirmed;
- admin recovery confirmed;
- GitHub main clean;
- release tagged.

Only Ray authorises production cutover.

---

# 47. Roadmap

## Phase 0 — Baseline
**Outcome:** architecture frozen.

1. approve V1 specification;
2. define public identity;
3. identify disclosure-safe projects;
4. create repo;
5. record architecture baseline.

---

## Phase 1 — Foundation
**Outcome:** reproducible engineering environment.

1. initialise application;
2. configure TypeScript;
3. establish design system;
4. database container;
5. tests;
6. GitHub CI;
7. Docker;
8. documentation.

---

## Phase 2 — Public Experience
**Outcome:** new portfolio works as a static professional website before AI complexity.

1. homepage;
2. About;
3. Services;
4. Skills;
5. Projects;
6. project detail;
7. Experience;
8. Contact;
9. SEO.

---

## Phase 3 — Administration
**Outcome:** content managed through secure backend.

1. authentication;
2. RBAC;
3. admin dashboard;
4. project manager;
5. service manager;
6. skill manager;
7. media;
8. publishing;
9. revision history;
10. audit history.

---

## Phase 4 — AI Layer
**Outcome:** genuinely useful AI rather than decorative chatbot.

1. approved knowledge corpus;
2. retrieval;
3. Frank;
4. lead classification;
5. admin drafting;
6. cost controls;
7. abuse prevention;
8. evaluations.

---

## Phase 5 — Operational Hardening
**Outcome:** VPS-ready system.

1. security review;
2. E2E verification;
3. accessibility;
4. performance;
5. backups;
6. restore;
7. logging;
8. deployment documentation.

---

## Phase 6 — Staging
**Outcome:** production-equivalent validation.

---

## Phase 7 — Production
**Outcome:** controlled migration of `raywooler.online`.

DNS changes occur only after staging acceptance.

The existing site remains recoverable during migration.

---

# 48. V1 Acceptance Definition

V1 is complete only when:

- the public site professionally represents Ray's current work;
- portfolio data is evidence-aware;
- projects have explicit maturity states;
- Ray can administer content after login;
- unpublished content cannot leak publicly;
- Frank answers against approved portfolio information;
- AI cannot publish or alter critical state autonomously;
- enquiries are captured reliably;
- application source exists in GitHub;
- CI passes;
- automated tests pass;
- application can be built independently of Sites;
- VPS staging succeeds;
- backups exist;
- restore has been demonstrated;
- security baseline passes;
- Ray explicitly approves production release.

---

# 49. Deferred V2 Candidates

Do not implement during V1 unless a Gate review changes scope.

- multiple external editors;
- client accounts;
- applicant/recruiter portals;
- full CRM;
- automated LinkedIn publishing;
- automated email sending;
- newsletter;
- booking engine;
- payment processing;
- analytics warehouse;
- vector infrastructure requiring separate services;
- autonomous business agents;
- live GitHub ingestion;
- project-management system;
- public API;
- mobile app.

---

# 50. Codex Master Instruction

You are the implementation engineering agent for `raywooler.online`.

Your task is to implement Version 1 of Raymond Wooler's professional portfolio and AI-powered services platform.

## Authority

Raymond Wooler is Product Owner and final production authority.

Frank is Chief of Staff and Architecture Authority.

You are the Implementation Executor.

You may make ordinary implementation decisions inside the accepted architecture but must not materially expand product scope, weaken controls or change architectural boundaries merely to simplify implementation.

## Objective

Build a professional, portable, GitHub-backed portfolio application containing:

- public professional portfolio;
- services;
- projects;
- skills;
- experience;
- contact/lead intake;
- authenticated backend administration;
- controlled publishing workflow;
- revision history;
- audit logging;
- a bounded OpenAI-powered public portfolio assistant called Frank;
- administrative AI drafting assistance;
- Docker/VPS deployment capability.

## Architecture

Use:

- current stable Next.js;
- React;
- strict TypeScript;
- Tailwind CSS;
- PostgreSQL;
- Drizzle ORM;
- server-side authentication;
- Docker;
- Caddy deployment configuration;
- OpenAI through a server-side abstraction.

Prefer the smallest reliable dependency set.

Do not introduce Redis, queues, Kubernetes, Elasticsearch, separate vector databases or other infrastructure unless an accepted requirement proves they are necessary.

## Portability

ChatGPT Sites/OpenAI may be used as the development surface, but the implementation must remain portable.

GitHub source, documented database schema and reproducible deployment are authoritative.

Do not couple core application logic irreversibly to proprietary hosting behaviour.

## Security

All authorization must occur server-side.

Never expose secrets to browser code.

Never commit credentials.

Use secure sessions, authorization checks, rate limiting, validation and audit logging.

The public AI assistant must never receive private administrative information or authentication data.

## AI Authority

AI may draft, summarise, retrieve, classify and recommend.

AI may not:

- publish;
- delete;
- change authentication;
- alter authorization;
- deploy production;
- change DNS;
- send external messages;
- purchase services;
- modify audit history.

Human approval is required for consequential mutations.

## Evidence

Portfolio project status must use explicit maturity classifications:

Concept, Research, Prototype, Pilot, Active Development, Operational, Production or Archived.

Do not generate unsupported claims or metrics.

Metrics must support provenance and disclosure status.

## Development behaviour

Before each major phase:

1. inspect repository state;
2. read architecture documentation;
3. identify the relevant gate;
4. write or update the implementation plan;
5. implement only the accepted scope;
6. add tests;
7. execute tests;
8. fix failures;
9. update documentation;
10. report evidence against acceptance criteria.

Never declare a gate passed because code was written.

A gate passes only when its acceptance criteria have evidence.

## Quality

Maintain:

- clear module boundaries;
- accessible UI;
- strict typing;
- secure defaults;
- comprehensible code;
- minimal duplication;
- useful tests;
- documented decisions.

Avoid premature abstraction.

Avoid placeholder implementations being represented as complete.

## Git

Use bounded commits.

Recommended commit forms:

`feat:`\
`fix:`\
`test:`\
`docs:`\
`refactor:`\
`security:`\
`chore:`

Never force-push `main`.

Never bypass failing CI.

Production releases require owner approval.

## Budget

Autonomous paid AI/API/agent engineering expenditure has a hard ceiling of:

**AUD $300 equivalent.**

At AUD $225 equivalent, stop significant new work and produce a budget/status review.

At AUD $300 equivalent, stop all additional paid execution until the Product Owner explicitly authorises further expenditure.

Budget is a ceiling, not a target.

Do not introduce paid external products without owner approval.

Optimise for correctness and completion rather than token consumption.

## Scope discipline

When a requested or discovered improvement falls outside V1:

1. document it;
2. add it to the deferred backlog;
3. continue with the current gate.

Do not allow opportunistic improvements to destabilise the critical path.

## Failure handling

If blocked:

- identify the exact blocker;
- preserve working state;
- record evidence;
- propose the smallest resolution;
- continue unaffected work where safe.

Do not fabricate successful execution.

## Final condition

Stop only when the current gate either:

A. passes every acceptance criterion with evidence; or\
B. has a documented blocker that cannot be resolved within your authority.

Report:

- files changed;
- tests executed;
- results;
- architecture decisions;
- security implications;
- budget implications;
- unresolved issues;
- recommended next action.

---

# 51. First Codex Assignment

After Gate 0 is accepted, execute only the following:

### Gate 1 — Repository Foundation

1. Create or initialise `raywooler-online`.
2. Establish the agreed directory structure.
3. Initialise current stable Next.js with strict TypeScript.
4. Configure linting and formatting.
5. Configure PostgreSQL development environment.
6. Configure Drizzle and migration framework.
7. Implement environment schema validation.
8. Create Docker development configuration.
9. Create CI for lint, typecheck, tests and production build.
10. Add baseline unit/integration/E2E test infrastructure.
11. Create:
   - README.md
   - AGENTS.md
   - ARCHITECTURE.md
   - SECURITY.md
   - DATA-MODEL.md
   - AI-BOUNDARY.md
12. Create architecture decision records for major technology choices.
13. Do not implement public portfolio features yet.
14. Run all verification.
15. Produce Gate 1 evidence report.

**Stop at Gate 1.**

Do not begin Gate 2 until Gate 1 has been reviewed and accepted.

---

# 52. Chief-of-Staff Recommendation

The central strategic decision is that `raywooler.online` should cease being primarily an IT-support website.

It becomes Ray Wooler's **professional proof system**.

FrankAI can represent the broader AI engineering practice.

`raywooler.online` represents the individual:

**who Ray is, what he can do, what he has built, how he approaches systems, and how to engage him.**

Those two identities should reinforce one another without becoming duplicates.

The architecture therefore optimises for:

**credibility → evidence → interaction → conversion → maintainability.**

Not page count.

Not AI gimmicks.

Not framework complexity.

Not inflated claims.

That is the V1 operating doctrine.
