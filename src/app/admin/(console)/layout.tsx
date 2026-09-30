import { requireAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();
  return (
    <>
      <nav className="admin-nav" aria-label="Administration">
        <a href="/admin">Overview</a>
        <a href="/admin/content">Content</a>
        <a href="/admin/media">Media</a>
      </nav>
      {children}
    </>
  );
}
