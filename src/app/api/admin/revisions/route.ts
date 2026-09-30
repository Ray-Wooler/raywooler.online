import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getRevisions } from "@/lib/content/store";
import { isContentResource } from "@/lib/content/validation";

const querySchema = z.object({ resource: z.string(), id: z.string().uuid() });
export async function GET(request: Request) {
  await requireAdmin();
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success || !isContentResource(parsed.data.resource))
    return NextResponse.json({ error: "Invalid revision query" }, { status: 400 });
  return NextResponse.json(
    { items: await getRevisions(parsed.data.resource, parsed.data.id) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
