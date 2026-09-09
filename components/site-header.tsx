'use client';

import Image from 'next/image';
import { SiteLink as Link } from './site-link';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

export function SiteHeader() {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
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
            <span key={cart.count}>{cart.count}</span>
          </button>
          <button
            className="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <nav
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        aria-label="Navegação para celular"
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Início
        </Link>
        <Link href="/produtos" onClick={() => setMenuOpen(false)}>
          Todos os produtos
        </Link>
        <Link
          href="/produtos?categoria=suplementos-fitness"
          onClick={() => setMenuOpen(false)}
        >
          Linha fitness
        </Link>
        <Link href="/#categorias" onClick={() => setMenuOpen(false)}>
          Categorias
        </Link>
        <Link href="/#contato" onClick={() => setMenuOpen(false)}>
          Contato
        </Link>
      </nav>
      {cart.notice && (
        <output className="cart-notice" aria-live="polite">
          {cart.notice}
        </output>
      )}
    </>
  );
}
