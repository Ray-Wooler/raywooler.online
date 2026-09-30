import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { experience, pages, projects, services, skills } from "@/db/schema";

export async function getPublishedProjects() {
  if (!process.env.DATABASE_URL) return [];
  return getDatabase()
    .select()
    .from(projects)
    .where(and(eq(projects.publicationStatus, "PUBLISHED"), eq(projects.visibility, "PUBLIC")))
    .orderBy(asc(projects.sortOrder));
}

export async function getPublishedProject(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  const [project] = await getDatabase()
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.publicationStatus, "PUBLISHED"),
        eq(projects.visibility, "PUBLIC"),
      ),
    )
    .limit(1);
  return project ?? null;
}

export async function getPublishedServices() {
  if (!process.env.DATABASE_URL) return [];
  return getDatabase()
    .select()
    .from(services)
    .where(eq(services.publicationStatus, "PUBLISHED"))
    .orderBy(asc(services.sortOrder));
}
export async function getPublishedSkills() {
  if (!process.env.DATABASE_URL) return [];
  return getDatabase()
    .select()
    .from(skills)
    .where(eq(skills.publicationStatus, "PUBLISHED"))
    .orderBy(asc(skills.sortOrder));
}
export async function getPublishedExperience() {
  if (!process.env.DATABASE_URL) return [];
  return getDatabase()
    .select()
    .from(experience)
    .where(eq(experience.publicationStatus, "PUBLISHED"))
    .orderBy(asc(experience.sortOrder));
}
export async function getPublishedPage(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  const [page] = await getDatabase()
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.publicationStatus, "PUBLISHED")))
    .limit(1);
  return page ?? null;
}
