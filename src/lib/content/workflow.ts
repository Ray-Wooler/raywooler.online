export type PublicationState = "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
export type PublicationAction =
  | "submit_review"
  | "return_to_draft"
  | "approve"
  | "publish"
  | "unpublish"
  | "archive"
  | "restore";

const transitions: Record<
  PublicationState,
  Partial<Record<PublicationAction, PublicationState>>
> = {
  DRAFT: { submit_review: "REVIEW", archive: "ARCHIVED" },
  REVIEW: { return_to_draft: "DRAFT", approve: "APPROVED" },
  APPROVED: { return_to_draft: "DRAFT", publish: "PUBLISHED" },
  PUBLISHED: { unpublish: "DRAFT", archive: "ARCHIVED" },
  ARCHIVED: { restore: "DRAFT" },
};
const ownerActions = new Set<PublicationAction>([
  "approve",
  "publish",
  "unpublish",
  "archive",
  "restore",
]);

export function transitionPublicationState(
  state: PublicationState,
  action: PublicationAction,
  role: string,
): PublicationState {
  if (ownerActions.has(action) && role !== "owner")
    throw new Error("Only the owner may perform this publication action");
  const next = transitions[state][action];
  if (!next) throw new Error(`Invalid publication transition: ${state} → ${action}`);
  return next;
}
