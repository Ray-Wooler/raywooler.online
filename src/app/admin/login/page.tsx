import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedOwner } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign in" };

type LoginPageProps = { searchParams: Promise<{ error?: string; revoked?: string }> };

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await getAuthenticatedOwner()) redirect("/admin");
  const query = await searchParams;
  return (
    <section className="admin-login content-section">
      <p className="eyebrow">
        <span className="eyebrow-line" />
        Owner access
      </p>
      <h1>Sign in to administration.</h1>
      {query.error ? (
        <p className="admin-error" role="alert">
          Sign-in failed. Check your details or wait before trying again.
        </p>
      ) : null}
      {query.revoked ? (
        <p className="admin-notice" role="status">
          All active sessions have been signed out.
        </p>
      ) : null}
      <form action="/api/auth/login" method="post" className="admin-login-form">
        <label>
          Email
          <input autoComplete="username" name="email" required type="email" maxLength={320} />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            required
            type="password"
            maxLength={1024}
          />
        </label>
        <button className="button button-dark" type="submit">
          Sign in
        </button>
      </form>
      <p className="muted">
        Owner accounts are provisioned from the application host. There is no public registration or
        email-based password reset.
      </p>
      <Link className="text-link" href="/">
        Return to the public site <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
