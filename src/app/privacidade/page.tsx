'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const { settings } = useStore();

  return (
    <div className="w-full pb-24 pt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-stone-300 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400 hover:text-gold-300">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Início</span>
      </Link>

      <div className="border-b border-gold-400/20 pb-4">
        <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans block mb-1">
          Segurança & LGPD
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Política de Privacidade e Proteção de Dados
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Compromisso com a Privacidade</h2>
          <p>
            A <strong>TIÚBA RESERVE</strong> preza pela segurança, confidencialidade e integridade dos dados pessoais de todos os seus clientes e apreciadores. Esta política foi estruturada em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Dados Coletados e Finalidade</h2>
          <p>
            Coletamos apenas os dados indispensáveis para o processamento da sua compra, envio logístico com seguro (nome completo, endereço de entrega, telefone e e-mail) e emissão de notas fiscais. Não comercializamos nem compartilhamos seus dados com terceiros para fins de publicidade.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Criptografia e Armazenamento</h2>
          <p>
            Todas as transações e comunicações em nossa plataforma contam com criptografia TLS de 256 bits. Informações financeiras confidenciais (números de cartão de crédito) são transmitidas diretamente aos processadores autorizados (Stripe e Mercado Pago), não ficando armazenadas em nossos servidores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Encarregado de Proteção de Dados (DPO)</h2>
          <p>
            Para exercer seus direitos de confirmação de tratamento, acesso, correção ou eliminação de dados pessoais, contate nosso time pelo e-mail: <strong>privacidade@tiubareserve.com.br</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
