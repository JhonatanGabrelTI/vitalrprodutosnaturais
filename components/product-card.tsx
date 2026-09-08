'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { money, type Product } from '@/lib/catalog-data';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
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
  const variant = variants[variantIndex];
  return (
    <article className="product-card">
      <Link
        className="product-image"
        href={`/produtos/${product.slug}`}
        style={{ '--crop': `${55 + (index % 3) * 15}%` } as React.CSSProperties}
      >
        <Image
        src={product.imageUrl || '/vitale-hero.webp'}
          alt={product.name}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
        {(product.promotion || product.featured) && (
          <span>{product.promotion ? 'Oferta' : 'Destaque'}</span>
        )}
        {product.stockQty <= 0 && <em>Indisponível</em>}
      </Link>
      <div className="product-info">
        <small>{product.categoryName}</small>
        <Link href={`/produtos/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.shortDescription}</p>
        <NativeSelect
          aria-label={`Escolher medida de ${product.name}`}
          value={variantIndex}
          onChange={(event) => setVariantIndex(Number(event.target.value))}
        >
          {variants.map((item, idx) => (
            <NativeSelectOption key={item.label} value={idx}>
              {item.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <div className="product-buy">
          <div>
            {product.salePriceCents && <del>{money(product.priceCents)}</del>}
            <strong>{money(variant.priceCents)}</strong>
          </div>
          <button
            disabled={product.stockQty <= 0}
            onClick={() => cart.addItem(product, variant)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
