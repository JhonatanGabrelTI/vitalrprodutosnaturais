import type { SaleVariant } from './catalog-data';

const cents = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0;
};

export function parseProductVariantsInput(value: unknown): SaleVariant[] {
  const parsed =
    typeof value === 'string' ? (JSON.parse(value) as unknown) : value;
  if (!Array.isArray(parsed) || !parsed.length || parsed.length > 50)
    throw new Error('VARIANTS_INVALID');

  const labels = new Set<string>();
  return parsed.map((entry) => {
    const item = entry as Record<string, unknown>;
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    if (!label || labels.has(label.toLocaleLowerCase('pt-BR')))
      throw new Error('VARIANTS_INVALID');
    labels.add(label.toLocaleLowerCase('pt-BR'));

    return {
      label,
      quantity: Math.max(1, cents(item.quantity) || 1),
      priceCents: cents(item.priceCents),
      salePriceCents:
        item.salePriceCents == null || item.salePriceCents === ''
          ? null
          : cents(item.salePriceCents),
      stockQty:
        item.stockQty == null || item.stockQty === ''
          ? null
          : cents(item.stockQty),
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '',
    };
  });
}
