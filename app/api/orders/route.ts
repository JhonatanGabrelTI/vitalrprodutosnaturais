import { NextResponse } from 'next/server';
import { getRawDb } from '@/db';
import { readCatalog } from '@/lib/catalog-server';

type SubmittedItem = {
  productId?: string;
  name?: string;
  variantLabel?: string;
  quantity?: number;
  unitPriceCents?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: SubmittedItem[] };
    if (
      !Array.isArray(body.items) ||
      !body.items.length ||
      body.items.length > 50
    )
      return NextResponse.json(
        { error: 'Carrinho inválido.' },
        { status: 400 },
      );
    const catalog = await readCatalog(true);
    const items = body.items.map((submitted) => {
      const product = catalog.products.find(
        (item) => item.id === submitted.productId && item.active,
      );
      if (!product) throw new Error('Produto indisponível.');
      const variant = product.variants.find(
        (item) => item.label === submitted.variantLabel,
      ) ||
        product.variants[0] || {
          label: product.unitLabel,
          quantity: 1,
          priceCents: product.salePriceCents ?? product.priceCents,
        };
      const quantity = Math.max(
        product.minQty,
        Math.min(product.maxQty, Math.trunc(Number(submitted.quantity) || 1)),
      );
      return {
        product,
        variant,
        quantity,
        lineTotalCents: variant.priceCents * quantity,
      };
    });
    const db = getRawDb();
    const orderId = crypto.randomUUID();
    const createdAt = Date.now();
    const totalCents = items.reduce(
      (sum, item) => sum + item.lineTotalCents,
      0,
    );
    const statements = [
      db
        .prepare(
          'INSERT INTO orders (id, customer_name, customer_phone, total_cents, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .bind(
          orderId,
          'Cliente via WhatsApp',
          '',
          totalCents,
          'Novo',
          createdAt,
        ),
      ...items.map((item) =>
        db
          .prepare(
            'INSERT INTO order_items (id, order_id, product_id, product_name, variant_label, quantity, unit_price_cents, line_total_cents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          )
          .bind(
            crypto.randomUUID(),
            orderId,
            item.product.id,
            item.product.name,
            item.variant.label,
            item.quantity,
            item.variant.priceCents,
            item.lineTotalCents,
          ),
      ),
    ];
    await db.batch(statements);
    return NextResponse.json({ orderId, totalCents }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Não foi possível registrar o pedido.',
      },
      { status: 503 },
    );
  }
}
