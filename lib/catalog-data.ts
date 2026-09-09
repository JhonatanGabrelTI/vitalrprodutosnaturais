export type SaleVariant = {
  label: string;
  quantity: number;
  priceCents: number;
  salePriceCents?: number | null;
  stockQty?: number | null;
  imageUrl?: string;
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

export const variantPrice = (variant: SaleVariant) =>
  variant.salePriceCents ?? variant.priceCents;

export const productVariants = (product: Product): SaleVariant[] =>
  product.variants.length
    ? product.variants
    : [
        {
          label: product.unitLabel,
          quantity: 1,
          priceCents: product.priceCents,
          salePriceCents: product.salePriceCents,
          stockQty: product.stockQty,
          imageUrl: product.imageUrl,
        },
      ];

export const variantImage = (product: Product, variant: SaleVariant) =>
  variant.imageUrl?.trim() || product.imageUrl || '/vitale-hero.webp';

export const variantStock = (product: Product, variant: SaleVariant) =>
  variant.stockQty == null ? product.stockQty : Math.max(0, variant.stockQty);

export const productStock = (product: Product) =>
  product.variants.some((variant) => variant.stockQty != null)
    ? product.variants.reduce(
        (total, variant) => total + Math.max(0, variant.stockQty ?? 0),
        0,
      )
    : product.stockQty;

export const productStartingPrice = (product: Product) =>
  Math.min(...productVariants(product).map(variantPrice));

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
    id: 'cat-fitness',
    name: 'Suplementos fitness',
    slug: 'suplementos-fitness',
    description: 'Creatinas, proteínas e opções para a rotina de treinos.',
    active: true,
  },
  {
    id: 'cat-proteinas',
    name: 'Proteínas & snacks',
    slug: 'proteinas-snacks',
    description: 'Opções práticas para levar, combinar e saborear.',
    active: true,
  },
  {
    id: 'cat-graos',
    name: 'Grãos & sementes',
    slug: 'graos-sementes',
    description: 'Ingredientes versáteis para receitas de todos os dias.',
    active: true,
  },
  {
    id: 'cat-castanhas',
    name: 'Castanhas & frutas secas',
    slug: 'castanhas-frutas-secas',
    description: 'Texturas, sabores e porções do seu jeito.',
    active: true,
  },
  {
    id: 'cat-chas',
    name: 'Chás & ervas',
    slug: 'chas-ervas',
    description: 'Misturas aromáticas para diferentes momentos.',
    active: true,
  },
  {
    id: 'cat-mercearia',
    name: 'Mercearia natural',
    slug: 'mercearia-natural',
    description: 'Uma despensa mais diversa, prática e saborosa.',
    active: true,
  },
  {
    id: 'cat-ingredientes',
    name: 'Temperos & ingredientes',
    slug: 'temperos-ingredientes',
    description: 'Cores e sabores para completar suas receitas.',
    active: true,
  },
];

type DemoProductInput = Pick<
  Product,
  | 'id'
  | 'name'
  | 'slug'
  | 'categoryId'
  | 'categoryName'
  | 'shortDescription'
  | 'sku'
  | 'saleType'
  | 'unitLabel'
  | 'priceCents'
  | 'variants'
> &
  Partial<Product>;

const makeDemoProduct = (item: DemoProductInput): Product => ({
  imageUrl: '/vitale-hero.webp',
  description:
    'Item demonstrativo para apresentar a variedade da Vitale. Confirme marca, composição, peso e disponibilidade antes da compra.',
  ingredients:
    'Informação não cadastrada — consulte o rótulo e confirme com a loja.',
  nutrition:
    'Informação nutricional não cadastrada — consulte o rótulo do produto.',
  brand: 'Marca a definir',
  salePriceCents: null,
  minQty: 1,
  maxQty: 10,
  stockQty: 20,
  featured: false,
  promotion: false,
  active: true,
  ...item,
});

export const demoProducts: Product[] = [
  makeDemoProduct({
    id: 'demo-creatina',
    name: 'Creatina monohidratada',
    slug: 'creatina-monohidratada',
    categoryId: 'cat-fitness',
    categoryName: 'Suplementos fitness',
    imageUrl: '/vitale-fitness.png',
    shortDescription: 'Embalagem demonstrativa para a nova seleção fitness.',
    sku: 'DEMO-FIT-01',
    saleType: 'unit',
    unitLabel: 'pote 300 g',
    priceCents: 8990,
    salePriceCents: 7990,
    featured: true,
    promotion: true,
    variants: [
      { label: 'Pote 150 g', quantity: 1, priceCents: 4690 },
      { label: 'Pote 300 g', quantity: 1, priceCents: 7990 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-whey-chocolate',
    name: 'Whey protein — chocolate',
    slug: 'whey-protein-chocolate',
    categoryId: 'cat-fitness',
    categoryName: 'Suplementos fitness',
    imageUrl: '/vitale-fitness.png',
    shortDescription:
      'Proteína em pó com sabor chocolate, em formato demonstrativo.',
    sku: 'DEMO-FIT-02',
    saleType: 'unit',
    unitLabel: 'pote 900 g',
    priceCents: 12990,
    featured: true,
    variants: [
      { label: 'Sachê 30 g', quantity: 1, priceCents: 890 },
      { label: 'Pote 450 g', quantity: 1, priceCents: 7490 },
      { label: 'Pote 900 g', quantity: 1, priceCents: 12990 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-whey-baunilha',
    name: 'Whey protein — baunilha',
    slug: 'whey-protein-baunilha',
    categoryId: 'cat-fitness',
    categoryName: 'Suplementos fitness',
    imageUrl: '/vitale-fitness.png',
    shortDescription:
      'Versão demonstrativa com sabor baunilha e três tamanhos.',
    sku: 'DEMO-FIT-03',
    saleType: 'unit',
    unitLabel: 'pote 900 g',
    priceCents: 12990,
    featured: true,
    variants: [
      { label: 'Sachê 30 g', quantity: 1, priceCents: 890 },
      { label: 'Pote 450 g', quantity: 1, priceCents: 7490 },
      { label: 'Pote 900 g', quantity: 1, priceCents: 12990 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-pre-treino',
    name: 'Pré-treino em pó',
    slug: 'pre-treino-em-po',
    categoryId: 'cat-fitness',
    categoryName: 'Suplementos fitness',
    imageUrl: '/vitale-fitness.png',
    shortDescription: 'Produto demonstrativo para completar a linha esportiva.',
    sku: 'DEMO-FIT-04',
    saleType: 'unit',
    unitLabel: 'pote 300 g',
    priceCents: 7490,
    variants: [{ label: 'Pote 300 g', quantity: 1, priceCents: 7490 }],
  }),
  makeDemoProduct({
    id: 'demo-pasta-amendoim',
    name: 'Pasta de amendoim integral',
    slug: 'pasta-de-amendoim-integral',
    categoryId: 'cat-proteinas',
    categoryName: 'Proteínas & snacks',
    imageUrl: '/vitale-fitness.png',
    shortDescription:
      'Textura cremosa para combinar com frutas, pães e receitas.',
    sku: 'DEMO-SNK-05',
    saleType: 'unit',
    unitLabel: 'pote 500 g',
    priceCents: 2990,
    salePriceCents: 2590,
    promotion: true,
    variants: [
      { label: 'Pote 500 g', quantity: 1, priceCents: 2590 },
      { label: 'Pote 1 kg', quantity: 1, priceCents: 4790 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-barra-proteica',
    name: 'Barra proteica',
    slug: 'barra-proteica',
    categoryId: 'cat-proteinas',
    categoryName: 'Proteínas & snacks',
    imageUrl: '/vitale-fitness.png',
    shortDescription: 'Opção individual demonstrativa para a rotina corrida.',
    sku: 'DEMO-SNK-06',
    saleType: 'unit',
    unitLabel: 'unidade 60 g',
    priceCents: 1090,
    variants: [
      { label: 'Unidade 60 g', quantity: 1, priceCents: 1090 },
      { label: 'Caixa com 12', quantity: 12, priceCents: 11500 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-granola',
    name: 'Granola artesanal',
    slug: 'granola-artesanal',
    categoryId: 'cat-mercearia',
    categoryName: 'Mercearia natural',
    shortDescription: 'Mistura crocante para acompanhar frutas e iogurtes.',
    sku: 'DEMO-MER-07',
    saleType: 'package',
    unitLabel: 'pacote 500 g',
    priceCents: 2890,
    salePriceCents: 2490,
    featured: true,
    promotion: true,
    variants: [
      { label: 'Pacote 250 g', quantity: 1, priceCents: 1390 },
      { label: 'Pacote 500 g', quantity: 1, priceCents: 2490 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-castanha',
    name: 'Castanha-de-caju',
    slug: 'castanha-de-caju',
    categoryId: 'cat-castanhas',
    categoryName: 'Castanhas & frutas secas',
    shortDescription: 'Crocante e selecionada, disponível em quatro medidas.',
    sku: 'DEMO-CAS-08',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 1200,
    featured: true,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 1200 },
      { label: '250 g', quantity: 250, priceCents: 2800 },
      { label: '500 g', quantity: 500, priceCents: 5400 },
      { label: '1 kg', quantity: 1000, priceCents: 10000 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-amendoa',
    name: 'Amêndoas torradas',
    slug: 'amendoas-torradas',
    categoryId: 'cat-castanhas',
    categoryName: 'Castanhas & frutas secas',
    shortDescription: 'Porção crocante para lanches e receitas.',
    sku: 'DEMO-CAS-09',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 1190,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 1190 },
      { label: '250 g', quantity: 250, priceCents: 2790 },
      { label: '500 g', quantity: 500, priceCents: 5290 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-damasco',
    name: 'Damasco seco',
    slug: 'damasco-seco',
    categoryId: 'cat-castanhas',
    categoryName: 'Castanhas & frutas secas',
    shortDescription: 'Fruta seca de sabor marcante, vendida por peso.',
    sku: 'DEMO-CAS-10',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 990,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 990 },
      { label: '250 g', quantity: 250, priceCents: 2290 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-tamara',
    name: 'Tâmara sem caroço',
    slug: 'tamara-sem-caroco',
    categoryId: 'cat-castanhas',
    categoryName: 'Castanhas & frutas secas',
    shortDescription: 'Doçura natural em porções para escolher.',
    sku: 'DEMO-CAS-11',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 890,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 890 },
      { label: '250 g', quantity: 250, priceCents: 2090 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-chia',
    name: 'Chia em grãos',
    slug: 'chia-em-graos',
    categoryId: 'cat-graos',
    categoryName: 'Grãos & sementes',
    shortDescription: 'Semente prática para receitas doces e salgadas.',
    sku: 'DEMO-GRA-12',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 850,
    featured: true,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 850 },
      { label: '250 g', quantity: 250, priceCents: 1990 },
      { label: '500 g', quantity: 500, priceCents: 3800 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-linhaca',
    name: 'Linhaça dourada',
    slug: 'linhaca-dourada',
    categoryId: 'cat-graos',
    categoryName: 'Grãos & sementes',
    shortDescription: 'Grãos dourados vendidos na quantidade ideal para você.',
    sku: 'DEMO-GRA-13',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 590,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 590 },
      { label: '250 g', quantity: 250, priceCents: 1290 },
      { label: '500 g', quantity: 500, priceCents: 2390 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-quinoa',
    name: 'Quinoa em grãos',
    slug: 'quinoa-em-graos',
    categoryId: 'cat-graos',
    categoryName: 'Grãos & sementes',
    shortDescription: 'Ingrediente versátil para bowls, saladas e preparos.',
    sku: 'DEMO-GRA-14',
    saleType: 'weight',
    unitLabel: '100 g',
    priceCents: 790,
    variants: [
      { label: '100 g', quantity: 100, priceCents: 790 },
      { label: '250 g', quantity: 250, priceCents: 1790 },
      { label: '500 g', quantity: 500, priceCents: 3290 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-hibisco',
    name: 'Chá de hibisco',
    slug: 'cha-de-hibisco',
    categoryId: 'cat-chas',
    categoryName: 'Chás & ervas',
    shortDescription: 'Ervas secas selecionadas e vendidas por peso.',
    sku: 'DEMO-CHA-15',
    saleType: 'weight',
    unitLabel: '50 g',
    priceCents: 690,
    variants: [
      { label: '50 g', quantity: 50, priceCents: 690 },
      { label: '100 g', quantity: 100, priceCents: 1250 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-camomila',
    name: 'Camomila em flores',
    slug: 'camomila-em-flores',
    categoryId: 'cat-chas',
    categoryName: 'Chás & ervas',
    shortDescription: 'Flores secas aromáticas em duas medidas.',
    sku: 'DEMO-CHA-16',
    saleType: 'weight',
    unitLabel: '30 g',
    priceCents: 790,
    variants: [
      { label: '30 g', quantity: 30, priceCents: 790 },
      { label: '60 g', quantity: 60, priceCents: 1390 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-cacau',
    name: 'Cacau em pó',
    slug: 'cacau-em-po',
    categoryId: 'cat-ingredientes',
    categoryName: 'Temperos & ingredientes',
    shortDescription: 'Sabor intenso para bebidas, bolos e receitas.',
    sku: 'DEMO-ING-17',
    saleType: 'package',
    unitLabel: 'pacote 200 g',
    priceCents: 1890,
    variants: [
      { label: 'Pacote 200 g', quantity: 1, priceCents: 1890 },
      { label: 'Pacote 500 g', quantity: 1, priceCents: 4190 },
    ],
  }),
  makeDemoProduct({
    id: 'demo-curcuma',
    name: 'Cúrcuma em pó',
    slug: 'curcuma-em-po',
    categoryId: 'cat-ingredientes',
    categoryName: 'Temperos & ingredientes',
    shortDescription: 'Tempero de cor intensa para completar a despensa.',
    sku: 'DEMO-ING-18',
    saleType: 'package',
    unitLabel: 'pacote 100 g',
    priceCents: 990,
    salePriceCents: 790,
    promotion: true,
    variants: [{ label: 'Pacote 100 g', quantity: 1, priceCents: 790 }],
  }),
  makeDemoProduct({
    id: 'demo-acucar-coco',
    name: 'Açúcar de coco',
    slug: 'acucar-de-coco',
    categoryId: 'cat-mercearia',
    categoryName: 'Mercearia natural',
    shortDescription: 'Alternativa culinária para bebidas e preparos.',
    sku: 'DEMO-MER-19',
    saleType: 'package',
    unitLabel: 'pacote 250 g',
    priceCents: 1690,
    variants: [{ label: 'Pacote 250 g', quantity: 1, priceCents: 1690 }],
  }),
  makeDemoProduct({
    id: 'demo-farinha-amendoa',
    name: 'Farinha de amêndoas',
    slug: 'farinha-de-amendoas',
    categoryId: 'cat-mercearia',
    categoryName: 'Mercearia natural',
    shortDescription: 'Ingrediente versátil para diferentes receitas.',
    sku: 'DEMO-MER-20',
    saleType: 'package',
    unitLabel: 'pacote 250 g',
    priceCents: 2490,
    variants: [
      { label: 'Pacote 250 g', quantity: 1, priceCents: 2490 },
      { label: 'Pacote 500 g', quantity: 1, priceCents: 4590 },
    ],
  }),
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
