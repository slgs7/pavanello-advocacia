import { NewsCover } from './news-cover';
import Link from 'next/link';
import type { Noticia } from '@/content/noticias';
export function NewsCard({ item }: { item: Noticia }) {
  return (
    <article className="news-card">
      <Link
        href={`/noticias/${item.slug}`}
        className="news-cover"
        tabIndex={-1}
        aria-hidden="true"
      >
        <NewsCover
          url={item.imagem_url}
          authorized={item.imagem_autorizada}
          alt={item.titulo}
        />
      </Link>
      <div>
        {item.imagem_autorizada && item.imagem_url && (
          <p className="small">
            Imagem: {item.imagem_credito || item.fonte_nome}
          </p>
        )}
        <span className="small">
          {item.exemplo
            ? 'Prévia · Aguardando publicação'
            : `${item.fonte_nome}${item.publicado_em ? ' · ' + new Date(item.publicado_em).toLocaleDateString('pt-BR') : ''}`}
        </span>
        <h3>
          <Link href={`/noticias/${item.slug}`}>{item.titulo}</Link>
        </h3>
        <p>{item.resumo}</p>
        <Link href={`/noticias/${item.slug}`} className="text-link">
          Ler comentário do escritório
        </Link>
      </div>
    </article>
  );
}
export function NewsSection({ items }: { items: Noticia[] }) {
  return (
    <section className="section light">
      <div className="container">
        <div className="section-heading">
          <h2>
            Informação que aproxima
            <br />
            você dos seus direitos.
          </h2>
          <Link href="/noticias" className="text-link">
            Ver todas as notícias
          </Link>
        </div>
        {items.length ? (
          <div className="news-grid">
            {items.slice(0, 3).map((item) => (
              <NewsCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>As próximas notícias passam por aqui.</h3>
            <p className="muted">
              A equipe está preparando uma seleção de notícias com fontes e
              comentários do escritório.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
