'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Droplet, 
  Layers, 
  Award,
  Search,
  ExternalLink
} from 'lucide-react';
import ProductCard from '@/components/boutique/ProductCard';

export default function HomePage() {
  const { products, t } = useStore();

  return (
    <div className="w-full flex flex-col space-y-24 sm:space-y-32 pb-24">
      {/* ========================================================
          1. HERO SECTION: CINEMATOGRAPHIC PRESENTATION
      ======================================================== */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Ambient atmospheric layers */}
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-amber-honey/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-forest-leaf/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Monumental Typography & Manifesto */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-400/30 bg-onyx-900/80 backdrop-blur-md shadow-gold">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                <span className="text-[10px] sm:text-xs font-sans tracking-luxury uppercase text-gold-300 font-semibold">
                  Made in Brazil · Amazon Biome · Export Grade
                </span>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <span className="block font-serif text-sm sm:text-base tracking-monumental text-gold-400 uppercase">
                  {t('O Néctar Ancestral da Amazônia', 'The Ancestral Amazonian Nectar')}
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08]">
                  TIÚBA <span className="gold-text">RESERVE</span>
                </h1>
                <p className="font-serif text-lg sm:text-xl text-stone-300 italic max-w-xl font-light">
                  {t(
                    'Mel nobre da abelha nativa sem ferrão Tiúba (Melipona fasciculata). A expressão máxima de flora, território e tempo.',
                    'Noble honey from the stingless Tiúba bee (Melipona fasciculata). The purest synthesis of flora, territory, and time.'
                  )}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans max-w-xl">
                {t(
                  'Colhido artesanalmente nas copas preservadas da floresta primária, cada frasco de 150ml traduz a safra limitada de 1 a 2 litros anuais por colônia. Uma iguaria viva, fluida e com perfil bioativo insuperável.',
                  'Artisanally harvested across pristine canopies of primary rainforest, each 150ml bottle reflects an ultra-scarce yield of 1 to 2 liters per colony each year. A living gastronomic jewel of unmatched bioactivity.'
                )}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/loja"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-honey text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-gold-glow hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-onyx-950" />
                  <span>{t('Explorar Boutique do Mel', 'Explore Honey Boutique')}</span>
                  <ArrowRight className="w-4 h-4 text-onyx-950" />
                </Link>

                <Link
                  href="/produtos"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-gold-400/30 bg-onyx-900/60 hover:bg-onyx-850 hover:border-gold-400 text-gold-300 font-serif text-xs uppercase tracking-wider transition-all"
                >
                  <span>{t('Nossos 4 Méis Exclusivos', 'Our 4 Exclusive Honeys')}</span>
                </Link>
              </div>

              {/* Key Highlights Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gold-400/15">
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold gold-text block">1 - 2 L</span>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider font-sans">
                    {t('Safra Anual / Colmeia', 'Annual Harvest / Hive')}
                  </span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-300 block">100%</span>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider font-sans">
                    {t('Sem Pasteurização', 'Raw & Unheated')}
                  </span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-300 block">0 Ferrão</span>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider font-sans">
                    {t('Abelha Nativa Brasileira', 'Native Stingless Bee')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: High Jewelry Product Flacon Rendering */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden p-1 border border-gold-400/40 bg-gradient-to-b from-onyx-850 to-onyx-950 shadow-2xl shadow-gold-400/10 group">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                  <Image
                    src="/images/hero-bottle.jpg"
                    alt="Frasco de 150ml TIÚBA RESERVE"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Accent Label */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-onyx-950/85 backdrop-blur-md border border-gold-400/30">
                    <span className="text-[10px] font-sans tracking-luxury uppercase text-gold-400 font-bold block">
                      Grand Cru · Safra 2026
                    </span>
                    <p className="font-serif text-sm font-semibold text-foreground">
                      Frasco Colecionador 150ml
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {t('Fechamento hermético e rastreabilidade por QR Code.', 'Airtight sealing with individual batch QR Code.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. STORYTELLING BOTÂNICO: A ABELHA E A FLORESTA
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-onyx-900 via-onyx-850 to-forest-deep border border-gold-400/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
                {t('A Alma da Espécie', 'The Soul of the Species')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Tiúba: A Guardiã Alada das Copas Amazônicas
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                {t(
                  'A abelha Tiúba (Melipona compressipes fasciculata) é uma das espécies mais reverenciadas das matas de transição e do Bioma Amazônia. Sem ferrão, dócil e adaptada à exuberância vegetal das copas altas, a Tiúba poliniza árvores gigantescas e cipós raros inacessíveis a outras abelhas.',
                  'The Tiúba bee (Melipona compressipes fasciculata) is one of the most venerated species of the Amazonian canopy. Stingless, docile, and evolved alongside ancient high-canopy flora, Tiúba pollinates monumental trees and rare forest lianas inaccessible to common bees.'
                )}
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center shrink-0 mt-0.5 text-gold-400">
                    <Droplet className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-stone-300">
                    <strong className="text-gold-300 font-serif">{t('Fluidez Natural Elevada:', 'High Natural Liquidity:')}</strong>{' '}
                    {t(
                      'Diferente do mel convencional de Apis mellifera, o mel de Tiúba possui umidade natural de 24 a 26%, resultando em textura leve, delicada e refrescante.',
                      'Unlike conventional Apis honey, Tiúba honey carries a natural moisture of 24 to 26%, yielding an ethereal, silky and refreshing mouthfeel.'
                    )}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center shrink-0 mt-0.5 text-gold-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-stone-300">
                    <strong className="text-gold-300 font-serif">{t('Acidez Viva e Cítrica:', 'Crisp Mineral Acidity:')}</strong>{' '}
                    {t(
                      'O néctar fermenta suavemente nos potes de cerume da colmeia, desenvolvendo um perfil ácido naturalmente elegante que corta a doçura excessiva.',
                      'Gentle maturation inside pure cerumen pots develops a naturally elegant acidity (pH ~3.7) that elevates gastronomic sophistication.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold-400/30">
                <Image
                  src="/images/products/tradicional-1.jpg"
                  alt="Meliponário sustentável Tiúba Reserve"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold-400/30 mt-6">
                <Image
                  src="/images/products/bifloral-1.jpg"
                  alt="Colheita nobre de mel de Tiúba"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. BIOATIVIDADE BRASILEIRA™: O MANIFESTO
      ======================================================== */}
      <section className="relative w-full py-16 bg-forest-dark border-y border-gold-400/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-onyx-950 text-gold-300 text-[10px] font-sans uppercase tracking-widest font-semibold">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span>Bioatividade Brasileira™ · Ciência & Natureza</span>
          </div>

          <blockquote className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-snug">
            “O que se forma na colmeia <span className="gold-text">não se encerra no frasco</span>. Continua no organismo.”
          </blockquote>

          <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mx-auto leading-relaxed font-sans">
            {t(
              'O mel da abelha Tiúba não é submetido a calor térmico ou processos de ultrafiltragem industrial. Cada lote preserva integralmente suas enzimas ativas (diastase, invertase), compostos fenólicos com alto poder antioxidante e probióticos naturais da floresta, atuando como um potente regenerador celular e elixir imunológico.',
              'Tiúba honey is never subjected to thermal heat or industrial microfiltration. Every batch preserves raw living enzymes, polyphenols with immense antioxidant capacity, and native forest probiotics that support systemic cellular wellness.'
            )}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-left">
            <div className="p-4 rounded-xl bg-onyx-900 border border-gold-400/15">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Compostos Fenólicos</span>
              <span className="font-serif text-lg font-bold text-foreground">Até 124 mg GAE</span>
              <p className="text-[10px] text-stone-400 mt-1">Defesa antioxidante contra radicais livres.</p>
            </div>
            <div className="p-4 rounded-xl bg-onyx-900 border border-gold-400/15">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Índice HMF</span>
              <span className="font-serif text-lg font-bold text-emerald-400">&lt; 3.0 mg/kg</span>
              <p className="text-[10px] text-stone-400 mt-1">Frescor microbiológico de colheita recente.</p>
            </div>
            <div className="p-4 rounded-xl bg-onyx-900 border border-gold-400/15">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Enzimas Vivas</span>
              <span className="font-serif text-lg font-bold text-foreground">100% Preservadas</span>
              <p className="text-[10px] text-stone-400 mt-1">Sem pasteurização, do favo ao frasco.</p>
            </div>
            <div className="p-4 rounded-xl bg-onyx-900 border border-gold-400/15">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Origem Florestal</span>
              <span className="font-serif text-lg font-bold text-foreground">Amazônia Viva</span>
              <p className="text-[10px] text-stone-400 mt-1">Bioma protegido e comunidades parceiras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. COLEÇÃO EXCLUSIVA: OS 4 PRODUTOS
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
            {t('A Linha de Méis', 'The Honey Line')}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
            A Coleção Tiúba Reserve
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto font-sans">
            {t(
              'Quatro expressões inimitáveis do bioma amazônico. Escolha a sua safra ou presenteie com uma joia da meliponicultura brasileira.',
              'Four inimitable expressions of the Amazon biome. Choose your harvest or gift a true jewel of Brazilian meliponiculture.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-gold-400 hover:text-gold-300 border-b border-gold-400/40 pb-1 transition-colors"
          >
            <span>{t('Comparar Perfil Sensorial e Tabela Nutricional Completa', 'Compare Sensory Profiles & Complete Nutritional Data')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          5. RASTREABILIDADE DE LOTE CALLOUT
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-onyx-900 border border-gold-400/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase tracking-luxury font-bold font-sans">
                {t('Rastreabilidade Total por Frasco', 'Full Bottle Traceability')}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Já possui um frasco Tiúba Reserve?
            </h3>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              {t(
                'Digite o código do lote gravado no selo do seu frasco (ex.: TR-BF-001, AM-2026-001) para acessar a certidão de pureza laboratorial, laudo melissopalinológico e a ficha da comunidade produtora.',
                'Enter the batch code stamped on your seal (e.g., TR-BF-001, AM-2026-001) to view the laboratory purity certificate, melissopalynological report, and community background.'
              )}
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <Link
              href="/rastreio"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-400/20"
            >
              <Search className="w-4 h-4" />
              <span>{t('Rastrear Meu Lote Agora', 'Track My Batch Now')}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
