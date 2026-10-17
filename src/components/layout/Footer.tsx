'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  Instagram, 
  Facebook, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Download,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const { settings, t } = useStore();

  return (
    <footer className="w-full bg-onyx-950 border-t border-gold-400/20 pt-16 pb-12 relative overflow-hidden text-stone-300">
      {/* Subtle background forest radial glow */}
      <div className="absolute inset-0 bg-forest-glow pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-400/40 p-0.5 bg-onyx-900">
                <Image
                  src={settings.logo_url || '/images/logo.png'}
                  alt="TIÚBA RESERVE"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="font-serif tracking-monumental text-lg font-bold text-foreground">
                TIÚBA RESERVE
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              {t(
                'A máxima expressão do mel nobre da abelha nativa Tiúba (Melipona fasciculata). Colhido de forma sustentável nas copas intocadas do Bioma Amazônia com pureza botânica inegociável.',
                'The supreme expression of noble honey from native Tiúba bees (Melipona fasciculata). Sustainably wild-harvested across untouched Amazonian canopies with uncompromising botanical purity.'
              )}
            </p>
            <div className="pt-2">
              <a
                href="/docs/catalogo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 border border-gold-400/30 px-3 py-1.5 rounded bg-gold-400/5 hover:bg-gold-400/10 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('Baixar Catálogo em PDF', 'Download PDF Catalog')}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-luxury uppercase text-gold-300 font-semibold border-b border-gold-400/20 pb-2">
              {t('Navegação & Coleções', 'Navigation & Collections')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/produtos" className="hover:text-gold-400 transition-colors">
                  {t('Nossos 4 Méis Exclusivos', 'Our 4 Exclusive Honeys')}
                </Link>
              </li>
              <li>
                <Link href="/loja" className="hover:text-gold-400 transition-colors">
                  {t('Boutique & Compra Rápida', 'Boutique & Quick Purchase')}
                </Link>
              </li>
              <li>
                <Link href="/clube" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <span>✦ Clube de Assinatura Tiúba</span>
                </Link>
              </li>
              <li>
                <Link href="/minha-conta/assinatura" className="hover:text-gold-400 transition-colors">
                  {t('Área do Assinante', 'Subscriber Portal')}
                </Link>
              </li>
              <li>
                <Link href="/rastreio" className="hover:text-gold-400 transition-colors">
                  {t('Rastreabilidade de Lote & Laudos', 'Batch Traceability & Lab Reports')}
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-gold-400 transition-colors">
                  {t('Consultoria com Sommelier', 'Honey Sommelier Advisory')}
                </Link>
              </li>
              <li>
                <Link href="/afiliados" className="text-gold-400/90 hover:text-gold-300 transition-colors flex items-center gap-1.5 font-medium py-1">
                  <span>✦ Programa de Embaixadores & Afiliados</span>
                </Link>
              </li>
            </ul>

            {/* Acesso Restrito (Discreto e separado) */}
            <div className="pt-4 border-t border-white/5">
              <Link 
                href="/admin/login" 
                className="text-stone-600 hover:text-stone-400 text-xs transition-colors inline-flex items-center gap-1.5"
                title="Área Administrativa"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>{t('Acesso Restrito', 'Restricted Access')}</span>
              </Link>
            </div>
          </div>

          {/* Column 3: Institutional & Legal Editable Data */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-luxury uppercase text-gold-300 font-semibold border-b border-gold-400/20 pb-2">
              {t('Atendimento & Localização', 'Customer Care & Address')}
            </h4>
            <div className="space-y-3 text-sm text-stone-300 leading-relaxed font-sans">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>contato@tiubareserve.com.br</span>
              </p>
              <p className="pt-1 text-xs text-stone-400 font-mono">
                CNPJ: {settings.cnpj}
              </p>
            </div>
          </div>

          {/* Column 4: Social Media & Sommelier WhatsApp */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-luxury uppercase text-gold-300 font-semibold border-b border-gold-400/20 pb-2">
              {t('Conexão & Redes', 'Connect & Follow')}
            </h4>
            <p className="text-sm text-stone-300 leading-relaxed">
              {t(
                'Acompanhe as expedições amazônicas e o registro das floradas sazonais no nosso canal oficial.',
                'Follow our Amazonian expeditions and documentation of seasonal blooms on our official channels.'
              )}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-onyx-850 border border-gold-400/30 flex items-center justify-center text-gold-400 hover:border-gold-400 hover:bg-gold-400/10 hover:scale-110 transition-all shadow-md"
                  aria-label="Siga-nos no Instagram da Tiúba Reserve"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-onyx-850 border border-gold-400/30 flex items-center justify-center text-gold-400 hover:border-gold-400 hover:bg-gold-400/10 hover:scale-110 transition-all shadow-md"
                  aria-label="Curta nossa página no Facebook da Tiúba Reserve"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-onyx-850 border border-gold-400/30 flex items-center justify-center text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/15 hover:scale-110 transition-all shadow-md"
                  aria-label="Converse conosco pelo WhatsApp do Sommelier Tiúba Reserve"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Sommelier Highlight Badge */}
            <div className="p-3.5 rounded-xl bg-onyx-850 border border-gold-400/25 mt-3">
              <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold block mb-1">
                {t('Sommelier Exclusivo', 'Exclusive Sommelier')}
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {t('Atendimento sob medida para enotecas e alta gastronomia.', 'Bespoke advisory for wine cellars and fine gastronomy.')}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Policies and Copyright Bar */}
        <div className="border-t border-gold-400/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-300 font-sans">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/termos" className="min-h-[44px] flex items-center hover:text-gold-400 transition-colors">
              {t('Termos e Condições', 'Terms & Conditions')}
            </Link>
            <span className="text-stone-500">·</span>
            <Link href="/privacidade" className="min-h-[44px] flex items-center hover:text-gold-400 transition-colors">
              {t('Política de Privacidade (LGPD)', 'Privacy Policy')}
            </Link>
            <span className="text-stone-500">·</span>
            <Link href="/cookies" className="min-h-[44px] flex items-center hover:text-gold-400 transition-colors">
              {t('Política de Cookies', 'Cookies Policy')}
            </Link>
            <span className="text-stone-500">·</span>
            <Link href="/trocas" className="min-h-[44px] flex items-center hover:text-gold-400 transition-colors">
              {t('Trocas e Devoluções', 'Returns & Exchanges')}
            </Link>
          </div>

          <div className="text-center md:text-right text-stone-400 text-xs">
            <span>{settings.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
