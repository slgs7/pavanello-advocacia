import { noticias, type Noticia } from '@/content/noticias';
import { publicDatabase } from '@/lib/supabase/server';
import { isDevelopment } from '@/site.config';
export async function listarNoticias(): Promise<Noticia[]> {
  const db = publicDatabase();
  if (!db) return isDevelopment ? noticias : [];
  const { data, error } = await db
    .from('noticias')
    .select('*')
    .eq('status', 'publicado')
    .eq('revisado', true)
    .order('publicado_em', { ascending: false });
  if (error) throw new Error('Não foi possível carregar as notícias.');
  return data || [];
}
export async function obterNoticia(slug: string) {
  return (await listarNoticias()).find((n) => n.slug === slug);
}
