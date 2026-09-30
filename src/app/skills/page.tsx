import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portfolio-ui";
import { findProject, skills } from "@/content/portfolio";
import { getPublishedSkills } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Evidence-linked capabilities in applied AI, agentic systems, architecture, software, automation and operations.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Skills & capabilities | Ray Wooler",
    description: "Capabilities connected to current project evidence.",
  },
};

export const dynamic = "force-dynamic";
export default async function SkillsPage() {
  const managed = await getPublishedSkills().catch(() => []);
  const displaySkills = managed.length
    ? managed.map((skill) => ({
        name: skill.name,
        description: skill.summary,
        evidence: skill.evidence,
      }))
    : skills;
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="Skills & capabilities"
          title="Capabilities connected to evidence."
          intro="I do not use percentage bars to imply precision. Each area below links to work where the capability is being applied, with project maturity shown on the project itself."
        />
      </div>
      <section className="content-section">
        <div className="shell skill-grid">
          {displaySkills.map((skill) => (
            <article className="skill-card" key={skill.name}>
              <h2>{skill.name}</h2>
              <p>{skill.description}</p>
              <section className="tag-list" aria-label={`Projects demonstrating ${skill.name}`}>
                {skill.evidence.map((slug) => {
                  const project = findProject(slug);
                  return project ? (
                    <Link className="tag" href={`/projects/${slug}`} key={slug}>
                      {project.title}
                    </Link>
                  ) : null;
                })}
              </section>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
