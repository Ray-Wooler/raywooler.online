import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { hasTrustedOrigin } from "@/lib/auth/csrf";
import { createContent, listContent } from "@/lib/content/store";
import { contentSchemas, isContentResource } from "@/lib/content/validation";

type Context = { params: Promise<{ resource: string }> };
export async function GET(_request: Request, { params }: Context) {
  await requireAdmin();
  const { resource } = await params;
  if (!isContentResource(resource))
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  return NextResponse.json(
    { items: await listContent(resource) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request, { params }: Context) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const owner = await requireAdmin();
  const { resource } = await params;
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
  const item = await createContent(resource, parsed.data as Record<string, unknown>, owner.id);
  return NextResponse.json({ item }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
