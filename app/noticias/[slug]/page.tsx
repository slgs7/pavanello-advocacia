import { notFound } from 'next/navigation';
import Link from 'next/link';
import { obterNoticia, listarNoticias } from '@/lib/data/noticias';
import { PageIntro } from '@/components/page-intro';
import { NewsSection } from '@/components/news-section';
import { JsonLd, pageMetadata } from '@/components/seo';
import { siteConfig } from '@/site.config';
import { NewsCover } from '@/components/news-cover';
export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const n = await obterNoticia((await params).slug);
  return n
    ? {
        ...pageMetadata(n.titulo, n.resumo, `/noticias/${n.slug}`),
        ...(!n.revisado ? { robots: { index: false, follow: false } } : {}),
      }
    : {};
}
export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const n = await obterNoticia((await params).slug);
  if (!n) notFound();
  return (
    <>
      <PageIntro
        title={n.titulo}
        description={n.resumo}
        crumbs={[
          { label: 'Notícias', href: '/noticias' },
          { label: n.titulo, href: `/noticias/${n.slug}` },
        ]}
      />
      <section className="section light">
        <article className="container prose">
          {n.imagem_url && n.imagem_autorizada && (
            <figure>
              <div className="news-cover">
                <NewsCover url={n.imagem_url} authorized alt={n.titulo} />
              </div>
              <figcaption className="small">
                Imagem: {n.imagem_credito || n.fonte_nome}
              </figcaption>
            </figure>
          )}
          <p className="small">
            Fonte: {n.fonte_nome}
            {n.publicado_em &&
              ` · ${new Date(n.publicado_em).toLocaleDateString('pt-BR')}`}
          </p>
          {!n.revisado && (
            <p className="pending">
              Prévia editorial · Texto aguardando revisão do escritório
            </p>
          )}
          <h2>O que isso muda para você</h2>
          {n.comentario
            .split('\n')
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          {n.fonte_url && (
            <a
              href={n.fonte_url}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ler a matéria original
            </a>
          )}
          <div className="button-row">
            <Link href={`/contato?area=${n.area}`} className="button secondary">
              Conversar sobre este assunto
            </Link>
          </div>
        </article>
      </section>
      {n.revisado && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: n.titulo,
            datePublished: n.publicado_em,
            author: { '@type': 'Organization', name: siteConfig.name },
            citation: n.fonte_url,
            mainEntityOfPage: siteConfig.url + `/noticias/${n.slug}`,
          }}
        />
      )}
      <NewsSection
        items={(await listarNoticias()).filter(
          (other) => other.area === n.area && other.id !== n.id,
        )}
      />
    </>
  );
}
