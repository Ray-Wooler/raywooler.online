import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BulletList } from "@/components/portfolio-ui";
import { findProject, projects } from "@/content/portfolio";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <div className="page-intro">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            Project detail
          </p>
          <h1>{project.title}</h1>
          <p className="intro-copy">
            {project.strapline} {project.summary}
          </p>
          <div className="project-detail-top">
            <span className="status">
              <span className="status-dot" />
              {project.status}
            </span>
            <Link className="text-link" href="/projects">
              ← Back to all projects
            </Link>
          </div>
        </div>
        <div className="content-section project-detail-grid">
          <div>
            <section>
              <h2>The problem</h2>
              <p>{project.problem}</p>
            </section>
            <section>
              <h2>Approach</h2>
              <BulletList items={project.approach} />
            </section>
            <section>
              <h2>Role</h2>
              <p>{project.role}</p>
            </section>
          </div>
          <aside className="project-aside" aria-label="Project details">
            <h2>At a glance</h2>
            <dl>
              <dt>Current state</dt>
              <dd>{project.status}</dd>
              <dt>Capabilities</dt>
              <dd>{project.capabilities.join(", ")}</dd>
              <dt>Technologies</dt>
              <dd>{project.technologies.join(", ")}</dd>
              <dt>Disclosure</dt>
              <dd>
                Summary-level project information; owner review required before production release.
              </dd>
            </dl>
          </aside>
        </div>
        <nav className="project-nav" aria-label="Project navigation">
          <Link className="text-link" href="/projects">
            All projects <span aria-hidden="true">→</span>
          </Link>
          <Link className="text-link" href="/contact">
            Discuss related work <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
