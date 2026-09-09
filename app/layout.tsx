import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { MotionObserver } from '@/components/motion-observer';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';
import './storefront-refresh.css';

const sans = Geist({ variable: '--font-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Vitale Produtos Naturais | Ibaiti - PR',
  description:
    'Produtos naturais, suplementos fitness, creatina, whey e snacks. Monte seu pedido online e finalize pelo WhatsApp.',
  keywords: [
    'produtos naturais',
    'suplementos fitness',
    'creatina',
    'whey protein',
    'Ibaiti',
    'Vitale',
  ],
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
      <body className={sans.variable}>
        <CartProvider>
          <MotionObserver />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
