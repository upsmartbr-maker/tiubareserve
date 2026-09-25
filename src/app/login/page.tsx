'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShieldCheck, User, Lock, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, logout, currentUser, isAdmin, settings, t } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, 'client');
      router.push('/loja');
    }
  };

  const handleAdminDemoLogin = () => {
    login('admin@tiubareserve.com.br', 'admin');
    router.push('/admin');
  };

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-400/40 p-0.5 bg-onyx-950 mx-auto">
            <Image
              src={settings.logo_url || '/images/logo.png'}
              alt="TIÚBA RESERVE"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {currentUser
              ? t('Minha Conta Tiúba', 'My Tiúba Account')
              : isRegister
              ? t('Criar Conta Exclusiva', 'Create Exclusive Account')
              : t('Acesso do Cliente', 'Client Sign In')}
          </h1>
          <p className="text-xs text-stone-400 font-sans">
            {currentUser
              ? `Você está logado como ${currentUser.email}`
              : t('Acompanhe seus pedidos, reservas de safra e laudos.', 'Track your orders, reserve allocations, and lab reports.')}
          </p>
        </div>

        {currentUser ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-xs font-sans space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Nome:</span>
                <span className="text-foreground font-semibold">{currentUser.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">E-mail:</span>
                <span className="text-foreground font-mono">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Nível de Acesso:</span>
                <span className="text-gold-300 font-bold uppercase font-mono">{currentUser.role}</span>
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('Acessar Painel Administrativo (/admin)', 'Access Admin Panel (/admin)')}</span>
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-sans text-xs uppercase tracking-wider transition-colors"
            >
              {t('Encerrar Sessão', 'Sign Out')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                {t('Seu E-mail *', 'Your Email *')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                {t('Senha de Acesso *', 'Password *')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-400/20"
            >
              <span>{isRegister ? t('Cadastrar Conta', 'Register Account') : t('Entrar', 'Sign In')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-gold-400/90 hover:text-gold-300 underline font-sans"
              >
                {isRegister
                  ? t('Já possui conta? Faça login', 'Already have an account? Sign in')
                  : t('Ainda não é cadastrado? Criar conta', 'New customer? Create an account')}
              </button>
            </div>

            {/* Quick Admin Access shortcut */}
            <div className="pt-6 border-t border-gold-400/15 text-center">
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/30 text-gold-300 hover:border-gold-400 text-xs font-serif uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{t('Acessar Direto como Administrador', 'Access Directly as Admin')}</span>
              </button>
              <span className="text-[10px] text-stone-400 block mt-1.5 font-sans">
                {t('Para avaliação do Dashboard, CRUD de produtos e pedidos.', 'For evaluation of Dashboard, products CRUD, and orders.')}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
