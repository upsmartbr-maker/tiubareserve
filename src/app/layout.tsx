import type { Metadata } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AffiliateTracker from '@/components/common/AffiliateTracker';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'TIÚBA RESERVE · Mel Nobre de Abelha Tiúba (Melipona fasciculata)',
  description: 'Plataforma oficial TIÚBA RESERVE. Méis nobres e raros de abelha nativa sem ferrão Tiúba colhidos nas copas do Bioma Amazônia. Pureza botânica, rastreabilidade de lote e alta gastronomia.',
  keywords: [
    'Mel de Tiúba',
    'Melipona fasciculata',
    'Abelha sem ferrão',
    'Méis raros Amazônia',
    'Tiúba Reserve',
    'Alta gastronomia',
    'Superalimento bioativo',
  ],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${cinzel.variable} ${montserrat.variable}`}>
      <body className="bg-onyx-950 text-foreground min-h-screen flex flex-col antialiased selection:bg-gold-400 selection:text-onyx-950">
        <StoreProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <AffiliateTracker />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
