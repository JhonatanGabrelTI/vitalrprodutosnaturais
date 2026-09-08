import { HomeStore } from '@/components/home-store';
import { readCatalog } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const catalog = await readCatalog();
  return <HomeStore catalog={catalog} />;
}
