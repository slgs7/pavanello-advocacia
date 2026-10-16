import { requireAdmin } from '@/lib/supabase/server';
import { LeadsAdmin } from '@/components/admin-leads';
export default async function AdminLeads() {
  const db = await requireAdmin();
  const { data, error } = await db
    .from('leads')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(500);
  return (
    <>
      <h1>Contatos recebidos</h1>
      <p className="muted">
        Os 500 contatos mais recentes, organizados para o atendimento.
      </p>
      {error ? (
        <p className="error">Não foi possível carregar os contatos.</p>
      ) : (
        <LeadsAdmin items={data || []} />
      )}
    </>
  );
}
