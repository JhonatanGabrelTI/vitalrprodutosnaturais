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

export async function POST(request: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const body = (await request.json()) as Input;
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
