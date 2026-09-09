import type { StoreSettings } from '@/lib/catalog-data';

export function buildWhatsAppUrl(
  settings: StoreSettings,
  message = settings.checkoutMessage,
) {
  const phone = settings.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(
  settings: StoreSettings,
  productName: string,
  variantLabel: string,
  formattedPrice: string,
) {
  return `${settings.checkoutMessage}\n\n• ${productName} — ${variantLabel} — ${formattedPrice}\n\nPode confirmar a disponibilidade para mim?`;
}
