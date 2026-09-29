import Link from "next/link";
import { ContactBand, ProjectCard, SectionHeading } from "@/components/portfolio-ui";
import { capabilities, projects, skills } from "@/content/portfolio";

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Applied AI · Systems · Practical technology
            </p>
            <h1>
              I build practical systems that turn complex operational problems into useful software.
            </h1>
            <p className="hero-lede">
              My work connects AI, applications, automation and infrastructure to the realities of
              how people and organisations operate.
            </p>
            <div className="hero-actions">
              <Link className="button button-accent" href="/projects">
                Explore my work <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-ghost" href="/contact">
                Discuss a project <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <aside className="hero-aside" aria-label="Working approach">
            <strong>From problem to system</strong>
            <span>Understand the work. Design clear boundaries. Build and verify what helps.</span>
          </aside>
        </div>
      </section>

      <section className="proof-strip" aria-label="Areas of work">
        <div className="shell proof-inner">
          <div className="proof-item">
            <strong>Applied AI</strong>
            <span>Useful, governed workflows</span>
          </div>
          <div className="proof-item">
            <strong>Systems architecture</strong>
            <span>Clear boundaries and integration</span>
          </div>
          <div className="proof-item">
            <strong>Software & automation</strong>
            <span>Purpose-built operational tools</span>
          </div>
          <div className="proof-item">
            <strong>Technical operations</strong>
            <span>Practical support and delivery</span>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell">
          <SectionHeading
            eyebrow="How I work"
            title="Technology should fit the work, not the other way around."
          >
            I start with the people, process and constraints. Then I shape a system that can be
            understood, tested and improved.
          </SectionHeading>
          <div className="capability-grid">
            {capabilities.map((item) => (
              <article className="capability" key={item.number}>
                <span className="capability-number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-topline">
            <SectionHeading
              eyebrow="Selected work"
              title="Projects with their current state in view."
            >
              A sample of independent work across AI systems, software and operational design.
            </SectionHeading>
            <Link className="text-link" href="/projects">
              All projects <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="project-grid">
            {featuredProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <p className="muted" style={{ marginTop: 16, fontSize: 11 }}>
            Project maturity is labelled explicitly. Summaries remain subject to owner review before
            a production release; private work and unverified metrics are excluded.
          </p>
        </div>
      </section>

      <section className="section section-muted">
        <div className="shell two-column">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" />A practical perspective
            </p>
            <blockquote className="manifesto">
              <span className="manifesto-mark" aria-hidden="true">
                “
              </span>
              <br />
              The best system is the one that makes the work clearer, safer and easier to carry
              forward.
            </blockquote>
          </div>
          <div>
            <SectionHeading title="Built at the intersection of people and systems.">
              I bring hands-on technical experience together with operational context. That means
              looking beyond the demo: at ownership, exceptions, failure, recovery and what happens
              after launch.
            </SectionHeading>
            <div className="principles">
              <article className="principle">
                <h3>Evidence over theatre</h3>
                <p>Show what exists and where it stands.</p>
              </article>
              <article className="principle">
                <h3>Bounded automation</h3>
                <p>Give systems purpose without unearned authority.</p>
              </article>
              <article className="principle">
                <h3>Portable by design</h3>
                <p>Keep the work understandable and reproducible.</p>
              </article>
            </div>
            <Link className="text-link" href="/about" style={{ marginTop: 26 }}>
              More about Ray <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell two-column">
          <SectionHeading
            eyebrow="Capabilities"
            title="Skills connected to work, not percentage bars."
          >
            Each capability is supported by the systems and projects where it is being applied.
          </SectionHeading>
          <div className="skill-grid">
            {skills.slice(0, 4).map((skill) => (
              <article className="skill-card" key={skill.name}>
                <h2>{skill.name}</h2>
                <p>{skill.description}</p>
                <Link className="text-link" href="/skills">
                  See related evidence <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="shell">
          <ContactBand />
        </div>
      </section>
    </main>
  );
}
