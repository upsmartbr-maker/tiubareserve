'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Truck, 
  Settings, 
  ArrowLeft, 
  ShieldCheck, 
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isAdmin, settings, logout, t } = useStore();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/pedidos', label: 'Gestor de Pedidos', icon: ShoppingBag },
    { href: '/admin/produtos', label: 'Gestor de Produtos', icon: Package },
    { href: '/admin/lotes', label: 'Gestor de Lotes & Laudos', icon: ShieldCheck },
    { href: '/admin/frete', label: 'Gestor de Frete & Motoboy', icon: Truck },
    { href: '/admin/configuracoes', label: 'Configurações Gerais & APIs', icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-full min-h-screen bg-onyx-950 flex flex-col md:flex-row text-foreground">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-onyx-900 border-r border-gold-400/20 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 border-b border-gold-400/15 pb-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-400/40 p-0.5 bg-onyx-950 shrink-0">
              <Image
                src={settings.logo_url || '/images/logo.png'}
                alt="TIÚBA RESERVE Admin"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <span className="font-serif tracking-monumental text-sm font-bold text-foreground block">
                TIÚBA ADMIN
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono">
                Curadoria & Gestão
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 font-sans">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                    active
                      ? 'bg-gold-400 text-onyx-950 shadow-md shadow-gold-400/20 font-bold'
                      : 'text-stone-300 hover:text-gold-300 hover:bg-onyx-850'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Back to Store */}
        <div className="pt-6 border-t border-gold-400/15 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-300 font-mono text-[11px] truncate max-w-[140px]">
                {currentUser?.email || 'admin@tiubareserve.com.br'}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-stone-400 hover:text-red-400 p-1"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border border-gold-400/20 bg-onyx-950 hover:bg-onyx-850 text-gold-300 text-xs font-serif uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Loja Virtual</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
