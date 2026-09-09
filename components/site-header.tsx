'use client';

import Image from 'next/image';
import { SiteLink as Link } from './site-link';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

export function SiteHeader() {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="demo-bar">
        Produtos naturais e linha fitness • Atendimento em Ibaiti, Paraná
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
          <span className="brand-copy">
            <strong>Vitale</strong>
            <small>Produtos Naturais</small>
          </span>
        </Link>
        <nav aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/#categorias">Categorias</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/#contato">Contato</Link>
        </nav>
        <div className="header-actions">
          <form className="header-search" action="/produtos">
            <Search size={19} />
            <input
              type="search"
              name="busca"
              aria-label="Buscar no catálogo"
              placeholder="Buscar produtos..."
            />
          </form>
          <Link
            className="account-button"
            href="/admin/login"
            aria-label="Entrar no painel da loja"
          >
            <UserRound size={19} />
          </Link>
          <button
            className="bag-button"
            onClick={() => cart.setOpen(true)}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={19} />
            <span className="cart-label">Carrinho</span>
            <span className="cart-count" key={cart.count}>
              {cart.count}
            </span>
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
