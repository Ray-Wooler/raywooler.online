import type { Metadata } from "next";
import { PageIntro, ProjectCard } from "@/components/portfolio-ui";
import { projects } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Ray Wooler's applied AI, software, systems and workflow projects, with current maturity clearly labelled.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects by Ray Wooler",
    description: "Current work across applied AI, software and systems.",
  },
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="Projects"
          title="A body of work, shown at its real maturity."
          intro="These independent projects explore practical systems across AI, software, automation and operations. Each project states where it stands today."
        />
      </div>
      <section className="content-section">
        <div className="shell">
          <p className="muted" style={{ maxWidth: 760, margin: "0 0 28px", fontSize: 13 }}>
            Project summaries are intentionally limited to public-safe information. Client work,
            sensitive context and unsupported outcome claims are not included. Descriptions are
            subject to owner review before a production release.
          </p>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
