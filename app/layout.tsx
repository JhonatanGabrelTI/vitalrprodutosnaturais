import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import './globals.css';

const sans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const display = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://vitale-produtos-naturais-ibaiti.nutty-degu-4811.chatgpt.site',
  ),
  title: 'Vitale Produtos Naturais | Ibaiti - PR',
  description:
    'Produtos naturais selecionados. Monte seu pedido online e finalize pelo WhatsApp.',
  keywords: ['produtos naturais', 'Ibaiti', 'castanhas', 'grãos', 'Vitale'],
  alternates: { canonical: '/' },
  icons: { icon: '/vitale-logo.jpg', apple: '/vitale-logo.jpg' },
  openGraph: {
    title: 'Vitale Produtos Naturais',
    description:
      'Escolha produtos naturais na medida certa e finalize pelo WhatsApp.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${display.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
