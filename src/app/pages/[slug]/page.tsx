import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPage } from "@/lib/content/public";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  return page
    ? {
        title: page.seoTitle ?? page.title,
        description: page.seoDescription ?? page.summary,
        alternates: { canonical: page.canonicalUrl ?? `/pages/${page.slug}` },
      }
    : { title: "Page not found" };
}
export default async function ManagedPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <section className="page-intro">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            Portfolio page
          </p>
          <h1>{page.title}</h1>
          {page.summary && <p className="intro-copy">{page.summary}</p>}
        </section>
        <article className="managed-page-body">
          {page.body
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </article>
      </div>
    </main>
  );
}
