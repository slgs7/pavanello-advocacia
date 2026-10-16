import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/server';
import { NewsEditor } from '@/components/admin-news';
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = await requireAdmin();
  const { data } = await db
    .from('noticias')
    .select('*')
    .eq('id', (await params).id)
    .single();
  if (!data) notFound();
  return (
    <>
      <h1>Editar notícia</h1>
      <NewsEditor initial={data} />
    </>
  );
}
