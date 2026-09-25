'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  Settings, 
  Key, 
  Save, 
  QrCode, 
  CreditCard, 
  FileText, 
  Image as ImageIcon, 
  Share2, 
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '@/types';

export default function AdminSettingsPage() {
  const { settings, updateSettings, t } = useStore();
  const [formState, setFormState] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            Parâmetros do Sistema
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Configurações Gerais & Credenciais de API
          </h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full font-mono font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configurações salvas e aplicadas!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Brand Assets (Logo & Favicon) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <ImageIcon className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300">
              Ativos Visuais da Marca (Logo & Favicon)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Logo Preview */}
            <div className="sm:col-span-3 flex flex-col items-center justify-center p-4 rounded-2xl bg-onyx-950 border border-gold-400/20 text-center space-y-3">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gold-400/50 p-1 bg-onyx-900 shadow-lg">
                <Image
                  src={formState.logo_url || '/images/logo.png'}
                  alt="Logo Preview"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="text-[10px] uppercase font-mono text-gold-300">Logotipo Oficial Ativo</span>
            </div>

            {/* Inputs */}
            <div className="sm:col-span-9 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  URL / Caminho do Logotipo Oficial (Header & Footer)
                </label>
                <input
                  type="text"
                  value={formState.logo_url}
                  onChange={(e) => setFormState({ ...formState, logo_url: e.target.value })}
                  placeholder="/images/logo.png"
                  className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
                <span className="text-[10px] text-stone-400 block mt-1">
                  Ativo padrão salvo em: /images/logo.png (alta definição oficial).
                </span>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  URL / Caminho do Favicon (.ico ou .png)
                </label>
                <input
                  type="text"
                  value={formState.favicon_url}
                  onChange={(e) => setFormState({ ...formState, favicon_url: e.target.value })}
                  placeholder="/favicon.ico"
                  className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Institutional & Footer Data */}
        <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <FileText className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300">
              Dados Institucionais, Contato e Rodapé
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                CNPJ da Empresa
              </label>
              <input
                type="text"
                value={formState.cnpj}
                onChange={(e) => setFormState({ ...formState, cnpj: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Telefone Institucional
              </label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Endereço Corporativo Completo
              </label>
              <input
                type="text"
                value={formState.address}
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                WhatsApp Comercial & Envio de Comprovantes
              </label>
              <input
                type="text"
                value={formState.whatsapp}
                onChange={(e) => setFormState({ ...formState, whatsapp: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                WhatsApp Direto do Sommelier de Méis
              </label>
              <input
                type="text"
                value={formState.sommelier_phone}
                onChange={(e) => setFormState({ ...formState, sommelier_phone: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={formState.instagram}
                onChange={(e) => setFormState({ ...formState, instagram: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={formState.facebook}
                onChange={(e) => setFormState({ ...formState, facebook: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Assinatura do Copyright do Rodapé
              </label>
              <input
                type="text"
                value={formState.copyright}
                onChange={(e) => setFormState({ ...formState, copyright: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: PIX Settings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <QrCode className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300">
              Parâmetros do PIX Direto (Banco Central do Brasil)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Chave PIX da Empresa *
              </label>
              <input
                type="text"
                required
                value={formState.pix_key}
                onChange={(e) => setFormState({ ...formState, pix_key: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Tipo da Chave
              </label>
              <select
                value={formState.pix_key_type}
                onChange={(e) => setFormState({ ...formState, pix_key_type: e.target.value as any })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
              >
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave Aleatória (EVP)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Nome do Titular Favorecido (Max 25 caracteres)
              </label>
              <input
                type="text"
                maxLength={25}
                value={formState.pix_receiver_name}
                onChange={(e) => setFormState({ ...formState, pix_receiver_name: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground uppercase focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Cidade do Titular (Max 15 caracteres)
              </label>
              <input
                type="text"
                maxLength={15}
                value={formState.pix_city}
                onChange={(e) => setFormState({ ...formState, pix_city: e.target.value })}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground uppercase focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Stripe & Mercado Pago API Keys */}
        <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <Lock className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300">
              Credenciais de API dos Gateways de Pagamento
            </h3>
          </div>

          {/* Stripe */}
          <div className="space-y-4 p-5 rounded-2xl bg-onyx-950 border border-gold-400/15">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-foreground">Stripe International</span>
              <select
                value={formState.stripe_mode}
                onChange={(e) => setFormState({ ...formState, stripe_mode: e.target.value as any })}
                className="bg-onyx-900 border border-gold-400/20 rounded px-2 py-1 text-[11px] text-gold-300 font-mono"
              >
                <option value="test">Modo Teste</option>
                <option value="live">Modo Produção (Live)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                  Stripe Publishable Key (pk_...)
                </label>
                <input
                  type="text"
                  value={formState.stripe_publishable_key}
                  onChange={(e) => setFormState({ ...formState, stripe_publishable_key: e.target.value })}
                  className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                  Stripe Secret Key (sk_...)
                </label>
                <input
                  type="password"
                  value={formState.stripe_secret_key}
                  onChange={(e) => setFormState({ ...formState, stripe_secret_key: e.target.value })}
                  className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>

          {/* Mercado Pago */}
          <div className="space-y-4 p-5 rounded-2xl bg-onyx-950 border border-gold-400/15">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-foreground">Mercado Pago Brasil</span>
              <select
                value={formState.mp_mode}
                onChange={(e) => setFormState({ ...formState, mp_mode: e.target.value as any })}
                className="bg-onyx-900 border border-gold-400/20 rounded px-2 py-1 text-[11px] text-gold-300 font-mono"
              >
                <option value="sandbox">Sandbox (Teste)</option>
                <option value="production">Produção</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                  Mercado Pago Public Key
                </label>
                <input
                  type="text"
                  value={formState.mp_public_key}
                  onChange={(e) => setFormState({ ...formState, mp_public_key: e.target.value })}
                  className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                  Mercado Pago Access Token
                </label>
                <input
                  type="password"
                  value={formState.mp_access_token}
                  onChange={(e) => setFormState({ ...formState, mp_access_token: e.target.value })}
                  className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gold-400/20">
          <button
            type="submit"
            className="flex items-center gap-2 py-3 px-8 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-400/20"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
