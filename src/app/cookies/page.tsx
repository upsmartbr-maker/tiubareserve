'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="w-full pb-24 pt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-stone-300 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400 hover:text-gold-300">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Início</span>
      </Link>

      <div className="border-b border-gold-400/20 pb-4">
        <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans block mb-1">
          Transparência Digital
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Política de Cookies
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita a plataforma TIÚBA RESERVE. Eles permitem memorizar suas preferências (como idioma PT/EN e itens adicionados ao carrinho de compras) para proporcionar uma navegação rápida e sem atritos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Cookies Essenciais</h2>
          <p>
            Utilizamos cookies estritamente necessários para manter sua sessão ativa durante o checkout, calcular o frete para seu CEP e registrar suas escolhas de privacidade. Você pode desativar os cookies nas configurações do seu navegador a qualquer momento.
          </p>
        </section>
      </div>
    </div>
  );
}
