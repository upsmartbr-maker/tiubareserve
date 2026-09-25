'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  const { settings } = useStore();

  return (
    <div className="w-full pb-24 pt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-stone-300 font-sans">
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400 hover:text-gold-300">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Início</span>
      </Link>

      <div className="border-b border-gold-400/20 pb-4">
        <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans block mb-1">
          Documento Oficial
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Termos e Condições Gerais de Uso e Compra
        </h1>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">1. Identificação da Empresa</h2>
          <p>
            A plataforma <strong>TIÚBA RESERVE</strong> é operada sob a razão social TIÚBA RESERVE BRASIL LTDA., inscrita no CNPJ sob o nº {settings.cnpj}, com sede em {settings.address}.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">2. Natureza Artesanal e Sazonal do Produto</h2>
          <p>
            Os méis da abelha Tiúba (<em>Melipona fasciculata</em>) são produtos de colheita natural, sazonal e limitada. Por se tratar de um mel cru e vivo, sem pasteurização ou adição de conservantes artificiais, cada lote pode apresentar sutis variações naturais de coloração, aroma, acidez e densidade, determinadas pelas condições climáticas e pelas floradas visitadas pelas abelhas nativas no Bioma Amazônia.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">3. Preços e Formas de Pagamento</h2>
          <p>
            Todos os valores apresentados na Boutique virtual estão em Reais (BRL). Aceitamos pagamentos via PIX Direto com confirmação imediata, bem como cartões de crédito internacionais processados por gateways certificados (Stripe e Mercado Pago).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-foreground">4. Entrega e Logística Especializada</h2>
          <p>
            Os frascos colecionáveis de 150ml são acondicionados em embalagens térmicas e anti-impacto. Para a capital de São Paulo e Grande SP cadastrada, disponibilizamos o serviço de entrega expressa via Motoboy com monitoramento.
          </p>
        </section>
      </div>
    </div>
  );
}
