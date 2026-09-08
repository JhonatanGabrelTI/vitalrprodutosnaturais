'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import type { CatalogPayload } from '@/lib/catalog-data';
import { ProductCard } from './product-card';
import { SiteHeader } from './site-header';
import { CartSheet } from './cart-sheet';

export function CatalogClient({
  catalog,
  initialCategory = 'todos',
}: {
  catalog: CatalogPayload;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [order, setOrder] = useState('featured');
  const filtered = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase('pt-BR');
    return catalog.products
      .filter(
        (product) =>
          (category === 'todos' ||
            product.categoryId === category ||
            catalog.categories.find((item) => item.id === product.categoryId)
              ?.slug === category) &&
          (!terms ||
            `${product.name} ${product.categoryName} ${product.shortDescription}`
              .toLocaleLowerCase('pt-BR')
              .includes(terms)),
      )
      .sort((a, b) =>
        order === 'price-asc'
          ? (a.salePriceCents ?? a.priceCents) -
            (b.salePriceCents ?? b.priceCents)
          : order === 'price-desc'
            ? (b.salePriceCents ?? b.priceCents) -
              (a.salePriceCents ?? a.priceCents)
            : order === 'name'
              ? a.name.localeCompare(b.name, 'pt-BR')
              : Number(b.featured) - Number(a.featured),
      );
  }, [catalog, query, category, order]);
  return (
    <main>
      <SiteHeader />
      <CartSheet settings={catalog.settings} />
      <section className="catalog-hero">
        <Link href="/">
          <ArrowLeft size={17} /> Voltar para o início
        </Link>
        <span className="eyebrow green">Catálogo Vitale</span>
        <h1>Encontre a sua próxima escolha natural.</h1>
        <p>
          Busque, filtre e escolha o peso ou a embalagem antes de adicionar ao
          carrinho.
        </p>
      </section>
      <section className="catalog-layout">
        <aside className="filters">
          <div className="filter-title">
            <SlidersHorizontal size={18} />
            <strong>Filtros</strong>
          </div>
          <label>
            Buscar produto
            <div className="search-field">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: castanhas"
              />
            </div>
          </label>
          <fieldset>
            <legend>Categoria</legend>
            <button
              className={category === 'todos' ? 'active' : ''}
              onClick={() => setCategory('todos')}
            >
              Todos <span>{catalog.products.length}</span>
            </button>
            {catalog.categories.map((item) => (
              <button
                key={item.id}
                className={
                  category === item.id || category === item.slug ? 'active' : ''
                }
                onClick={() => setCategory(item.id)}
              >
                {item.name}
                <span>
                  {
                    catalog.products.filter(
                      (product) => product.categoryId === item.id,
                    ).length
                  }
                </span>
              </button>
            ))}
          </fieldset>
          <label htmlFor="catalog-order">
            Ordenar por
            <NativeSelect
              id="catalog-order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <NativeSelectOption value="featured">
                Destaques primeiro
              </NativeSelectOption>
              <NativeSelectOption value="name">Nome</NativeSelectOption>
              <NativeSelectOption value="price-asc">
                Menor preço
              </NativeSelectOption>
              <NativeSelectOption value="price-desc">
                Maior preço
              </NativeSelectOption>
            </NativeSelect>
          </label>
        </aside>
        <div className="catalog-results">
          <div className="results-meta">
            <strong>
              {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
            </strong>
            {catalog.demo && <span>Dados demonstrativos</span>}
          </div>
          {filtered.length ? (
            <div className="product-grid catalog-grid">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search size={34} />
              <h2>Nenhum produto encontrado</h2>
              <p>Tente outro termo ou limpe os filtros.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setCategory('todos');
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
