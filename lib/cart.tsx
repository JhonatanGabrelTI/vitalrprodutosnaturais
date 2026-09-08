'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product, SaleVariant, StoreSettings } from './catalog-data';

export type CartItem = {
  key: string;
  product: Product;
  variant: SaleVariant;
  quantity: number;
};
type CartContextValue = {
  items: CartItem[];
  open: boolean;
  notice: string;
  count: number;
  totalCents: number;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, variant: SaleVariant, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  checkout: (settings: StoreSettings) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'vitale-cart-v1';

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: unknown,
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        setItems(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
      } catch {
        setItems([]);
      }
    }, 0);
    fetch('/api/catalog')
      .then((r) => r.json() as Promise<{ products?: Product[] }>)
      .then((data) => setCatalog(data.products || []))
      .catch(() => {});
    return () => window.clearTimeout(hydrationTimer);
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (product: Product, variant: SaleVariant, quantity = 1) => {
      const safeQuantity = Math.max(
        product.minQty,
        Math.min(product.maxQty, quantity),
      );
      const key = `${product.id}:${variant.label}`;
      setItems((current) => {
        const found = current.find((item) => item.key === key);
        return found
          ? current.map((item) =>
              item.key === key
                ? {
                    ...item,
                    quantity: Math.min(
                      product.maxQty,
                      item.quantity + safeQuantity,
                    ),
                  }
                : item,
            )
          : [...current, { key, product, variant, quantity: safeQuantity }];
      });
      setNotice(`${product.name} foi adicionado ao carrinho.`);
      setTimeout(() => setNotice(''), 2600);
    },
    [],
  );

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool || !catalog.length) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'add_product_to_cart',
            title: 'Adicionar produto ao carrinho',
            description:
              'Adiciona ao carrinho um produto disponível no catálogo Vitale usando seu slug.',
            inputSchema: {
              type: 'object',
              properties: {
                slug: { type: 'string' },
                variantLabel: { type: 'string' },
                quantity: { type: 'integer', minimum: 1 },
              },
              required: ['slug'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input: unknown) {
              const value = input as {
                slug?: string;
                variantLabel?: string;
                quantity?: number;
              };
              const product = catalog.find(
                (item) => item.slug === value.slug && item.active,
              );
              if (!product)
                throw new Error('Produto não encontrado ou indisponível.');
              const variant = product.variants.find(
                (item) => item.label === value.variantLabel,
              ) ||
                product.variants[0] || {
                  label: product.unitLabel,
                  quantity: 1,
                  priceCents: product.salePriceCents ?? product.priceCents,
                };
              addItem(product, variant, value.quantity || 1);
              return {
                added: true,
                product: product.name,
                variant: variant.label,
                quantity: value.quantity || 1,
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [catalog, addItem]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      open,
      notice,
      setOpen,
      addItem,
      updateQuantity: (key, quantity) =>
        setItems((current) =>
          current.map((item) =>
            item.key === key
              ? {
                  ...item,
                  quantity: Math.max(
                    1,
                    Math.min(item.product.maxQty, quantity),
                  ),
                }
              : item,
          ),
        ),
      removeItem: (key) =>
        setItems((current) => current.filter((item) => item.key !== key)),
      clear: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      totalCents: items.reduce(
        (sum, item) => sum + item.variant.priceCents * item.quantity,
        0,
      ),
      async checkout(settings) {
        if (!items.length) return;
        const total = items.reduce(
          (sum, item) => sum + item.variant.priceCents * item.quantity,
          0,
        );
        const order = {
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            variantLabel: item.variant.label,
            quantity: item.quantity,
            unitPriceCents: item.variant.priceCents,
          })),
          totalCents: total,
        };
        let orderId = '';
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(order),
          });
          const result = (await response.json()) as { orderId?: string };
          orderId = result.orderId || '';
        } catch {}
        const lines = items.map(
          (item) =>
            `• ${item.quantity}x ${item.product.name} — ${item.variant.label} — ${((item.variant.priceCents * item.quantity) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        );
        const message = [
          settings.checkoutMessage,
          '',
          ...lines,
          '',
          `Total estimado: ${(total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
          orderId ? `Pedido: ${orderId.slice(0, 8).toUpperCase()}` : '',
        ]
          .filter(Boolean)
          .join('\n');
        if (settings.whatsapp.replace(/\D/g, ''))
          window.open(
            `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer',
          );
        else {
          await navigator.clipboard?.writeText(message);
          setNotice(
            'Pedido copiado. Configure o WhatsApp da loja no painel para abrir a conversa automaticamente.',
          );
        }
      },
    }),
    [items, open, notice, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart deve ser usado dentro de CartProvider');
  return value;
}
