import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/content/portfolio";

export function PageIntro({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="page-intro">
      <p className="eyebrow">
        <span className="eyebrow-line" />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      <p className="intro-copy">{intro}</p>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      {eyebrow ? (
        <p className="eyebrow">
          <span className="eyebrow-line" />
          {eyebrow}
        </p>
      ) : null}
      <h2>{title}</h2>
      {children ? <div className="section-copy">{children}</div> : null}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className="status">
          <span className="status-dot" />
          {project.status}
        </span>
        <span className="card-index" aria-hidden="true">
          /{project.slug.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <h3>
        <Link href={`/projects/${project.slug}`}>
          {project.title}
          <span aria-hidden="true"> ↗</span>
        </Link>
      </h3>
      <p className="project-strapline">{project.strapline}</p>
      <p className="muted">{project.summary}</p>
      <section className="tag-list" aria-label="Project capabilities">
        {project.capabilities.map((item) => (
          <span className="tag" key={item}>
            {item}
          </span>
        ))}
      </section>
      <Link className="text-link" href={`/projects/${project.slug}`}>
        Explore project <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band">
      <div>
        <p className="eyebrow">
          <span className="eyebrow-line" />
          Start a conversation
        </p>
        <h2>Have a complex problem worth untangling?</h2>
        <p className="muted">
          Share the challenge, the people involved and what a useful outcome would look like.
        </p>
      </div>
      <Link className="button button-dark" href="/contact">
        Discuss a project <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
