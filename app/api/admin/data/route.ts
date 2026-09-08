import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';
import { readCatalog } from '@/lib/catalog-server';

export async function GET() {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const catalog = await readCatalog(true);
  try {
    const db = getRawDb();
    const [orders, items] = await Promise.all([
      db
        .prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100')
        .all(),
      db.prepare('SELECT * FROM order_items ORDER BY order_id').all(),
    ]);
    return NextResponse.json({
      ...catalog,
      orders: orders.results.map((order) => ({
        ...order,
        items: items.results.filter((item) => item.order_id === order.id),
      })),
    });
  } catch {
    return NextResponse.json({ ...catalog, orders: [] });
  }
}
