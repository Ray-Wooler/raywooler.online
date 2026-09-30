import {
  boolean,
  check,
  index,
  integer,
  jsonb,
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

export const schema = { users, sessions, authLoginLimits, auditEvents };
