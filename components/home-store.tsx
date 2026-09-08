'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  Dumbbell,
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
    .slice(0, 6);
  const products = featured.length ? featured : catalog.products.slice(0, 6);
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
        <div className="hero-word" aria-hidden="true">
          VITALE
        </div>
        <div className="hero-copy">
          <span className="eyebrow">
            <Leaf size={15} /> Natural, fitness e bem-estar
          </span>
          <h1>
            Sua rotina, <em>mais viva.</em>
          </h1>
          <p>
            Do grão à performance: uma seleção ampla de produtos naturais,
            creatinas, whey protein, snacks e muito mais.
          </p>
          <div className="hero-actions">
            <Link className="primary-cta" href="/produtos">
              Ver todos os produtos <ArrowRight size={18} />
            </Link>
            <Link
              className="secondary-cta"
              href="/produtos?categoria=suplementos-fitness"
            >
              Linha fitness
            </Link>
          </div>
          <div className="hero-pills" aria-label="Categorias em destaque">
            <span>Creatina</span>
            <span>Whey</span>
            <span>Grãos</span>
            <span>Castanhas</span>
          </div>
        </div>
        <div className="hero-note">
          <Dumbbell />
          <strong>Da despensa ao treino.</strong>
          <span>
            Escolha o peso, monte o carrinho e finalize pelo WhatsApp.
          </span>
        </div>
      </section>

      <div className="brand-ticker" aria-label="Seleção de categorias">
        <div>
          <span>Produtos naturais</span>
          <i>✦</i>
          <span>Nutrição esportiva</span>
          <i>✦</i>
          <span>Venda por peso</span>
          <i>✦</i>
          <span>Snacks</span>
          <i>✦</i>
          <span>Chás e ervas</span>
          <i>✦</i>
          <span>Produtos naturais</span>
          <i>✦</i>
          <span>Nutrição esportiva</span>
          <i>✦</i>
          <span>Venda por peso</span>
          <i>✦</i>
          <span>Snacks</span>
          <i>✦</i>
          <span>Chás e ervas</span>
          <i>✦</i>
        </div>
      </div>

      <section className="catalog-preview" id="produtos" data-reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow green">Seleção Vitale</span>
            <h2>Escolhas para cada momento</h2>
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

      <section className="fitness-feature" data-reveal>
        <div className="fitness-visual">
          <Image
            src="/vitale-fitness.png"
            alt="Composição ilustrativa com suplementos, aveia, cacau e amêndoas"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          <span>Nova seleção</span>
        </div>
        <div className="fitness-copy">
          <span className="eyebrow">Performance com identidade natural</span>
          <h2>
            Força para o treino. <em>Escolha para a rotina.</em>
          </h2>
          <p>
            Creatina, whey protein, pré-treino, pasta de amendoim e snacks
            reunidos em uma seção feita para quem busca praticidade.
          </p>
          <div className="fitness-tags">
            <span>Creatinas</span>
            <span>Whey protein</span>
            <span>Pré-treinos</span>
            <span>Snacks</span>
          </div>
          <Link
            className="primary-cta"
            href="/produtos?categoria=suplementos-fitness"
          >
            Explorar linha fitness <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="category-section" id="categorias" data-reveal>
        <div className="section-heading light">
          <div>
            <span className="eyebrow">Um catálogo completo</span>
            <h2>Explore por categoria</h2>
          </div>
        </div>
        <div className="category-grid">
          {catalog.categories.map((category, index) => (
            <Link
              href={`/produtos?categoria=${category.slug}`}
              key={category.id}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <ArrowRight size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits" data-reveal>
        <div data-reveal>
          <Scale />
          <h3>Na medida certa</h3>
          <p>Opções por peso, pacote ou unidade, com preço transparente.</p>
        </div>
        <div data-reveal>
          <PackageCheck />
          <h3>Pedido do seu jeito</h3>
          <p>Escolha as variações e ajuste quantidades direto no carrinho.</p>
        </div>
        <div data-reveal>
          <MessageCircle />
          <h3>Atendimento próximo</h3>
          <p>Finalize pelo WhatsApp e combine os detalhes com a loja.</p>
        </div>
        <div data-reveal>
          <ShieldCheck />
          <h3>Compra tranquila</h3>
          <p>Disponibilidade e valores são confirmados antes da entrega.</p>
        </div>
      </section>

      <section className="about-section" id="sobre" data-reveal>
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

      <section className="contact-section" id="contato" data-reveal>
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
