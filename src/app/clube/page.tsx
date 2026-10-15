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
  HelpCircle, 
  ChevronDown, 
  Truck, 
  Calendar, 
  RefreshCw,
  Award,
  Compass,
  Star,
  Users
} from 'lucide-react';

export default function ClubePage() {
  const { subscriptionPlans, currentBox, t } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona a cobrança e o envio da minha caixa?',
      a: 'A assinatura é mensal e renovada automaticamente a cada 30 dias no cartão de crédito via Stripe ou através do PIX Recorrente mensal. Sua caixa é cuidadosamente embalada e despachada na primeira quinzena do mês, acompanhada do código de rastreamento enviado por e-mail e disponível em seu painel.'
    },
    {
      q: 'Existe período de fidelidade ou multa rescisória?',
      a: 'Zero fidelidade. Você tem total controle sobre sua assinatura. A qualquer momento, com apenas um clique em sua área do assinante (/minha-conta/assinatura), você pode pausar por 1 mês ou cancelar definitivamente sem nenhum custo adicional.'
    },
    {
      q: 'Para quais idades é recomendada a revistinha "As Aventuras da Tiúba"?',
      a: 'A revistinha é concebida para crianças de 3 a 12 anos, com historinhas ilustradas envolventes para leitura em família, curiosidades da fauna amazônica, passatempos educativos, labirintos, encartes de destacar e receitas fáceis para preparar juntos.'
    },
    {
      q: 'Como funciona o Certificado e o Desconto de 15% do plano Guardião da Floresta?',
      a: 'Assinantes do plano Guardião da Floresta recebem um certificado nominado com o selo oficial e as coordenadas geográficas GPS da colmeia/meliponário preservado na Amazônia. Além disso, o desconto de 15% é aplicado automaticamente em todas as compras avulsas realizadas na Boutique do Mel da Tiúba Reserve.'
    },
    {
      q: 'Como posso alterar meu endereço ou método de pagamento?',
      a: 'Diretamente na sua Área do Assinante (/minha-conta/assinatura). Você pode atualizar o endereço de entrega ou trocar o cartão cadastrado em segundos antes do próximo ciclo de despacho.'
    },
    {
      q: 'Posso presentear alguém com uma assinatura?',
      a: 'Sim! No momento do checkout, basta preencher os dados de entrega com o nome e endereço do presenteado. Enviamos uma embalagem comemorativa selada e uma carta sensorial de boas-vindas.'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-onyx-950 text-foreground overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-gold-400/20 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-honey/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-dark/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-400/40 bg-gradient-to-r from-gold-400/15 via-amber-honey/10 to-gold-400/15 shadow-[0_0_20px_rgba(223,183,67,0.2)] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-300 font-bold">
                Clube de Assinatura Recorrente Tiúba Reserve
              </span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              A Amazônia viva, mês a mês, <br />
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-amber-honey bg-clip-text text-transparent">
                na mesa da sua família.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-stone-300 font-sans max-w-2xl leading-relaxed">
              Alta gastronomia com méis raros de abelha Tiúba, revistinha infantil educativa para as crianças e brindes artesanais dos produtores locais.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <a
                href="#planos"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-[0_0_30px_rgba(223,183,67,0.4)] hover:shadow-[0_0_40px_rgba(223,183,67,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Escolher Meu Plano</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#como-funciona"
                className="w-full sm:w-auto px-7 py-4 rounded-full border border-gold-400/30 bg-onyx-900/80 hover:bg-onyx-850 text-gold-300 font-serif text-xs uppercase tracking-luxury hover:border-gold-400/60 transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-gold-400" />
                <span>Como Funciona o Clube</span>
              </a>
            </div>

            {/* Micro guarantees */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-stone-400 text-xs font-sans border-t border-gold-400/15 w-full max-w-3xl">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400" />
                <span>Sem fidelidade (Cancele quando quiser)</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400" />
                <span>Méis 100% Puros Certificados</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400" />
                <span>Revistinha Sem Telas p/ Crianças</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-gold-400" />
                <span>Apoio Direto aos Meliponicultores</span>
              </div>
            </div>

          </div>

          {/* LUXURY BOX MOCKUP VISUAL */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-onyx-900/90 to-onyx-950 border border-gold-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
              {/* Gold border accent ribbon */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
                
                {/* Visual Representation of Box Contents */}
                <div className="w-full lg:w-1/2 flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] max-w-md rounded-2xl bg-gradient-to-tr from-onyx-950 via-forest-dark/50 to-onyx-900 border border-gold-400/30 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    {/* Simulated Luxury Open Box Preview */}
                    <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-amber-honey/15 rounded-full blur-2xl" />
                    
                    <div className="flex items-center justify-between border-b border-gold-400/20 pb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gold-400" />
                        <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-300 font-bold">
                          Caixa do Mês Aberta
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        {currentBox.cycle_month} {currentBox.cycle_year}
                      </span>
                    </div>

                    {/* Rendered 3 key contents */}
                    <div className="grid grid-cols-3 gap-3 my-4 items-end">
                      {/* 1. Honey Jars */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-onyx-900/90 border border-gold-400/20">
                        <div className="w-12 h-16 relative bg-gradient-to-b from-amber-honey/30 to-amber-deep/40 rounded-lg border border-gold-400/40 flex items-center justify-center mb-1 shadow-inner">
                          <span className="text-[9px] font-serif font-bold text-gold-200">150ml</span>
                        </div>
                        <span className="text-[10px] font-sans font-medium text-stone-200 leading-tight">
                          2 Frascos Mel Tiúba
                        </span>
                      </div>

                      {/* 2. Comic Magazine */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-onyx-900/90 border border-gold-400/20 scale-105 shadow-gold">
                        <div className="w-14 h-18 relative bg-gradient-to-br from-emerald-900/50 via-gold-500/20 to-onyx-900 rounded-lg border border-gold-400/50 flex flex-col items-center justify-center p-1 mb-1">
                          <BookOpen className="w-5 h-5 text-gold-400 mb-1" />
                          <span className="text-[8px] font-serif font-bold text-gold-300 uppercase leading-none">
                            Revistinha
                          </span>
                        </div>
                        <span className="text-[10px] font-sans font-medium text-gold-300 leading-tight">
                          As Aventuras da Tiúba
                        </span>
                      </div>

                      {/* 3. Artisan Gift */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-onyx-900/90 border border-gold-400/20">
                        <div className="w-12 h-16 relative bg-gradient-to-t from-stone-800 to-amber-900/40 rounded-lg border border-gold-400/30 flex items-center justify-center mb-1">
                          <Gift className="w-5 h-5 text-gold-400" />
                        </div>
                        <span className="text-[10px] font-sans font-medium text-stone-200 leading-tight">
                          Brinde Artesanal
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gold-400/10 flex items-center justify-between text-[10px] text-stone-400 font-sans">
                      <span>✓ Embalagem térmica ecológica</span>
                      <span className="text-gold-400 font-bold">Lote Raro</span>
                    </div>
                  </div>
                </div>

                {/* Box details callout */}
                <div className="w-full lg:w-1/2 space-y-4 text-left">
                  <div className="inline-block px-3 py-1 rounded-md bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[11px] font-mono uppercase tracking-wider">
                    Curadoria Ativa: {currentBox.title}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    O que você recebe na sua primeira caixa:
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                    {currentBox.description}
                  </p>

                  <div className="space-y-2.5 pt-2 font-sans text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-full bg-gold-400/20 text-gold-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-foreground">Méis de Abelha Tiúba (150ml cada):</strong>
                        <p className="text-stone-400 text-[11px]">Floradas selecionadas com laudo de pureza e rastreabilidade total.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-full bg-gold-400/20 text-gold-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-foreground">Revistinha Infantil Colecionável:</strong>
                        <p className="text-stone-400 text-[11px]">Tema deste mês: &ldquo;{currentBox.bee_magazine_theme}&rdquo; com passatempos e histórias ecológicas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-full bg-gold-400/20 text-gold-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-foreground">Brinde Exclusivo do Produtor:</strong>
                        <p className="text-stone-400 text-[11px]">{currentBox.artisan_gift_name} ({currentBox.artisan_gift_origin}).</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href="#planos"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-serif font-bold text-gold-400 hover:text-gold-300 underline underline-offset-4"
                    >
                      <span>Ver opções de planos a partir de R$ 99/mês</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. COMO FUNCIONA (3 PASSOS) */}
      <section id="como-funciona" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Experiência Sem Complicações
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
              Como Funciona o Clube Tiúba
            </h2>
            <p className="text-sm text-stone-400 font-sans">
              Três passos simples para transformar o café da manhã e os momentos em família com o mel mais precioso do Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 relative group hover:border-gold-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="font-serif text-xl font-bold">01</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                Passo 1: Escolha seu Plano
              </h3>
              <p className="text-stone-300 font-sans text-xs sm:text-sm leading-relaxed">
                Selecione a experiência ideal para a sua casa: desde a degustação essencial até a reserva máxima com tiragens ultralimitadas e benefícios na Boutique.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 relative group hover:border-gold-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="font-serif text-xl font-bold">02</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                Passo 2: Curadoria Mensal Exclusiva
              </h3>
              <p className="text-stone-300 font-sans text-xs sm:text-sm leading-relaxed">
                Receba em casa uma seleção de lotes raros, a revistinha &ldquo;As Aventuras da Tiúba&rdquo; e itens artesanais dos produtores locais direto na sua porta.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 relative group hover:border-gold-400/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="font-serif text-xl font-bold">03</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                Passo 3: Flexibilidade Total
              </h3>
              <p className="text-stone-300 font-sans text-xs sm:text-sm leading-relaxed">
                Sem fidelidade: pause quando for viajar, altere o plano ou cancele quando quiser diretamente pelo seu painel do assinante com apenas 1 clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GRADE COMPARATIVA DOS 3 PLANOS */}
      <section id="planos" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15 relative">
        {/* Glow behind featured card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Planos de Assinatura Recorrente
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
              Escolha sua Experiência Mensal
            </h2>
            <p className="text-sm text-stone-300 font-sans">
              Cada caixa é montada sob medida com lotes colhidos respeitando o ciclo biológico das abelhas indígenas sem ferrão.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {subscriptionPlans.map((plan) => {
              const isPopular = plan.is_featured;
              const isLuxury = plan.slug === 'guardiao-da-floresta';

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-onyx-850 to-onyx-900 border-2 border-[#dfb743] shadow-[0_0_35px_rgba(223,183,67,0.3)] lg:-translate-y-4'
                      : isLuxury
                      ? 'bg-gradient-to-b from-onyx-900 to-forest-dark/40 border border-gold-400/35 hover:border-gold-400/60 shadow-xl'
                      : 'bg-onyx-900 border border-gold-400/20 hover:border-gold-400/40 shadow-lg'
                  }`}
                >
                  {/* Badge for Featured Plan */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-honey text-onyx-950 font-serif text-[11px] font-bold uppercase tracking-luxury shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-onyx-950 fill-current" />
                        <span>{plan.badge}</span>
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-stone-400 font-sans mt-1">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="border-y border-gold-400/15 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-mono text-stone-400">R$</span>
                        <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-300">
                          {plan.price.toFixed(0)}
                        </span>
                        <span className="text-xs text-stone-400 font-sans">/mês</span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-sans mt-1">
                        Cobrança recorrente mensal · Cancele quando quiser
                      </p>
                    </div>

                    {/* Main contents highlight */}
                    <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/20 space-y-2.5 text-xs font-sans">
                      <div className="flex items-start gap-2 text-foreground">
                        <Package className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{plan.honey_desc}</span>
                      </div>
                      <div className="flex items-start gap-2 text-foreground">
                        <BookOpen className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{plan.magazine_desc}</span>
                      </div>
                      <div className="flex items-start gap-2 text-foreground">
                        <Gift className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{plan.artisan_gift_desc}</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-3 font-sans text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono font-bold block">
                        Benefícios Inclusos:
                      </span>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                          <span className="text-stone-300 leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Exclusive perks for luxury tier */}
                    {plan.exclusive_perks && (
                      <div className="pt-2 border-t border-gold-400/15 space-y-2 font-sans text-xs">
                        <span className="text-[10px] uppercase tracking-wider text-amber-honey font-mono font-bold block">
                          ✦ Privilégios Guardião:
                        </span>
                        {plan.exclusive_perks.map((perk, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-gold-300/90 text-[11px]">
                            <Star className="w-3 h-3 text-gold-400 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA subscribe button */}
                  <div className="pt-8">
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

      {/* 4. SEÇÃO "PARA NOSSOS PEQUENOS" (A REVISTINHA INFANTIL) */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15 bg-gradient-to-b from-onyx-950 via-forest-dark/30 to-onyx-950 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Visual presentation of the comic magazine */}
            <div className="w-full lg:w-1/2">
              <div className="relative p-8 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between border-b border-gold-400/20 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gold-400" />
                    <span className="font-serif text-sm font-bold text-foreground uppercase tracking-luxury">
                      Revistinha Infantil Mensal
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-400/15 text-gold-300 text-[10px] font-mono font-bold">
                    100% Sem Telas
                  </span>
                </div>

                {/* Cover Preview Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-leaf/30 via-onyx-950 to-onyx-900 border border-gold-400/25 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gold-300/80 font-mono">
                    <span>Edição #{currentBox.bee_magazine_edition}</span>
                    <span>Colecionável</span>
                  </div>
                  
                  <h4 className="font-serif text-2xl font-bold text-gold-300">
                    &ldquo;{currentBox.bee_magazine_theme}&rdquo;
                  </h4>
                  
                  <p className="text-xs text-stone-300 font-sans leading-relaxed">
                    Acompanhe as aventuras da abelha Tiubinha pela imensidão da copa amazônica, ensinando como a polinização protege a floresta e alimenta o planeta.
                  </p>

                  {/* Character Cards */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono font-bold block mb-2">
                      Conheça os Personagens:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {currentBox.magazine_characters.map((char, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-onyx-900/90 border border-gold-400/15 text-center">
                          <Heart className="w-3.5 h-3.5 text-gold-400 mx-auto mb-1" />
                          <span className="text-[11px] font-sans font-semibold text-stone-200 block">
                            {char}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 font-sans">
                  <span>✓ Passatempos & labirintos</span>
                  <span>✓ Encarte destacável</span>
                  <span>✓ Receita saudável sem açúcar</span>
                </div>
              </div>
            </div>

            {/* Description & educational value */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-serif uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Para Nossos Pequenos Guardiões</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Educação Ecológica & Conexão Sem Telas.
              </h2>

              <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
                Acreditamos que a preservação da Amazônia começa na infância. Todo mês, sua família recebe uma edição física exclusiva de <strong>&ldquo;As Aventuras da Tiúba&rdquo;</strong>, projetada por pedagogos e biólogos para estimular a leitura longe de celulares e tablets.
              </p>

              <div className="space-y-4 font-sans text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground">Histórias com Propósito:</strong>
                    <p className="text-stone-400 text-xs mt-0.5">Narrativas que ensinam sobre as abelhas nativas sem ferrão, os rios voadores e os povos tradicionais.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground">Atividades Práticas em Família:</strong>
                    <p className="text-stone-400 text-xs mt-0.5">Desenhos para colorir, jogos dos 7 erros, desafios ecológicos e sementes melíferas para plantar em vasos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground">Memórias Afetivas:</strong>
                    <p className="text-stone-400 text-xs mt-0.5">Um momento especial de degustação gastronômica enquanto os pais leem com os filhos.</p>
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

      {/* 5. FAQ DO CLUBE */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-gold-400/15">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Tire Todas as Dúvidas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-stone-400 font-sans">
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
                    <div className="px-6 pb-6 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed border-t border-gold-400/10 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-onyx-900/60 border border-gold-400/20 text-center space-y-3">
            <p className="text-xs text-stone-400 font-sans">
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

      {/* 6. BOTTOM CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-gradient-to-b from-onyx-950 to-forest-dark/50">
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
          <p className="text-sm text-stone-300 font-sans leading-relaxed">
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
