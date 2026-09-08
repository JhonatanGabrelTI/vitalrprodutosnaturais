'use client';
import { type SyntheticEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Boxes,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PackagePlus,
  Pencil,
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
import { money } from '@/lib/catalog-data';

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
  unitLabel: string;
  price: string;
  salePrice: string;
  minQty: string;
  maxQty: string;
  stockQty: string;
  featured: boolean;
  promotion: boolean;
  active: boolean;
  variants: string;
};

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
  unitLabel: 'unidade',
  price: '',
  salePrice: '',
  minQty: '1',
  maxQty: '99',
  stockQty: '0',
  featured: false,
  promotion: false,
  active: true,
  variants: '',
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
    setProductForm(emptyProduct);
    setProductOpen(true);
  };
  const openEdit = (product: Product) => {
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
      unitLabel: product.unitLabel,
      price: String(product.priceCents / 100).replace('.', ','),
      salePrice:
        product.salePriceCents == null
          ? ''
          : String(product.salePriceCents / 100).replace('.', ','),
      minQty: String(product.minQty),
      maxQty: String(product.maxQty),
      stockQty: String(product.stockQty),
      featured: product.featured,
      promotion: product.promotion,
      active: product.active,
      variants: product.variants
        .map(
          (item) =>
            `${item.label}=${String(item.priceCents / 100).replace('.', ',')}`,
        )
        .join('\n'),
    });
    setProductOpen(true);
  };
  const submitProduct = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parseMoney = (value: string) =>
      Math.round(Number(value.replace(',', '.')) * 100);
    const variants = productForm.variants
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, price = '0'] = line.split('=');
        return {
          label: label.trim(),
          quantity: Number(label.replace(/\D/g, '')) || 1,
          priceCents: parseMoney(price.trim()),
        };
      });
    const payload = {
      ...productForm,
      priceCents: parseMoney(productForm.price),
      salePriceCents: productForm.salePrice
        ? parseMoney(productForm.salePrice)
        : null,
      minQty: Number(productForm.minQty),
      maxQty: Number(productForm.maxQty),
      stockQty: Number(productForm.stockQty),
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
  const addCategory = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
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
      setCategoryName('');
      setCategorySlug('');
      setCategoryDescription('');
      await load();
      notify('Categoria adicionada.');
    }
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
                      />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.sku}</small>
                      </span>
                    </span>
                    <span>{product.categoryName}</span>
                    <span>
                      {money(product.salePriceCents ?? product.priceCents)}
                    </span>
                    <span className="sale-type">
                      {product.saleType === 'weight'
                        ? 'Por peso'
                        : product.saleType === 'package'
                          ? 'Pacote'
                          : 'Unidade'}
                      <small>{product.unitLabel}</small>
                    </span>
                    <span className="stock-cell">
                      <strong>{product.stockQty}</strong>
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
                    </article>
                  ))}
                </div>
              </div>
              <form className="admin-card simple-form" onSubmit={addCategory}>
                <div className="card-title">
                  <div>
                    <small>Nova</small>
                    <h2>Adicionar categoria</h2>
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
                <button>Adicionar categoria</button>
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
  const field = (key: keyof ProductForm) => ({
    value: String(form[key]),
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setForm({ ...form, [key]: event.target.value }),
  });
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
          Preço base (R$)
          <input required inputMode="decimal" {...field('price')} />
        </label>
        <label>
          Preço promocional (R$)
          <input inputMode="decimal" {...field('salePrice')} />
        </label>
        <label>
          Unidade exibida
          <input
            required
            {...field('unitLabel')}
            placeholder={
              form.saleType === 'weight'
                ? 'Ex.: 100 g ou 1 kg'
                : form.saleType === 'package'
                  ? 'Ex.: pacote 500 g'
                  : 'Ex.: unidade ou pote 300 g'
            }
          />
          <small className="field-help">
            É o formato que o cliente verá na vitrine.
          </small>
        </label>
        <label>
          Quantidade em estoque
          <input required type="number" min="0" {...field('stockQty')} />
          <small className="field-help">
            {form.saleType === 'weight'
              ? 'Informe o total em gramas. Ex.: 5000 equivale a 5 kg.'
              : 'Informe quantas unidades ou pacotes estão disponíveis.'}
          </small>
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
        <label className="full">
          Imagem (URL ou caminho)
          <input {...field('imageUrl')} />
        </label>
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
        <label className="full">
          Tamanhos e preços — uma opção por linha
          <textarea {...field('variants')} />
          <small className="field-help">
            Use o formato “100 g=12,00”, “500 g=49,90” ou “1 kg=89,90”.
          </small>
        </label>
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
