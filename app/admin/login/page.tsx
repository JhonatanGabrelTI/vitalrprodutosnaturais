import Image from 'next/image';
import { SiteLink as Link } from '@/components/site-link';
import { redirect } from 'next/navigation';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin-login-form';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  getAdminEmail,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLogin() {
  if (await getAdminEmail()) redirect('/admin');
  return (
    <main className="login-page">
      <Link href="/">
        <ArrowLeft />
        Voltar para a loja
      </Link>
      <section>
        <Image
          src="/vitale-logo.jpg"
          alt="Vitale Produtos Naturais"
          width={112}
          height={96}
        />
        <span>
          <LockKeyhole /> Área protegida
        </span>
        <h1>Painel do catálogo</h1>
        <p>
          Cadastre produtos, fotos, categorias, preços, estoque e unidades de
          venda da Vitale.
        </p>
        <AdminLoginForm demoEmail={DEMO_ADMIN_EMAIL} />
        <div className="demo-credentials">
          <strong>Acesso fictício para demonstração</strong>
          <span>E-mail: {DEMO_ADMIN_EMAIL}</span>
          <span>Senha: {DEMO_ADMIN_PASSWORD}</span>
        </div>
        <small>
          Antes do uso real, altere as credenciais nas variáveis protegidas do
          ambiente de hospedagem.
        </small>
      </section>
    </main>
  );
}
