import "server-only";
import { and, asc, desc, eq, max } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import {
  auditEvents,
  contentRevisions,
  experience,
  pages,
  projects,
  services,
  skills,
} from "@/db/schema";
import type { ContentResource } from "@/lib/content/validation";
import {
  transitionPublicationState,
  type PublicationAction,
  type PublicationState,
} from "@/lib/content/workflow";

const tables = { projects, services, skills, experience, pages };
const tableFor = (resource: ContentResource) => tables[resource];

export async function listContent(resource: ContentResource) {
  const db = getDatabase();
  if (resource === "pages") return db.select().from(pages).orderBy(asc(pages.slug));
  if (resource === "projects") return db.select().from(projects).orderBy(asc(projects.sortOrder));
  if (resource === "services") return db.select().from(services).orderBy(asc(services.sortOrder));
  if (resource === "skills") return db.select().from(skills).orderBy(asc(skills.sortOrder));
  return db.select().from(experience).orderBy(asc(experience.sortOrder));
}

export async function getContent(resource: ContentResource, id: string) {
  const table = tableFor(resource);
  const [item] = await getDatabase().select().from(table).where(eq(table.id, id)).limit(1);
  return item ?? null;
}

export async function createContent(
  resource: ContentResource,
  data: Record<string, unknown>,
  actorId: string,
) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const table = tableFor(resource);
    const [item] = await tx
      .insert(table)
      .values({ ...data, publicationStatus: "DRAFT", publishedAt: null } as never)
      .returning();
    if (!item) throw new Error("Could not create content draft");
    await tx.insert(contentRevisions).values({
      entityType: resource,
      entityId: item.id,
      version: 1,
      before: null,
      after: item,
      changedBy: actorId,
      changeReason: "Created draft",
    });
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      eventType: "CONTENT_CREATED",
      metadata: { entityType: resource, entityId: item.id, status: "DRAFT" },
    });
    return item;
  });
}

export async function updateContent(
  resource: ContentResource,
  id: string,
  data: Record<string, unknown>,
  actorId: string,
) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const table = tableFor(resource);
    const [before] = await tx.select().from(table).where(eq(table.id, id)).limit(1);
    if (!before) return null;
    const [after] = await tx
      .update(table)
      .set({ ...data, updatedAt: new Date() } as never)
      .where(eq(table.id, id))
      .returning();
    const [latest] = await tx
      .select({ version: max(contentRevisions.version) })
      .from(contentRevisions)
      .where(and(eq(contentRevisions.entityType, resource), eq(contentRevisions.entityId, id)));
    const version = Number(latest?.version ?? 0) + 1;
    await tx.insert(contentRevisions).values({
      entityType: resource,
      entityId: id,
      version,
      before,
      after,
      changedBy: actorId,
      changeReason: "Owner edited content",
    });
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      eventType: "CONTENT_UPDATED",
      metadata: { entityType: resource, entityId: id, version },
    });
    return after;
  });
}

export async function transitionContent(
  resource: ContentResource,
  id: string,
  action: PublicationAction,
  role: string,
  actorId: string,
) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const table = tableFor(resource);
    const [before] = await tx.select().from(table).where(eq(table.id, id)).limit(1);
    if (!before) return null;
    const currentState = before.publicationStatus as PublicationState;
    const next = transitionPublicationState(currentState, action, role);
    const [after] = await tx
      .update(table)
      .set({
        publicationStatus: next,
        publishedAt: next === "PUBLISHED" ? new Date() : null,
        updatedAt: new Date(),
      } as never)
      .where(eq(table.id, id))
      .returning();
    const [latest] = await tx
      .select({ version: max(contentRevisions.version) })
      .from(contentRevisions)
      .where(and(eq(contentRevisions.entityType, resource), eq(contentRevisions.entityId, id)));
    await tx.insert(contentRevisions).values({
      entityType: resource,
      entityId: id,
      version: Number(latest?.version ?? 0) + 1,
      before,
      after,
      changedBy: actorId,
      changeReason: `Publication transition: ${action}`,
    });
    const eventType: Record<PublicationAction, string> = {
      submit_review: "CONTENT_SUBMITTED_FOR_REVIEW",
      return_to_draft: "CONTENT_RETURNED_TO_DRAFT",
      approve: "CONTENT_APPROVED",
      publish: "CONTENT_PUBLISHED",
      unpublish: "CONTENT_UNPUBLISHED",
      archive: "CONTENT_ARCHIVED",
      restore: "CONTENT_RESTORED",
    };
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      eventType: eventType[action],
      metadata: { entityType: resource, entityId: id, from: currentState, to: next },
    });
    return after;
  });
}

export async function getRevisions(resource: ContentResource, id: string) {
  return getDatabase()
    .select()
    .from(contentRevisions)
    .where(and(eq(contentRevisions.entityType, resource), eq(contentRevisions.entityId, id)))
    .orderBy(desc(contentRevisions.version))
    .limit(100);
}
