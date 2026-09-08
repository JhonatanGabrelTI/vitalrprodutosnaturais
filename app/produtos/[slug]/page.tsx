import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/product-detail-client';
import { readCatalog } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, catalog] = await Promise.all([params, readCatalog()]);
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} settings={catalog.settings} />;
}
