import { requireAdmin } from '@/lib/supabase/server';
import { ReviewsAdmin } from '@/components/admin-reviews';
export default async function AdminReviews() {
  const db = await requireAdmin();
  const { data, error } = await db
    .from('avaliacoes')
    .select('*')
    .order('criado_em', { ascending: false });
  return (
    <>
      <h1>Avaliações</h1>
      <p className="muted">
        Cole o texto exatamente como o cliente escreveu. Não edite nem resuma.
      </p>
      {error ? (
        <p className="error">Não foi possível carregar as avaliações.</p>
      ) : (
        <ReviewsAdmin items={data || []} />
      )}
    </>
  );
}
