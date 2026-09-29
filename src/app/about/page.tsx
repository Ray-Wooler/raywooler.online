import type { Metadata } from "next";
import { ContactBand, PageIntro } from "@/components/portfolio-ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Ray Wooler and learn how he approaches applied AI, systems architecture and practical technology.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Ray Wooler",
    description: "Applied AI, systems architecture and practical technology.",
  },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="About"
          title="Technical thinking grounded in how work actually happens."
          intro="I work across applied AI, systems design, software and technical operations—bringing technical execution together with practical experience of people, service and business processes."
        />
      </div>
      <section className="content-section">
        <div className="shell two-column">
          <div className="content-prose">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              My perspective
            </p>
            <h2 className="manifesto">I care about what happens after the architecture diagram.</h2>
          </div>
          <div className="content-prose">
            <p>
              Good technology starts with a better understanding of the problem. I look at the
              people doing the work, the information they need, the systems they already use and the
              exceptions that tend to break an idealised process.
            </p>
            <p>
              My background spans technical support, systems administration, operations, customer
              service, marketing and business roles. Those experiences shape a practical approach:
              make the system useful, explain its boundaries and leave the next person with a clear
              way to operate it.
            </p>
            <p>
              Today I apply that perspective to AI-enabled workflows, web applications, automation
              and self-managed infrastructure. The work is presented with explicit maturity labels
              so a prototype is never mistaken for a production service.
            </p>
          </div>
        </div>
      </section>
      <section className="content-section section-muted">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Working principles
            </p>
            <h2>Useful systems earn trust through their behaviour.</h2>
          </div>
          <div className="principles">
            <article className="principle">
              <h3>Start with context</h3>
              <p>Map the task and constraints before selecting a tool.</p>
            </article>
            <article className="principle">
              <h3>Make authority explicit</h3>
              <p>People remain accountable for consequential decisions.</p>
            </article>
            <article className="principle">
              <h3>Verify before claiming</h3>
              <p>Show evidence, limits and current maturity clearly.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="shell">
          <ContactBand />
        </div>
      </section>
    </main>
  );
}
