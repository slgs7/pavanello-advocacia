'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Noticia } from '@/content/noticias';
import { areas } from '@/content/areas';
const empty = {
  titulo: '',
  fonte_url: '',
  fonte_nome: '',
  imagem_url: '',
  imagem_credito: '',
  imagem_autorizada: false,
  resumo: '',
  comentario: '',
  area: '',
  revisado: false,
  status: 'rascunho' as const,
};
export function NewsEditor({
  initial,
  preview = false,
}: {
  initial?: Noticia;
  preview?: boolean;
}) {
  const [data, setData] = useState(initial || empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function lookup() {
    if (preview) {
      setError('Prévia visual: a busca será habilitada ao conectar o banco.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/admin/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.fonte_url }),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      setData((d) => ({ ...d, ...result }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Preencha os campos manualmente.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function save(status: 'rascunho' | 'publicado') {
    if (preview) {
      setError('Prévia visual: nenhuma alteração foi salva ou publicada.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/admin/noticias', {
        method: initial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status }),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      router.push('/admin/noticias');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      className="panel admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        void save('rascunho');
      }}
    >
      <div className="field">
        <label htmlFor="fonte_url">Link da notícia</label>
        <input
          id="fonte_url"
          type="url"
          value={data.fonte_url}
          onChange={(e) => setData({ ...data, fonte_url: e.target.value })}
          required
        />
      </div>
      <button
        className="button secondary"
        type="button"
        onClick={lookup}
        disabled={busy}
      >
        Buscar dados
      </button>
      <div className="field" style={{ marginTop: 'var(--s6)' }}>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          value={data.titulo}
          onChange={(e) => setData({ ...data, titulo: e.target.value })}
          maxLength={200}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="fonte_nome">Nome da fonte</label>
        <input
          id="fonte_nome"
          value={data.fonte_nome}
          onChange={(e) => setData({ ...data, fonte_nome: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="imagem_url">Link da miniatura (opcional)</label>
        <input
          id="imagem_url"
          type="url"
          value={data.imagem_url || ''}
          onChange={(e) => setData({ ...data, imagem_url: e.target.value })}
        />
        <span className="small muted">
          Use somente imagens com permissão de reprodução. Sem autorização, o
          site usa o ornamento do escritório.
        </span>
      </div>
      <div className="field">
        <label htmlFor="imagem_credito">Crédito da imagem</label>
        <input
          id="imagem_credito"
          value={data.imagem_credito || ''}
          onChange={(e) => setData({ ...data, imagem_credito: e.target.value })}
        />
      </div>
      <label className="check" style={{ marginBottom: 'var(--s6)' }}>
        <input
          type="checkbox"
          checked={data.imagem_autorizada || false}
          onChange={(e) =>
            setData({ ...data, imagem_autorizada: e.target.checked })
          }
        />
        Confirmo que temos permissão para reproduzir a miniatura, com o crédito
        informado.
      </label>
      <div className="field">
        <label htmlFor="resumo">Resumo · {data.resumo.length}/320</label>
        <textarea
          id="resumo"
          maxLength={320}
          rows={3}
          value={data.resumo}
          onChange={(e) => setData({ ...data, resumo: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="comentario">O que isso muda para você</label>
        <textarea
          id="comentario"
          rows={7}
          value={data.comentario}
          onChange={(e) => setData({ ...data, comentario: e.target.value })}
          required
        />
        <span className="small muted">
          Escreva o comentário do escritório. Não copie a matéria original.
        </span>
      </div>
      <div className="field">
        <label htmlFor="area-noticia">Área relacionada</label>
        <select
          id="area-noticia"
          value={data.area}
          onChange={(e) => setData({ ...data, area: e.target.value })}
        >
          <option value="">Geral</option>
          {areas.map((a) => (
            <option value={a.slug} key={a.slug}>
              {a.nome}
            </option>
          ))}
        </select>
      </div>
      <label className="check">
        <input
          type="checkbox"
          checked={data.revisado}
          onChange={(e) => setData({ ...data, revisado: e.target.checked })}
        />
        Confirmo que este conteúdo foi revisado por advogado e está autorizado
        para publicação.
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="button-row">
        <button type="submit" className="button secondary" disabled={busy}>
          Salvar rascunho
        </button>
        <button
          type="button"
          className="button primary"
          disabled={busy || !data.revisado}
          onClick={() => save('publicado')}
        >
          {busy ? 'Salvando…' : 'Publicar notícia'}
        </button>
      </div>
    </form>
  );
}
export function NewsAdminList({
  items,
  preview = false,
}: {
  items: Noticia[];
  preview?: boolean;
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function action(item: Noticia, remove = false) {
    if (preview) {
      setError('Prévia visual: nenhuma notícia foi alterada.');
      return;
    }
    if (remove && !confirm(`Excluir a notícia “${item.titulo}”?`)) return;
    setBusy(true);
    try {
      const r = await fetch('/api/admin/noticias', {
        method: remove ? 'DELETE' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          remove ? { id: item.id } : { ...item, status: 'rascunho' },
        ),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Não foi possível alterar.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!items.length && (
        <div className="panel">
          <h3>A primeira notícia começa com um link.</h3>
          <p>Adicione uma fonte, seu resumo e o comentário do escritório.</p>
        </div>
      )}
      <div className="admin-list">
        {items.map((n) => (
          <article className="panel" key={n.id}>
            <span className="status">
              {n.status === 'publicado' ? 'Publicado' : 'Rascunho'}
            </span>
            <h3>{n.titulo}</h3>
            <div className="button-row">
              <Link
                href={
                  preview
                    ? `/previa-painel?editar=${n.id}`
                    : `/admin/noticias/${n.id}`
                }
                className="button secondary"
              >
                Editar
              </Link>
              {n.status === 'publicado' && (
                <button
                  className="button ghost"
                  disabled={busy}
                  onClick={() => action(n)}
                >
                  Despublicar
                </button>
              )}
              <button
                className="plain-button"
                disabled={busy}
                onClick={() => action(n, true)}
              >
                Excluir notícia
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
