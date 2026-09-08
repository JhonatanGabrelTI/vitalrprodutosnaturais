import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';
import { demoCategories, demoProducts, demoSettings } from '@/lib/catalog-data';

export async function POST() {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const db = getRawDb();
    const now = Date.now();
    const categoryStatements = demoCategories.map((item) =>
      db
        .prepare(
          'INSERT INTO categories (id, name, slug, description, active, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, description = excluded.description, active = excluded.active',
        )
        .bind(
          item.id,
          item.name,
          item.slug,
          item.description,
          Number(item.active),
          now,
        ),
    );
    const productStatements = demoProducts.map((item) =>
      db
        .prepare(
          'INSERT INTO products (id, name, slug, category_id, image_url, short_description, description, ingredients, nutrition, brand, sku, sale_type, unit_label, price_cents, sale_price_cents, min_qty, max_qty, stock_qty, featured, promotion, active, variants_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, category_id = excluded.category_id, image_url = excluded.image_url, short_description = excluded.short_description, description = excluded.description, ingredients = excluded.ingredients, nutrition = excluded.nutrition, brand = excluded.brand, sku = excluded.sku, sale_type = excluded.sale_type, unit_label = excluded.unit_label, price_cents = excluded.price_cents, sale_price_cents = excluded.sale_price_cents, min_qty = excluded.min_qty, max_qty = excluded.max_qty, stock_qty = excluded.stock_qty, featured = excluded.featured, promotion = excluded.promotion, active = excluded.active, variants_json = excluded.variants_json, updated_at = excluded.updated_at',
        )
        .bind(
          item.id,
          item.name,
          item.slug,
          item.categoryId,
          item.imageUrl,
          item.shortDescription,
          item.description,
          item.ingredients,
          item.nutrition,
          item.brand,
          item.sku,
          item.saleType,
          item.unitLabel,
          item.priceCents,
          item.salePriceCents,
          item.minQty,
          item.maxQty,
          item.stockQty,
          Number(item.featured),
          Number(item.promotion),
          Number(item.active),
          JSON.stringify(item.variants),
          now,
          now,
        ),
    );
    const settingsStatement = db
      .prepare(
        'INSERT INTO store_settings (id, whatsapp, instagram, address, hours, checkout_message, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET instagram = excluded.instagram, address = excluded.address, hours = excluded.hours, checkout_message = excluded.checkout_message, updated_at = excluded.updated_at',
      )
      .bind(
        'store',
        demoSettings.whatsapp,
        demoSettings.instagram,
        demoSettings.address,
        demoSettings.hours,
        demoSettings.checkoutMessage,
        now,
      );
    await db.batch([
      ...categoryStatements,
      ...productStatements,
      settingsStatement,
    ]);
    return NextResponse.json({ seeded: true });
  } catch {
    return NextResponse.json(
      { error: 'Banco indisponível. Aplique as migrações antes de importar.' },
      { status: 503 },
    );
  }
}
