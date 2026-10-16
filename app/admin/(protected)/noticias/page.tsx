import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { NewsAdminList } from '@/components/admin-news';
export default async function AdminNews() {
  const db = await requireAdmin();
  const { data, error } = await db
    .from('noticias')
    .select('*')
    .order('criado_em', { ascending: false });
  return (
    <>
      <div className="section-heading">
        <h1>Notícias</h1>
        <Link href="/admin/noticias/nova" className="button primary">
          Adicionar notícia
        </Link>
      </div>
      {error ? (
        <p className="error">Não foi possível carregar as notícias.</p>
      ) : (
        <NewsAdminList items={data || []} />
      )}
    </>
  );
}
