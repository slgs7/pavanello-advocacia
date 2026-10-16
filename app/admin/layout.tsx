import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Painel do escritório',
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container admin-shell">{children}</div>;
}
