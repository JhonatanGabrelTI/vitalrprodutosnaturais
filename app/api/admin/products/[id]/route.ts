import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';
import { parseProductVariantsInput } from '@/lib/product-variants-server';
type Input = Record<string, unknown>;
const clean = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number'
    ? String(value).trim()
    : '';
const int = (value: unknown, fallback = 0) =>
  Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const [body, { id }] = await Promise.all([
      request.json() as Promise<Input>,
      params,
    ]);
    let variants;
    try {
      variants = parseProductVariantsInput(body.variantsJson);
    } catch {
      return NextResponse.json(
        { error: 'Adicione ao menos uma variação com nome e preço válidos.' },
        { status: 400 },
      );
    }
    if (!clean(body.name) || !clean(body.slug))
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios.' },
        { status: 400 },
      );
    const primaryVariant = variants[0];
    const totalStock = variants.reduce(
      (total, item) => total + Math.max(0, item.stockQty ?? 0),
      0,
    );
    const db = getRawDb();
    const now = Date.now();
    await db
      .prepare(
        'INSERT INTO products (id, name, slug, category_id, image_url, short_description, description, ingredients, nutrition, brand, sku, sale_type, unit_label, price_cents, sale_price_cents, min_qty, max_qty, stock_qty, featured, promotion, active, variants_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, category_id = excluded.category_id, image_url = excluded.image_url, short_description = excluded.short_description, description = excluded.description, ingredients = excluded.ingredients, nutrition = excluded.nutrition, brand = excluded.brand, sku = excluded.sku, sale_type = excluded.sale_type, unit_label = excluded.unit_label, price_cents = excluded.price_cents, sale_price_cents = excluded.sale_price_cents, min_qty = excluded.min_qty, max_qty = excluded.max_qty, stock_qty = excluded.stock_qty, featured = excluded.featured, promotion = excluded.promotion, active = excluded.active, variants_json = excluded.variants_json, updated_at = excluded.updated_at',
      )
      .bind(
        id,
        clean(body.name),
        clean(body.slug),
        clean(body.categoryId) || null,
        clean(body.imageUrl) || '/vitale-hero.webp',
        clean(body.shortDescription),
        clean(body.description),
        clean(body.ingredients),
        clean(body.nutrition),
        clean(body.brand) || 'Vitale',
        clean(body.sku),
        clean(body.saleType) || 'unit',
        primaryVariant.label,
        primaryVariant.priceCents,
        primaryVariant.salePriceCents,
        Math.max(1, int(body.minQty, 1)),
        Math.max(1, int(body.maxQty, 99)),
        totalStock,
        Number(Boolean(body.featured)),
        Number(Boolean(body.promotion)),
        Number(body.active !== false),
        JSON.stringify(variants),
        now,
        now,
      )
      .run();
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível atualizar o produto.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const { id } = await params;
    await getRawDb()
      .prepare('DELETE FROM products WHERE id = ?')
      .bind(id)
      .run();
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível excluir o produto.' },
      { status: 500 },
    );
  }
}
