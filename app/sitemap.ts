import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { areas } from '@/content/areas';
import { listarNoticias } from '@/lib/data/noticias';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = (await listarNoticias()).filter(
    (n) => n.revisado && n.status === 'publicado',
  );
  return [
    '',
    '/sobre',
    '/areas-de-atuacao',
    '/noticias',
    '/contato',
    '/aviso-legal',
    ...areas
      .filter((a) => a.revisado)
      .map((a) => `/areas-de-atuacao/${a.slug}`),
    ...news.map((n) => `/noticias/${n.slug}`),
  ].map((path) => ({ url: siteConfig.url + path }));
}
