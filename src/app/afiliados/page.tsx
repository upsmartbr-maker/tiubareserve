'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Share2, 
  Percent, 
  HeartHandshake, 
  CheckCircle2, 
  ChevronRight,
  Crown
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AffiliatesProgramLandingPage() {
  const { t } = useStore();

  const benefits = [
    {
      title: 'Comissão Nobre de 10%',
      desc: 'Receba comissão líquida de 10% sobre todas as vendas geradas através do seu código ou link exclusivo de divulgação.',
      icon: TrendingUp,
    },
    {
      title: '5% de Desconto aos Seguidores',
      desc: 'Seu público e convidados ganham 5% de desconto automático em qualquer safra da Boutique do Mel Tiúba Reserve.',
      icon: Percent,
    },
    {
      title: 'Pagamentos Pontuais via PIX',
      desc: 'Transparência total no extrato. Acompanhe suas vendas e receba suas comissões aprovadas diretamente em sua chave PIX.',
      icon: CheckCircle2,
    },
    {
      title: 'Rastreabilidade & Alta Pureza',
      desc: 'Indique um superalimento da Amazônia com laudo laboratorial, botânica certificada e embalagens de alta sofisticação.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-onyx-950 py-16 px-4 sm:px-6 lg:px-8 text-foreground font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-onyx-900 to-onyx-950 border border-gold-400/30 p-8 sm:p-14 text-center space-y-8 overflow-hidden shadow-2xl shadow-black/80">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-gold-400" />
            <span>Aliança Nobre · Programa de Embaixadores & Afiliados</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Torne-se um Embaixador do <span className="gold-text">Mel Nobre de Tiúba</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Seja a voz que conecta amantes da alta gastronomia, sommeliers e entusiastas da biodiversidade amazônica ao mel mais raro do Brasil. Monetize sua influência com comissões de até 12%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/afiliados/painel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-gold-400/20"
            >
              <span>Acessar Painel do Afiliado</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/5511999988888?text=Olá! Gostaria de me inscrever no Programa de Embaixadores da Tiúba Reserve."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-onyx-900 border border-gold-400/30 hover:border-gold-400 text-gold-300 text-xs font-serif font-bold uppercase tracking-wider transition-all"
            >
              <span>Solicitar Convite VIP</span>
              <Share2 className="w-4 h-4 text-gold-400" />
            </a>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold">
              Privilégios da Parceria
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Por que divulgar a TIÚBA RESERVE?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-onyx-900/80 border border-gold-400/20 space-y-4 hover:border-gold-400/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">
                    {b.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="p-8 sm:p-12 rounded-3xl bg-onyx-900 border border-gold-400/20 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold">
              Passo a Passo Simples
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Como funciona o programa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <span className="font-serif text-4xl font-bold text-gold-400/40">01</span>
              <h4 className="font-serif text-lg font-bold text-foreground">Receba seu Código Exclusivo</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Você recebe um cupom personalizado (ex: <strong className="text-gold-300">CHEFANA</strong>) e um link direto que grava a indicação por 30 dias na navegação do cliente.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-4xl font-bold text-gold-400/40">02</span>
              <h4 className="font-serif text-lg font-bold text-foreground">Compartilhe com sua Audiência</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Indique receitas, harmonizações, histórias das abelhas sem ferrão ou publique o link no WhatsApp, stories, bio e reviews gastronômicos.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-4xl font-bold text-gold-400/40">03</span>
              <h4 className="font-serif text-lg font-bold text-foreground">Monetize em Tempo Real</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                A cada pedido faturado, sua comissão de 10% é creditada no painel e transferida via PIX diretamente para sua conta cadastrada.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 text-center">
            <Link
              href="/afiliados/painel"
              className="inline-flex items-center gap-2 text-xs font-serif font-bold text-gold-400 hover:text-gold-300 uppercase tracking-wider"
            >
              <span>Acessar Meu Painel de Afiliado Agora</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
