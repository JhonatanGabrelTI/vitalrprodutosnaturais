import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { isAdminRequest } from '@/lib/admin-auth';
type Input = Record<string, unknown>;
const clean = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number'
    ? String(value).trim()
    : '';
const int = (value: unknown, fallback = 0) =>
  Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;

export async function POST(request: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const body = (await request.json()) as Input;
    if (!clean(body.name) || !clean(body.slug) || int(body.priceCents) < 0)
      return NextResponse.json(
        { error: 'Nome, slug e preço são obrigatórios.' },
        { status: 400 },
      );
    const db = getRawDb();
    const id = clean(body.id) || crypto.randomUUID();
    const now = Date.now();
    await db
      .prepare(
        'INSERT INTO products (id, name, slug, category_id, image_url, short_description, description, ingredients, nutrition, brand, sku, sale_type, unit_label, price_cents, sale_price_cents, min_qty, max_qty, stock_qty, featured, promotion, active, variants_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        clean(body.unitLabel) || 'unidade',
        int(body.priceCents),
        body.salePriceCents === '' || body.salePriceCents == null
          ? null
          : int(body.salePriceCents),
        Math.max(1, int(body.minQty, 1)),
        Math.max(1, int(body.maxQty, 99)),
        Math.max(0, int(body.stockQty)),
        Number(Boolean(body.featured)),
        Number(Boolean(body.promotion)),
        Number(body.active !== false),
        clean(body.variantsJson) || '[]',
        now,
        now,
      )
      .run();
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes('UNIQUE')
            ? 'O slug informado já está em uso.'
            : 'Não foi possível salvar o produto.',
      },
      { status: 500 },
    );
  }
}
