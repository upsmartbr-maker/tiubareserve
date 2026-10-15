'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  Sparkles, 
  Check, 
  Crown, 
  Heart, 
  Package, 
  BookOpen, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  ChevronDown, 
  Truck, 
  Compass, 
  Star,
  Award,
  CheckCircle2,
  Gift as GiftIcon
} from 'lucide-react';

export default function ClubePage() {
  const { subscriptionPlans, currentBox, t } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // FAQ array with "Posso presentear alguém com uma assinatura?" in 2nd position
  const faqs = [
    {
      q: 'Como funciona a cobrança e o envio da minha caixa?',
      a: 'A assinatura é mensal e renovada automaticamente a cada 30 dias no cartão de crédito via Stripe ou através do PIX Recorrente mensal. Sua caixa é cuidadosamente embalada e despachada na primeira quinzena do mês, acompanhada do código de rastreamento enviado por e-mail e disponível em seu painel.'
    },
    {
      q: 'Posso presentear alguém com uma assinatura?',
      a: 'Sim! No momento do checkout, basta preencher os dados de entrega com o nome e endereço da pessoa presenteada. Enviamos a caixa em embalagem comemorativa selada com cera vegetal e uma carta sensorial de boas-vindas nominada.'
    },
    {
      q: 'Existe período de fidelidade ou multa rescisória?',
      a: 'Zero fidelidade. Você tem total controle sobre sua assinatura. A qualquer momento, com apenas um clique em sua área do assinante (/minha-conta/assinatura), você pode pausar por 1 mês ou cancelar definitivamente sem nenhum custo adicional.'
    },
    {
      q: 'Para quais idades é recomendada a revistinha "As Aventuras da Tiúba"?',
      a: 'A revistinha é concebida para crianças de 3 a 12 anos, com historinhas ilustradas envolventes para leitura em família, curiosidades da fauna amazônica, passatempos educativos, labirintos, encartes de destacar e receitas fáceis para preparar juntos sem telas.'
    },
    {
      q: 'Como funciona o Certificado e o Desconto de 15% do plano Guardião da Floresta?',
      a: 'Assinantes do plano Guardião da Floresta recebem um certificado nominado com o selo oficial e as coordenadas geográficas GPS da colmeia/meliponário preservado na Amazônia. Além disso, o desconto de 15% é aplicado automaticamente em todas as compras avulsas realizadas na Boutique do Mel da Tiúba Reserve.'
    },
    {
      q: 'Como posso alterar meu endereço ou método de pagamento?',
      a: 'Diretamente na sua Área do Assinante (/minha-conta/assinatura). Você pode atualizar o endereço de entrega ou trocar o cartão cadastrado em segundos antes do próximo ciclo de despacho.'
    }
  ];

  // Verified confidence guarantee seals
  const trustSeals = [
    { label: 'SIF / MAPA', sub: 'Inspeção Federal Oficial' },
    { label: 'Rastreabilidade por Lote', sub: 'Laudo Físico-Químico em QR Code' },
    { label: '100% Puro Melipona', sub: 'Abelha Tiúba Sem Pasteurização' },
    { label: 'Origem Amazônica Certificada', sub: 'Manejo Sustentável em Floresta Viva' },
  ];

  // Optional real testimonials (empty if none from database, preventing mock placeholders)
  const realTestimonials: { name: string; city: string; text: string; plan: string }[] = [];

  return (
    <div className="w-full min-h-screen bg-onyx-950 text-foreground overflow-x-hidden">
      
      {/* ========================================================
          1. HERO SECTION COM IMAGEM RICA E CONTRASTE WCAG AA
      ======================================================== */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-gold-400/20 overflow-hidden">
        {/* Background Atmospheric Rich Honey Bottle Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bottle.jpg"
            alt="Mel Nobre Tiúba Reserve"
            fill
            className="object-cover object-right md:object-center opacity-30 md:opacity-40 mix-blend-luminosity scale-105"
            priority
          />
          {/* Multi-layered dark vignette ensuring maximum contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090c0a] via-[#090c0a]/90 to-[#090c0a]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-transparent to-onyx-950/80" />
        </div>

        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[500px] bg-gold-400/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-amber-honey/15 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-400/40 bg-gradient-to-r from-gold-400/15 via-amber-honey/10 to-gold-400/15 shadow-[0_0_20px_rgba(223,183,67,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="text-xs uppercase tracking-luxury font-serif text-gold-300 font-bold">
                Clube de Assinatura Recorrente Tiúba Reserve
              </span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              A Amazônia viva, mês a mês, <br />
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-amber-honey bg-clip-text text-transparent">
                na mesa da sua família.
              </span>
            </h1>

            {/* Sub-headline com contraste ampliado (text-slate-200, fonte 16px+) */}
            <p className="text-base sm:text-lg text-slate-200 font-sans max-w-2xl leading-relaxed">
              Alta gastronomia com méis raros de abelha Tiúba, revistinha infantil educativa para as crianças e brindes artesanais dos produtores locais.
            </p>

            {/* Action buttons (CTA principal preenchido + secundário elegante com contorno) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#planos"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-[0_0_30px_rgba(223,183,67,0.4)] hover:shadow-[0_0_40px_rgba(223,183,67,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Assinar Agora</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#planos"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#dfb743] text-[#dfb743] hover:bg-[#dfb743]/15 font-serif text-xs uppercase tracking-luxury font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>Ver Opções de Planos a partir de R$ 99/mês</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Micro guarantees em caixa mista legível */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-slate-300 text-sm font-sans border-t border-gold-400/20 w-full max-w-3xl">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Sem fidelidade (Cancele quando quiser)</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Méis 100% Puros Certificados</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Revistinha Sem Telas para Crianças</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Apoio Direto aos Meliponicultores</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              SEÇÃO "O QUE VOCÊ RECEBE NA PRIMEIRA CAIXA" (FOTOGRÁFICO REALISTA)
          ======================================================== */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-onyx-900/95 to-onyx-950 border border-gold-400/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
                
                {/* Fotografia realista da caixa aberta unboxing */}
                <div className="w-full lg:w-1/2 flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gold-400/40 shadow-2xl group bg-onyx-950">
                    <Image
                      src="/images/clube-box-open.jpg"
                      alt="Caixa do Clube Tiúba aberta com méis, revistinha e colher em madeira nobre"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge sobreposto */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-onyx-950/90 border border-gold-400/50 backdrop-blur-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-gold-400" />
                      <span className="text-[10px] uppercase tracking-wider font-mono text-gold-300 font-bold">
                        Unboxing Real · Edição {currentBox.cycle_month} {currentBox.cycle_year}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-onyx-950/85 backdrop-blur-md border border-gold-400/20 text-center">
                      <span className="text-xs font-serif text-gold-200 font-semibold">
                        2 Frascos de Mel 150ml + Revistinha Colecionável + Colher Artesanal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Box details callout */}
                <div className="w-full lg:w-1/2 space-y-4 text-left">
                  <div className="inline-block px-3 py-1 rounded-md bg-gold-400/15 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase tracking-wider">
                    Curadoria Ativa: {currentBox.title}
                  </div>
                  
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    O que você recebe na sua primeira caixa:
                  </h3>
                  
                  <p className="text-sm sm:text-[15px] text-slate-300 font-sans leading-relaxed">
                    {currentBox.description}
                  </p>

                  <div className="space-y-3 pt-2 font-sans text-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-gold-400/20 text-gold-400 shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-foreground">Méis Raros de Abelha Tiúba (150ml cada):</strong>
                        <p className="text-slate-300 text-xs mt-0.5">Floradas rotativas exclusivas com laudo individual de pureza e rastreabilidade total.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-gold-400/20 text-gold-400 shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-foreground">Revistinha Infantil &ldquo;As Aventuras da Tiúba&rdquo;:</strong>
                        <p className="text-slate-300 text-xs mt-0.5">Tema deste mês: &ldquo;{currentBox.bee_magazine_theme}&rdquo; com passatempos educativos, labirintos e encartes destacáveis sem telas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-gold-400/20 text-gold-400 shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-foreground">Brinde Nobre do Produtor Artesanal:</strong>
                        <p className="text-slate-300 text-xs mt-0.5">{currentBox.artisan_gift_name} ({currentBox.artisan_gift_origin}).</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href="#planos"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#dfb743] text-[#dfb743] hover:bg-[#dfb743]/15 font-serif text-xs uppercase tracking-luxury font-bold transition-all"
                    >
                      <span>Ver Opções de Planos a partir de R$ 99/mês</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          BARRA HORIZONTAL DE SELOS DE CONFIANÇA & GARANTIA
      ======================================================== */}
      <section className="py-8 px-4 bg-onyx-900 border-b border-gold-400/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {trustSeals.map((seal, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center text-left">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shrink-0 text-gold-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif text-xs sm:text-sm font-bold text-foreground block">
                    {seal.label}
                  </span>
                  <span className="text-[11px] text-slate-300 font-sans block">
                    {seal.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          2. COMO FUNCIONA (3 PASSOS DIDÁTICOS)
      ======================================================== */}
      <section id="como-funciona" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Experiência Sem Complicações
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
              Como Funciona o Clube Tiúba
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-300 font-sans">
              Três passos simples para transformar o café da manhã e os momentos em família com o mel mais precioso do Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Passo 1 */}
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 relative group hover:border-gold-400/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-110 transition-transform">
                <span className="font-serif text-lg font-bold">01</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                Passo 1: Escolha seu Plano
              </h3>
              <p className="text-slate-300 font-sans text-sm leading-relaxed">
                Selecione a experiência ideal para a sua casa: desde a degustação essencial até a reserva máxima com tiragens ultralimitadas e benefícios na Boutique.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 relative group hover:border-gold-400/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-110 transition-transform">
                <span className="font-serif text-lg font-bold">02</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                Passo 2: Curadoria Mensal Exclusiva
              </h3>
              <p className="text-slate-300 font-sans text-sm leading-relaxed">
                Receba em casa uma seleção de lotes raros, a revistinha &ldquo;As Aventuras da Tiúba&rdquo; e itens artesanais dos produtores locais direto na sua porta.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 relative group hover:border-gold-400/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-110 transition-transform">
                <span className="font-serif text-lg font-bold">03</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                Passo 3: Flexibilidade Total
              </h3>
              <p className="text-slate-300 font-sans text-sm leading-relaxed">
                Sem fidelidade: pause quando for viajar, altere o plano ou cancele quando quiser diretamente pelo seu painel do assinante com apenas 1 clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. GRADE DOS 3 PLANOS (PADRONIZADA, SEM DUPLICAÇÃO, FRETE VISÍVEL)
      ======================================================== */}
      <section id="planos" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Planos de Assinatura Recorrente
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
              Escolha sua Experiência Mensal
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-300 font-sans">
              Cada caixa é montada sob medida com lotes colhidos respeitando o ciclo biológico das abelhas indígenas sem ferrão.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {subscriptionPlans.map((plan) => {
              const isPopular = plan.is_featured;
              const isLuxury = plan.slug === 'guardiao-da-floresta';
              const isEssential = plan.slug === 'nectar-essencial';

              // Unify benefits list cleanly without duplicates
              const cleanFeatures: string[] = isEssential
                ? [
                    '1 Frasco de Mel Nobre Tiúba 150ml (safra rotativa)',
                    '1 Edição da Revistinha Colecionável "As Aventuras da Tiúba"',
                    '1 Brinde Botânico (sementes melíferas nativas para plantar)',
                    'Acesso ao clube de vantagens e laudos de análise dos lotes',
                    'Pause ou cancele quando quiser sem multas nem carência'
                  ]
                : isPopular
                ? [
                    '2 Frascos de Mel de Tiúba 150ml (Amazonas + Bifloral raro)',
                    '1 Edição da Revistinha Ilustrada + Encarte de atividades destacáveis',
                    '1 Brinde Nobre do Produtor (colher dosadora em madeira nobre)',
                    'Ficha sensorial exclusiva de harmonização gastronômica com queijos',
                    'Prioridade de safra e acesso antecipado a lançamentos raros',
                    'Pause ou cancele quando quiser com apenas 1 clique'
                  ]
                : [
                    '3 Frascos de Mel (2 safras nobres + 1 lote numerado ultralimitado)',
                    'Certificado oficial de Guardião da Colmeia com coordenadas GPS',
                    '1 Edição da Revistinha Ilustrada + Minibrinde infantil colecionável',
                    '1 Brinde de Luxo (cerâmica regional amazônica ou vela de cerume puro)',
                    '15% de desconto vitalício em qualquer pedido avulso na Boutique',
                    'Frete prioritário grátis para todo o Brasil',
                    'Canal direto e consultoria VIP com Sommelier de Méis'
                  ];

              return (
                <div
                  key={plan.id}
                  className={`h-full rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-onyx-850 to-onyx-900 border-2 border-[#dfb743] shadow-[0_0_35px_rgba(223,183,67,0.3)] lg:-translate-y-3'
                      : isLuxury
                      ? 'bg-gradient-to-b from-onyx-900 to-forest-dark/50 border border-gold-400/40 shadow-xl'
                      : 'bg-onyx-900 border border-gold-400/20 shadow-lg'
                  }`}
                >
                  {/* Badge for Featured Plan */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-honey text-onyx-950 font-serif text-[11px] font-bold uppercase tracking-luxury shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-onyx-950 fill-current" />
                        <span>{plan.badge}</span>
                      </span>
                    </div>
                  )}

                  {/* Top & Content */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans mt-1">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Preço e Regra de Frete Visível */}
                    <div className="border-y border-gold-400/20 py-4 space-y-1.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-mono text-stone-400">R$</span>
                        <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-300">
                          {plan.price.toFixed(0)}
                        </span>
                        <span className="text-xs text-slate-300 font-sans">/mês</span>
                      </div>

                      {/* Regra de Frete explícita */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <Truck className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isEssential 
                            ? 'Frete fixo nacional subsidiado (R$ 19)' 
                            : 'Frete incluso para todo o Brasil'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-sans pt-1">
                        <GiftIcon className="w-3 h-3 text-gold-400 shrink-0" />
                        <span>Disponível também para presentear</span>
                      </div>
                    </div>

                    {/* Lista limpa e desduplicada de benefícios */}
                    <div className="space-y-3 font-sans text-sm">
                      <span className="text-xs uppercase tracking-wider text-gold-400 font-mono font-bold block">
                        Experiência Inclusa no Ciclo:
                      </span>
                      {cleanFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                          <span className="text-slate-200 leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Ação Travado na Base (Alinhamento uniforme) */}
                  <div className="pt-8 mt-auto">
                    <Link
                      href={`/checkout/assinatura?plano=${plan.slug}`}
                      className={`w-full py-4 px-6 rounded-full font-serif font-bold text-xs uppercase tracking-luxury transition-all flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 shadow-[0_0_20px_rgba(223,183,67,0.4)] hover:shadow-[0_0_30px_rgba(223,183,67,0.6)] hover:scale-105 active:scale-95'
                          : 'border border-gold-400/40 bg-onyx-850 hover:bg-gold-400 hover:text-onyx-950 text-gold-300 hover:border-gold-400'
                      }`}
                    >
                      <span>Assinar {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SEÇÃO INFANTIL / CONEXÃO SEM TELAS (COM CAPA REALISTA DA REVISTINHA)
      ======================================================== */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15 bg-gradient-to-b from-onyx-950 via-forest-dark/30 to-onyx-950 relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            
            {/* Mockup Vertical Colorido e Refinado da Capa da Revistinha */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] rounded-3xl overflow-hidden p-1 border border-gold-400/40 bg-gradient-to-b from-onyx-850 to-onyx-950 shadow-2xl shadow-gold-400/15 group">
                <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                  <Image
                    src="/images/clube-revista-cover.jpg"
                    alt="Capa da Revistinha As Aventuras da Tiúba com Tiubinha e Curumim Cauã"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge da Edição */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-onyx-950/90 border border-gold-400/50 backdrop-blur-md">
                    <span className="text-[10px] font-mono font-bold text-gold-300 uppercase">
                      Edição #{currentBox.bee_magazine_edition} · 100% Sem Telas
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-onyx-950/85 backdrop-blur-md border border-gold-400/25">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gold-400 font-bold block">
                      Personagens Principais
                    </span>
                    <p className="font-serif text-xs font-semibold text-foreground mt-0.5">
                      Tiubinha (a abelhinha operária) & Curumim Cauã
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição Educativa e Valor Familiar */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-serif uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Para Nossos Pequenos Guardiões</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Educação Ecológica & Conexão Sem Telas.
              </h2>

              <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
                Acreditamos que a preservação da Amazônia começa na infância. Todo mês, sua família recebe uma edição física exclusiva de <strong>&ldquo;As Aventuras da Tiúba&rdquo;</strong>, projetada por pedagogos e biólogos para estimular a leitura longe de celulares e tablets.
              </p>

              <div className="space-y-4 font-sans text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground">Histórias com Propósito:</strong>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Narrativas que ensinam sobre as abelhas nativas sem ferrão, os rios voadores e a flora amazônica.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground">Atividades Práticas em Família:</strong>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Desenhos para colorir, jogos dos 7 erros, desafios ecológicos e sementes melíferas para plantar em vasos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground">Memórias Afetivas:</strong>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Um momento especial de degustação gastronômica enquanto os pais leem com os filhos.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#planos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury transition-all"
                >
                  <span>Garantir a Revistinha na Minha Caixa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SEÇÃO DE DEPOIMENTOS (CONDICIONAL: APENAS DADOS REAIS)
      ======================================================== */}
      {realTestimonials.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-luxury font-serif text-gold-400 font-bold">
                Depoimentos Reais
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                O que dizem nossos assinantes
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {realTestimonials.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-3">
                  <p className="text-sm text-slate-200 italic font-serif">&ldquo;{t.text}&rdquo;</p>
                  <div className="pt-2 border-t border-gold-400/10">
                    <span className="font-bold text-xs text-foreground block">{t.name}</span>
                    <span className="text-[11px] text-stone-400">{t.city} · {t.plan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          5. FAQ DO CLUBE COM REPOSICIONAMENTO DE PERGUNTA DE PRESENTE
      ======================================================== */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Tire Todas as Dúvidas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Perguntas Frequentes
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-300 font-sans">
              Transparência absoluta para você desfrutar do melhor do mel nativo brasileiro.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-onyx-900 border border-gold-400/20 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-onyx-850/50 transition-colors"
                  >
                    <span className="font-serif text-sm sm:text-base font-bold text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gold-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-200 font-sans leading-relaxed border-t border-gold-400/10 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-onyx-900/60 border border-gold-400/20 text-center space-y-3">
            <p className="text-sm text-slate-300 font-sans">
              Precisa de ajuda personalizada ou deseja assinar para empresas e eventos corporativos?
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-luxury text-gold-400 hover:text-gold-300 font-bold"
            >
              <span>Fale com o nosso Sommelier via WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. BOTTOM CTA BANNER
      ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-gradient-to-b from-onyx-950 to-forest-dark/50">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-400/40 p-0.5 bg-onyx-950 mx-auto">
            <Image
              src="/images/logo.png"
              alt="TIÚBA RESERVE"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Viva a Experiência Tiúba Reserve.
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
            Junte-se a apreciadores da alta gastronomia e defensores da biodiversidade amazônica. Cancele ou pause quando desejar.
          </p>
          <div className="pt-2">
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-[0_0_30px_rgba(223,183,67,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-onyx-950" />
              <span>Assinar Agora com Frete Incluso</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
