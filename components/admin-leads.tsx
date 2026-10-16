'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
type LeadRecord = {
  id: string;
  nome: string;
  whatsapp: string;
  cidade: string;
  area: string;
  descricao: string;
  prioridade: string;
  status: string;
  criado_em: string;
};
const statuses = {
  novo: 'Novo',
  em_contato: 'Em contato',
  fechado: 'Fechado',
  descartado: 'Descartado',
};
export function LeadsAdmin({ items }: { items: LeadRecord[] }) {
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function update(id: string, value: string) {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: value }),
      });
      if (!r.ok) throw new Error();
      router.refresh();
    } catch {
      setError('Não foi possível alterar o status. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }
  const filtered = items.filter(
    (l) =>
      (!priority || l.prioridade === priority) &&
      (!status || l.status === status),
  );
  return (
    <>
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="priority">Prioridade</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos</option>
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!filtered.length && (
        <div className="panel">
          <p>Nenhum contato encontrado com estes filtros.</p>
        </div>
      )}
      {filtered.map((l) => (
        <article className="panel" key={l.id}>
          <div className="section-heading">
            <div>
              <h3>{l.nome}</h3>
              <p className="small muted">
                {new Date(l.criado_em).toLocaleString('pt-BR')} · {l.cidade}
              </p>
            </div>
            <span className="status">
              Prioridade {l.prioridade === 'media' ? 'média' : l.prioridade}
            </span>
          </div>
          <p>{l.area.replaceAll('-', ' ')}</p>
          <p>{l.descricao}</p>
          <div className="filter-bar">
            <a
              href={`https://wa.me/55${l.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button secondary"
            >
              Conversar no WhatsApp
            </a>
            <div className="field">
              <label htmlFor={`status-${l.id}`}>Status do contato</label>
              <select
                id={`status-${l.id}`}
                value={l.status}
                disabled={busy}
                onChange={(e) => update(l.id, e.target.value)}
              >
                {Object.entries(statuses).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
