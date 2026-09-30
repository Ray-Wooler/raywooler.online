import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  text,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 32 }).notNull().default("owner"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_single_owner_unique").on(table.role),
    check("users_owner_role_check", sql`${table.role} = 'owner'`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_user_expires_idx").on(table.userId, table.expiresAt),
  ],
);

export const authLoginLimits = pgTable(
  "auth_login_limits",
  {
    emailDigest: varchar("email_digest", { length: 64 }).primaryKey(),
    attempts: integer("attempts").notNull().default(0),
    windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull().defaultNow(),
    blockedUntil: timestamp("blocked_until", { withTimezone: true }),
  },
  (table) => [check("auth_login_limits_attempts_nonnegative", sql`${table.attempts} >= 0`)],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    eventType: varchar("event_type", { length: 64 }).notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, string | number | boolean | null>>()
      .notNull()
      .default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_events_occurred_at_idx").on(table.occurredAt)],
);

export const publicationStatuses = [
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

const publicationColumns = () => ({
  publicationStatus: varchar("publication_status", { length: 16 }).notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    summary: text("summary").notNull(),
    problem: text("problem").notNull().default(""),
    context: text("context").notNull().default(""),
    solution: text("solution").notNull().default(""),
    role: varchar("role", { length: 240 }).notNull().default(""),
    responsibilities: jsonb("responsibilities").$type<string[]>().notNull().default([]),
    architecture: text("architecture").notNull().default(""),
    technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
    capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
    maturity: varchar("maturity", { length: 32 }).notNull().default("Concept"),
    visibility: varchar("visibility", { length: 16 }).notNull().default("PUBLIC"),
    currentState: text("current_state").notNull().default(""),
    outcomes: jsonb("outcomes").$type<string[]>().notNull().default([]),
    metrics: jsonb("metrics").$type<Array<Record<string, unknown>>>().notNull().default([]),
    evidence: jsonb("evidence").$type<string[]>().notNull().default([]),
    screenshots: jsonb("screenshots").$type<string[]>().notNull().default([]),
    links: jsonb("links").$type<Array<{ label: string; url: string }>>().notNull().default([]),
    repositoryVisibility: varchar("repository_visibility", { length: 16 })
      .notNull()
      .default("UNKNOWN"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    ...publicationColumns(),
  },
  (table) => [
    index("projects_public_order_idx").on(table.publicationStatus, table.sortOrder),
    check(
      "projects_publication_status_check",
      sql`${table.publicationStatus} in ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')`,
    ),
    check(
      "projects_maturity_check",
      sql`${table.maturity} in ('Concept', 'Research', 'Prototype', 'Pilot', 'Active Development', 'Operational', 'Production', 'Archived')`,
    ),
    check("projects_visibility_check", sql`${table.visibility} in ('PUBLIC', 'PRIVATE')`),
    check(
      "projects_repository_visibility_check",
      sql`${table.repositoryVisibility} in ('PUBLIC', 'PRIVATE', 'UNKNOWN')`,
    ),
  ],
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    summary: text("summary").notNull().default(""),
    problem: text("problem").notNull(),
    targetCustomer: text("target_customer").notNull().default(""),
    deliverables: jsonb("deliverables").$type<string[]>().notNull().default([]),
    typicalEngagement: text("typical_engagement").notNull().default(""),
    capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    ...publicationColumns(),
  },
  (table) => [
    index("services_public_order_idx").on(table.publicationStatus, table.sortOrder),
    check(
      "services_publication_status_check",
      sql`${table.publicationStatus} in ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')`,
    ),
  ],
);

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    category: varchar("category", { length: 100 }).notNull(),
    summary: text("summary").notNull(),
    evidence: jsonb("evidence").$type<string[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...publicationColumns(),
  },
  (table) => [
    index("skills_public_order_idx").on(table.publicationStatus, table.sortOrder),
    check(
      "skills_publication_status_check",
      sql`${table.publicationStatus} in ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')`,
    ),
  ],
);

export const experience = pgTable(
  "experience",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    organisation: varchar("organisation", { length: 180 }).notNull().default(""),
    periodLabel: varchar("period_label", { length: 100 }).notNull().default(""),
    responsibilities: jsonb("responsibilities").$type<string[]>().notNull().default([]),
    systems: jsonb("systems").$type<string[]>().notNull().default([]),
    problemsSolved: jsonb("problems_solved").$type<string[]>().notNull().default([]),
    transferableCapabilities: jsonb("transferable_capabilities")
      .$type<string[]>()
      .notNull()
      .default([]),
    sortOrder: integer("sort_order").notNull().default(0),
    ...publicationColumns(),
  },
  (table) => [
    index("experience_public_order_idx").on(table.publicationStatus, table.sortOrder),
    check(
      "experience_publication_status_check",
      sql`${table.publicationStatus} in ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')`,
    ),
  ],
);

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    title: varchar("title", { length: 140 }).notNull(),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
    seoTitle: varchar("seo_title", { length: 160 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    canonicalUrl: text("canonical_url"),
    ogImage: uuid("og_image"),
    ...publicationColumns(),
  },
  (table) => [
    index("pages_public_order_idx").on(table.publicationStatus, table.slug),
    check(
      "pages_publication_status_check",
      sql`${table.publicationStatus} in ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')`,
    ),
  ],
);

export const contentRevisions = pgTable(
  "content_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 32 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    version: integer("version").notNull(),
    before: jsonb("before"),
    after: jsonb("after").notNull(),
    changedBy: uuid("changed_by").references(() => users.id, { onDelete: "set null" }),
    changeReason: varchar("change_reason", { length: 240 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("content_revisions_version_uq").on(table.entityType, table.entityId, table.version),
    index("content_revisions_entity_idx").on(table.entityType, table.entityId),
  ],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storageKey: varchar("storage_key", { length: 80 }).notNull().unique(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 64 }).notNull(),
    byteSize: integer("byte_size").notNull(),
    checksumSha256: varchar("checksum_sha256", { length: 64 }).notNull(),
    altText: varchar("alt_text", { length: 500 }).notNull().default(""),
    isPublic: boolean("is_public").notNull().default(false),
    publicationStatus: varchar("publication_status", { length: 16 }).notNull().default("DRAFT"),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      "media_publication_status_check",
      sql`${table.publicationStatus} in ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')`,
    ),
    check(
      "media_mime_type_check",
      sql`${table.mimeType} in ('image/png', 'image/jpeg', 'image/webp')`,
    ),
    check("media_size_positive_check", sql`${table.byteSize} > 0 and ${table.byteSize} <= 8388608`),
  ],
);

export const schema = {
  users,
  sessions,
  authLoginLimits,
  auditEvents,
  projects,
  services,
  skills,
  experience,
  pages,
  contentRevisions,
  mediaAssets,
};
