'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Droplet, 
  Layers, 
  Award,
  Search,
  ExternalLink,
  Truck,
  CreditCard,
  RotateCcw,
  Gift,
  CheckCircle2,
  ChevronDown,
  Star,
  Quote,
  FileCheck,
  Check
} from 'lucide-react';
import ProductCard from '@/components/boutique/ProductCard';

export default function HomePage() {
  const { products, t } = useStore();

  // State for waitlist form
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistMessage, setWaitlistMessage] = useState('');

  // State for accessible FAQ accordion (allows toggling open state)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      setWaitlistStatus('error');
      setWaitlistMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!lgpdConsent) {
      setWaitlistStatus('error');
      setWaitlistMessage('É necessário consentir com o recebimento de notificações para prosseguir.');
      return;
    }

    setWaitlistStatus('loading');

    try {
      // TODO: Integrar com API/Supabase para persistir lead na tabela 'newsletter_leads'
      await new Promise((resolve) => setTimeout(resolve, 900));
      setWaitlistStatus('success');
      setWaitlistMessage('Prioridade confirmada! Você receberá o comunicado oficial assim que o lote for envasado.');
      setWaitlistEmail('');
      setLgpdConsent(false);
    } catch {
      setWaitlistStatus('error');
      setWaitlistMessage('Ocorreu uma instabilidade temporária. Por favor, tente novamente em alguns instantes.');
    }
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://tiubareserve.com.br/#organization',
        name: 'Tiúba Reserve',
        url: 'https://tiubareserve.com.br',
        logo: 'https://tiubareserve.com.br/images/logo.png',
        description: 'Méis nobres e raros de abelha nativa sem ferrão Tiúba (Melipona fasciculata) colhidos nas copas do Bioma Amazônia.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+55-11-3197-8800',
          contactType: 'customer service',
          areaServed: 'BR',
          availableLanguage: ['Portuguese', 'English']
        }
      },
      {
        '@type': 'ItemList',
        itemListElement: products.map((prod, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: prod.name,
            description: prod.description,
            image: prod.images?.[0] || 'https://tiubareserve.com.br/images/hero-bottle.jpg',
            sku: prod.id,
            offers: {
              '@type': 'Offer',
              price: prod.promo_price || prod.price,
              priceCurrency: 'BRL',
              availability: prod.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `https://tiubareserve.com.br/produto/${prod.slug}`
            }
          }
        }))
      }
    ]
  };

  return (
    <div className="w-full flex flex-col space-y-12 md:space-y-16 pb-16 relative bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(223,183,67,0.08),rgba(255,255,255,0))]">
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ========================================================
          1. HERO SECTION: CINEMATOGRAPHIC PRESENTATION
      ======================================================== */}
      <section className="relative w-full h-auto flex items-center justify-center overflow-hidden pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-1/4 -right-1/4 w-[450px] h-[450px] bg-amber-honey/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[450px] h-[450px] bg-forest-leaf/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Monumental Typography & Manifesto */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Badge (Standardized Portuguese) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-400/30 bg-onyx-900/90 backdrop-blur-md shadow-gold">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                <span className="text-xs font-sans tracking-luxury uppercase text-gold-300 font-semibold">
                  Origem Brasil · Bioma Amazônico · Padrão de Exportação
                </span>
              </div>

              {/* Title (Single H1 on page) */}
              <div className="space-y-2">
                <span className="block font-serif text-xs sm:text-sm tracking-monumental text-gold-400 uppercase font-semibold">
                  {t('O Néctar Ancestral da Amazônia', 'The Ancestral Amazonian Nectar')}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
                  TIÚBA <span className="gold-text">RESERVE</span>
                </h1>
                <p className="font-serif text-base sm:text-lg text-stone-200 italic max-w-xl font-light leading-relaxed">
                  {t(
                    'Mel nobre da abelha nativa sem ferrão Tiúba (Melipona fasciculata). A expressão máxima de flora, território e tempo.',
                    'Noble honey from the stingless Tiúba bee (Melipona fasciculata). The purest synthesis of flora, territory, and time.'
                  )}
                </p>
              </div>

              {/* Factual descriptive copy (No therapeutic claims) */}
              <p className="text-sm text-stone-300 leading-relaxed font-sans max-w-xl">
                {t(
                  'Colhido artesanalmente nas copas preservadas da floresta primária, cada frasco de 150ml traduz a safra limitada de 1 a 2 litros anuais por colônia. Uma iguaria viva, fluida e com composição fitoquímica natural preservada da colmeia ao frasco.',
                  'Artisanally harvested across pristine canopies of primary rainforest, each 150ml bottle reflects an ultra-scarce yield of 1 to 2 liters per colony each year. A living gastronomic jewel with naturally preserved raw botanical composition.'
                )}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/loja"
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-honey text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-gold-glow hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-onyx-950" />
                  <span>{t('Explorar Boutique do Mel', 'Explore Honey Boutique')}</span>
                  <ArrowRight className="w-4 h-4 text-onyx-950" />
                </Link>

                <Link
                  href="/produtos"
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-gold-400/30 bg-onyx-900/70 hover:bg-onyx-850 hover:border-gold-400 text-gold-300 font-serif text-xs uppercase tracking-wider transition-all"
                >
                  <span>{t('Nossos 4 Méis Exclusivos', 'Our 4 Exclusive Honeys')}</span>
                </Link>
              </div>

              {/* Key Highlights Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gold-400/15">
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold gold-text block">1 - 2 L</span>
                  <span className="text-xs text-stone-300 uppercase tracking-wider font-sans">
                    {t('Safra Anual / Colmeia', 'Annual Harvest / Hive')}
                  </span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-300 block">100%</span>
                  <span className="text-xs text-stone-300 uppercase tracking-wider font-sans">
                    {t('Sem Pasteurização', 'Raw & Unheated')}
                  </span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-gold-300 block">0 Ferrão</span>
                  <span className="text-xs text-stone-300 uppercase tracking-wider font-sans">
                    {t('Abelha Nativa Brasileira', 'Native Stingless Bee')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Flacon Rendering with Portuguese Badge */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden p-1 border border-gold-400/40 bg-gradient-to-b from-onyx-850 to-onyx-950 shadow-2xl shadow-gold-400/10 group">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                  <Image
                    src="/images/hero-bottle.jpg"
                    alt="Frasco de 150ml do mel nobre TIÚBA RESERVE em vidro âmbar com lacre termofundido"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Accent Label (Portuguese by default) */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-onyx-950/90 backdrop-blur-md border border-gold-400/30">
                    <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block">
                      Safra Especial 2026 · Frasco 150ml
                    </span>
                    <p className="font-serif text-sm font-semibold text-foreground">
                      Frasco de Colecionador Numerado
                    </p>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {t('Fechamento hermético e rastreabilidade por QR Code individual.', 'Airtight sealing with individual batch QR Code.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          2. A COLEÇÃO TIÚBA RESERVE (MOVED DIRECTLY BELOW HERO)
      ======================================================== */}
      <section id="colecao" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        <div className="text-center space-y-2.5">
          <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
            {t('A Linha de Méis', 'The Honey Line')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            A Coleção Tiúba Reserve
          </h2>
          <p className="text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            {t(
              'Quatro expressões inimitáveis do bioma amazônico. Escolha a sua safra ou presenteie com uma joia da meliponicultura brasileira.',
              'Four inimitable expressions of the Amazon biome. Choose your harvest or gift a true jewel of Brazilian meliponiculture.'
            )}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Comparison Callout Link */}
        <div className="text-center pt-1">
          <Link
            href="/produtos"
            className="min-h-[44px] inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-gold-400 hover:text-gold-300 border-b border-gold-400/40 pb-1 transition-colors"
          >
            <span>{t('Comparar Perfil Sensorial e Tabela Nutricional Completa', 'Compare Sensory Profiles & Complete Nutritional Data')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================
            FAIXA DE CONFIANÇA (4 ITENS COM ÍCONES)
        ======================================================== */}
        <div className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-7 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-xl">
            
            {/* ITEM 1 - EDITAR: Frete e Prazo */}
            <div className="flex items-start gap-3.5 p-2">
              <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center shrink-0 text-gold-400 mt-0.5">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">
                  Frete Climatizado Especializado {/* EDITAR: Título do Frete */}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  Enviamos com seguro total para todo o Brasil em embalagem térmica protetora. {/* EDITAR: Texto do Frete */}
                </p>
              </div>
            </div>

            {/* ITEM 2 - EDITAR: Pagamento */}
            <div className="flex items-start gap-3.5 p-2">
              <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center shrink-0 text-gold-400 mt-0.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">
                  Pix com Desconto ou Cartão {/* EDITAR: Título do Pagamento */}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  Pix imediato com 5% OFF ou parcele em até 6x sem juros em todos os cartões. {/* EDITAR: Texto do Pagamento */}
                </p>
              </div>
            </div>

            {/* ITEM 3 - EDITAR: Troca e Devolução */}
            <div className="flex items-start gap-3.5 p-2">
              <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center shrink-0 text-gold-400 mt-0.5">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">
                  Garantia de Satisfação {/* EDITAR: Título da Troca */}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  7 dias corridos para trocas ou devoluções com logística reversa simplificada. {/* EDITAR: Texto da Troca */}
                </p>
              </div>
            </div>

            {/* ITEM 4 - EDITAR: Embalagem para Presente */}
            <div className="flex items-start gap-3.5 p-2">
              <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center shrink-0 text-gold-400 mt-0.5">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">
                  Embalagem Nobre para Presente {/* EDITAR: Título de Presente */}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  Caixa rígida preta e dourada selada a cera, perfeita para surpreender paladares refinados. {/* EDITAR: Texto de Presente */}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          3. STORYTELLING BOTÂNICO: A ALMA DA ESPÉCIE
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-onyx-900 via-onyx-850 to-forest-deep border border-gold-400/20 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
                {t('A Alma da Espécie', 'The Soul of the Species')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Tiúba: A Guardiã Alada das Copas Amazônicas
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed font-sans">
                {t(
                  'A abelha Tiúba (Melipona compressipes fasciculata) é uma das espécies mais reverenciadas das matas de transição e do Bioma Amazônia. Sem ferrão, dócil e adaptada à exuberância vegetal das copas altas, a Tiúba poliniza árvores gigantescas e cipós raros inacessíveis a outras abelhas.',
                  'The Tiúba bee (Melipona compressipes fasciculata) is one of the most venerated species of the Amazonian canopy. Stingless, docile, and evolved alongside ancient high-canopy flora, Tiúba pollinates monumental trees and rare forest lianas inaccessible to common bees.'
                )}
              </p>
              
              <div className="space-y-4 pt-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-gold-400/15 border border-gold-400/40 flex items-center justify-center shrink-0 mt-0.5 text-gold-400 shadow-sm shadow-gold-400/10">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    <strong className="text-gold-300 font-serif text-sm block sm:inline">{t('Fluidez Natural Elevada:', 'High Natural Liquidity:')}</strong>{' '}
                    {t(
                      'Diferente do mel convencional de Apis mellifera, o mel de Tiúba possui umidade natural de 24 a 26%, resultando em textura leve, delicada e refrescante.',
                      'Unlike conventional Apis honey, Tiúba honey carries a natural moisture of 24 to 26%, yielding an ethereal, silky and refreshing mouthfeel.'
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-gold-400/15 border border-gold-400/40 flex items-center justify-center shrink-0 mt-0.5 text-gold-400 shadow-sm shadow-gold-400/10">
                    <Layers className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    <strong className="text-gold-300 font-serif text-sm block sm:inline">{t('Acidez Viva e Cítrica:', 'Crisp Mineral Acidity:')}</strong>{' '}
                    {t(
                      'O néctar fermenta suavemente nos potes de cerume da colmeia, desenvolvendo um perfil ácido naturalmente elegante que corta a doçura excessiva.',
                      'Gentle maturation inside pure cerumen pots develops a naturally elegant acidity (pH ~3.7) that elevates gastronomic sophistication.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold-400/30 shadow-md group">
                <Image
                  src="/images/products/tradicional-1.jpg"
                  alt="Meliponário sustentável nas matas amazônicas Tiúba Reserve"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold-400/30 mt-4 sm:mt-6 shadow-md group">
                <Image
                  src="/images/products/bifloral-1.jpg"
                  alt="Colheita nobre e puríssima de mel de Tiúba"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          4. BIOATIVIDADE BRASILEIRA™: O MANIFESTO (SEM ALEGAÇÕES TERAPÊUTICAS)
      ======================================================== */}
      <section className="relative w-full py-12 md:py-14 bg-forest-dark border-y border-gold-400/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-400/30 bg-onyx-950 text-gold-300 text-xs font-sans uppercase tracking-widest font-semibold">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span>Bioatividade Brasileira™ · Ciência & Natureza</span>
          </div>

          {/* Balanced quote without orphan word */}
          <blockquote className="font-serif text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold text-foreground leading-snug [text-wrap:balance] max-w-4xl mx-auto">
            “O que se forma na colmeia <span className="gold-text">não se encerra no frasco</span>. Continua no organismo.”
          </blockquote>

          {/* Factual non-promotional text */}
          <p className="text-sm text-stone-300 max-w-3xl mx-auto leading-relaxed font-sans">
            {t(
              'O mel da abelha Tiúba não é submetido a calor térmico ou processos de ultrafiltragem industrial. Cada lote preserva integralmente suas enzimas nativas (como diastase e invertase) e compostos fenólicos característicos da flora nativa, colhido cru e sem pasteurização térmica, mantendo a integridade bioquímica original do néctar florestal.',
              'Tiúba honey is never subjected to thermal heat or industrial microfiltration. Every batch preserves raw native enzymes and botanical phenolic compounds harvested raw and unpasteurized, maintaining the natural biochemical integrity of forest nectar.'
            )}
          </p>

          {/* 4 Scientific Indicators with discrete 'Ver laudo' link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-left">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">Compostos Fenólicos</span>
                <span className="font-serif text-lg font-bold text-foreground mt-0.5 block">Até 124 mg GAE</span>
                <p className="text-xs text-stone-300 mt-1.5 leading-snug">
                  Perfil fitoquímico com alta concentração de polifenóis botânicos.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-gold-400/10">
                <Link
                  href="/rastreio"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-mono underline underline-offset-4"
                  title="Consultar laudo laboratorial de polifenóis"
                >
                  <span>Ver laudo laboratorial</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">Índice HMF</span>
                <span className="font-serif text-lg font-bold text-emerald-400 mt-0.5 block">&lt; 3.0 mg/kg</span>
                <p className="text-xs text-stone-300 mt-1.5 leading-snug">
                  Frescor microbiológico garantido e ausência de degradação térmica.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-gold-400/10">
                <Link
                  href="/rastreio"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-mono underline underline-offset-4"
                  title="Consultar laudo laboratorial de HMF"
                >
                  <span>Ver laudo laboratorial</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">Enzimas Nativas</span>
                <span className="font-serif text-lg font-bold text-foreground mt-0.5 block">100% Preservadas</span>
                <p className="text-xs text-stone-300 mt-1.5 leading-snug">
                  Sem pasteurização nem calor, mantendo a bioatividade viva do favo.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-gold-400/10">
                <Link
                  href="/rastreio"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-mono underline underline-offset-4"
                  title="Consultar análise enzimática"
                >
                  <span>Ver laudo laboratorial</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">Origem Florestal</span>
                <span className="font-serif text-lg font-bold text-foreground mt-0.5 block">Amazônia Viva</span>
                <p className="text-xs text-stone-300 mt-1.5 leading-snug">
                  Manejo botânico sustentável com meliponicultores tradicionais.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-gold-400/10">
                <Link
                  href="/rastreio"
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-mono underline underline-offset-4"
                  title="Consultar certidão de origem florestal"
                >
                  <span>Ver certidão de origem</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          5. BLOCO EXPLICATIVO DO CLUBE TIÚBA (ASSINATURA)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-onyx-900 via-onyx-850 to-forest-dark border-2 border-gold-400/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-300 text-xs font-mono uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Experiência por Assinatura Exclusiva</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Clube Tiúba: Acesso Garantido às Safras Mais Raras {/* EDITAR: Título do Clube */}
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto">
              Como as abelhas Tiúba produzem volumes estritamente limitados, membros do Clube têm prioridade vitalícia de safra e recebem em casa seleções rotativas acompanhadas de itens colecionáveis. {/* EDITAR: Descrição do Clube */}
            </p>

            {/* 3 Benefícios do Clube */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
              
              {/* Benefício 1 */}
              <div className="p-5 rounded-2xl bg-onyx-950/80 border border-gold-400/20 space-y-2">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center font-bold font-serif text-sm">
                  1
                </div>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Curadoria Rotativa Mensal {/* EDITAR: Benefício 1 Título */}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  2 frascos de méis nobres com floradas alternadas (Amazonas, Bifloral e Multifloral) com laudo de pureza. {/* EDITAR: Benefício 1 Texto */}
                </p>
              </div>

              {/* Benefício 2 */}
              <div className="p-5 rounded-2xl bg-onyx-950/80 border border-gold-400/20 space-y-2">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center font-bold font-serif text-sm">
                  2
                </div>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Revistinha & Brindes Nobres {/* EDITAR: Benefício 2 Título */}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Edição colecionável da revistinha infantil &ldquo;As Aventuras da Tiúba&rdquo; e brinde artesanal em madeira. {/* EDITAR: Benefício 2 Texto */}
                </p>
              </div>

              {/* Benefício 3 */}
              <div className="p-5 rounded-2xl bg-onyx-950/80 border border-gold-400/20 space-y-2">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center font-bold font-serif text-sm">
                  3
                </div>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Flexibilidade & Frete Grátis {/* EDITAR: Benefício 3 Título */}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Envios mensais ou bimestrais com frete seguro incluso. Pause, troque ou cancele quando quiser sem multas. {/* EDITAR: Benefício 3 Texto */}
                </p>
              </div>

            </div>

            {/* Frequência e CTA */}
            <div className="pt-6 space-y-3">
              <p className="text-xs font-mono text-gold-300 uppercase tracking-widest">
                Frequência: Planos Mensais e Bimestrais · A partir de R$ 99/mês {/* EDITAR: Frequência */}
              </p>
              <div className="flex justify-center">
                <Link
                  href="/clube"
                  className="min-h-[44px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-lg shadow-gold-400/25 hover:shadow-[0_0_25px_rgba(223,183,67,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Conhecer os Planos do Clube Tiúba</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          6. PROVA SOCIAL ("QUEM JÁ PROVOU"): DEPOIMENTOS, IMPRENSA E SELOS
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 w-full">
        <div className="text-center space-y-2.5">
          <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
            {t('Reconhecimento & Crítica', 'Recognition & Reviews')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Quem Já Provou Tiúba Reserve {/* EDITAR: Título Prova Social */}
          </h2>
          <p className="text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            A opinião de sommeliers renomados, chefs de alta gastronomia e colecionadores que apreciam a singularidade do mel nativo brasileiro.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 - EDITAR */}
          <div className="p-6 sm:p-7 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between shadow-xl relative">
            <Quote className="w-8 h-8 text-gold-400/20 absolute top-5 right-5" />
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-300 italic font-sans leading-relaxed">
                &ldquo;A acidez viva e a fluidez do mel de Tiúba transformaram o serviço de sobremesas autorais do nosso restaurante. Um ingrediente de terroir amazônico que não encontra paralelo no mundo.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gold-400/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center font-serif text-gold-300 font-bold text-sm">
                HS
              </div>
              <div>
                <strong className="block text-sm font-serif font-bold text-foreground">Chef Helena Sampaio</strong>
                <span className="text-xs text-stone-400 font-sans">Restaurante Estrela Michelin, São Paulo</span>
              </div>
            </div>
          </div>

          {/* Card 2 - EDITAR */}
          <div className="p-6 sm:p-7 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between shadow-xl relative">
            <Quote className="w-8 h-8 text-gold-400/20 absolute top-5 right-5" />
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-300 italic font-sans leading-relaxed">
                &ldquo;O meliponário e a pureza botânica do Tiúba Reserve rivalizam sensorialmente com os maiores Grand Crus. A rastreabilidade por lote com certidão de laboratório dá segurança incomparável.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gold-400/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center font-serif text-gold-300 font-bold text-sm">
                MV
              </div>
              <div>
                <strong className="block text-sm font-serif font-bold text-foreground">Dr. Marcos Vinícius</strong>
                <span className="text-xs text-stone-400 font-sans">Sommelier e Pesquisador Botânico, Curitiba</span>
              </div>
            </div>
          </div>

          {/* Card 3 - EDITAR */}
          <div className="p-6 sm:p-7 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col justify-between shadow-xl relative">
            <Quote className="w-8 h-8 text-gold-400/20 absolute top-5 right-5" />
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-300 italic font-sans leading-relaxed">
                &ldquo;O unboxing do Clube Tiúba é um espetáculo. Meus filhos adoram ler a revistinha da abelhinha enquanto provamos os méis com queijos curados no café da manhã. Virou um ritual sagrado.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-gold-400/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center font-serif text-gold-300 font-bold text-sm">
                BA
              </div>
              <div>
                <strong className="block text-sm font-serif font-bold text-foreground">Beatriz Alencar</strong>
                <span className="text-xs text-stone-400 font-sans">Membro Guardiã do Clube Tiúba, Rio de Janeiro</span>
              </div>
            </div>
          </div>

        </div>

        {/* Linha de Menções de Imprensa e Parceiros (Placeholders Editáveis) */}
        <div className="pt-4 border-t border-gold-400/10">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-mono text-center block mb-4">
            Destaque na Crítica Especializada & Parceiros Gastronômicos {/* EDITAR: Cabeçalho Imprensa */}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-stone-300 text-sm font-serif uppercase tracking-wider font-semibold opacity-80">
            <span className="hover:text-gold-300 transition-colors">Gastronomia & Estilo</span> {/* EDITAR: Parceiro 1 */}
            <span className="text-gold-400/40">✦</span>
            <span className="hover:text-gold-300 transition-colors">Revista Forbes Brasil</span> {/* EDITAR: Parceiro 2 */}
            <span className="text-gold-400/40">✦</span>
            <span className="hover:text-gold-300 transition-colors">Guia Alta Gastronomia</span> {/* EDITAR: Parceiro 3 */}
            <span className="text-gold-400/40">✦</span>
            <span className="hover:text-gold-300 transition-colors">Amazônia Sustentável</span> {/* EDITAR: Parceiro 4 */}
          </div>
        </div>

        {/* Linha de Selos e Certificações (Placeholders Editáveis) */}
        <div className="pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            
            <div className="p-3 rounded-xl bg-onyx-950/60 border border-gold-400/15 flex items-center justify-center gap-2 text-xs text-stone-300 font-sans">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Origem 100% Rastreada</span> {/* EDITAR: Selo 1 */}
            </div>

            <div className="p-3 rounded-xl bg-onyx-950/60 border border-gold-400/15 flex items-center justify-center gap-2 text-xs text-stone-300 font-sans">
              <FileCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Laudo Melissopalinológico</span> {/* EDITAR: Selo 2 */}
            </div>

            <div className="p-3 rounded-xl bg-onyx-950/60 border border-gold-400/15 flex items-center justify-center gap-2 text-xs text-stone-300 font-sans">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Manejo Não Destrutivo</span> {/* EDITAR: Selo 3 */}
            </div>

            <div className="p-3 rounded-xl bg-onyx-950/60 border border-gold-400/15 flex items-center justify-center gap-2 text-xs text-stone-300 font-sans">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Sem Aditivos ou Açúcar</span> {/* EDITAR: Selo 4 */}
            </div>

          </div>
        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          7. RASTREABILIDADE DE LOTE COM MOCKUP VISUAL EM HTML/CSS
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Callout and instructions */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-gold-400 justify-center lg:justify-start">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs uppercase tracking-luxury font-bold font-sans">
                  {t('Rastreabilidade Total por Frasco', 'Full Bottle Traceability')}
                </span>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Já Possui um Frasco Tiúba Reserve?
              </h2>

              <p className="text-sm text-stone-300 font-sans leading-relaxed">
                {t(
                  'Digite o código do lote gravado no selo térmico do seu frasco (ex.: TR-BF-001, AM-2026-001) para acessar a certidão de pureza laboratorial, laudo melissopalinológico com as espécies botânicas polinizadas e as coordenadas geográficas da colheita.',
                  'Enter the batch code stamped on your seal (e.g., TR-BF-001, AM-2026-001) to view the laboratory purity certificate, melissopalynological report, and harvest coordinates.'
                )}
              </p>

              <div className="pt-2 flex justify-center lg:justify-start">
                <Link
                  href="/rastreio"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-400/20 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('Rastrear Meu Lote Agora', 'Track My Batch Now')}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive HTML/CSS Mockup of What Customer Sees */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-onyx-950 border border-gold-400/30 p-5 sm:p-6 shadow-2xl relative font-sans text-xs">
                {/* Header of Mockup Card */}
                <div className="flex items-center justify-between border-b border-gold-400/20 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-gold-300 uppercase tracking-widest font-bold">
                      Certidão de Lote Autenticada
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-gold-400/15 border border-gold-400/30 text-gold-400 font-mono font-bold">
                    LOTE: TR-BF-001
                  </span>
                </div>

                {/* Mockup Data Rows */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-stone-400">Espécie Produtora:</span>
                    <span className="text-foreground font-serif font-semibold">Melipona fasciculata (Tiúba)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-stone-400">Origem & Coordenadas:</span>
                    <span className="text-foreground font-mono">Reserva Tapajós · 02°25′S 54°42′W</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-stone-400">Umidade Natural:</span>
                    <span className="text-emerald-400 font-mono font-bold">24.6% (Ideal de Safra)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-stone-400">Índice HMF em Laboratório:</span>
                    <span className="text-emerald-400 font-mono font-bold">1.8 mg/kg (Ultra-Fresco)</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-400">Floradas Mapeadas:</span>
                    <span className="text-gold-300 text-right font-medium">Castanheira-do-Pará & Cipó-Uva</span>
                  </div>
                </div>

                {/* Mockup Bottom Ribbon */}
                <div className="mt-4 pt-3 border-t border-gold-400/20 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>Autenticação Criptográfica SHA-256</span>
                  <span className="text-emerald-400">✓ Laudo Verificado</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          8. LISTA DE ESPERA DA PRÓXIMA SAFRA (CAPTURA DE E-MAIL COM LGPD)
      ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-onyx-900 to-onyx-950 border border-gold-400/25 shadow-2xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Safras Limitadas & Numeradas</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Lista de Espera da Próxima Safra
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            Como cada colônia de Tiúba produz apenas 1 a 2 litros anuais, algumas floradas esgotam em poucos dias. Inscreva-se para receber aviso antecipado antes da abertura pública.
          </p>

          {/* Form */}
          <form onSubmit={handleWaitlistSubmit} className="max-w-lg mx-auto space-y-4 text-left">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                placeholder="Seu melhor e-mail (ex: ana@exemplo.com)"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-onyx-950 border border-gold-400/30 text-foreground placeholder:text-stone-500 focus:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400 outline-none text-sm font-sans"
              />
              <button
                type="submit"
                disabled={waitlistStatus === 'loading'}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap active:scale-95"
              >
                {waitlistStatus === 'loading' ? 'Registrando...' : 'Garantir Prioridade'}
              </button>
            </div>

            {/* LGPD Consent Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gold-400/40 text-gold-400 focus:ring-gold-400 bg-onyx-950"
              />
              <span className="text-xs text-stone-400 leading-snug">
                Concordo em receber comunicados sobre safras exclusivas e notificações da Tiúba Reserve em conformidade com a LGPD e a nossa{' '}
                <Link href="/privacidade" className="text-gold-400 underline underline-offset-2">Política de Privacidade</Link>.
              </span>
            </label>

            {/* Feedback Message */}
            {waitlistStatus === 'success' && (
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{waitlistMessage}</span>
              </div>
            )}

            {waitlistStatus === 'error' && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/30 text-red-300 text-xs">
                {waitlistMessage}
              </div>
            )}
          </form>

        </div>
      </section>

      {/* Visual Transition Divider */}
      <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#dfb743]/30 to-transparent" />

      {/* ========================================================
          9. FAQ (ACCORDION ACESSÍVEL COM 6 PERGUNTAS E RESPOSTAS)
      ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
            {t('Dúvidas Frequentes', 'Frequently Asked Questions')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Perguntas Frequentes sobre o Mel Tiúba
          </h2>
          <p className="text-sm text-stone-300 max-w-lg mx-auto font-sans leading-relaxed">
            Respostas claras e factuais sobre o manejo, conservação e características das nossas safras.
          </p>
        </div>

        <div className="space-y-3 font-sans">
          
          {/* FAQ 1 */}
          <div className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all">
            <button
              onClick={() => toggleFaq(0)}
              className="w-full min-h-[44px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-foreground font-serif text-base sm:text-lg font-bold hover:text-gold-300 transition-colors"
              aria-expanded={openFaqIndex === 0}
            >
              <span>Qual é o prazo de entrega e como funciona o frete?</span> {/* EDITAR: Pergunta 1 */}
              <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-200 ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
            </button>
            {openFaqIndex === 0 && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 leading-relaxed border-t border-gold-400/10">
                Os pedidos são despachados em até 24 horas úteis a partir de centros climatizados. O prazo varia de 2 a 5 dias úteis para capitais e de 4 a 8 dias úteis para demais localidades, com rastreamento postal e seguro total incluso contra avarias. {/* EDITAR: Resposta 1 */}
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all">
            <button
              onClick={() => toggleFaq(1)}
              className="w-full min-h-[44px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-foreground font-serif text-base sm:text-lg font-bold hover:text-gold-300 transition-colors"
              aria-expanded={openFaqIndex === 1}
            >
              <span>Como devo conservar o mel de Tiúba após aberto?</span> {/* EDITAR: Pergunta 2 */}
              <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-200 ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
            </button>
            {openFaqIndex === 1 && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 leading-relaxed border-t border-gold-400/10">
                Por se tratar de um mel cru com umidade natural em torno de 24% a 26%, recomendamos mantê-lo sob refrigeração (4°C a 10°C) após aberto para preservar seu frescor, suas notas aromáticas florais e desacelerar a fermentação natural. {/* EDITAR: Resposta 2 */}
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full min-h-[44px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-foreground font-serif text-base sm:text-lg font-bold hover:text-gold-300 transition-colors"
              aria-expanded={openFaqIndex === 2}
            >
              <span>Por que o mel cristaliza ou pode fermentar suavemente?</span> {/* EDITAR: Pergunta 3 */}
              <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-200 ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
            </button>
            {openFaqIndex === 2 && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 leading-relaxed border-t border-gold-400/10">
                A cristalização e a leve liberação de gás são processos naturais de méis não pasteurizados. O mel de abelhas nativas contém leveduras e enzimas vivas que mantêm o produto em constante evolução sensorial, conferindo notas ácidas gastronômicas desejadas. {/* EDITAR: Resposta 3 */}
              </div>
            )}
          </div>

          {/* FAQ 4 */}
          <div className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full min-h-[44px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-foreground font-serif text-base sm:text-lg font-bold hover:text-gold-300 transition-colors"
              aria-expanded={openFaqIndex === 3}
            >
              <span>Qual é a diferença entre o mel de Tiúba e o mel de Apis mellifera?</span> {/* EDITAR: Pergunta 4 */}
              <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-200 ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
            </button>
            {openFaqIndex === 3 && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 leading-relaxed border-t border-gold-400/10">
                A Tiúba é uma abelha indígena brasileira sem ferrão. Seu mel é significativamente mais fluido, com teor de umidade naturalmente superior e marcante acidez cítrica e mineral (pH ~3.8), enquanto o mel de Apis é mais denso, viscoso e puramente doce. {/* EDITAR: Resposta 4 */}
              </div>
            )}
          </div>

          {/* FAQ 5 */}
          <div className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all">
            <button
              onClick={() => toggleFaq(4)}
              className="w-full min-h-[44px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-foreground font-serif text-base sm:text-lg font-bold hover:text-gold-300 transition-colors"
              aria-expanded={openFaqIndex === 4}
            >
              <span>O que significa mel &ldquo;sem pasteurização&rdquo;?</span> {/* EDITAR: Pergunta 5 */}
              <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-200 ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
            </button>
            {openFaqIndex === 4 && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 leading-relaxed border-t border-gold-400/10">
                Significa que o mel não foi aquecido a altas temperaturas industriais para padronização. Todo o conteúdo biológico, vitaminas, aroma das floradas e atividade enzimática chegam intactos ao consumidor, assim como saem dos potes de cerume da colmeia. {/* EDITAR: Resposta 5 */}
              </div>
            )}
          </div>

          {/* FAQ 6 */}
          <div className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all">
            <button
              onClick={() => toggleFaq(5)}
              className="w-full min-h-[44px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-foreground font-serif text-base sm:text-lg font-bold hover:text-gold-300 transition-colors"
              aria-expanded={openFaqIndex === 5}
            >
              <span>Como rastrear e consultar o laudo do meu lote?</span> {/* EDITAR: Pergunta 6 */}
              <ChevronDown className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-200 ${openFaqIndex === 5 ? 'rotate-180' : ''}`} />
            </button>
            {openFaqIndex === 5 && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-300 leading-relaxed border-t border-gold-400/10">
                Basta escanear o QR Code impresso no lacre do frasco ou acessar a página de Rastreio em nosso site e digitar o código alfanumérico (ex.: TR-BF-001) para baixar o PDF do laudo laboratorial autenticado. {/* EDITAR: Resposta 6 */}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
