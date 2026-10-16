import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.NEXT_PUBLIC_SITE_READY === 'true'
        ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }
        : { userAgent: '*', disallow: '/' },
    sitemap: siteConfig.url + '/sitemap.xml',
  };
}
