"use client";

import { useEffect, useState } from "react";

type Media = {
  id: string;
  originalName: string;
  mimeType: string;
  byteSize: number;
  altText: string;
  isPublic: boolean;
  publicationStatus: string;
  createdAt: string;
};
export function MediaWorkspace() {
  const [items, setItems] = useState<Media[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Could not load media");
    setItems(result.items);
  }
  useEffect(() => {
    fetch("/api/admin/media", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load media");
        setItems(result.items);
      })
      .catch((error: Error) => setMessage(error.message));
  }, []);
  async function update(item: Media, changes: object) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, ...changes }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Update failed");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }
    const form = new FormData();
    form.set("file", file);
    form.set("altText", altText);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Upload failed");
      setFile(null);
      setAltText("");
      event.currentTarget.reset();
      await refresh();
      setMessage("Image uploaded as a private draft.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="content-workspace">
      <form className="media-upload" onSubmit={upload}>
        <h2>Upload image</h2>
        <p>
          PNG, JPEG or WebP, up to 8 MB. New uploads remain private until approved and published.
        </p>
        <label htmlFor="media-file">Image file</label>
        <input
          id="media-file"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <label htmlFor="media-alt">Alternative text</label>
        <input
          id="media-alt"
          value={altText}
          maxLength={500}
          onChange={(event) => setAltText(event.target.value)}
        />
        <button type="submit" className="button button-dark" disabled={busy}>
          Upload image
        </button>
      </form>
      <h2>Media library</h2>
      {items.length ? (
        <ul className="media-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.originalName}</strong>
                <p>
                  {item.mimeType} · {Math.ceil(item.byteSize / 1024)} KB · {item.publicationStatus}
                </p>
                <label>
                  Alt text{" "}
                  <input
                    value={item.altText}
                    maxLength={500}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((candidate) =>
                          candidate.id === item.id
                            ? { ...candidate, altText: event.target.value }
                            : candidate,
                        ),
                      )
                    }
                    onBlur={(event) => update(item, { altText: event.target.value })}
                  />
                </label>
              </div>
              <div className="admin-actions">
                {item.publicationStatus === "DRAFT" && (
                  <button
                    type="button"
                    className="button button-ghost-dark"
                    disabled={busy}
                    onClick={() => update(item, { action: "submit_review" })}
                  >
                    Submit for review
                  </button>
                )}
                {item.publicationStatus === "REVIEW" && (
                  <button
                    type="button"
                    className="button button-ghost-dark"
                    disabled={busy}
                    onClick={() => update(item, { action: "approve" })}
                  >
                    Approve
                  </button>
                )}
                {item.publicationStatus === "APPROVED" && (
                  <button
                    type="button"
                    className="button button-ghost-dark"
                    disabled={busy}
                    onClick={() => update(item, { action: "publish", isPublic: true })}
                  >
                    Publish publicly
                  </button>
                )}
                {item.publicationStatus === "PUBLISHED" && (
                  <button
                    type="button"
                    className="button button-ghost-dark"
                    disabled={busy}
                    onClick={() => update(item, { action: "unpublish", isPublic: false })}
                  >
                    Unpublish
                  </button>
                )}
                {item.publicationStatus === "PUBLISHED" && (
                  <a href={`/api/media/${item.id}`} target="_blank" rel="noreferrer">
                    View public image
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No media uploaded yet.</p>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
