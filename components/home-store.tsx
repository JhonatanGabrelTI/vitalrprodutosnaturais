'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  Leaf,
  MapPin,
  MessageCircle,
  PackageCheck,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { CatalogPayload } from '@/lib/catalog-data';
import { SiteHeader } from './site-header';
import { CartSheet } from './cart-sheet';
import { ProductCard } from './product-card';

export function HomeStore({ catalog }: { catalog: CatalogPayload }) {
  const featured = catalog.products
    .filter((p) => p.featured || p.promotion)
    .slice(0, 3);
  const products = featured.length ? featured : catalog.products.slice(0, 3);
  return (
    <main>
      <SiteHeader />
      <CartSheet settings={catalog.settings} />
      <section className="hero" id="inicio">
        <Image
          src="/vitale-hero.webp"
          alt="Castanhas, sementes, granola e especiarias em uma composição natural"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow">
            <Leaf size={15} /> Curadoria natural em Ibaiti
          </span>
          <h1>Escolhas que fazem bem, todos os dias.</h1>
          <p>
            Produtos naturais selecionados, vendidos na medida certa para a sua
            rotina.
          </p>
          <Link className="primary-cta" href="/produtos">
            Explorar produtos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-note">
          <strong>Do grão à sua mesa.</strong>
          <span>
            Escolha o peso, monte o carrinho e finalize pelo WhatsApp.
          </span>
        </div>
      </section>

      <section className="catalog-preview" id="produtos">
        <div className="section-heading">
          <div>
            <span className="eyebrow green">Seleção Vitale</span>
            <h2>Os queridinhos da casa</h2>
          </div>
          <Link href="/produtos">
            Ver catálogo completo <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="category-section" id="categorias">
        <div className="section-heading light">
          <div>
            <span className="eyebrow">Encontre o seu ritual</span>
            <h2>Natural do seu jeito</h2>
          </div>
        </div>
        <div className="category-grid">
          {catalog.categories.slice(0, 4).map((category, index) => (
            <Link
              href={`/produtos?categoria=${category.slug}`}
              key={category.id}
            >
              <span>0{index + 1}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <ArrowRight size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits">
        <div>
          <Scale />
          <h3>Na medida certa</h3>
          <p>Opções por peso, pacote ou unidade, com preço transparente.</p>
        </div>
        <div>
          <PackageCheck />
          <h3>Pedido do seu jeito</h3>
          <p>Escolha as variações e ajuste quantidades direto no carrinho.</p>
        </div>
        <div>
          <MessageCircle />
          <h3>Atendimento próximo</h3>
          <p>Finalize pelo WhatsApp e combine os detalhes com a loja.</p>
        </div>
        <div>
          <ShieldCheck />
          <h3>Compra tranquila</h3>
          <p>Disponibilidade e valores são confirmados antes da entrega.</p>
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="about-mark">
          <Image
            src="/vitale-logo.jpg"
            alt="Logo Vitale Produtos Naturais"
            width={430}
            height={360}
          />
        </div>
        <div>
          <span className="eyebrow green">
            <Sparkles size={15} /> A nossa essência
          </span>
          <h2>Mais leveza para a sua rotina.</h2>
          <p>
            A Vitale aproxima você de uma alimentação mais natural com escolhas
            práticas, atendimento humano e produtos selecionados.
          </p>
          <p className="source-note">
            As informações definitivas de cada produto — como ingredientes e
            tabela nutricional — são cadastradas e atualizadas pela loja.
          </p>
          <Link className="text-link" href="/produtos">
            Conheça o catálogo <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div>
          <span className="eyebrow">Estamos por perto</span>
          <h2>
            Escolha online.
            <br />
            Converse com a gente.
          </h2>
        </div>
        <div className="contact-cards">
          <a
            href={`https://instagram.com/${catalog.settings.instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
          >
            <AtSign />
            <span>
              <small>Instagram</small>
              <strong>{catalog.settings.instagram}</strong>
            </span>
          </a>
          <div>
            <MapPin />
            <span>
              <small>Onde estamos</small>
              <strong>{catalog.settings.address}</strong>
            </span>
          </div>
        </div>
      </section>

      <footer>
        <Link className="footer-brand" href="/">
          <Image
            src="/vitale-logo.jpg"
            alt="Vitale Produtos Naturais"
            width={78}
            height={66}
          />
        </Link>
        <p>Produtos naturais com atendimento próximo em Ibaiti, Paraná.</p>
        <div>
          <Link href="/produtos">Produtos</Link>
          <Link href="/#categorias">Categorias</Link>
          <Link href="/admin/login">Área administrativa</Link>
        </div>
        <span>{catalog.settings.hours}</span>
      </footer>
    </main>
  );
}
