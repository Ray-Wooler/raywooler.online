import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portfolio-ui";
import { findProject, services } from "@/content/portfolio";
import { getPublishedServices } from "@/lib/content/public";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Applied AI, systems architecture, automation, custom applications and practical technical consulting.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Ray Wooler",
    description: "Practical technology services for real operational needs.",
  },
};

export const dynamic = "force-dynamic";
export default async function ServicesPage() {
  const managed = await getPublishedServices();
  const displayServices = managed.length
    ? managed.map((service) => ({
        ...service,
        engagement: service.typicalEngagement,
        relatedProjects: [] as string[],
      }))
    : services;
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="Services"
          title="Practical help for systems that need to work in the real world."
          intro="Engagements start with the actual problem and its constraints. The right outcome might be a clearer process, an architecture, a prototype or hands-on technical support."
        />
      </div>
      <section className="content-section">
        <div className="shell page-grid">
          {displayServices.map((service) => (
            <article className="service-card" key={service.slug}>
              <p className="eyebrow">
                <span className="eyebrow-line" />
                {service.slug.replaceAll("-", " ")}
              </p>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
              <p className="service-problem">
                <strong>Good fit when:</strong> {service.problem}
              </p>
              <h3>Typical engagement</h3>
              <p>{service.engagement}</p>
              <h3>Possible deliverables</h3>
              <ul className="check-list">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <section className="tag-list" aria-label="Related projects">
                {service.relatedProjects.map((slug) => {
                  const project = findProject(slug);
                  return project ? (
                    <Link className="tag" href={`/projects/${slug}`} key={slug}>
                      {project.title}
                    </Link>
                  ) : null;
                })}
              </section>
              <Link className="text-link" href="/contact">
                Discuss this area <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
