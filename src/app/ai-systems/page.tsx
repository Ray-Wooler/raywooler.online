import type { Metadata } from "next";
import { ContactBand, PageIntro, SectionHeading } from "@/components/portfolio-ui";

export const metadata: Metadata = {
  title: "AI & Systems",
  description:
    "How Ray Wooler approaches applied AI, bounded automation, agent capabilities and human authority.",
  alternates: { canonical: "/ai-systems" },
  openGraph: {
    title: "AI & Systems | Ray Wooler",
    description: "Practical AI with explicit context, boundaries and human review.",
  },
};

export default function AiSystemsPage() {
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="AI & Systems"
          title="AI is useful when its job and authority are clear."
          intro="I focus on the whole system around a model: the problem, the approved information it can use, the workflow it supports and the human who remains accountable."
        />
      </div>
      <section className="content-section">
        <div className="shell">
          <SectionHeading title="The model is one part of the design.">
            Practical AI work includes choosing where automation helps, defining what context is
            appropriate, testing how failure behaves and making sure a person can review the result.
          </SectionHeading>
          <div className="method-grid">
            <article className="method-card">
              <span className="capability-number">01 / CONTEXT</span>
              <h2>Use the right information</h2>
              <p>
                Keep a system's knowledge relevant to its purpose and respect private or restricted
                data boundaries.
              </p>
            </article>
            <article className="method-card">
              <span className="capability-number">02 / AUTHORITY</span>
              <h2>Separate advice from action</h2>
              <p>
                Drafting and recommendation can help. Publishing, access changes and external
                actions need explicit human control.
              </p>
            </article>
            <article className="method-card">
              <span className="capability-number">03 / EVIDENCE</span>
              <h2>Test the operating path</h2>
              <p>
                Check normal use, invalid inputs, outages and handover before describing a workflow
                as dependable.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="content-section section-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Authority boundary"
            title="Automation can assist without becoming the decision-maker."
          />
          <div className="boundary-panel">
            <div>
              <h2>AI can support</h2>
              <p>
                Summarise, retrieve approved information, classify, draft and recommend—within a
                defined scope.
              </p>
            </div>
            <div>
              <h2>People retain control</h2>
              <ul>
                <li>Publishing and deletion</li>
                <li>Identity and access changes</li>
                <li>External messages and deployment</li>
                <li>Audit records and consequential decisions</li>
              </ul>
            </div>
          </div>
          <p className="muted" style={{ maxWidth: 780, marginTop: 18, fontSize: 12 }}>
            The public assistant and AI services are not enabled in this portfolio core. They will
            be implemented in later gates after the approved public knowledge boundary, privacy
            terms and cost controls are in place.
          </p>
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
