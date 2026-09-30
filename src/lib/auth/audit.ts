import "server-only";
import { getDatabase } from "@/db/client";
import { auditEvents } from "@/db/schema";

type AuditInput = {
  eventType: string;
  actorUserId?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function writeAuditEvent(event: AuditInput): Promise<void> {
  await getDatabase()
    .insert(auditEvents)
    .values({
      eventType: event.eventType,
      actorUserId: event.actorUserId ?? null,
      metadata: event.metadata ?? {},
    });
}
