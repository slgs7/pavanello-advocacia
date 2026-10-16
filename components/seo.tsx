import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website' },
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
export function LegalService() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        name: siteConfig.name,
        url: siteConfig.url,
        telephone: '+' + siteConfig.phoneDigits,
        email: siteConfig.email,
        image: siteConfig.url + '/logo.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.street,
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.state,
          postalCode: siteConfig.postalCode,
          addressCountry: 'BR',
        },
        areaServed: { '@type': 'City', name: siteConfig.city },
      }}
    />
  );
}
