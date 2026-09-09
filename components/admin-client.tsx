'use client';
import { type SyntheticEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { SiteLink as Link } from './site-link';
import {
  Boxes,
  ExternalLink,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PackagePlus,
  Pencil,
  Plus,
  Settings,
  ShoppingBag,
  Tags,
  Trash2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import type { Category, Product, StoreSettings } from '@/lib/catalog-data';
import { money, productStartingPrice, productStock } from '@/lib/catalog-data';

type Order = {
  id: string;
  total_cents: number;
  status: string;
  created_at: number;
  customer_phone: string;
  items: Array<Record<string, string | number>>;
};
type AdminData = {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  orders: Order[];
  demo: boolean;
};
type ProductVariantForm = {
  id: string;
  label: string;
  price: string;
  salePrice: string;
  stockQty: string;
  imageUrl: string;
};
type ProductForm = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  imageUrl: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  nutrition: string;
  brand: string;
  sku: string;
  saleType: Product['saleType'];
  minQty: string;
  maxQty: string;
  featured: boolean;
  promotion: boolean;
  active: boolean;
  variants: ProductVariantForm[];
};
type ProductStringField = {
  [Key in keyof ProductForm]: ProductForm[Key] extends string ? Key : never;
}[keyof ProductForm];

const createVariantForm = (
  values: Partial<ProductVariantForm> = {},
): ProductVariantForm => ({
  id: crypto.randomUUID(),
  label: '',
  price: '',
  salePrice: '',
  stockQty: '0',
  imageUrl: '',
  ...values,
});

const moneyInput = (value: number | null | undefined) =>
  value == null ? '' : String(value / 100).replace('.', ',');

const emptyProduct: ProductForm = {
  id: '',
  name: '',
  slug: '',
  categoryId: '',
  imageUrl: '/vitale-hero.webp',
  shortDescription: '',
  description: '',
  ingredients: '',
  nutrition: '',
  brand: 'Vitale',
  sku: '',
  saleType: 'unit',
  minQty: '1',
  maxQty: '99',
  featured: false,
  promotion: false,
  active: true,
  variants: [],
};

export function AdminClient({
  userName,
  signOutPath,
}: {
  userName: string;
  signOutPath: string;
}) {
  const [data, setData] = useState<AdminData | null>(null);
  const [message, setMessage] = useState('');
  const [productOpen, setProductOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const load = async () => {
    const response = await fetch('/api/admin/data');
    if (!response.ok) throw new Error('Não foi possível carregar o painel.');
    setData(await response.json());
  };
  useEffect(() => {
    let active = true;
    fetch('/api/admin/data')
      .then((response) => {
        if (!response.ok)
          throw new Error('Não foi possível carregar o painel.');
        return response.json() as Promise<AdminData>;
      })
      .then((nextData) => {
        if (active) setData(nextData);
      })
      .catch((error: Error) => {
        if (active) setMessage(error.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const notify = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3500);
  };
  const openNew = () => {
    setProductForm({
      ...emptyProduct,
      variants: [createVariantForm()],
    });
    setProductOpen(true);
  };
  const openEdit = (product: Product) => {
    const variants = product.variants.length
      ? product.variants.map((item, index) =>
          createVariantForm({
            label: item.label,
            price: moneyInput(item.priceCents),
            salePrice: moneyInput(item.salePriceCents),
            stockQty: String(
              item.stockQty ?? (index === 0 ? product.stockQty : 0),
            ),
            imageUrl: item.imageUrl || '',
          }),
        )
      : [
          createVariantForm({
            label: product.unitLabel,
            price: moneyInput(product.priceCents),
            salePrice: moneyInput(product.salePriceCents),
            stockQty: String(product.stockQty),
          }),
        ];
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      shortDescription: product.shortDescription,
      description: product.description,
      ingredients: product.ingredients,
      nutrition: product.nutrition,
      brand: product.brand,
      sku: product.sku,
      saleType: product.saleType,
      minQty: String(product.minQty),
      maxQty: String(product.maxQty),
      featured: product.featured,
      promotion: product.promotion,
      active: product.active,
      variants,
    });
    setProductOpen(true);
  };
  const submitProduct = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parseMoney = (value: string) =>
      Math.round(Number(value.replace(',', '.')) * 100);
    const variantLabels = productForm.variants.map((item) =>
      item.label.trim().toLocaleLowerCase('pt-BR'),
    );
    const invalidVariant = productForm.variants.find(
      (item) =>
        !item.label.trim() ||
        !item.price.trim() ||
        !Number.isFinite(Number(item.price.replace(',', '.'))) ||
        Number(item.price.replace(',', '.')) < 0 ||
        (item.salePrice.trim() !== '' &&
          (!Number.isFinite(Number(item.salePrice.replace(',', '.'))) ||
            Number(item.salePrice.replace(',', '.')) < 0)) ||
        !Number.isFinite(Number(item.stockQty)) ||
        Number(item.stockQty) < 0,
    );
    const hasDuplicate = variantLabels.some(
      (label, index) => label && variantLabels.indexOf(label) !== index,
    );
    if (!productForm.variants.length || invalidVariant || hasDuplicate) {
      notify(
        hasDuplicate
          ? 'Cada variação precisa ter um nome diferente.'
          : 'Preencha nome, preço e estoque de todas as variações.',
      );
      return;
    }
    const variants = productForm.variants.map((item) => ({
      label: item.label.trim(),
      quantity: Number(item.label.replace(/\D/g, '')) || 1,
      priceCents: parseMoney(item.price),
      salePriceCents: item.salePrice ? parseMoney(item.salePrice) : null,
      stockQty: Math.max(0, Number(item.stockQty) || 0),
      imageUrl: item.imageUrl.trim(),
    }));
    const primaryVariant = variants[0];
    const payload = {
      ...productForm,
      unitLabel: primaryVariant.label,
      priceCents: primaryVariant.priceCents,
      salePriceCents: primaryVariant.salePriceCents,
      minQty: Number(productForm.minQty),
      maxQty: Number(productForm.maxQty),
      stockQty: variants.reduce((total, item) => total + item.stockQty, 0),
      variantsJson: JSON.stringify(variants),
    };
    const response = await fetch(
      productForm.id
        ? `/api/admin/products/${productForm.id}`
        : '/api/admin/products',
      {
        method: productForm.id ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    const result = (await response.json()) as { error?: string };
    if (!response.ok) return notify(result.error || 'Não foi possível salvar.');
    setProductOpen(false);
    await load();
    notify('Produto salvo com sucesso.');
  };
  const deleteProduct = async () => {
    if (!deleteId) return;
    const response = await fetch(`/api/admin/products/${deleteId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      await load();
      notify('Produto excluído.');
    } else notify('Não foi possível excluir.');
    setDeleteId(null);
  };
  const saveCategory = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: categoryId || undefined,
        name: categoryName,
        description: categoryDescription,
        slug:
          categorySlug ||
          categoryName
            .toLocaleLowerCase('pt-BR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
      }),
    });
    if (response.ok) {
      setCategoryId('');
      setCategoryName('');
      setCategorySlug('');
      setCategoryDescription('');
      await load();
      notify(categoryId ? 'Categoria atualizada.' : 'Categoria adicionada.');
    }
  };
  const editCategory = (category: Category) => {
    setCategoryId(category.id);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setCategoryDescription(category.description);
  };
  const deleteCategory = async (category: Category) => {
    if (
      !window.confirm(
        `Excluir a categoria “${category.name}”? Os produtos não serão excluídos, mas ficarão sem categoria até serem editados.`,
      )
    )
      return;
    const response = await fetch(
      `/api/admin/categories?id=${encodeURIComponent(category.id)}`,
      { method: 'DELETE' },
    );
    if (!response.ok) return notify('Não foi possível excluir a categoria.');
    if (categoryId === category.id) {
      setCategoryId('');
      setCategoryName('');
      setCategorySlug('');
      setCategoryDescription('');
    }
    await load();
    notify('Categoria excluída.');
  };
  const updateOrder = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
    notify('Status atualizado.');
  };
  const saveSettings = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data) return;
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data.settings),
    });
    if (response.ok) {
      await load();
      notify('Configurações salvas.');
    }
  };
  const importDemo = async () => {
    const response = await fetch('/api/admin/seed', { method: 'POST' });
    const result = (await response.json()) as { error?: string };
    if (response.ok) {
      await load();
      notify('Catálogo demonstrativo salvo no banco.');
    } else notify(result.error || 'Não foi possível importar.');
  };
  if (!data)
    return (
      <main className="admin-loading">
        <Image src="/vitale-logo.jpg" alt="Vitale" width={78} height={68} />
        <div className="loading-line" />
        <p>{message || 'Carregando painel…'}</p>
      </main>
    );
  const active = data.products.filter((item) => item.active).length;
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Image src="/vitale-logo.jpg" alt="Vitale" width={82} height={70} />
        <span>Painel Vitale</span>
        <nav>
          <a href="#dashboard">
            <LayoutDashboard />
            Visão geral
          </a>
          <a href="#products">
            <Boxes />
            Produtos
          </a>
          <a href="#categories">
            <Tags />
            Categorias
          </a>
          <a href="#orders">
            <ShoppingBag />
            Pedidos
          </a>
          <a href="#settings">
            <Settings />
            Configurações
          </a>
        </nav>
        <div className="admin-side-footer">
          <Link href="/" target="_blank">
            <ExternalLink />
            Abrir loja
          </Link>
          <a href={signOutPath}>
            <LogOut />
            Sair
          </a>
        </div>
      </aside>
      <section className="admin-main">
        <header>
          <div>
            <small>Área administrativa</small>
            <h1>Olá, {userName.split('@')[0]}</h1>
          </div>
          {data.demo && (
            <button className="seed-button" onClick={importDemo}>
              Salvar catálogo demonstrativo no banco
            </button>
          )}
        </header>
        {message && (
          <output className="admin-notice" aria-live="polite">
            {message}
          </output>
        )}
        <Tabs defaultValue="dashboard">
          <TabsList className="admin-tabs" variant="line">
            <TabsTrigger value="dashboard">
              <LayoutDashboard />
              Visão geral
            </TabsTrigger>
            <TabsTrigger value="products">
              <Boxes />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tags />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings />
              Configurações
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" id="dashboard">
            <div className="stats-grid">
              <article>
                <span>Produtos</span>
                <strong>{data.products.length}</strong>
                <small>{active} ativos</small>
              </article>
              <article>
                <span>Categorias</span>
                <strong>{data.categories.length}</strong>
                <small>organizando o catálogo</small>
              </article>
              <article>
                <span>Em destaque</span>
                <strong>
                  {data.products.filter((item) => item.featured).length}
                </strong>
                <small>na página inicial</small>
              </article>
              <article>
                <span>Pedidos</span>
                <strong>{data.orders.length}</strong>
                <small>
                  {data.orders.filter((item) => item.status === 'Novo').length}{' '}
                  novos
                </small>
              </article>
            </div>
            <div className="admin-card">
              <div className="card-title">
                <div>
                  <small>Operação</small>
                  <h2>Pedidos recentes</h2>
                </div>
              </div>
              <OrderList
                orders={data.orders.slice(0, 5)}
                onChange={updateOrder}
                whatsapp={data.settings.whatsapp}
              />
            </div>
          </TabsContent>
          <TabsContent value="products" id="products">
            <div className="admin-card">
              <div className="card-title">
                <div>
                  <small>Catálogo</small>
                  <h2>Produtos</h2>
                </div>
                <button onClick={openNew}>
                  <PackagePlus />
                  Novo produto
                </button>
              </div>
              <div className="admin-table">
                <div className="admin-row head">
                  <span>Produto</span>
                  <span>Categoria</span>
                  <span>Preço</span>
                  <span>Venda</span>
                  <span>Estoque</span>
                  <span>Status</span>
                  <span />
                </div>
                {data.products.map((product) => (
                  <div className="admin-row" key={product.id}>
                    <span className="product-cell">
                      <Image
                        src={product.imageUrl || '/vitale-hero.webp'}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized={
                          product.imageUrl.startsWith('data:') ||
                          product.imageUrl.startsWith('http')
                        }
                      />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.sku}</small>
                      </span>
                    </span>
                    <span>{product.categoryName}</span>
                    <span>
                      {product.variants.length > 1 && (
                        <small>A partir de </small>
                      )}
                      {money(productStartingPrice(product))}
                    </span>
                    <span className="sale-type">
                      {product.saleType === 'weight'
                        ? 'Por peso'
                        : product.saleType === 'package'
                          ? 'Pacote'
                          : 'Unidade'}
                      <small>
                        {product.variants.length || 1}{' '}
                        {product.variants.length === 1
                          ? 'variação'
                          : 'variações'}
                      </small>
                    </span>
                    <span className="stock-cell">
                      <strong>{productStock(product)}</strong>
                      <small>
                        {product.saleType === 'weight'
                          ? 'gramas'
                          : 'disponíveis'}
                      </small>
                    </span>
                    <span>
                      <i
                        className={
                          product.active ? 'status-active' : 'status-off'
                        }
                      >
                        {product.active ? 'Ativo' : 'Inativo'}
                      </i>
                    </span>
                    <span className="row-actions">
                      <button
                        onClick={() => openEdit(product)}
                        aria-label="Editar"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        aria-label="Excluir"
                      >
                        <Trash2 />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="categories" id="categories">
            <div className="admin-columns">
              <div className="admin-card">
                <div className="card-title">
                  <div>
                    <small>Organização</small>
                    <h2>Categorias da loja</h2>
                  </div>
                </div>
                <div className="category-list">
                  {data.categories.map((category) => (
                    <article key={category.id}>
                      <div>
                        <strong>{category.name}</strong>
                        <small>/{category.slug}</small>
                        {category.description && <p>{category.description}</p>}
                      </div>
                      <span>
                        {
                          data.products.filter(
                            (item) => item.categoryId === category.id,
                          ).length
                        }{' '}
                        produtos
                      </span>
                      <span className="category-actions">
                        <button
                          onClick={() => editCategory(category)}
                          aria-label={`Editar categoria ${category.name}`}
                        >
                          <Pencil />
                        </button>
                        <button
                          onClick={() => deleteCategory(category)}
                          aria-label={`Excluir categoria ${category.name}`}
                        >
                          <Trash2 />
                        </button>
                      </span>
                    </article>
                  ))}
                </div>
              </div>
              <form className="admin-card simple-form" onSubmit={saveCategory}>
                <div className="card-title">
                  <div>
                    <small>{categoryId ? 'Edição' : 'Nova'}</small>
                    <h2>
                      {categoryId ? 'Editar categoria' : 'Adicionar categoria'}
                    </h2>
                  </div>
                </div>
                <label>
                  Nome
                  <input
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </label>
                <label>
                  Slug
                  <input
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    placeholder="gerado automaticamente"
                  />
                </label>
                <label>
                  Descrição
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Ex.: suplementos e acessórios para o treino"
                  />
                </label>
                <button>
                  {categoryId ? 'Salvar categoria' : 'Adicionar categoria'}
                </button>
                {categoryId && (
                  <button
                    type="button"
                    className="category-cancel"
                    onClick={() => {
                      setCategoryId('');
                      setCategoryName('');
                      setCategorySlug('');
                      setCategoryDescription('');
                    }}
                  >
                    Cancelar edição
                  </button>
                )}
              </form>
            </div>
          </TabsContent>
          <TabsContent value="orders" id="orders">
            <div className="admin-card">
              <div className="card-title">
                <div>
                  <small>Atendimento</small>
                  <h2>Pedidos</h2>
                </div>
              </div>
              <OrderList
                orders={data.orders}
                onChange={updateOrder}
                whatsapp={data.settings.whatsapp}
              />
            </div>
          </TabsContent>
          <TabsContent value="settings" id="settings">
            <form className="admin-card settings-form" onSubmit={saveSettings}>
              <div className="card-title">
                <div>
                  <small>Loja</small>
                  <h2>Configurações</h2>
                </div>
              </div>
              <div className="form-grid">
                <label>
                  WhatsApp com DDD
                  <input
                    value={data.settings.whatsapp}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          whatsapp: e.target.value,
                        },
                      })
                    }
                    placeholder="5543999999999"
                  />
                </label>
                <label>
                  Instagram
                  <input
                    value={data.settings.instagram}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          instagram: e.target.value,
                        },
                      })
                    }
                  />
                </label>
                <label>
                  Endereço
                  <input
                    value={data.settings.address}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, address: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Horário
                  <input
                    value={data.settings.hours}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, hours: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="full">
                  Mensagem inicial do pedido
                  <textarea
                    value={data.settings.checkoutMessage}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          checkoutMessage: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              </div>
              <button className="save-button">Salvar configurações</button>
            </form>
          </TabsContent>
        </Tabs>
      </section>
      <Dialog open={productOpen} onOpenChange={setProductOpen}>
        <DialogContent className="product-dialog">
          <DialogHeader>
            <DialogTitle>
              {productForm.id ? 'Editar produto' : 'Novo produto'}
            </DialogTitle>
            <DialogDescription>
              Cadastre apenas informações verificadas sobre o produto.
            </DialogDescription>
          </DialogHeader>
          <ProductFormView
            form={productForm}
            setForm={setProductForm}
            categories={data.categories}
            onSubmit={submitProduct}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este produto?</AlertDialogTitle>
            <AlertDialogDescription>
              O item será removido do catálogo. Pedidos antigos permanecem
              preservados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteProduct}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function ProductFormView({
  form,
  setForm,
  categories,
  onSubmit,
}: {
  form: ProductForm;
  setForm: (form: ProductForm) => void;
  categories: Category[];
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}) {
  const [imageError, setImageError] = useState('');
  const field = (key: ProductStringField) => ({
    value: form[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setForm({ ...form, [key]: event.target.value }),
  });
  const updateVariant = (
    id: string,
    key: keyof Omit<ProductVariantForm, 'id'>,
    value: string,
  ) =>
    setForm({
      ...form,
      variants: form.variants.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    });
  const removeVariant = (id: string) =>
    setForm({
      ...form,
      variants: form.variants.filter((item) => item.id !== id),
    });
  const uploadVariantImage = (variantId: string, file?: File) => {
    if (!file) return;
    if (file.size > 1_500_000) {
      setImageError('Cada imagem deve ter no máximo 1,5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      updateVariant(variantId, 'imageUrl', reader.result);
      setImageError('');
    };
    reader.readAsDataURL(file);
  };
  return (
    <form className="product-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          Nome
          <input
            required
            {...field('name')}
            onBlur={() =>
              !form.slug &&
              setForm({
                ...form,
                slug: form.name
                  .toLocaleLowerCase('pt-BR')
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, ''),
              })
            }
          />
        </label>
        <label>
          Slug
          <input required {...field('slug')} />
        </label>
        <label htmlFor="admin-product-category">
          Categoria
          <NativeSelect
            id="admin-product-category"
            required
            {...field('categoryId')}
          >
            <NativeSelectOption value="">
              Selecione uma categoria
            </NativeSelectOption>
            {categories.map((item) => (
              <NativeSelectOption key={item.id} value={item.id}>
                {item.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <label htmlFor="admin-product-sale-type">
          Tipo de venda
          <NativeSelect id="admin-product-sale-type" {...field('saleType')}>
            <NativeSelectOption value="unit">Unidade (cada)</NativeSelectOption>
            <NativeSelectOption value="weight">
              Peso (g ou kg)
            </NativeSelectOption>
            <NativeSelectOption value="package">
              Pacote / embalagem
            </NativeSelectOption>
          </NativeSelect>
        </label>
        <label>
          Quantidade mínima
          <input type="number" min="1" {...field('minQty')} />
        </label>
        <label>
          Quantidade máxima
          <input type="number" min="1" {...field('maxQty')} />
        </label>
        <label>
          Marca
          <input {...field('brand')} />
        </label>
        <label>
          SKU
          <input {...field('sku')} />
        </label>
        <div className="image-field full">
          <div className="image-preview">
            <Image
              src={form.imageUrl || '/vitale-hero.webp'}
              alt="Prévia da foto do produto"
              width={160}
              height={130}
              unoptimized={
                form.imageUrl.startsWith('data:') ||
                form.imageUrl.startsWith('http')
              }
            />
          </div>
          <div>
            <strong>Foto do produto</strong>
            <label className="image-upload">
              <ImagePlus /> Escolher imagem
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1_500_000) {
                    setImageError('A imagem deve ter no máximo 1,5 MB.');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result !== 'string') return;
                    setForm({ ...form, imageUrl: reader.result });
                    setImageError('');
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <label className="image-url">
              Ou cole uma URL/caminho
              <input {...field('imageUrl')} />
            </label>
            {imageError && <small className="field-error">{imageError}</small>}
            <small className="field-help">
              JPG, PNG ou WebP. Para melhor desempenho, use imagens quadradas e
              otimizadas.
            </small>
          </div>
        </div>
        <label className="full">
          Descrição curta
          <input {...field('shortDescription')} />
        </label>
        <label className="full">
          Descrição completa
          <textarea {...field('description')} />
        </label>
        <label className="full">
          Ingredientes
          <textarea {...field('ingredients')} />
        </label>
        <label className="full">
          Informações nutricionais
          <textarea {...field('nutrition')} />
        </label>
        <section
          className="variant-editor full"
          aria-labelledby="variants-title"
        >
          <header>
            <div>
              <strong id="variants-title">Variações do produto</strong>
              <p>
                Reúna sabores, pesos, tamanhos ou embalagens no mesmo produto.
                Foto, preço e estoque mudam juntos na vitrine.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  variants: [...form.variants, createVariantForm()],
                })
              }
            >
              <Plus /> Adicionar variação
            </button>
          </header>
          <div className="variant-list">
            {form.variants.map((variant, index) => {
              const preview = variant.imageUrl || form.imageUrl;
              return (
                <article className="variant-card" key={variant.id}>
                  <div className="variant-card-head">
                    <span>
                      <b>Opção {index + 1}</b>
                      <small>
                        {variant.label || 'Sabor, peso, tamanho ou embalagem'}
                      </small>
                    </span>
                    <button
                      type="button"
                      disabled={form.variants.length === 1}
                      onClick={() => removeVariant(variant.id)}
                      aria-label={`Remover opção ${index + 1}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                  <div className="variant-fields">
                    <label>
                      Nome da variação
                      <input
                        required
                        value={variant.label}
                        onChange={(event) =>
                          updateVariant(variant.id, 'label', event.target.value)
                        }
                        placeholder="Ex.: Chocolate · 900 g"
                      />
                    </label>
                    <label>
                      Preço normal (R$)
                      <input
                        required
                        inputMode="decimal"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(variant.id, 'price', event.target.value)
                        }
                        placeholder="Ex.: 129,90"
                      />
                    </label>
                    <label>
                      Preço promocional (R$)
                      <input
                        inputMode="decimal"
                        value={variant.salePrice}
                        onChange={(event) =>
                          updateVariant(
                            variant.id,
                            'salePrice',
                            event.target.value,
                          )
                        }
                        placeholder="Opcional"
                      />
                    </label>
                    <label>
                      Estoque desta variação
                      <input
                        required
                        type="number"
                        min="0"
                        value={variant.stockQty}
                        onChange={(event) =>
                          updateVariant(
                            variant.id,
                            'stockQty',
                            event.target.value,
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="variant-image-field">
                    <div className="variant-image-preview">
                      <Image
                        src={preview || '/vitale-hero.webp'}
                        alt={`Prévia da opção ${variant.label || index + 1}`}
                        width={118}
                        height={96}
                        unoptimized={
                          preview.startsWith('data:') ||
                          preview.startsWith('http')
                        }
                      />
                    </div>
                    <div>
                      <strong>Foto desta variação</strong>
                      <small className="field-help">
                        Se não escolher outra, será usada a foto principal.
                      </small>
                      <label className="image-upload variant-upload">
                        <ImagePlus /> Escolher imagem
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) =>
                            uploadVariantImage(
                              variant.id,
                              event.target.files?.[0],
                            )
                          }
                        />
                      </label>
                      <label className="image-url">
                        Ou cole uma URL/caminho
                        <input
                          value={variant.imageUrl}
                          onChange={(event) =>
                            updateVariant(
                              variant.id,
                              'imageUrl',
                              event.target.value,
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {imageError && <small className="field-error">{imageError}</small>}
        </section>
        <div className="checks full">
          <label>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Ativo
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Destaque
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.promotion}
              onChange={(e) =>
                setForm({ ...form, promotion: e.target.checked })
              }
            />
            Promoção
          </label>
        </div>
      </div>
      <button className="save-button">Salvar produto</button>
    </form>
  );
}

function OrderList({
  orders,
  onChange,
  whatsapp,
}: {
  orders: Order[];
  onChange: (id: string, status: string) => void;
  whatsapp: string;
}) {
  if (!orders.length)
    return (
      <div className="empty-admin">
        <ShoppingBag />
        <h3>Nenhum pedido registrado</h3>
        <p>Os pedidos aparecem aqui quando o cliente inicia a finalização.</p>
      </div>
    );
  return (
    <div className="order-list">
      {orders.map((order) => (
        <article key={order.id}>
          <div>
            <small>{new Date(order.created_at).toLocaleString('pt-BR')}</small>
            <strong>Pedido #{order.id.slice(0, 8).toUpperCase()}</strong>
            <p>
              {order.items
                .map(
                  (item) =>
                    `${item.quantity}x ${item.product_name} (${item.variant_label})`,
                )
                .join(' · ')}
            </p>
          </div>
          <b>{money(Number(order.total_cents))}</b>
          <NativeSelect
            value={order.status}
            onChange={(e) => onChange(order.id, e.target.value)}
          >
            {[
              'Novo',
              'Em atendimento',
              'Confirmado',
              'Preparando',
              'Finalizado',
              'Cancelado',
            ].map((status) => (
              <NativeSelectOption key={status} value={status}>
                {status}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {whatsapp && (
            <a
              className="order-whatsapp"
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle />
              WhatsApp
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
