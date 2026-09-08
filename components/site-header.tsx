'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function SiteHeader() {
  const cart = useCart();
  return (
    <>
      <div className="demo-bar">
        Catálogo demonstrativo — personalize produtos, preços e contato no
        painel
      </div>
      <header className="site-header">
        <Link
          className="brand"
          href="/"
          aria-label="Vitale Produtos Naturais — início"
        >
          <Image
            src="/vitale-logo.jpg"
            alt="Vitale Produtos Naturais"
            width={56}
            height={48}
            priority
          />
        </Link>
        <nav aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/#categorias">Categorias</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/#contato">Contato</Link>
        </nav>
        <div className="header-actions">
          <Link className="icon-button" href="/produtos" aria-label="Pesquisar">
            <Search size={19} />
          </Link>
          <button
            className="bag-button"
            onClick={() => cart.setOpen(true)}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={19} />
            <span>{cart.count}</span>
          </button>
          <button className="mobile-menu" aria-label="Menu">
            <Menu size={21} />
          </button>
        </div>
      </header>
      {cart.notice && (
        <output className="cart-notice" aria-live="polite">
          {cart.notice}
        </output>
      )}
    </>
  );
}
