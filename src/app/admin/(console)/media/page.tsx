import { MediaWorkspace } from "@/components/admin/media-workspace";

export const metadata = { title: "Media administration" };
export default function MediaPage() {
  return (
    <section className="admin-panel content-section">
      <p className="eyebrow">
        <span className="eyebrow-line" />
        Portfolio assets
      </p>
      <h1>Media library</h1>
      <p>Upload, review and publish public portfolio images.</p>
      <MediaWorkspace />
    </section>
  );
}
