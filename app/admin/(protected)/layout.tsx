import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin-nav';
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
