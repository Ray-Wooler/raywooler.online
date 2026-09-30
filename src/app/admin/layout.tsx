export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main-content" className="page-main">
      <div className="shell">{children}</div>
    </main>
  );
}
