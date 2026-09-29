import { describe, expect, it } from "vitest";
import { experience, findProject, projects, services, skills } from "../../src/content/portfolio";
import { navigation } from "../../src/lib/site";

describe("public portfolio content", () => {
  it("uses unique project slugs and explicit maturity states", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.status).toBeTruthy();
      expect(project.summary.length).toBeGreaterThan(20);
    }
  });

  it("keeps project disclosure and maturity review explicit", () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((project) => project.publicDisclosure === "owner-review-required")).toBe(
      true,
    );
    expect(
      projects.every(
        (project) => project.status !== "Production" && project.status !== "Operational",
      ),
    ).toBe(true);
  });

  it("links services and skills only to known project records", () => {
    for (const item of services) {
      expect(item.target).toBeTruthy();
      expect(item.engagement).toBeTruthy();
      expect(item.deliverables.length).toBeGreaterThan(0);
      for (const slug of item.relatedProjects) expect(findProject(slug)).toBeDefined();
    }
    for (const skill of skills) {
      expect(skill.evidence.length).toBeGreaterThan(0);
      for (const slug of skill.evidence) expect(findProject(slug)).toBeDefined();
    }
  });

  it("includes the public route set and a role-family experience overview", () => {
    expect(navigation.map((item) => item.href)).toEqual([
      "/about",
      "/projects",
      "/services",
      "/skills",
      "/ai-systems",
      "/experience",
      "/contact",
    ]);
    expect(experience.length).toBeGreaterThanOrEqual(3);
    expect(experience.every((item) => item.title && item.description)).toBe(true);
  });
});
