import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { chatGPTSignInPath, getChatGPTUser } from '@/app/chatgpt-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLogin() {
  const user = await getChatGPTUser();
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
        <h1>Painel da loja</h1>
        <p>
          Gerencie o catálogo, as categorias, os pedidos e os dados de
          atendimento da Vitale.
        </p>
        {user ? (
          <Link className="login-button" href="/admin">
            Entrar no painel
          </Link>
        ) : (
          <a
            className="login-button"
            href={chatGPTSignInPath('/admin')}
            target="_top"
          >
            Entrar com ChatGPT
          </a>
        )}
        <small>
          O acesso exige autenticação e respeita as permissões definidas para o
          site.
        </small>
      </section>
    </main>
  );
}
