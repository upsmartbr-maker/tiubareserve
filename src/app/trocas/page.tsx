'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ExchangesPage() {
  return (
    <div className="w-full pb-24 pt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-stone-300 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400 hover:text-gold-300">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Início</span>
      </Link>

      <div className="border-b border-gold-400/20 pb-4">
        <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans block mb-1">
          Garantia de Qualidade
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Política de Trocas, Devoluções e Reembolso
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Direito de Arrependimento</h2>
          <p>
            Em conformidade com o Código de Defesa do Consumidor (Artigo 49), o cliente tem até 7 (sete) dias corridos após o recebimento do pedido para solicitar a devolução por arrependimento, desde que o produto permaneça com o lacre vegetal e a embalagem original intactos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Avarias de Transporte</h2>
          <p>
            Caso ocorra qualquer dano ao frasco durante o trajeto logístico, envie uma fotografia do pacote recebido para o nosso WhatsApp de suporte ou para contato@tiubareserve.com.br em até 48 horas. Enviaremos imediatamente um novo frasco sem qualquer custo adicional para você.
          </p>
        </section>
      </div>
    </div>
  );
}
