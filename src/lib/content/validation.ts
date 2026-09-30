import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const short = (max = 500) => z.string().trim().max(max);
const list = z.array(z.string().trim().min(1).max(500)).max(50).default([]);
const publicUrl = z
  .url()
  .refine((value) => /^https?:\/\//i.test(value), "Only HTTP and HTTPS URLs are allowed");
const metric = z
  .object({
    statement: short(500),
    value: short(80),
    unit: short(40),
    evidenceStatus: z.enum(["UNVERIFIED", "SUPPORTED", "APPROVED_FOR_PUBLIC_DISCLOSURE"]),
    evidenceReference: z.string().trim().max(1000).nullable(),
    publicDisclosureApproved: z.boolean(),
  })
  .refine(
    (entry) =>
      !entry.publicDisclosureApproved ||
      (entry.evidenceStatus === "APPROVED_FOR_PUBLIC_DISCLOSURE" &&
        Boolean(entry.evidenceReference)),
    "Public metrics require disclosure approval and an evidence reference",
  );
const base = { title: short(140).min(1), slug };
const project = z.object({
  ...base,
  summary: short().min(1),
  problem: short(4000).default(""),
  context: short(4000).default(""),
  solution: short(4000).default(""),
  role: short(240).default(""),
  responsibilities: list,
  architecture: short(6000).default(""),
  technologies: list,
  capabilities: list,
  maturity: z.enum([
    "Concept",
    "Research",
    "Prototype",
    "Pilot",
    "Active Development",
    "Operational",
    "Production",
    "Archived",
  ]),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  currentState: short(3000).default(""),
  outcomes: list,
  metrics: z.array(metric).max(30).default([]),
  evidence: list,
  screenshots: z.array(z.string().uuid()).max(20).default([]),
  links: z
    .array(z.object({ label: short(80), url: publicUrl }))
    .max(30)
    .default([]),
  repositoryVisibility: z.enum(["PUBLIC", "PRIVATE", "UNKNOWN"]).default("UNKNOWN"),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  seoTitle: short(160).nullable().default(null),
  seoDescription: short(320).nullable().default(null),
});
const service = z.object({
  ...base,
  summary: short(700).default(""),
  problem: short(2000).min(1),
  targetCustomer: short().default(""),
  deliverables: list,
  typicalEngagement: short(600).default(""),
  capabilities: list,
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  seoTitle: short(160).nullable().default(null),
  seoDescription: short(320).nullable().default(null),
});
const skill = z.object({
  name: short(140).min(1),
  slug,
  category: short(100).min(1),
  summary: short(700).min(1),
  evidence: list,
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(10000).default(0),
});
const experience = z.object({
  title: short(140).min(1),
  organisation: short(180).default(""),
  periodLabel: short(100).default(""),
  responsibilities: list,
  systems: list,
  problemsSolved: list,
  transferableCapabilities: list,
  sortOrder: z.number().int().min(0).max(10000).default(0),
});
const page = z.object({
  slug,
  title: short(140).min(1),
  summary: short().default(""),
  body: short(30000).default(""),
  seoTitle: short(160).nullable().default(null),
  seoDescription: short(320).nullable().default(null),
  canonicalUrl: publicUrl.nullable().default(null),
  ogImage: z.string().uuid().nullable().default(null),
});

export const resourceNames = ["projects", "services", "skills", "experience", "pages"] as const;
export type ContentResource = (typeof resourceNames)[number];
export const contentSchemas = {
  projects: project,
  services: service,
  skills: skill,
  experience,
  pages: page,
};
export function isContentResource(value: string): value is ContentResource {
  return (resourceNames as readonly string[]).includes(value);
}
