'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/boutique/ProductCard';
import { Sparkles, Filter, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import SommelierModal from '@/components/boutique/SommelierModal';

export default function BoutiquePage() {
  const { products, settings, t } = useStore();
  const [filter, setFilter] = useState<'all' | 'tradicional' | 'bifloral' | 'multifloral' | 'amazonas'>('all');
  const [generalSommelierOpen, setGeneralSommelierOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'tradicional') return p.slug.includes('tradicional');
    if (filter === 'bifloral') return p.slug.includes('bifloral');
    if (filter === 'multifloral') return p.slug.includes('multifloral');
    if (filter === 'amazonas') return p.slug.includes('amazonas');
    return true;
  });

  return (
    <div className="w-full pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative w-full py-16 bg-gradient-to-b from-onyx-950 via-onyx-900 to-onyx-950 border-b border-gold-400/20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-onyx-950 text-gold-300 text-[10px] font-sans uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('Boutique Oficial do Mel Nobre', 'Official Noble Honey Boutique')}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Boutique Tiúba Reserve
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            {t(
              'Explore nossas quatro expressões exclusivas em frascos colecionáveis de 150ml. Produção sob safra limitada e frete especializado com seguro incluso.',
              'Explore our four exclusive expressions in 150ml collector flasks. Limited harvest production and dedicated insured delivery.'
            )}
          </p>

          {/* Delivery & Security Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-stone-300 font-sans">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-400" />
              <span>{t('Entrega Express Motoboy SP & Envio Nacional Seguro', 'Express Courier in SP & Safe National Delivery')}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>{t('Lacre de Pureza & Análise Melissopalinológica', 'Purity Seal & Melissopalynological Analysis')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Pills & Sommelier Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-luxury text-stone-400 font-bold mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gold-400" />
              {t('Filtrar:', 'Filter:')}
            </span>
            {[
              { id: 'all', label: t('Todos os Méis (4)', 'All Honeys (4)') },
              { id: 'tradicional', label: 'Tradicional' },
              { id: 'bifloral', label: 'Bifloral' },
              { id: 'multifloral', label: 'Multifloral' },
              { id: 'amazonas', label: 'Amazonas Grand Cru' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full font-serif transition-all ${
                  filter === cat.id
                    ? 'bg-gold-400 text-onyx-950 font-bold shadow-md shadow-gold-400/20'
                    : 'bg-onyx-900 border border-gold-400/20 text-stone-300 hover:border-gold-400/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={() => setGeneralSommelierOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-gold-300 border border-gold-400/30 px-4 py-2 rounded-xl bg-onyx-900 hover:bg-gold-400/10 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-gold-400" />
              <span>{t('Dúvidas? Fale com nosso Sommelier', 'Questions? Talk to our Sommelier')}</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="p-6 rounded-2xl bg-forest-dark border border-gold-400/20 text-center space-y-2">
          <p className="text-xs uppercase tracking-luxury text-gold-300 font-bold font-sans">
            {t('Privilégio de Envio Tiúba Reserve', 'Tiúba Reserve Shipping Privilege')}
          </p>
          <p className="text-xs text-stone-300 font-sans">
            {t(
              `Frete Cortesia para todo o Brasil em compras a partir de R$ ${settings.free_shipping_threshold.toFixed(2).replace('.', ',')}.`,
              `Complimentary shipping across Brazil on orders above R$ ${settings.free_shipping_threshold.toFixed(2).replace('.', ',')}.`
            )}
          </p>
        </div>
      </div>

      <SommelierModal
        isOpen={generalSommelierOpen}
        onClose={() => setGeneralSommelierOpen(false)}
      />
    </div>
  );
}
