import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/portfolio-ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation about applied AI, systems architecture, automation or technical work with Ray Wooler.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Ray Wooler",
    description: "Discuss an applied AI, systems or technology challenge.",
  },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="page-main">
      <div className="shell">
        <PageIntro
          eyebrow="Contact"
          title="Start with the problem you are trying to solve."
          intro="A useful first conversation begins with the work, the people involved and what a better outcome would look like."
        />
      </div>
      <section className="content-section">
        <div className="shell contact-shell">
          <aside className="contact-status">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              Contact pathway
            </p>
            <h2>The enquiry form is being built with its privacy and abuse controls.</h2>
            <p>
              This is a contact-page shell only. It does not collect or send your information. The
              secure enquiry workflow will be enabled in a later V1 gate.
            </p>
            <p>
              In the meantime, explore the{" "}
              <Link className="text-link" href="/projects">
                project work
              </Link>{" "}
              or connect through the public{" "}
              <a
                className="text-link"
                href="https://github.com/Ray-Wooler"
                target="_blank"
                rel="noreferrer"
              >
                GitHub profile ↗
              </a>
              .
            </p>
          </aside>
          <form className="disabled-form" aria-describedby="contact-form-note">
            <fieldset
              disabled
              style={{ display: "grid", gap: 15, margin: 0, padding: 0, border: 0 }}
            >
              <label>
                Name
                <input autoComplete="name" name="name" placeholder="Your name" />
              </label>
              <label>
                Email
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>
              <label>
                What would you like to discuss?
                <textarea name="message" placeholder="A short description of the problem" />
              </label>
              <button type="button">Secure form coming in a later V1 gate</button>
            </fieldset>
            <p className="form-note" id="contact-form-note">
              All fields are disabled. Nothing typed here is submitted or stored.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
