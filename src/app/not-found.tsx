import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="page-main">
      <section className="content-section">
        <div className="shell content-prose">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            404 · Not found
          </p>
          <h1>That page is not here.</h1>
          <p className="muted">The address may have changed or the page may not exist.</p>
          <Link className="button button-dark" href="/">
            Return home <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
