import { desc } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { auditEvents } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Administration" };

export default async function AdminHomePage() {
  const owner = await requireAdmin();
  const events = await getDatabase()
    .select({
      id: auditEvents.id,
      eventType: auditEvents.eventType,
      occurredAt: auditEvents.occurredAt,
    })
    .from(auditEvents)
    .orderBy(desc(auditEvents.occurredAt))
    .limit(10);
  return (
    <section className="admin-panel content-section">
      <p className="eyebrow">
        <span className="eyebrow-line" />
        Private administration
      </p>
      <h1>Portfolio administration</h1>
      <p>
        Signed in as <strong>{owner.email}</strong>. Content administration is introduced in Gate 4.
      </p>
      <div className="admin-actions">
        <form action="/api/auth/logout" method="post">
          <button className="button button-dark" type="submit">
            Sign out
          </button>
        </form>
        <form action="/api/auth/logout-all" method="post">
          <button className="button button-ghost-dark" type="submit">
            Sign out all sessions
          </button>
        </form>
      </div>
      <h2>Recent security events</h2>
      {events.length ? (
        <ul className="admin-event-list">
          {events.map((event) => (
            <li key={event.id}>
              <span>{event.eventType}</span>
              <time dateTime={event.occurredAt.toISOString()}>
                {event.occurredAt.toLocaleString("en-AU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Australia/Brisbane",
                })}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <p>No security events recorded yet.</p>
      )}
    </section>
  );
}
