import { CatalogClient } from '@/components/catalog-client';
import { readCatalog } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [catalog, params] = await Promise.all([readCatalog(), searchParams]);
  return (
    <CatalogClient
      catalog={catalog}
      initialCategory={params.categoria || 'todos'}
    />
  );
}
