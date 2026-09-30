import { describe, expect, it } from "vitest";
import { contentSchemas } from "./validation";

describe("content input validation", () => {
  it("accepts a project with an allowed maturity and slug", () => {
    expect(
      contentSchemas.projects.safeParse({
        title: "Example",
        slug: "example",
        summary: "Example project",
        maturity: "Prototype",
      }).success,
    ).toBe(true);
  });
  it("rejects unsafe slugs and unsupported maturity labels", () => {
    expect(
      contentSchemas.projects.safeParse({
        title: "Example",
        slug: "../admin",
        summary: "Example project",
        maturity: "Prototype",
      }).success,
    ).toBe(false);
    expect(
      contentSchemas.projects.safeParse({
        title: "Example",
        slug: "example",
        summary: "Example project",
        maturity: "Shipped",
      }).success,
    ).toBe(false);
  });
  it("validates project links and bounds page bodies", () => {
    expect(
      contentSchemas.projects.safeParse({
        title: "Example",
        slug: "example",
        summary: "Example",
        maturity: "Prototype",
        links: [{ label: "Invalid", url: "javascript:alert(1)" }],
      }).success,
    ).toBe(false);
    expect(
      contentSchemas.pages.safeParse({ title: "Page", slug: "page", body: "a".repeat(30_001) })
        .success,
    ).toBe(false);
  });
  it("requires a provenance reference before a metric can be disclosed publicly", () => {
    const metric = {
      statement: "Measured outcome",
      value: "12",
      unit: "hours",
      evidenceStatus: "SUPPORTED",
      evidenceReference: null,
      publicDisclosureApproved: true,
    };
    expect(
      contentSchemas.projects.safeParse({
        title: "Example",
        slug: "example",
        summary: "Example",
        maturity: "Prototype",
        metrics: [metric],
      }).success,
    ).toBe(false);
  });
});
