import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
    <html lang="pt-BR" className="dark">
      <body className="bg-onyx-950 text-foreground min-h-screen flex flex-col antialiased selection:bg-gold-400 selection:text-onyx-950">
        <StoreProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
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
