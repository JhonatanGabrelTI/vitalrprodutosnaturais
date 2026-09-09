'use client';
import Image from 'next/image';
import { SiteLink as Link } from './site-link';
import { MessageCircle, Plus } from 'lucide-react';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  money,
  productVariants,
  variantImage,
  variantPrice,
  variantStock,
  type Product,
  type StoreSettings,
} from '@/lib/catalog-data';
import { useCart } from '@/lib/cart';
import { buildWhatsAppUrl, productWhatsAppMessage } from '@/lib/whatsapp';
import { useState } from 'react';
import type { CSSProperties } from 'react';

export function ProductCard({
  product,
  settings,
  index = 0,
}: {
  product: Product;
  settings: StoreSettings;
  index?: number;
}) {
  const cart = useCart();
  const variants = productVariants(product);
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = variants[variantIndex];
  const currentPrice = variantPrice(variant);
  const currentImage = variantImage(product, variant);
  const currentStock = variantStock(product, variant);
  const whatsappUrl = buildWhatsAppUrl(
    settings,
    productWhatsAppMessage(
      settings,
      product.name,
      variant.label,
      money(currentPrice),
    ),
  );
  return (
    <article
      className={`product-card ${product.categoryId === 'cat-fitness' ? 'fitness-card' : ''}`}
      data-reveal
      style={
        {
          '--reveal-delay': `${Math.min(index, 5) * 70}ms`,
        } as CSSProperties
      }
    >
      <Link
        className="product-image"
        href={`/produtos/${product.slug}`}
        style={{ '--crop': `${55 + (index % 3) * 15}%` } as CSSProperties}
      >
        <Image
          key={currentImage}
          src={currentImage}
          alt={`${product.name} — ${variant.label}`}
          fill
          unoptimized={
            currentImage.startsWith('data:') || currentImage.startsWith('http')
          }
          sizes="(max-width: 760px) 100vw, 33vw"
        />
        {(variant.salePriceCents || product.promotion || product.featured) && (
          <span>
            {variant.salePriceCents || product.promotion
              ? 'Oferta'
              : 'Destaque'}
          </span>
        )}
        {currentStock <= 0 && <em>Indisponível</em>}
      </Link>
      <div className="product-info">
        <small>{product.categoryName}</small>
        <Link href={`/produtos/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.shortDescription}</p>
        <NativeSelect
          aria-label={`Escolher variação de ${product.name}`}
          value={variantIndex}
          onChange={(event) => setVariantIndex(Number(event.target.value))}
        >
          {variants.map((item, idx) => (
            <NativeSelectOption key={item.label} value={idx}>
              {item.label} — {money(variantPrice(item))}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <div className="product-buy">
          <div>
            {variant.salePriceCents != null &&
              variant.salePriceCents < variant.priceCents && (
                <del>{money(variant.priceCents)}</del>
              )}
            <strong>{money(currentPrice)}</strong>
          </div>
          <button
            disabled={currentStock <= 0}
            onClick={() => cart.addItem(product, variant)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={20} />
          </button>
        </div>
        <a
          className="product-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Comprar ${product.name} pelo WhatsApp`}
        >
          <MessageCircle size={17} /> Comprar pelo WhatsApp
        </a>
      </div>
    </article>
  );
}
