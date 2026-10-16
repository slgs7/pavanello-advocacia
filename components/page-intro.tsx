import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { JsonLd } from './seo';
export function PageIntro({
  title,
  description,
  crumbs = [],
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; href: string }[];
}) {
  const list = [{ label: 'Início', href: '/' }, ...crumbs];
  return (
    <div className="page-intro">
      <div className="container">
        <nav aria-label="Caminho da página" className="breadcrumbs">
          {list.map((c, i) => (
            <span key={c.href}>
              {i > 0 && ' / '}
              {i === list.length - 1 ? (
                <span aria-current="page">{c.label}</span>
              ) : (
                <Link href={c.href}>{c.label}</Link>
              )}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {description && <p className="lead">{description}</p>}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: list.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: siteConfig.url + c.href,
          })),
        }}
      />
    </div>
  );
}
