'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('Home', 'Home') },
    { href: '/produtos', label: t('Nossos Produtos', 'Our Products') },
    { href: '/loja', label: t('Boutique do Mel', 'Honey Boutique') },
    { href: '/rastreio', label: t('Rastreio de Lote', 'Batch Traceability') },
    { href: '/contato', label: t('Contato & Sommelier', 'Contact & Sommelier') },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-onyx-950/90 backdrop-blur-md border-b border-gold-400/20 transition-all duration-300">
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

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Official Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-400/30 p-0.5 bg-onyx-900 group-hover:border-gold-400 transition-colors">
            <Image
              src={settings.logo_url || '/images/logo.png'}
              alt="TIÚBA RESERVE Logo"
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-monumental text-base sm:text-lg font-bold text-foreground group-hover:text-gold-300 transition-colors">
              TIÚBA RESERVE
            </span>
            <span className="text-[9px] font-sans tracking-widest text-gold-400 uppercase -mt-0.5">
              Melipona Fasciculata · Amazonia
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-luxury font-sans transition-all py-1 border-b-2 ${
                isActive(link.href)
                  ? 'text-gold-400 border-gold-400 font-semibold'
                  : 'text-stone-300 hover:text-gold-300 border-transparent hover:border-gold-400/40'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Controls: Lang, Admin, User, Cart */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border border-gold-400/20 bg-onyx-850 hover:border-gold-400/50 text-gold-300 transition-all font-sans"
            title="Alternar Idioma / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-semibold uppercase tracking-wider">{lang}</span>
          </button>

          {/* Admin Direct Button (if admin or demo accessible) */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider rounded-md border border-gold-500/30 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20 transition-all"
            title="Acesso ao Painel Administrativo"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Admin</span>
          </Link>

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
          <Link
            href="/carrinho"
            className="relative p-2.5 rounded-full border border-gold-400/20 bg-onyx-850 hover:border-gold-400/60 text-gold-400 transition-all group"
            title="Ver Carrinho de Compras"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-honey to-gold-400 text-onyx-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg font-sans">
                {cartCount}
              </span>
            )}
          </Link>

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
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-luxury font-sans py-2 text-gold-300 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Painel Administrativo (/admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
