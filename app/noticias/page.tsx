import Link from 'next/link';
import { PageIntro } from '@/components/page-intro';
import { NewsCard } from '@/components/news-section';
import { listarNoticias } from '@/lib/data/noticias';
import { AreaFilter } from '@/components/area-filter';
import { pageMetadata } from '@/components/seo';
export const dynamic = 'force-dynamic';
export const metadata = pageMetadata(
  'Notícias',
  'Notícias com fonte e comentários da equipe sobre os temas que fazem parte da sua vida.',
  '/noticias',
);
export default async function Noticias({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; pagina?: string }>;
}) {
  const query = await searchParams;
  const all = (await listarNoticias()).filter(
    (n) => !query.area || n.area === query.area,
  );
  const pages = Math.max(1, Math.ceil(all.length / 6));
  const page = Math.max(1, Math.min(pages, Number(query.pagina) || 1));
  return (
    <>
      <PageIntro
        title="O direito faz parte da sua vida."
        description="Notícias, contexto e o olhar do escritório sobre os assuntos que importam."
        crumbs={[{ label: 'Notícias', href: '/noticias' }]}
      />
      <section className="section light">
        <div className="container">
          <form className="filter-bar" action="/noticias">
            <AreaFilter key={query.area || ''} initialValue={query.area} />
            <button className="button secondary" type="submit">
              Filtrar notícias
            </button>
          </form>
          {all.length ? (
            <div className="news-grid">
              {all.slice((page - 1) * 6, page * 6).map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Ainda não há notícias por aqui.</h2>
              <p>Novos conteúdos serão publicados após a revisão da equipe.</p>
              <Link className="text-link" href="/contato">
                Conversar com o escritório
              </Link>
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="Paginação">
              {Array.from({ length: pages }, (_, i) => (
                <Link
                  className="button secondary"
                  aria-current={page === i + 1 ? 'page' : undefined}
                  key={i}
                  href={`/noticias?area=${query.area || ''}&pagina=${i + 1}`}
                >
                  {i + 1}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
