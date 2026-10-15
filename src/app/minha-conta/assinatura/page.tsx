'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { ShippingAddress } from '@/types';
import { 
  Sparkles, 
  Crown, 
  Package, 
  Pause, 
  Play, 
  XCircle, 
  MapPin, 
  CreditCard, 
  Truck, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  Edit2,
  Check,
  AlertTriangle,
  QrCode
} from 'lucide-react';

export default function SubscriberPortalPage() {
  const { 
    currentUser, 
    subscriptions, 
    getUserSubscription, 
    pauseSubscription, 
    resumeSubscription, 
    cancelSubscription,
    updateSubscriptionAddress,
    shipments,
    currentBox,
    t 
  } = useStore();

  const currentSub = getUserSubscription(currentUser?.email);

  // Modal editing address
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editStreet, setEditStreet] = useState(currentSub?.shipping_address.street || '');
  const [editNumber, setEditNumber] = useState(currentSub?.shipping_address.number || '');
  const [editComplement, setEditComplement] = useState(currentSub?.shipping_address.complement || '');
  const [editNeighborhood, setEditNeighborhood] = useState(currentSub?.shipping_address.neighborhood || '');
  const [editCity, setEditCity] = useState(currentSub?.shipping_address.city || '');
  const [editState, setEditState] = useState(currentSub?.shipping_address.state || '');
  const [editZipCode, setEditZipCode] = useState(currentSub?.shipping_address.zipCode || '');

  // Confirm cancel modal
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  // Filter shipments associated with this subscriber
  const userShipments = shipments.filter(
    (sh) => sh.subscription_id === currentSub?.id || sh.subscriber_email === currentSub?.user_email
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSub) return;

    const newAddress: ShippingAddress = {
      fullName: currentSub.shipping_address.fullName,
      phone: currentSub.shipping_address.phone,
      street: editStreet,
      number: editNumber,
      complement: editComplement,
      neighborhood: editNeighborhood,
      city: editCity,
      state: editState,
      zipCode: editZipCode,
    };

    updateSubscriptionAddress(currentSub.id, newAddress);
    setIsEditingAddress(false);
  };

  const handlePause = () => {
    if (!currentSub) return;
    if (confirm('Deseja pausar sua assinatura por 30 dias? Você não será cobrado no próximo ciclo e pode reativar quando quiser.')) {
      pauseSubscription(currentSub.id);
    }
  };

  const handleResume = () => {
    if (!currentSub) return;
    resumeSubscription(currentSub.id);
  };

  const handleCancel = () => {
    if (!currentSub) return;
    cancelSubscription(currentSub.id);
    setIsConfirmingCancel(false);
  };

  if (!currentSub) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 text-center space-y-4">
          <Package className="w-12 h-12 text-gold-400 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-foreground">
            Nenhuma Assinatura Encontrada
          </h2>
          <p className="text-xs text-stone-400 font-sans">
            Você ainda não possui uma assinatura ativa do Clube Tiúba Reserve. Conheça nossos planos com méis raros e a revistinha infantil.
          </p>
          <div className="pt-2">
            <Link
              href="/clube"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-400 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury hover:bg-gold-300 transition-colors"
            >
              <span>Conhecer os Planos do Clube</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (currentSub.status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Assinatura Ativa</span>
          </span>
        );
      case 'paused':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Assinatura Pausada (30 dias)</span>
          </span>
        );
      case 'canceled':
        return (
          <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Assinatura Cancelada</span>
          </span>
        );
      case 'past_due':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Em Atraso</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-onyx-950 text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-400 font-bold">
                Portal do Assinante Tiúba
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Minha Assinatura Mensal
            </h1>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Gerencie seus envios, altere endereço, pause ou cancele quando quiser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/clube"
              className="px-4 py-2 rounded-full border border-gold-400/30 text-gold-300 hover:bg-onyx-900 font-serif text-xs uppercase tracking-luxury transition-all"
            >
              Ver Grade de Planos
            </Link>
            <Link
              href="/loja"
              className="px-4 py-2 rounded-full bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif text-xs uppercase tracking-luxury font-bold transition-all"
            >
              Ir para Boutique
            </Link>
          </div>
        </div>

        {/* 1. TOP OVERVIEW CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gold-400/15">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge()}
                <span className="text-xs font-mono text-stone-400">
                  ID: #{currentSub.id}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">
                Plano {currentSub.plan_name}
              </h2>
              <p className="text-xs text-stone-300 font-sans">
                Titular: <strong>{currentSub.user_name}</strong> ({currentSub.user_email})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-4 rounded-2xl bg-onyx-950 border border-gold-400/20 text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono block">
                  Valor Recorrente
                </span>
                <span className="font-serif text-2xl font-bold text-foreground">
                  R$ {currentSub.plan_price.toFixed(2)}
                </span>
                <span className="text-[10px] text-stone-400 font-sans block">/mês · Frete Incluso</span>
              </div>

              {/* Pause / Resume Actions */}
              {currentSub.status === 'active' && (
                <button
                  onClick={handlePause}
                  className="px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-serif text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pausar por 1 Mês</span>
                </button>
              )}

              {currentSub.status === 'paused' && (
                <button
                  onClick={handleResume}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-onyx-950 font-serif text-xs uppercase tracking-wider font-bold shadow-lg transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reativar Assinatura Agora</span>
                </button>
              )}
            </div>
          </div>

          {/* Details Grid: Cycle Dates, Payment Method, Delivery Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs font-sans">
            
            {/* Cycle & Next Box */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Próxima Renovação & Despacho
              </span>
              <p className="text-foreground font-semibold">
                {new Date(currentSub.next_billing_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-stone-400 text-[11px]">
                Edição em preparo: {currentBox.title}
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Forma de Faturamento
              </span>
              <p className="text-foreground font-semibold uppercase">
                {currentSub.payment_method === 'stripe' ? 'Cartão de Crédito (Stripe)' : 'PIX Mensal'}
              </p>
              <p className="text-stone-400 text-[11px]">
                {currentSub.stripe_subscription_id ? `Assinatura Stripe: ${currentSub.stripe_subscription_id}` : 'Envio automático de chave PIX a cada ciclo'}
              </p>
            </div>

            {/* Shipping Address */}
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Endereço de Envio Padrão
                </span>
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="text-gold-400 hover:text-gold-300 text-[11px] underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Editar
                </button>
              </div>
              <p className="text-foreground font-semibold leading-tight">
                {currentSub.shipping_address.street}, {currentSub.shipping_address.number}
                {currentSub.shipping_address.complement ? ` - ${currentSub.shipping_address.complement}` : ''}
              </p>
              <p className="text-stone-400 text-[11px]">
                {currentSub.shipping_address.neighborhood} · {currentSub.shipping_address.city}/{currentSub.shipping_address.state} · CEP {currentSub.shipping_address.zipCode}
              </p>
            </div>

          </div>

          {/* Cancel button footer */}
          {currentSub.status !== 'canceled' && (
            <div className="mt-6 pt-4 border-t border-gold-400/10 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-sans">
                Você pode cancelar sua assinatura sem burocracia ou taxas adicionais.
              </span>
              <button
                onClick={() => setIsConfirmingCancel(true)}
                className="text-red-400/80 hover:text-red-300 text-[11px] font-sans underline transition-colors"
              >
                Cancelar Assinatura Definitivamente
              </button>
            </div>
          )}
        </div>

        {/* 2. HISTÓRICO DE CAIXAS RECEBIDAS & RASTREIO */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Histórico de Caixas & Códigos de Rastreio
              </h3>
              <p className="text-xs text-stone-400 font-sans">
                Acompanhe o trajeto dos lotes de mel desde o meliponário amazônico até a sua mesa.
              </p>
            </div>
            <Link
              href="/rastreio"
              className="text-xs uppercase tracking-luxury font-serif text-gold-400 hover:text-gold-300 underline underline-offset-4 flex items-center gap-1"
            >
              <span>Consultar Lote Completo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {userShipments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-onyx-900 border border-gold-400/20 text-center text-xs text-stone-400">
              Sua primeira caixa está sendo preparada para o despacho do ciclo atual.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-3 relative group hover:border-gold-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gold-400/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gold-400" />
                      <span className="font-serif text-xs font-bold text-foreground">
                        {currentBox.title}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        shipment.status === 'delivered'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : shipment.status === 'shipped'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {shipment.status === 'delivered'
                        ? 'Entregue'
                        : shipment.status === 'shipped'
                        ? 'Despachado / Em Trânsito'
                        : 'Em Separação'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-sans text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Transportadora:</span>
                      <span className="font-medium text-foreground">{shipment.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Código de Rastreio:</span>
                      <span className="font-mono text-gold-300 font-bold">
                        {shipment.tracking_code || 'Aguardando despacho'}
                      </span>
                    </div>
                    {shipment.shipped_at && (
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>Data de Despacho:</span>
                        <span>{new Date(shipment.shipped_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>

                  {shipment.tracking_code && (
                    <div className="pt-2 border-t border-gold-400/10 flex justify-end">
                      <Link
                        href={`/rastreio?codigo=${shipment.tracking_code}`}
                        className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-sans font-semibold"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Rastrear Entrega em Tempo Real</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. MODAL DE EDIÇÃO DE ENDEREÇO */}
        {isEditingAddress && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Atualizar Endereço de Entrega
                </h3>
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="text-stone-400 hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      required
                      value={editZipCode}
                      onChange={(e) => setEditZipCode(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground font-mono focus:border-gold-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Rua / Endereço *
                    </label>
                    <input
                      type="text"
                      required
                      value={editStreet}
                      onChange={(e) => setEditStreet(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={editNumber}
                      onChange={(e) => setEditNumber(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={editComplement}
                      onChange={(e) => setEditComplement(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={editNeighborhood}
                      onChange={(e) => setEditNeighborhood(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Estado (UF) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-foreground uppercase font-mono focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold-400/10">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-4 py-2 rounded-xl text-stone-400 hover:text-foreground text-xs uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Salvar Novo Endereço
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
        {isConfirmingCancel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-red-500/40 shadow-2xl space-y-4 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-foreground">
                Deseja cancelar sua assinatura?
              </h3>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Você perderá a prioridade nas próximas safras de méis raros de Tiúba e o envio da revistinha infantil &ldquo;As Aventuras da Tiúba&rdquo;. 
                Lembre-se que você também pode apenas <strong>pausar por 1 mês sem custos</strong>.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handlePause}
                  className="w-full py-3 px-4 rounded-xl border border-gold-400 bg-gold-400/10 text-gold-300 font-serif font-bold text-xs uppercase tracking-wider hover:bg-gold-400/20"
                >
                  Prefiro Apenas Pausar por 1 Mês
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-2.5 px-4 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-sans text-xs uppercase tracking-wider"
                >
                  Confirmar Cancelamento Definitivo
                </button>
                <button
                  onClick={() => setIsConfirmingCancel(false)}
                  className="w-full py-2 text-stone-400 hover:text-stone-200 text-xs font-sans"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
