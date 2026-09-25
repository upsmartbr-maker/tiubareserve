'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  ShieldCheck, 
  Search, 
  FlaskConical, 
  MapPin, 
  Calendar, 
  User, 
  FileCheck, 
  Sparkles, 
  Download,
  AlertCircle
} from 'lucide-react';

function TraceabilityContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get('codigo') || '';
  const { getLotByCode, lots, t } = useStore();

  const [searchCode, setSearchCode] = useState(initialCode);
  const [activeLot, setActiveLot] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearchCode(initialCode);
    } else {
      handleSearchCode('TR-BF-001');
    }
  }, [initialCode]);

  const handleSearchCode = (code: string) => {
    const lot = getLotByCode(code);
    setActiveLot(lot || null);
    setSearchCode(code);
    setSearched(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      handleSearchCode(searchCode.trim());
    }
  };

  return (
    <div className="w-full pb-24 space-y-16">
      {/* Header Banner */}
      <section className="relative w-full py-16 bg-gradient-to-b from-onyx-950 via-forest-dark to-onyx-950 border-b border-gold-400/20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-onyx-950 text-gold-300 text-[10px] font-sans uppercase tracking-widest font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('Certificação de Origem & Laudo Laboratorial', 'Origin Certification & Lab Report')}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Rastreabilidade de Lote
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            {t(
              'Cada frasco Tiúba Reserve possui um código gravado no lacre que conecta você diretamente à história do produtor, safra, florada e laudo físico-químico oficial.',
              'Each Tiúba Reserve flask features an authentic batch code stamped on the seal, linking you directly to the producer, harvest date, flora, and official chemical analysis.'
            )}
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-6">
            <form onSubmit={handleFormSubmit} className="flex gap-2 p-1.5 rounded-2xl bg-onyx-900 border border-gold-400/40 shadow-2xl">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder={t('Ex.: TR-BF-001, AM-2026-001, TR-TD-001', 'E.g.: TR-BF-001, AM-2026-001, TR-TD-001')}
                className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm text-foreground font-mono uppercase tracking-wider focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-gold-400/20"
              >
                <Search className="w-4 h-4" />
                <span>{t('Consultar', 'Inspect')}</span>
              </button>
            </form>

            {/* Quick Test Codes */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px] text-stone-400 font-sans">
              <span>{t('Lotes disponíveis para teste rápido:', 'Available sample batches:')}</span>
              {lots.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSearchCode(l.code)}
                  className="px-2 py-0.5 rounded border border-gold-400/20 bg-onyx-900/60 font-mono text-gold-300 hover:border-gold-400 transition-colors"
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lot Details Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeLot ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-10">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
              <div>
                <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans">
                  {t('Certidão de Autenticidade Registrada', 'Registered Authenticity Certificate')}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  {activeLot.product_name}
                </h2>
                <p className="font-mono text-xs text-gold-300 mt-1">
                  LOTE NÚMERO: <strong className="text-foreground">{activeLot.code}</strong> · SAFRA: {activeLot.harvest_year}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full font-mono font-semibold flex items-center gap-1.5">
                  <CheckCircleIcon />
                  <span>{t('Lote Aprovado em Laboratório', 'Lab Certified & Approved')}</span>
                </span>
              </div>
            </div>

            {/* Grid of Origin & Botanical specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Origem Territorial</span>
                </div>
                <p className="text-xs text-stone-200 font-sans font-semibold">
                  {activeLot.region}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Produtor / Guardião</span>
                </div>
                <p className="text-xs text-stone-200 font-sans font-semibold">
                  {activeLot.producer_name}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Data de Envase</span>
                </div>
                <p className="text-xs text-stone-200 font-sans font-semibold">
                  {activeLot.bottle_date}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <FileCheck className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Certidão / Laudo Nº</span>
                </div>
                <p className="text-xs text-stone-200 font-mono font-semibold">
                  {activeLot.lab_cert_number}
                </p>
              </div>
            </div>

            {/* Floral source and purity statement */}
            <div className="p-6 rounded-2xl bg-onyx-950 border border-gold-400/20 space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>{t('Perfil Floral e Comprovação Melissopalinológica', 'Floral Profile & Melissopalynological Proof')}</span>
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {activeLot.floral_source}
              </p>
              <div className="p-3.5 rounded-xl bg-forest-dark border border-gold-400/20 text-xs text-gold-200 font-sans">
                ✓ <strong>Garantia de Pureza:</strong> {activeLot.purity_guarantee}
              </div>
            </div>

            {/* Physical-chemical indicators & Lab Certificate Download */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/15">
                  <span className="text-[10px] uppercase text-stone-400 font-bold block">Umidade Natural</span>
                  <span className="font-serif text-lg font-bold text-gold-300 font-mono">{activeLot.moisture_rate}</span>
                </div>
                <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/15">
                  <span className="text-[10px] uppercase text-stone-400 font-bold block">Acidez Livre</span>
                  <span className="font-serif text-lg font-bold text-gold-300 font-mono">{activeLot.acidity_level}</span>
                </div>
                <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/15">
                  <span className="text-[10px] uppercase text-stone-400 font-bold block">Abelha Produtora</span>
                  <span className="font-serif text-xs font-bold text-stone-200 italic">Melipona fasciculata</span>
                </div>
              </div>

              {/* Lab Certificate Preview link */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-onyx-950 border border-gold-400/30 flex flex-col items-center justify-center text-center space-y-3">
                <FileCheck className="w-10 h-10 text-gold-400" />
                <div>
                  <span className="font-serif text-sm font-bold text-foreground block">
                    {t('Certidão Laboratorial Digital', 'Digital Laboratory Certificate')}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {t('Documento autenticado com laudo de pureza microbiológica.', 'Authenticated document with microbiological purity report.')}
                  </span>
                </div>
                <a
                  href={activeLot.lab_analysis_url || '/images/certidao.png'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-gold-400/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('Ver Certidão em Alta Resolução', 'View High-Res Certificate')}</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          searched && (
            <div className="p-12 rounded-3xl bg-onyx-900 border border-red-500/20 text-center space-y-4 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-foreground">
                {t('Lote não localizado no registro', 'Batch not found in registry')}
              </h3>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                {t(
                  'Verifique se os caracteres foram digitados corretamente como constam no selo do frasco (exemplo: TR-BF-001). Para auxílio de lote antigo ou sob encomenda, consulte nosso Sommelier.',
                  'Ensure the code was typed correctly as printed on the flask seal (e.g. TR-BF-001). For vintage batches, please contact our Sommelier.'
                )}
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gold-400/30 text-gold-300 font-serif text-xs uppercase tracking-wider hover:bg-gold-400/10"
              >
                <span>{t('Falar com o Suporte ao Cliente', 'Contact Customer Support')}</span>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function TraceabilityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center text-xs font-mono text-gold-300">
        Carregando rastreabilidade do lote...
      </div>
    }>
      <TraceabilityContent />
    </Suspense>
  );
}
