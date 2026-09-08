import type { MetadataRoute } from 'next';
import { readCatalog } from '@/lib/catalog-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await readCatalog();
  const base =
    'https://vitale-produtos-naturais-ibaiti.nutty-degu-4811.chatgpt.site';
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/produtos`, changeFrequency: 'daily', priority: 0.9 },
    ...catalog.products.map((product) => ({
      url: `${base}/produtos/${product.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
