'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, settings, currentUser, isAdmin } = useStore();

  const [email, setEmail] = useState('admin@tiubareserve.com.br');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Informe o e-mail administrativo.');
      return;
    }
    // Authenticate as administrator
    login(email, 'admin');
    router.push('/admin');
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-16 px-4 bg-onyx-950">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-400/40 p-0.5 bg-onyx-950 mx-auto">
            <Image
              src={settings.logo_url || '/images/logo.png'}
              alt="TIÚBA RESERVE Admin"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[11px] font-mono uppercase tracking-wider">
            <Lock className="w-3 h-3 text-gold-400" />
            <span>Acesso Restrito · Gestão & Curadoria</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Autenticação Administrativa
          </h1>
          <p className="text-xs text-slate-300 font-sans">
            Área protegida para gestão de pedidos, lotes, fretes e do Clube de Assinatura.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block mb-1">
              E-mail Administrativo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tiubareserve.com.br"
              className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block mb-1">
              Senha de Segurança
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-onyx-950" />
            <span>Entrar no Painel de Controle</span>
          </button>
        </form>

        <div className="pt-4 border-t border-gold-400/15 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-gold-300 font-sans transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retornar à Loja Pública</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
