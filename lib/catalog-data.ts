export type SaleVariant = {
  label: string;
  quantity: number;
  priceCents: number;
};
export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  nutrition: string;
  brand: string;
  sku: string;
  saleType: 'weight' | 'unit' | 'package';
  unitLabel: string;
  priceCents: number;
  salePriceCents: number | null;
  minQty: number;
  maxQty: number;
  stockQty: number;
  featured: boolean;
  promotion: boolean;
  active: boolean;
  variants: SaleVariant[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
};
export type StoreSettings = {
  whatsapp: string;
  instagram: string;
  address: string;
  hours: string;
  checkoutMessage: string;
};

export type CatalogPayload = {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  demo: boolean;
};

export const demoCategories: Category[] = [
  {
    id: 'cat-graos',
    name: 'Grãos & sementes',
    slug: 'graos-sementes',
    description: 'Ingredientes versáteis para todos os dias.',
    active: true,
  },
  {
    id: 'cat-castanhas',
    name: 'Castanhas',
    slug: 'castanhas',
    description: 'Textura, sabor e praticidade na medida certa.',
    active: true,
  },
  {
    id: 'cat-chas',
    name: 'Chás & ervas',
    slug: 'chas-ervas',
    description: 'Misturas aromáticas para os seus momentos.',
    active: true,
  },
  {
    id: 'cat-mercearia',
    name: 'Mercearia natural',
    slug: 'mercearia-natural',
    description: 'Uma despensa mais simples e consciente.',
    active: true,
  },
];

export const demoProducts: Product[] = [
  {
    id: 'demo-castanha',
    name: 'Castanha-de-caju',
    slug: 'castanha-de-caju',
    categoryId: 'cat-castanhas',
    categoryName: 'Castanhas',
    imageUrl: '/vitale-hero.webp',
    shortDescription: 'Crocante e selecionada, disponível em quatro medidas.',
    description:
      'Produto demonstrativo para apresentar a experiência de compra por peso da Vitale.',
    ingredients:
      'Informação demonstrativa — cadastre os ingredientes reais no painel.',
    nutrition: 'Informação nutricional não cadastrada.',
    brand: 'Vitale',
    sku: 'DEMO-CAS-01',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 1200,
    salePriceCents: null,
    minQty: 1,
    maxQty: 10,
    stockQty: 28,
    featured: true,
    promotion: false,
    active: true,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 1200 },
      { label: '250 g', quantity: 250, priceCents: 2800 },
      { label: '500 g', quantity: 500, priceCents: 5400 },
      { label: '1 kg', quantity: 1000, priceCents: 10000 },
    ],
  },
  {
    id: 'demo-granola',
    name: 'Granola artesanal',
    slug: 'granola-artesanal',
    categoryId: 'cat-mercearia',
    categoryName: 'Mercearia natural',
    imageUrl: '/vitale-hero.webp',
    shortDescription: 'Uma mistura crocante para acompanhar frutas e iogurtes.',
    description:
      'Produto demonstrativo. Personalize descrição, composição e preço pelo painel administrativo.',
    ingredients:
      'Informação demonstrativa — cadastre os ingredientes reais no painel.',
    nutrition: 'Informação nutricional não cadastrada.',
    brand: 'Vitale',
    sku: 'DEMO-GRA-02',
    saleType: 'package',
    unitLabel: 'pacote 500 g',
    priceCents: 2890,
    salePriceCents: 2490,
    minQty: 1,
    maxQty: 8,
    stockQty: 14,
    featured: true,
    promotion: true,
    active: true,
    variants: [{ label: 'Pacote 500 g', quantity: 1, priceCents: 2490 }],
  },
  {
    id: 'demo-chia',
    name: 'Chia em grãos',
    slug: 'chia-em-graos',
    categoryId: 'cat-graos',
    categoryName: 'Grãos & sementes',
    imageUrl: '/vitale-hero.webp',
    shortDescription: 'Semente prática para receitas doces e salgadas.',
    description:
      'Produto demonstrativo vendido por peso. Os dados definitivos devem ser cadastrados pelo administrador.',
    ingredients:
      'Informação demonstrativa — cadastre os ingredientes reais no painel.',
    nutrition: 'Informação nutricional não cadastrada.',
    brand: 'Vitale',
    sku: 'DEMO-CHI-03',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 850,
    salePriceCents: null,
    minQty: 1,
    maxQty: 10,
    stockQty: 40,
    featured: true,
    promotion: false,
    active: true,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 850 },
      { label: '250 g', quantity: 250, priceCents: 1990 },
      { label: '500 g', quantity: 500, priceCents: 3800 },
    ],
  },
  {
    id: 'demo-cha',
    name: 'Chá de hibisco',
    slug: 'cha-de-hibisco',
    categoryId: 'cat-chas',
    categoryName: 'Chás & ervas',
    imageUrl: '/vitale-hero.webp',
    shortDescription: 'Ervas secas selecionadas e vendidas por peso.',
    description:
      'Produto demonstrativo para exibir filtros, estoque e variações do catálogo.',
    ingredients:
      'Informação demonstrativa — cadastre os ingredientes reais no painel.',
    nutrition: 'Informação nutricional não cadastrada.',
    brand: 'Vitale',
    sku: 'DEMO-CHA-04',
    saleType: 'weight',
    unitLabel: '50 g',
    priceCents: 690,
    salePriceCents: null,
    minQty: 1,
    maxQty: 8,
    stockQty: 22,
    featured: false,
    promotion: false,
    active: true,
    variants: [
      { label: '50 g', quantity: 50, priceCents: 690 },
      { label: '100 g', quantity: 100, priceCents: 1250 },
    ],
  },
  {
    id: 'demo-amendoa',
    name: 'Amêndoas torradas',
    slug: 'amendoas-torradas',
    categoryId: 'cat-castanhas',
    categoryName: 'Castanhas',
    imageUrl: '/vitale-hero.webp',
    shortDescription: 'Porção crocante para lanches e receitas.',
    description:
      'Produto demonstrativo. Substitua por informações verificadas antes de publicar o catálogo definitivo.',
    ingredients:
      'Informação demonstrativa — cadastre os ingredientes reais no painel.',
    nutrition: 'Informação nutricional não cadastrada.',
    brand: 'Vitale',
    sku: 'DEMO-AME-05',
    saleType: 'package',
    unitLabel: 'pacote 200 g',
    priceCents: 2190,
    salePriceCents: null,
    minQty: 1,
    maxQty: 8,
    stockQty: 18,
    featured: false,
    promotion: false,
    active: true,
    variants: [{ label: 'Pacote 200 g', quantity: 1, priceCents: 2190 }],
  },
  {
    id: 'demo-curcuma',
    name: 'Cúrcuma em pó',
    slug: 'curcuma-em-po',
    categoryId: 'cat-mercearia',
    categoryName: 'Mercearia natural',
    imageUrl: '/vitale-hero.webp',
    shortDescription: 'Tempero de cor intensa para a despensa.',
    description:
      'Produto demonstrativo sem alegações de saúde. Cadastre a origem e especificações reais no painel.',
    ingredients:
      'Informação demonstrativa — cadastre os ingredientes reais no painel.',
    nutrition: 'Informação nutricional não cadastrada.',
    brand: 'Vitale',
    sku: 'DEMO-CUR-06',
    saleType: 'package',
    unitLabel: 'pacote 100 g',
    priceCents: 990,
    salePriceCents: 790,
    minQty: 1,
    maxQty: 6,
    stockQty: 12,
    featured: false,
    promotion: true,
    active: true,
    variants: [{ label: 'Pacote 100 g', quantity: 1, priceCents: 790 }],
  },
];

export const demoSettings: StoreSettings = {
  whatsapp: '',
  instagram: '@vitaleprodutosnaturaisibaiti',
  address: 'Ibaiti - Paraná',
  hours: 'Consulte o horário de atendimento pelo WhatsApp',
  checkoutMessage:
    'Olá! Gostaria de fazer este pedido na Vitale Produtos Naturais:',
};

export function money(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}
