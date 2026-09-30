import { ContentWorkspace } from "@/components/admin/content-workspace";

export const metadata = { title: "Content administration" };
export default function ContentPage() {
  return (
    <section className="admin-panel content-section">
      <p className="eyebrow">
        <span className="eyebrow-line" />
        Portfolio content
      </p>
      <h1>Content management</h1>
      <p>Create and maintain portfolio records, review revisions and publish approved material.</p>
      <ContentWorkspace />
    </section>
  );
}
