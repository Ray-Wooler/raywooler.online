import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { hasTrustedOrigin } from "@/lib/auth/csrf";
import { getContent, updateContent } from "@/lib/content/store";
import { contentSchemas, isContentResource } from "@/lib/content/validation";

type Context = { params: Promise<{ resource: string; id: string }> };
export async function GET(_request: Request, { params }: Context) {
  await requireAdmin();
  const { resource, id } = await params;
  if (!isContentResource(resource))
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  const item = await getContent(resource, id);
  return item
    ? NextResponse.json({ item }, { headers: { "Cache-Control": "no-store" } })
    : NextResponse.json({ error: "Content not found" }, { status: 404 });
}
export async function PUT(request: Request, { params }: Context) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const owner = await requireAdmin();
  const { resource, id } = await params;
  if (!isContentResource(resource))
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  if (Number(request.headers.get("content-length") ?? 0) > 65_536)
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const body = await request.json().catch(() => null);
  const parsed = contentSchemas[resource].safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid content", issues: parsed.error.issues },
      { status: 400 },
    );
  const item = await updateContent(resource, id, parsed.data as Record<string, unknown>, owner.id);
  return item
    ? NextResponse.json({ item }, { headers: { "Cache-Control": "no-store" } })
    : NextResponse.json({ error: "Content not found" }, { status: 404 });
}
