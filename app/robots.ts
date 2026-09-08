import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/admin/'] },
    sitemap:
      'https://vitale-produtos-naturais-ibaiti.nutty-degu-4811.chatgpt.site/sitemap.xml',
  };
}
