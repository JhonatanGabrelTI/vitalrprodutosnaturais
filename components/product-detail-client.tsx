'use client';
import { useState } from 'react';
import Image from 'next/image';
import { SiteLink as Link } from './site-link';
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { money, type Product, type StoreSettings } from '@/lib/catalog-data';
import { useCart } from '@/lib/cart';
import { SiteHeader } from './site-header';
import { CartSheet } from './cart-sheet';

export function ProductDetailClient({
  product,
  settings,
}: {
  product: Product;
  settings: StoreSettings;
}) {
  const cart = useCart();
  const variants = product.variants.length
    ? product.variants
    : [
        {
          label: product.unitLabel,
          quantity: 1,
          priceCents: product.salePriceCents ?? product.priceCents,
        },
      ];
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(product.minQty || 1);
  const variant = variants[variantIndex];
  const add = () => cart.addItem(product, variant, quantity);
  const buyNow = async () => {
    const message = `${settings.checkoutMessage}\n\n• ${quantity}x ${product.name} — ${variant.label} — ${money(variant.priceCents * quantity)}\n\nTotal estimado: ${money(variant.priceCents * quantity)}`;
    const phone = settings.whatsapp.replace(/\D/g, '');
    if (phone)
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        '_blank',
        'noopener,noreferrer',
      );
    else {
      await navigator.clipboard?.writeText(message);
      add();
      cart.setOpen(true);
    }
  };
  return (
    <main>
      <SiteHeader />
      <CartSheet settings={settings} />
      <section className="product-detail">
        <Link className="back-link" href="/produtos">
          <ArrowLeft size={17} /> Voltar ao catálogo
        </Link>
        <div className="detail-grid">
          <div className="detail-image">
            <Image
              src={product.imageUrl || '/vitale-hero.webp'}
              alt={product.name}
              fill
              priority
              unoptimized={
                product.imageUrl.startsWith('data:') ||
                product.imageUrl.startsWith('http')
              }
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            {product.promotion && <span>Oferta</span>}
          </div>
          <div className="detail-copy">
            <span className="eyebrow green">{product.categoryName}</span>
            <h1>{product.name}</h1>
            <p className="lead">{product.shortDescription}</p>
            <div className="availability">
              <Check size={16} />{' '}
              {product.stockQty > 0
                ? 'Disponível para pedido'
                : 'Indisponível no momento'}
            </div>
            <div className="detail-price">
              <strong>{money(variant.priceCents)}</strong>
              <small>por {variant.label}</small>
            </div>
            <label htmlFor="product-variant">
              Escolha a medida
              <NativeSelect
                id="product-variant"
                value={variantIndex}
                onChange={(event) =>
                  setVariantIndex(Number(event.target.value))
                }
              >
                {variants.map((item, index) => (
                  <NativeSelectOption key={item.label} value={index}>
                    {item.label} — {money(item.priceCents)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
            <div className="detail-field">
              <span>Quantidade</span>
              <div className="quantity-control large">
                <button
                  onClick={() =>
                    setQuantity(Math.max(product.minQty, quantity - 1))
                  }
                  aria-label="Diminuir"
                >
                  <Minus />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.maxQty, quantity + 1))
                  }
                  aria-label="Aumentar"
                >
                  <Plus />
                </button>
              </div>
            </div>
            <div className="detail-actions">
              <button disabled={product.stockQty <= 0} onClick={add}>
                <ShoppingBag /> Adicionar ao carrinho
              </button>
              <button
                className="whatsapp-outline"
                disabled={product.stockQty <= 0}
                onClick={buyNow}
              >
                <MessageCircle /> Comprar pelo WhatsApp
              </button>
            </div>
            <small className="confirmation-note">
              O valor total e a disponibilidade serão confirmados pela equipe.
            </small>
          </div>
        </div>
        <div className="detail-tabs">
          <section>
            <span>Sobre o produto</span>
            <h2>Detalhes da seleção</h2>
            <p>{product.description}</p>
          </section>
          <dl>
            <div>
              <dt>Ingredientes</dt>
              <dd>{product.ingredients || 'Não informado.'}</dd>
            </div>
            <div>
              <dt>Informação nutricional</dt>
              <dd>{product.nutrition || 'Não informada.'}</dd>
            </div>
            <div>
              <dt>Marca</dt>
              <dd>{product.brand || 'Não informada'}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{product.sku || 'Não informado'}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
