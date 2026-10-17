'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Search,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, lang, setLang, t, currentUser, isAdmin, settings } = useStore();
  const { openCart, totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayCartCount = totalCount > 0 ? totalCount : cartCount;

  const navLinks = [
    { href: '/', label: t('Home', 'Home') },
    { href: '/produtos', label: t('Nossos Produtos', 'Our Products') },
    { href: '/loja', label: t('Boutique do Mel', 'Honey Boutique') },
    { href: '/rastreio', label: t('Rastreio', 'Traceability') },
    { href: '/afiliados', label: t('Revenda & Afiliados', 'Resell & Affiliates') },
    { href: '/contato', label: t('Contato', 'Contact') },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090c0a]/90 backdrop-blur-md border-b border-[#dfb743]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Top micro-bar for luxury origin announcement */}
      <div className="w-full bg-forest-dark border-b border-gold-400/10 py-1.5 px-4 text-center text-[11px] font-sans tracking-luxury uppercase text-gold-300/80 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
        <span>
          {t(
            'Made in Brazil · Bioma Amazônia · Grau de Exportação · Mel Nobre de Abelha Tiúba',
            'Made in Brazil · Amazon Biome · Export Grade · Rare Tiúba Native Honey'
          )}
        </span>
        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-20 sm:h-24 flex items-center justify-between">
        
        {/* 1. Lado Esquerdo: Bloco do Logotipo com margem de respiro */}
        <Link href="/" className="flex items-center gap-3.5 group py-1 mr-8 xl:mr-12 shrink-0">
          <div 
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#dfb743]/50 p-0.5 bg-onyx-950 group-hover:border-[#dfb743] transition-all shrink-0"
            style={{ filter: 'drop-shadow(0 0 10px rgba(223, 183, 67, 0.35))' }}
          >
            <Image
              src={settings.logo_url || '/images/logo.jpg'}
              alt="TIÚBA RESERVE Logo"
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold text-[#dfb743] tracking-[0.2em] group-hover:text-[#fef08a] transition-colors whitespace-nowrap">
              TIÚBA RESERVE
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans text-slate-400 tracking-[0.25em] uppercase -mt-0.5 whitespace-nowrap">
              AMAZONIAN NATIVE HONEY
            </span>
          </div>
        </Link>

        {/* 2. Centro: Links de Navegação com espaçamento uniforme */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 justify-center flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-luxury font-sans whitespace-nowrap transition-all py-1 border-b-2 ${
                isActive(link.href)
                  ? 'text-gold-400 border-gold-400 font-semibold'
                  : 'text-stone-300 hover:text-gold-300 border-transparent hover:border-gold-400/40'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 3. Lado Direito: Ações (Botão Clube Tiúba, Idioma, Login, Carrinho) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-4 xl:ml-8">
          
          {/* Exclusive Clube Tiúba CTA Pill Button */}
          <Link
            href="/clube"
            className={`hidden sm:inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfb743] bg-gradient-to-r from-[#dfb743]/15 via-[#d97706]/10 to-[#dfb743]/15 text-[#dfb743] hover:text-[#fef08a] hover:shadow-[0_0_15px_rgba(223,183,67,0.35)] transition-all duration-300 whitespace-nowrap text-xs font-semibold tracking-wider uppercase ${
              isActive('/clube') ? 'ring-2 ring-gold-400/40 bg-[#dfb743]/25 text-[#fef08a]' : ''
            }`}
            title="Conheça o Clube de Assinatura Tiúba"
          >
            {/* Deixe apenas UM ícone sutil à esquerda */}
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
            <span>Clube Tiúba</span>
          </Link>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border border-gold-400/20 bg-onyx-850 hover:border-gold-400/50 text-gold-300 transition-all font-sans"
            title="Alternar Idioma / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-semibold uppercase tracking-wider">{lang}</span>
          </button>

          {/* User Account / Login */}
          <Link
            href="/login"
            className="p-2 text-stone-300 hover:text-gold-300 transition-colors relative"
            title={currentUser ? `Logado como: ${currentUser.full_name}` : 'Acessar Conta'}
          >
            <User className="w-5 h-5" />
            {currentUser && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-onyx-950" />
            )}
          </Link>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 rounded-full border border-gold-400/20 bg-onyx-850 hover:border-gold-400/60 text-gold-400 transition-all group"
            title="Ver Carrinho de Compras"
            aria-label="Abrir Carrinho de Compras"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-honey to-gold-400 text-onyx-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg font-sans">
                {displayCartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-300 hover:text-gold-400"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-onyx-900 border-b border-gold-400/20 px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-luxury font-sans py-2 border-b border-white/5 ${
                  isActive(link.href) ? 'text-gold-400 font-semibold' : 'text-stone-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Exclusive Clube Tiúba CTA Pill */}
            <Link
              href="/clube"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full border border-[#dfb743] bg-gradient-to-r from-[#dfb743]/15 via-[#d97706]/10 to-[#dfb743]/15 text-[#dfb743] hover:text-[#fef08a] hover:shadow-[0_0_15px_rgba(223,183,67,0.35)] transition-all duration-300 whitespace-nowrap text-xs font-semibold tracking-wider uppercase mt-2 mb-2"
            >
              {/* Deixe apenas UM ícone sutil à esquerda */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
              </svg>
              <span>Clube Tiúba</span>
            </Link>

            <Link
              href="/minha-conta/assinatura"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-luxury font-sans py-2 text-gold-400/80 hover:text-gold-300 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Área do Assinante (/minha-conta/assinatura)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
