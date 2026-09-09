import { getRawDb } from '@/db';
import {
  CatalogPayload,
  Category,
  Product,
  StoreSettings,
  demoCategories,
  demoProducts,
  demoSettings,
} from './catalog-data';
type Row = Record<string, string | number | null>;

const bool = (value: unknown) => Number(value) === 1;
const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;
const number = (value: unknown, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

export async function readCatalog(
  includeInactive = false,
): Promise<CatalogPayload> {
  try {
    const db = getRawDb();
    const productQuery = includeInactive
      ? 'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id ORDER BY p.featured DESC, p.created_at DESC'
      : 'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.active = 1 ORDER BY p.featured DESC, p.created_at DESC';
    const categoryQuery = includeInactive
      ? 'SELECT * FROM categories ORDER BY name'
      : 'SELECT * FROM categories WHERE active = 1 ORDER BY name';
    const [productResult, categoryResult, settingsResult] = await Promise.all([
      db.prepare(productQuery).all<Row>(),
      db.prepare(categoryQuery).all<Row>(),
      db
        .prepare("SELECT * FROM store_settings WHERE id = 'store' LIMIT 1")
        .all<Row>(),
    ]);
    if (!productResult.results.length)
      return {
        products: demoProducts,
        categories: demoCategories,
        settings: demoSettings,
        demo: true,
      };
    const products = productResult.results.map(mapProductRow);
    const categories = categoryResult.results.map(mapCategoryRow);
    const settings = settingsResult.results[0]
      ? mapSettingsRow(settingsResult.results[0])
      : demoSettings;
    return { products, categories, settings, demo: false };
  } catch {
    return {
      products: demoProducts,
      categories: demoCategories,
      settings: demoSettings,
      demo: true,
    };
  }
}

export function mapProductRow(row: Row): Product {
  let variants: Product['variants'] = [];
  try {
    const parsed = JSON.parse(text(row.variants_json, '[]')) as unknown;
    variants = Array.isArray(parsed)
      ? parsed
          .map((value) => {
            const item = value as Record<string, unknown>;
            const label = text(item.label).trim();
            if (!label) return null;
            return {
              label,
              quantity: Math.max(1, number(item.quantity, 1)),
              priceCents: Math.max(0, number(item.priceCents)),
              salePriceCents:
                item.salePriceCents == null
                  ? null
                  : Math.max(0, number(item.salePriceCents)),
              stockQty:
                item.stockQty == null
                  ? null
                  : Math.max(0, number(item.stockQty)),
              imageUrl: text(item.imageUrl),
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
      : [];
  } catch {
    variants = [];
  }
  return {
    id: text(row.id),
    name: text(row.name),
    slug: text(row.slug),
    categoryId: text(row.category_id),
    categoryName: text(row.category_name, 'Sem categoria'),
    imageUrl: text(row.image_url, '/vitale-hero.webp'),
    shortDescription: text(row.short_description),
    description: text(row.description),
    ingredients: text(row.ingredients, 'Não informado.'),
    nutrition: text(row.nutrition, 'Não informado.'),
    brand: text(row.brand, 'Vitale'),
    sku: text(row.sku),
    saleType: text(row.sale_type, 'unit') as Product['saleType'],
    unitLabel: text(row.unit_label, 'unidade'),
    priceCents: number(row.price_cents),
    salePriceCents:
      row.sale_price_cents == null ? null : number(row.sale_price_cents),
    minQty: number(row.min_qty, 1),
    maxQty: number(row.max_qty, 99),
    stockQty: number(row.stock_qty),
    featured: bool(row.featured),
    promotion: bool(row.promotion),
    active: bool(row.active),
    variants,
  };
}

export function mapCategoryRow(row: Row): Category {
  return {
    id: text(row.id),
    name: text(row.name),
    slug: text(row.slug),
    description: text(row.description),
    active: bool(row.active),
  };
}

export function mapSettingsRow(row: Row): StoreSettings {
  return {
    whatsapp: text(row.whatsapp),
    instagram: text(row.instagram, demoSettings.instagram),
    address: text(row.address, demoSettings.address),
    hours: text(row.hours, demoSettings.hours),
    checkoutMessage: text(row.checkout_message, demoSettings.checkoutMessage),
  };
}
