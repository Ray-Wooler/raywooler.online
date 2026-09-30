import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { hasTrustedOrigin } from "@/lib/auth/csrf";
import { transitionContent } from "@/lib/content/store";
import { isContentResource } from "@/lib/content/validation";

const actionSchema = z.object({
  action: z.enum([
    "submit_review",
    "return_to_draft",
    "approve",
    "publish",
    "unpublish",
    "archive",
    "restore",
  ]),
});
type Context = { params: Promise<{ resource: string; id: string }> };
export async function POST(request: Request, { params }: Context) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const owner = await requireAdmin();
  const { resource, id } = await params;
  if (!isContentResource(resource))
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  try {
    const item = await transitionContent(resource, id, parsed.data.action, "owner", owner.id);
    return item
      ? NextResponse.json({ item }, { headers: { "Cache-Control": "no-store" } })
      : NextResponse.json({ error: "Content not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid transition" },
      { status: 409 },
    );
  }
}
