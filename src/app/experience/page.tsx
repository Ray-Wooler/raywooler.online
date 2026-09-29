import type { Metadata } from "next";
import { PageIntro } from "@/components/portfolio-ui";
import { experience } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "A practical career across technical support, systems work, business operations and applied software projects.",
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience | Ray Wooler",
    description: "Technical and operational experience connected to current systems work.",
  },
};

export default function ExperiencePage() {
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="Experience"
          title="A career shaped by technology and operational reality."
          intro="My work has moved between hands-on technical roles, service and business operations, and the design of new systems. That range helps me see both how a system is built and how it lands with the people using it."
        />
      </div>
      <section className="content-section">
        <div className="shell">
          <p className="experience-intro">
            This overview stays at role-family level. Employer names, dates and detailed
            responsibilities will be added only after the public résumé record has been checked.
          </p>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-card" key={item.title}>
                <div>
                  <span className="period">{item.period}</span>
                  <p className="organisation">{item.organisation}</p>
                </div>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <div className="tag-list">
                    {item.capabilities.map((capability) => (
                      <span className="tag" key={capability}>
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
