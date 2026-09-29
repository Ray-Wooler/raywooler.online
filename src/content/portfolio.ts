export type ProjectStatus =
  | "Concept"
  | "Research"
  | "Prototype"
  | "Pilot"
  | "Active Development"
  | "Operational"
  | "Production"
  | "Archived";

export type Project = {
  slug: string;
  title: string;
  strapline: string;
  summary: string;
  problem: string;
  approach: string[];
  role: string;
  status: ProjectStatus;
  capabilities: string[];
  technologies: string[];
  featured: boolean;
  publicDisclosure: "owner-review-required";
};

// Private/client work is intentionally absent until its owner approves public disclosure.
export const projects: Project[] = [
  {
    slug: "frankai-platform",
    title: "FrankAI Platform",
    strapline: "A governed foundation for practical AI systems.",
    summary:
      "An evolving platform concept for connecting specialist AI capabilities to clear human authority, useful context and accountable workflows.",
    problem:
      "AI tools become difficult to trust when capabilities, memory, permissions and review are scattered across disconnected experiments.",
    approach: [
      "Treat agent capabilities and authority as explicit system design concerns.",
      "Keep consequential actions behind human review and application-level controls.",
      "Build the platform in small, verifiable steps with a repository-backed record.",
    ],
    role: "Product architect and hands-on builder.",
    status: "Active Development",
    capabilities: ["AI systems", "Governance", "Platform architecture"],
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    featured: true,
    publicDisclosure: "owner-review-required",
  },
  {
    slug: "frankai-agent-registry",
    title: "FrankAI Agent Registry",
    strapline: "A clear catalogue for agent capabilities and boundaries.",
    summary:
      "A registry concept that makes agent purpose, inputs, outputs, authority and operating status easier to understand and review.",
    problem:
      "As agent systems grow, teams need a reliable way to see what each capability does and what it is allowed to change.",
    approach: [
      "Represent capabilities as governed records rather than informal prompts.",
      "Separate a useful recommendation from authority to perform an action.",
      "Make ownership, versioning and review part of the system lifecycle.",
    ],
    role: "Architecture, product design and implementation.",
    status: "Active Development",
    capabilities: ["Agent architecture", "Capability design", "AI governance"],
    technologies: ["TypeScript", "Next.js", "PostgreSQL"],
    featured: true,
    publicDisclosure: "owner-review-required",
  },
  {
    slug: "multistream",
    title: "MultiStream",
    strapline: "Broadcast operations designed around readiness and recovery.",
    summary:
      "A multi-destination streaming project exploring clearer setup, readiness checks and failure handling for a small creator workflow.",
    problem:
      "A stream can fail for reasons that are hard to spot when configuration, provider requirements and runtime status are treated separately.",
    approach: [
      "Make provider-specific configuration visible and reviewable.",
      "Model readiness as evidence instead of a single optimistic switch.",
      "Exercise runtime failure paths before calling a broadcast ready.",
    ],
    role: "Systems design and implementation.",
    status: "Active Development",
    capabilities: ["Systems design", "Integration", "Failure handling"],
    technologies: ["Web application", "Streaming protocols", "Automated testing"],
    featured: true,
    publicDisclosure: "owner-review-required",
  },
  {
    slug: "raywooler-online",
    title: "raywooler.online",
    strapline: "A portfolio built as a professional proof system.",
    summary:
      "The portfolio itself is being rebuilt as an evidence-aware application, with a portable foundation and a public experience that can stand on its own before AI features arrive.",
    problem:
      "A professional website should show what is real, where a project stands and how technical work connects to practical problems.",
    approach: [
      "Keep the source, architecture and delivery history in the canonical GitHub repository.",
      "Use explicit maturity labels and avoid unsupported outcomes or metrics.",
      "Ship the public experience before adding administration or AI complexity.",
    ],
    role: "Product owner, architect and developer.",
    status: "Active Development",
    capabilities: ["Portfolio architecture", "Web development", "Content governance"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    featured: true,
    publicDisclosure: "owner-review-required",
  },
];

export const services = [
  {
    slug: "applied-ai",
    title: "AI consulting & agentic systems",
    summary:
      "Find practical AI opportunities and design systems with clear limits and human ownership.",
    problem: "A promising AI demo is not yet a dependable workflow.",
    target: "Teams exploring AI adoption, automation or agent-based workflows.",
    engagement:
      "A focused discovery and design phase, followed by an agreed prototype where useful.",
    deliverables: [
      "Opportunity and risk assessment",
      "System and authority design",
      "Governed prototype",
    ],
    relatedProjects: ["frankai-platform", "frankai-agent-registry"],
  },
  {
    slug: "systems-automation",
    title: "Systems architecture & workflow automation",
    summary: "Connect people, processes and software around how work actually happens.",
    problem: "Repeated hand-offs, unclear ownership and disconnected tools make good work harder.",
    target: "Organisations improving operational workflows or connecting existing tools.",
    engagement: "Process discovery, a prioritised design and scoped implementation support.",
    deliverables: ["Process mapping", "Integration design", "Automation plan and implementation"],
    relatedProjects: ["frankai-platform", "multistream"],
  },
  {
    slug: "custom-applications",
    title: "Custom applications & internal tools",
    summary:
      "Build focused web applications for operational workflows and useful information access.",
    problem: "Off-the-shelf tools can leave important operational gaps.",
    target: "Small teams that need a focused internal tool or data-backed web application.",
    engagement: "Requirements, an iterative build and a practical handover plan.",
    deliverables: [
      "Requirements and architecture",
      "Working application prototype",
      "Testing and handover",
    ],
    relatedProjects: ["raywooler-online", "multistream"],
  },
  {
    slug: "knowledge-systems",
    title: "AI knowledge & document systems",
    summary:
      "Make information easier to find and use while preserving provenance and human review.",
    problem: "Useful knowledge is often buried in documents, messages and disconnected records.",
    target: "Teams working with large or fragmented knowledge collections.",
    engagement: "Information-boundary design and a small retrieval or document workflow prototype.",
    deliverables: [
      "Information workflow design",
      "Retrieval and review prototype",
      "Governance boundaries",
    ],
    relatedProjects: ["frankai-platform"],
  },
  {
    slug: "infrastructure",
    title: "Technical infrastructure & self-hosted AI",
    summary: "Plan maintainable Linux, container and hybrid AI environments for real constraints.",
    problem:
      "Infrastructure choices have to balance control, cost, portability and operational effort.",
    target: "Operators and small teams choosing or improving self-managed technical environments.",
    engagement: "A scoped environment review, deployment plan and operating notes.",
    deliverables: ["Environment assessment", "Portable deployment plan", "Operational runbook"],
    relatedProjects: ["raywooler-online", "frankai-platform"],
  },
  {
    slug: "operations",
    title: "Data, reporting & operational improvement",
    summary: "Clarify the information and process changes that help teams make better decisions.",
    problem: "Reporting can be noisy or disconnected from the decisions it is meant to support.",
    target: "Teams that need clearer operational information or more useful reporting.",
    engagement: "A bounded workflow and data review with a prioritised improvement plan.",
    deliverables: [
      "Workflow and data review",
      "Reporting design",
      "Prioritised improvement roadmap",
    ],
    relatedProjects: ["multistream", "raywooler-online"],
  },
  {
    slug: "technical-support",
    title: "IT consulting & technical support",
    summary: "Bring practical diagnostics and clear communication to everyday technology problems.",
    problem: "A technical issue needs a clear diagnosis and a proportionate fix.",
    target: "Individuals and small teams looking for practical technology support and advice.",
    engagement: "A defined troubleshooting or advisory session, with next steps explained plainly.",
    deliverables: [
      "Troubleshooting",
      "Systems and device advice",
      "Plain-language recommendations",
    ],
    relatedProjects: ["multistream"],
  },
];

export const skills = [
  {
    name: "Applied AI & LLM systems",
    description: "Designing AI use around clear purpose, safe context and human review.",
    evidence: ["frankai-platform", "frankai-agent-registry"],
  },
  {
    name: "Agentic architecture",
    description: "Making agent roles, capabilities and authority explicit.",
    evidence: ["frankai-agent-registry", "frankai-platform"],
  },
  {
    name: "Systems architecture",
    description: "Connecting application boundaries, data, people and operating needs.",
    evidence: ["frankai-platform", "multistream", "raywooler-online"],
  },
  {
    name: "Software & web applications",
    description: "Building typed, tested web experiences and operational tools.",
    evidence: ["raywooler-online", "multistream"],
  },
  {
    name: "Workflow automation",
    description: "Reducing repetitive friction while preserving clear ownership.",
    evidence: ["frankai-platform", "multistream"],
  },
  {
    name: "Databases & APIs",
    description: "Designing dependable application data and service boundaries.",
    evidence: ["frankai-platform", "raywooler-online"],
  },
  {
    name: "Technical operations",
    description: "Hands-on troubleshooting informed by systems and service work.",
    evidence: ["multistream", "raywooler-online"],
  },
  {
    name: "Technical communication",
    description: "Turning complex systems into clear decisions, interfaces and records.",
    evidence: ["frankai-agent-registry", "raywooler-online"],
  },
];

export const experience = [
  {
    title: "Technical support & systems work",
    organisation: "Multiple service and technology environments",
    period: "Career experience",
    description:
      "Computer support, systems administration, troubleshooting and helping people use technology with confidence.",
    capabilities: ["Diagnostics", "Systems thinking", "User communication"],
  },
  {
    title: "Operations, service & business roles",
    organisation: "Retail, marketing, wholesale and operational settings",
    period: "Career experience",
    description:
      "Practical experience across customer service, team and store operations, marketing and business processes.",
    capabilities: ["Process improvement", "Stakeholder communication", "Operational context"],
  },
  {
    title: "Applied systems development",
    organisation: "Independent project work",
    period: "Current",
    description:
      "Designing and building portfolio, AI, workflow and software projects with explicit maturity and governance boundaries.",
    capabilities: ["Architecture", "Applied AI", "Software development"],
  },
];

export const capabilities = [
  {
    number: "01",
    title: "Understand the work",
    description: "Start with the real process, its people and constraints.",
  },
  {
    number: "02",
    title: "Design the system",
    description: "Make data, integrations, authority and failure paths visible.",
  },
  {
    number: "03",
    title: "Build and verify",
    description: "Deliver a focused solution with evidence that it behaves as intended.",
  },
];

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function findService(slug: string) {
  return services.find((service) => service.slug === slug);
}
