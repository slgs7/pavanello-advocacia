'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
type Review = {
  id: string;
  autor: string;
  texto: string;
  nota: number;
  quando: string;
  url: string;
  ativo: boolean;
  origem: 'Google Maps';
};
export function ReviewsAdmin({ items }: { items: Review[] }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function save(payload: Record<string, unknown>) {
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/admin/avaliacoes', {
        method: payload.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.');
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form
        className="panel admin-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = Object.fromEntries(new FormData(form));
          if (
            await save({
              ...f,
              nota: Number(f.nota),
              origem: 'Google Maps',
              ativo: false,
            })
          )
            form.reset();
        }}
      >
        <div className="field">
          <label htmlFor="autor">Autor, como aparece no Google</label>
          <input id="autor" name="autor" required />
        </div>
        <div className="field">
          <label htmlFor="texto">Texto original completo</label>
          <textarea id="texto" name="texto" required rows={5} />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="nota">Nota</label>
            <select id="nota" name="nota" defaultValue="5">
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="quando">Quando foi publicada</label>
            <input id="quando" name="quando" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="url">Link da avaliação (opcional)</label>
          <input id="url" name="url" type="url" />
        </div>
        <p className="small muted">
          A avaliação começa inativa. Ative somente após confirmar a autorização
          do escritório.
        </p>
        <button className="button primary" disabled={busy}>
          Adicionar avaliação
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {items.map((item) => (
        <article className="panel" key={item.id}>
          <h3>{item.autor}</h3>
          <p>{item.texto}</p>
          <p className="small muted">
            Google Maps · {item.nota} de 5 · {item.ativo ? 'Ativa' : 'Inativa'}
          </p>
          <button
            className="button secondary"
            disabled={busy}
            onClick={() => save({ ...item, ativo: !item.ativo })}
          >
            {item.ativo ? 'Desativar' : 'Ativar'}
          </button>
        </article>
      ))}
    </>
  );
}
