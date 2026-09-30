import { describe, expect, it } from "vitest";
import { transitionPublicationState } from "./workflow";

describe("content publishing lifecycle", () => {
  it("requires review and owner approval before publishing", () => {
    expect(transitionPublicationState("DRAFT", "submit_review", "owner")).toBe("REVIEW");
    expect(transitionPublicationState("REVIEW", "approve", "owner")).toBe("APPROVED");
    expect(transitionPublicationState("APPROVED", "publish", "owner")).toBe("PUBLISHED");
  });
  it("rejects skipped states and non-owner publication", () => {
    expect(() => transitionPublicationState("DRAFT", "publish", "owner")).toThrow();
    expect(() => transitionPublicationState("REVIEW", "approve", "editor")).toThrow();
  });
  it("supports unpublishing and archiving", () => {
    expect(transitionPublicationState("PUBLISHED", "unpublish", "owner")).toBe("DRAFT");
    expect(transitionPublicationState("PUBLISHED", "archive", "owner")).toBe("ARCHIVED");
  });
});
