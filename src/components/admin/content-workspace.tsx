"use client";

import { useEffect, useState } from "react";
import { contentSchemas, resourceNames, type ContentResource } from "@/lib/content/validation";

type Item = Record<string, unknown> & {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  publicationStatus?: string;
};
const labels: Record<ContentResource, string> = {
  projects: "Projects",
  services: "Services",
  skills: "Skills",
  experience: "Experience",
  pages: "Pages",
};
const examples: Record<ContentResource, object> = {
  projects: {
    title: "Project title",
    slug: "project-title",
    summary: "A concise public summary",
    maturity: "Prototype",
  },
  services: {
    title: "Service title",
    slug: "service-title",
    problem: "The problem this service helps solve",
  },
  skills: {
    name: "Systems architecture",
    slug: "systems-architecture",
    category: "Systems",
    summary: "Evidence-linked capability",
  },
  experience: { title: "Role or experience", organisation: "", periodLabel: "", sortOrder: 0 },
  pages: { title: "Page title", slug: "page-slug", summary: "", body: "" },
};

export function ContentWorkspace() {
  const [resource, setResource] = useState<ContentResource>("projects");
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [json, setJson] = useState("");
  const [revisions, setRevisions] = useState<Array<Record<string, unknown>>>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch(`/api/admin/content/${resource}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Could not load content");
    setItems(result.items);
  }
  useEffect(() => {
    setSelected(null);
    setMessage("");
    fetch(`/api/admin/content/${resource}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load content");
        setItems(result.items);
      })
      .catch((e: Error) => setMessage(e.message));
  }, [resource]);
  useEffect(() => {
    if (!selected) {
      setJson(JSON.stringify(examples[resource], null, 2));
      setRevisions([]);
      return;
    }
    const editable = Object.fromEntries(
      Object.entries(selected).filter(
        ([key]) =>
          !["id", "publicationStatus", "createdAt", "updatedAt", "publishedAt"].includes(key),
      ),
    );
    setJson(JSON.stringify(editable, null, 2));
    fetch(`/api/admin/revisions?resource=${resource}&id=${selected.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setRevisions(data.items ?? []))
      .catch(() => setRevisions([]));
  }, [selected, resource]);

  async function request(url: string, method: string, body?: unknown) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Request failed");
      await refresh();
      if (result.item) setSelected(result.item);
      setMessage("Saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    let data: unknown;
    try {
      data = JSON.parse(json);
    } catch {
      setMessage("Content must be valid JSON.");
      return;
    }
    const validation = contentSchemas[resource].safeParse(data);
    if (!validation.success) {
      setMessage(
        validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      );
      return;
    }
    await request(
      selected ? `/api/admin/content/${resource}/${selected.id}` : `/api/admin/content/${resource}`,
      selected ? "PUT" : "POST",
      validation.data,
    );
  }
  async function transition(action: string) {
    if (!selected) return;
    await request(`/api/admin/content/${resource}/${selected.id}/transition`, "POST", { action });
  }

  return (
    <div className="content-workspace">
      <div className="content-toolbar">
        <label htmlFor="content-resource">Content type</label>
        <select
          id="content-resource"
          value={resource}
          onChange={(event) => setResource(event.target.value as ContentResource)}
        >
          {resourceNames.map((name) => (
            <option key={name} value={name}>
              {labels[name]}
            </option>
          ))}
        </select>
        <button
          className="button button-ghost-dark"
          type="button"
          onClick={() => setSelected(null)}
        >
          New draft
        </button>
      </div>
      <div className="content-columns">
        <section className="content-list" aria-label={`${labels[resource]} records`}>
          <h2>{labels[resource]}</h2>
          {items.length ? (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    className={selected?.id === item.id ? "content-item selected" : "content-item"}
                    type="button"
                    onClick={() => setSelected(item)}
                  >
                    <strong>{String(item.title ?? item.name ?? item.slug ?? "Untitled")}</strong>
                    <span className="content-status">{item.publicationStatus}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No records yet. Create your first draft.</p>
          )}
        </section>
        <section className="content-editor" aria-label="Content editor">
          <h2>{selected ? "Edit content" : "Create draft"}</h2>
          <p>
            Enter the record as JSON. New records always start as drafts and stay private until the
            owner publishes them.
          </p>
          <label htmlFor="content-json">Record fields</label>
          <textarea
            id="content-json"
            spellCheck={false}
            rows={22}
            value={json}
            onChange={(event) => setJson(event.target.value)}
          />
          <div className="admin-actions">
            <button className="button button-dark" type="button" disabled={busy} onClick={save}>
              {busy ? "Saving…" : selected ? "Save changes" : "Create draft"}
            </button>
            {selected?.publicationStatus === "DRAFT" && (
              <button
                className="button button-ghost-dark"
                type="button"
                disabled={busy}
                onClick={() => transition("submit_review")}
              >
                Submit for review
              </button>
            )}
            {selected?.publicationStatus === "REVIEW" && (
              <button
                className="button button-ghost-dark"
                type="button"
                disabled={busy}
                onClick={() => transition("approve")}
              >
                Approve
              </button>
            )}
            {selected?.publicationStatus === "APPROVED" && (
              <button
                className="button button-ghost-dark"
                type="button"
                disabled={busy}
                onClick={() => transition("publish")}
              >
                Publish
              </button>
            )}
            {selected?.publicationStatus === "PUBLISHED" && (
              <button
                className="button button-ghost-dark"
                type="button"
                disabled={busy}
                onClick={() => transition("unpublish")}
              >
                Unpublish
              </button>
            )}
          </div>
          {message && (
            <p role="status" className="content-message">
              {message}
            </p>
          )}
          {selected && (
            <section className="revision-list">
              <h3>Revision history</h3>
              {revisions.length ? (
                <ol>
                  {revisions.map((revision) => (
                    <li key={String(revision.id)}>
                      Version {String(revision.version)} · {String(revision.changeReason)} ·{" "}
                      {new Date(String(revision.createdAt)).toLocaleString()}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No revisions recorded.</p>
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
