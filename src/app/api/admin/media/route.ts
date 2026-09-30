import { createHash, randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDatabase } from "@/db/client";
import { auditEvents, mediaAssets } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { hasTrustedOrigin } from "@/lib/auth/csrf";
import { transitionPublicationState } from "@/lib/content/workflow";
import { removeMedia, saveMedia } from "@/lib/media/storage";
import { z } from "zod";

export const runtime = "nodejs";
const limit = 8 * 1024 * 1024;
function imageKind(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return { mime: "image/png", ext: "png" };
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])))
    return { mime: "image/jpeg", ext: "jpg" };
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP")
    return { mime: "image/webp", ext: "webp" };
  return null;
}
export async function GET() {
  await requireAdmin();
  const items = await getDatabase()
    .select()
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt))
    .limit(200);
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const owner = await requireAdmin();
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > limit + 32_768)
    return NextResponse.json({ error: "Image is too large." }, { status: 413 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size < 1 || file.size > limit)
    return NextResponse.json({ error: "Choose an image up to 8 MB." }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = imageKind(bytes);
  if (!kind)
    return NextResponse.json(
      { error: "Only PNG, JPEG and WebP images are accepted." },
      { status: 415 },
    );
  const key = `${randomUUID()}.${kind.ext}`;
  await saveMedia(key, bytes);
  let item: typeof mediaAssets.$inferSelect | undefined;
  try {
    [item] = await getDatabase()
      .insert(mediaAssets)
      .values({
        storageKey: key,
        originalName: file.name.replace(/[\r\n\0]/g, "").slice(0, 255) || key,
        mimeType: kind.mime,
        byteSize: bytes.byteLength,
        checksumSha256: createHash("sha256").update(bytes).digest("hex"),
        altText: String(form?.get("altText") ?? "")
          .trim()
          .slice(0, 500),
        uploadedBy: owner.id,
      })
      .returning();
  } catch (error) {
    await removeMedia(key).catch(() => undefined);
    throw error;
  }
  if (!item) return NextResponse.json({ error: "Could not save media metadata." }, { status: 500 });
  await getDatabase()
    .insert(auditEvents)
    .values({
      actorUserId: owner.id,
      eventType: "MEDIA_UPLOADED",
      metadata: { entityId: item.id, mimeType: kind.mime, byteSize: bytes.byteLength },
    });
  return NextResponse.json({ item }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
const updateSchema = z.object({
  id: z.string().uuid(),
  action: z
    .enum([
      "submit_review",
      "return_to_draft",
      "approve",
      "publish",
      "unpublish",
      "archive",
      "restore",
    ])
    .optional(),
  isPublic: z.boolean().optional(),
  altText: z.string().trim().max(500).optional(),
});
export async function PATCH(request: Request) {
  if (!hasTrustedOrigin(request))
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  const owner = await requireAdmin();
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid media update." }, { status: 400 });
  const db = getDatabase();
  const [before] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, parsed.data.id))
    .limit(1);
  if (!before) return NextResponse.json({ error: "Media not found." }, { status: 404 });
  if (parsed.data.action === "publish" && !(parsed.data.altText ?? before.altText).trim()) {
    return NextResponse.json(
      { error: "Add alternative text before publishing an image." },
      { status: 422 },
    );
  }
  let publicationStatus = before.publicationStatus;
  try {
    if (parsed.data.action)
      publicationStatus = transitionPublicationState(
        before.publicationStatus as "DRAFT",
        parsed.data.action,
        "owner",
      );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid transition" },
      { status: 409 },
    );
  }
  const [item] = await db
    .update(mediaAssets)
    .set({
      publicationStatus,
      isPublic: parsed.data.isPublic ?? before.isPublic,
      altText: parsed.data.altText ?? before.altText,
      updatedAt: new Date(),
    })
    .where(eq(mediaAssets.id, before.id))
    .returning();
  await db.insert(auditEvents).values({
    actorUserId: owner.id,
    eventType: "MEDIA_UPDATED",
    metadata: { entityId: before.id, publicationStatus, isPublic: item.isPublic },
  });
  return NextResponse.json({ item }, { headers: { "Cache-Control": "no-store" } });
}
