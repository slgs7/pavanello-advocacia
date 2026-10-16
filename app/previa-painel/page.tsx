import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NewsAdminList, NewsEditor } from '@/components/admin-news';
import { noticias } from '@/content/noticias';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Prévia do painel',
  robots: { index: false, follow: false },
};

export default async function AdminPreview({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string; nova?: string }>;
}) {
  if (process.env.NODE_ENV !== 'development') notFound();
  const query = await searchParams;
  const initial = noticias.find((item) => item.id === query.editar);
  const editor = Boolean(initial || query.nova);
  return (
    <div className="container admin-shell">
      <p className="pending">
        Prévia visual · Dados demonstrativos · Não salva nem publica
      </p>
      <nav className="button-row" aria-label="Prévia do painel">
        <Link className="button secondary" href="/previa-painel">
          Notícias
        </Link>
        <Link className="text-link" href="/admin/login">
          Tela de acesso
        </Link>
      </nav>
      <div className="section-heading" style={{ marginTop: 'var(--s12)' }}>
        <h1>
          {editor
            ? initial
              ? 'Editar notícia'
              : 'Adicionar notícia'
            : 'Notícias'}
        </h1>
        <Link
          className="button primary"
          href={editor ? '/previa-painel' : '/previa-painel?nova=1'}
        >
          {editor ? 'Voltar à lista' : 'Adicionar notícia'}
        </Link>
      </div>
      {editor ? (
        <NewsEditor initial={initial} preview />
      ) : (
        <NewsAdminList items={noticias} preview />
      )}
    </div>
  );
}
