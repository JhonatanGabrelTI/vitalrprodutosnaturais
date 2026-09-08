import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull(),
});

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    categoryId: text('category_id').references(() => categories.id),
    imageUrl: text('image_url').notNull().default('/vitale-hero.png'),
    shortDescription: text('short_description').notNull().default(''),
    description: text('description').notNull().default(''),
    ingredients: text('ingredients').notNull().default(''),
    nutrition: text('nutrition').notNull().default(''),
    brand: text('brand').notNull().default('Vitale'),
    sku: text('sku').notNull().default(''),
    saleType: text('sale_type').notNull().default('unit'),
    unitLabel: text('unit_label').notNull().default('unidade'),
    priceCents: integer('price_cents').notNull(),
    salePriceCents: integer('sale_price_cents'),
    minQty: integer('min_qty').notNull().default(1),
    maxQty: integer('max_qty').notNull().default(99),
    stockQty: integer('stock_qty').notNull().default(0),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    promotion: integer('promotion', { mode: 'boolean' })
      .notNull()
      .default(false),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    variantsJson: text('variants_json').notNull().default('[]'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_products_active_featured').on(table.active, table.featured),
    index('idx_products_category').on(table.categoryId),
  ],
);

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(),
    customerName: text('customer_name')
      .notNull()
      .default('Cliente via WhatsApp'),
    customerPhone: text('customer_phone').notNull().default(''),
    totalCents: integer('total_cents').notNull(),
    status: text('status').notNull().default('Novo'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('idx_orders_created_at').on(table.createdAt),
    index('idx_orders_status').on(table.status),
  ],
);

export const orderItems = sqliteTable(
  'order_items',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id),
    productId: text('product_id'),
    productName: text('product_name').notNull(),
    variantLabel: text('variant_label').notNull(),
    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    lineTotalCents: integer('line_total_cents').notNull(),
  },
  (table) => [index('idx_order_items_order_id').on(table.orderId)],
);

export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey(),
  whatsapp: text('whatsapp').notNull().default(''),
  instagram: text('instagram')
    .notNull()
    .default('@vitaleprodutosnaturaisibaiti'),
  address: text('address').notNull().default('Ibaiti - Paraná'),
  hours: text('hours').notNull().default('Consulte pelo WhatsApp'),
  checkoutMessage: text('checkout_message')
    .notNull()
    .default('Olá! Gostaria de fazer este pedido na Vitale Produtos Naturais:'),
  updatedAt: integer('updated_at').notNull(),
});
