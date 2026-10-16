import { avaliacoes, type Avaliacao } from '@/content/avaliacoes';
import { publicDatabase } from '@/lib/supabase/server';
import { isDevelopment, siteConfig } from '@/site.config';
export async function listarAvaliacoes(): Promise<Avaliacao[]> {
  if (!siteConfig.reviewsApproved && !isDevelopment) return [];
  const db = publicDatabase();
  if (!db) return avaliacoes.filter((a) => !a.exemplo && !a.incompleto);
  const { data, error } = await db
    .from('avaliacoes')
    .select('*')
    .eq('ativo', true);
  if (error) throw new Error('Não foi possível carregar as avaliações.');
  return data || [];
}
