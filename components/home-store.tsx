'use client';
import Image from 'next/image';
import { SiteLink as Link } from './site-link';
import {
  ArrowRight,
  AtSign,
  Clock3,
  Leaf,
  MapPin,
  MessageCircle,
  PackageCheck,
  Scale,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { CatalogPayload } from '@/lib/catalog-data';
import { SiteHeader } from './site-header';
import { CartSheet } from './cart-sheet';
import { ProductCard } from './product-card';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function HomeStore({ catalog }: { catalog: CatalogPayload }) {
  const featured = catalog.products
    .filter((p) => p.featured || p.promotion)
    .slice(0, 6);
  const products = featured.length ? featured : catalog.products.slice(0, 6);
  const whatsappUrl = buildWhatsAppUrl(
    catalog.settings,
    `${catalog.settings.checkoutMessage}\n\nOlá! Quero conhecer os produtos da Vitale.`,
  );
  return (
    <main>
      <CartSheet settings={catalog.settings} />
      <div className="market-frame">
        <SiteHeader />
        <section className="hero" id="inicio">
          <Image
            className="hero-backdrop"
            src="/vitale-market-hero.png"
            alt="Seleção de produtos naturais, castanhas, grãos e suplementos"
            fill
            priority
            sizes="100vw"
          />
          <span className="hero-wash" aria-hidden="true" />
          <Leaf className="hero-decor decor-one" aria-hidden="true" />
          <Sparkles className="hero-decor decor-two" aria-hidden="true" />
          <div className="hero-copy">
            <span className="eyebrow">
              <Leaf size={15} /> Bem para você. Perto de você.
            </span>
            <h1>
              Cuide da sua saúde de <em>forma natural.</em>
            </h1>
            <p>
              Produtos selecionados para uma vida mais saudável e equilibrada.
            </p>
            <div className="hero-actions">
              <Link className="primary-cta" href="/produtos">
                <ShoppingBag size={18} /> Conhecer produtos
              </Link>
              <a
                className="secondary-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> Comprar pelo WhatsApp
              </a>
            </div>
            <div className="hero-pills" aria-label="Categorias em destaque">
              <span>Creatina</span>
              <span>Whey</span>
              <span>Grãos</span>
              <span>Castanhas</span>
            </div>
          </div>
          <div className="hero-note">
            <Leaf />
            <strong>Natural + fitness</strong>
            <span>Uma seleção completa para a sua rotina.</span>
          </div>
          <span className="hero-location">Ibaiti · Paraná</span>

          <div className="hero-benefits" aria-label="Destaques da loja">
            <article>
              <Leaf />
              <span>
                <strong>Seleção cuidada</strong>
                <small>Naturais e suplementos</small>
              </span>
            </article>
            <article>
              <ShieldCheck />
              <span>
                <strong>Compra tranquila</strong>
                <small>Confirmação com a loja</small>
              </span>
            </article>
            <article>
              <PackageCheck />
              <span>
                <strong>Medida certa</strong>
                <small>Unidade, gramas ou quilos</small>
              </span>
            </article>
            <article>
              <MessageCircle />
              <span>
                <strong>Atendimento humano</strong>
                <small>Direto pelo WhatsApp</small>
              </span>
            </article>
          </div>
        </section>
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
            <ProductCard
              key={product.id}
              product={product}
              settings={catalog.settings}
              index={index}
            />
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

      <section className="benefits">
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
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle />
            <span>
              <small>WhatsApp</small>
              <strong>Fale com a Vitale</strong>
            </span>
          </a>
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
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(catalog.settings.address)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin />
            <span>
              <small>Onde estamos</small>
              <strong>{catalog.settings.address}</strong>
            </span>
          </a>
        </div>
        <div className="contact-hours">
          <Clock3 /> <span>{catalog.settings.hours}</span>
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
