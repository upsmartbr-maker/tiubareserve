'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Subscription, SubscriptionShipment, ShipmentStatus, SubscriptionStatus } from '@/types';
import { 
  Crown, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Truck, 
  Download, 
  Search, 
  Filter, 
  Check, 
  Pause, 
  Play, 
  XCircle, 
  Edit3, 
  Save, 
  Sparkles, 
  BookOpen, 
  Gift, 
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function AdminClubPage() {
  const { 
    subscriptions, 
    subscriptionPlans, 
    currentBox, 
    updateSubscriptionBox, 
    shipments, 
    updateShipmentStatus, 
    updateBulkShipmentTracking,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    lots
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'shipments'>('dashboard');

  // Search and filter for Subscribers
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberFilter, setSubscriberFilter] = useState<'all' | 'active' | 'paused' | 'canceled'>('all');

  // Box Planner state
  const [boxTitle, setBoxTitle] = useState(currentBox.title);
  const [boxMonth, setBoxMonth] = useState(currentBox.cycle_month);
  const [boxYear, setBoxYear] = useState(currentBox.cycle_year);
  const [boxDesc, setBoxDesc] = useState(currentBox.description);
  const [magazineTheme, setMagazineTheme] = useState(currentBox.bee_magazine_theme);
  const [magazineEdition, setMagazineEdition] = useState(currentBox.bee_magazine_edition);
  const [giftName, setGiftName] = useState(currentBox.artisan_gift_name);
  const [giftOrigin, setGiftOrigin] = useState(currentBox.artisan_gift_origin);
  const [boxSavedNotice, setBoxSavedNotice] = useState(false);

  // Shipments tracking inputs
  const [editingTracking, setEditingTracking] = useState<Record<string, string>>({});
  const [editingStatus, setEditingStatus] = useState<Record<string, ShipmentStatus>>({});
  const [shipmentsSavedNotice, setShipmentsSavedNotice] = useState(false);

  // Calculations for KPI Dashboard
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter((s) => s.status === 'active').length;
  const pausedSubscribers = subscriptions.filter((s) => s.status === 'paused').length;
  const canceledSubscribers = subscriptions.filter((s) => s.status === 'canceled').length;

  const mrr = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, sub) => acc + sub.plan_price, 0);

  const churnRate = totalSubscribers > 0 
    ? ((canceledSubscribers / totalSubscribers) * 100).toFixed(1)
    : '0.0';

  const newThisMonth = subscriptions.filter((s) => {
    const createdDate = new Date(s.created_at);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length;

  // Filtered subscribers
  const filteredSubscribers = subscriptions.filter((sub) => {
    const matchesSearch = 
      sub.user_name.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
      sub.user_email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
      sub.plan_name.toLowerCase().includes(subscriberSearch.toLowerCase());
    
    if (subscriberFilter === 'all') return matchesSearch;
    return matchesSearch && sub.status === subscriberFilter;
  });

  // Save Box Planner
  const handleSaveBox = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubscriptionBox({
      ...currentBox,
      title: boxTitle,
      cycle_month: boxMonth,
      cycle_year: boxYear,
      description: boxDesc,
      bee_magazine_theme: magazineTheme,
      bee_magazine_edition: Number(magazineEdition),
      artisan_gift_name: giftName,
      artisan_gift_origin: giftOrigin,
    });
    setBoxSavedNotice(true);
    setTimeout(() => setBoxSavedNotice(false), 3000);
  };

  // Export CSV for Shipping labels (Correios / Melhor Envio format)
  const handleExportShippingCSV = () => {
    const headers = [
      'ID Assinatura',
      'Nome Destinatario',
      'Email',
      'Telefone',
      'Plano',
      'Rua',
      'Numero',
      'Complemento',
      'Bairro',
      'Cidade',
      'Estado',
      'CEP',
      'Transportadora',
      'Status Envio',
      'Codigo Rastreio'
    ];

    const rows = shipments.map((sh) => [
      sh.subscription_id,
      `"${sh.subscriber_name}"`,
      sh.subscriber_email,
      sh.subscriber_phone,
      `"${sh.plan_name}"`,
      `"${sh.shipping_address.street}"`,
      sh.shipping_address.number,
      `"${sh.shipping_address.complement || ''}"`,
      `"${sh.shipping_address.neighborhood}"`,
      `"${sh.shipping_address.city}"`,
      sh.shipping_address.state,
      sh.shipping_address.zipCode,
      `"${sh.carrier}"`,
      sh.status,
      sh.tracking_code || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `etiquetas_clube_tiuba_${currentBox.cycle_month.toLowerCase()}_${currentBox.cycle_year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch update tracking codes
  const handleSaveAllTracking = () => {
    const bulkUpdates = shipments.map((sh) => ({
      id: sh.id,
      tracking_code: editingTracking[sh.id] !== undefined ? editingTracking[sh.id] : (sh.tracking_code || ''),
      status: editingStatus[sh.id] !== undefined ? editingStatus[sh.id] : sh.status,
    }));

    updateBulkShipmentTracking(bulkUpdates);
    setShipmentsSavedNotice(true);
    setTimeout(() => setShipmentsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold-400" />
            <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-400 font-bold">
              Gestão de Assinaturas Recorrentes
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Painel do Clube Tiúba
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Acompanhe métricas de MRR, configure o Box Planner do mês e gerencie despachos em lote.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-onyx-900 border border-gold-400/20 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-gold-400 text-onyx-950 shadow-md shadow-gold-400/20'
                : 'text-stone-300 hover:text-gold-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Assinantes & MRR</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'planner'
                ? 'bg-gold-400 text-onyx-950 shadow-md shadow-gold-400/20'
                : 'text-stone-300 hover:text-gold-300'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Box Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'shipments'
                ? 'bg-gold-400 text-onyx-950 shadow-md shadow-gold-400/20'
                : 'text-stone-300 hover:text-gold-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Envios em Massa</span>
          </button>
        </div>
      </div>

      {/* 1. DASHBOARD & SUBSCRIBERS TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Active Subscribers */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
                <span>ASSINANTES ATIVOS</span>
                <Users className="w-4 h-4 text-gold-400" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">
                {activeSubscribers}
              </div>
              <div className="text-[11px] text-emerald-400 font-sans mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+{newThisMonth} novos neste mês</span>
              </div>
            </div>

            {/* Monthly Recurring Revenue (MRR) */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/30 relative overflow-hidden shadow-gold">
              <div className="flex items-center justify-between text-gold-400 text-xs font-mono mb-2">
                <span>RECEITA RECORRENTE (MRR)</span>
                <DollarSign className="w-4 h-4 text-gold-400" />
              </div>
              <div className="font-serif text-3xl font-bold text-gold-300">
                R$ {mrr.toFixed(2)}
              </div>
              <div className="text-[11px] text-stone-400 font-sans mt-2">
                Previsão bruta mensal recorrente
              </div>
            </div>

            {/* Churn Rate */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
                <span>CHURN RATE MENSAL</span>
                <ArrowUpDown className="w-4 h-4 text-amber-honey" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">
                {churnRate}%
              </div>
              <div className="text-[11px] text-stone-400 font-sans mt-2">
                {canceledSubscribers} cancelamento(s) acumulado(s)
              </div>
            </div>

            {/* Paused subscriptions */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 text-xs font-mono mb-2">
                <span>PAUSADAS TEMPORARIAMENTE</span>
                <Pause className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-serif text-3xl font-bold text-amber-300">
                {pausedSubscribers}
              </div>
              <div className="text-[11px] text-stone-400 font-sans mt-2">
                Pausa solicitada de 30 dias
              </div>
            </div>

          </div>

          {/* Subscribers Table Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 space-y-6">
            
            {/* Table Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar assinante por nome, e-mail ou plano..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-onyx-950 border border-gold-400/20 text-xs text-foreground focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gold-400" />
                <select
                  value={subscriberFilter}
                  onChange={(e) => setSubscriberFilter(e.target.value as any)}
                  className="py-2 px-3 rounded-xl bg-onyx-950 border border-gold-400/20 text-xs text-stone-300 focus:outline-none focus:border-gold-400"
                >
                  <option value="all">Todos os Status ({totalSubscribers})</option>
                  <option value="active">Apenas Ativos ({activeSubscribers})</option>
                  <option value="paused">Apenas Pausados ({pausedSubscribers})</option>
                  <option value="canceled">Apenas Cancelados ({canceledSubscribers})</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-onyx-950 border-b border-gold-400/15 text-[11px] font-mono uppercase tracking-wider text-gold-400">
                  <tr>
                    <th className="py-3 px-4">Assinante</th>
                    <th className="py-3 px-4">Plano</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Cobrança</th>
                    <th className="py-3 px-4">Cidade / UF</th>
                    <th className="py-3 px-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-400/10">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400">
                        Nenhum assinante encontrado para o filtro selecionado.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-onyx-850/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{sub.user_name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{sub.user_email}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{sub.user_phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-serif font-bold text-gold-300">{sub.plan_name}</div>
                          <div className="font-mono text-[11px] text-stone-300">R$ {sub.plan_price.toFixed(2)}/mês</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1 ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : sub.status === 'paused'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{sub.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 uppercase font-mono text-[11px] text-stone-300">
                          {sub.payment_method === 'stripe' ? 'Cartão Stripe' : 'PIX Mensal'}
                        </td>
                        <td className="py-3.5 px-4 text-stone-300">
                          <div>{sub.shipping_address.city} - {sub.shipping_address.state}</div>
                          <div className="text-[10px] text-stone-400 font-mono">CEP {sub.shipping_address.zipCode}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {sub.status === 'active' && (
                            <button
                              onClick={() => pauseSubscription(sub.id)}
                              className="px-2.5 py-1 rounded-md border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[10px] uppercase font-bold"
                              title="Pausar por 1 mês"
                            >
                              Pausar
                            </button>
                          )}
                          {sub.status === 'paused' && (
                            <button
                              onClick={() => resumeSubscription(sub.id)}
                              className="px-2.5 py-1 rounded-md bg-emerald-500 text-onyx-950 hover:bg-emerald-400 text-[10px] uppercase font-bold"
                              title="Reativar"
                            >
                              Reativar
                            </button>
                          )}
                          {sub.status !== 'canceled' && (
                            <button
                              onClick={() => {
                                if (confirm(`Deseja cancelar a assinatura de ${sub.user_name}?`)) {
                                  cancelSubscription(sub.id);
                                }
                              }}
                              className="px-2.5 py-1 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[10px] uppercase font-bold"
                              title="Cancelar assinatura"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* 2. BOX PLANNER (CURADORIA DA CAIXA DO MÊS) */}
      {activeTab === 'planner' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <form onSubmit={handleSaveBox} className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/25 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Planejamento da Caixa do Próximo Ciclo (Box Planner)
                </h3>
                <p className="text-xs text-stone-400 font-sans mt-0.5">
                  Defina o tema botânico, a historinha infantil e os brindes nobres enviados aos assinantes.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-gold"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Curadoria</span>
              </button>
            </div>

            {boxSavedNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-sans flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Curadoria da Caixa atualizada com sucesso! Todos os assinantes verão as novidades na página pública e em seus painéis.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-xs">
              
              <div className="sm:col-span-2">
                <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                  Título da Edição do Mês *
                </label>
                <input
                  type="text"
                  required
                  value={boxTitle}
                  onChange={(e) => setBoxTitle(e.target.value)}
                  placeholder="Ex: Edição Outubro 2026 - Florada do Dossel Amazônico"
                  className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    Mês do Ciclo *
                  </label>
                  <input
                    type="text"
                    required
                    value={boxMonth}
                    onChange={(e) => setBoxMonth(e.target.value)}
                    placeholder="Outubro"
                    className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    Ano *
                  </label>
                  <input
                    type="text"
                    required
                    value={boxYear}
                    onChange={(e) => setBoxYear(e.target.value)}
                    placeholder="2026"
                    className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground font-mono focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                  Descrição Sensorial & Conceitual da Caixa *
                </label>
                <textarea
                  rows={3}
                  required
                  value={boxDesc}
                  onChange={(e) => setBoxDesc(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground focus:border-gold-400"
                />
              </div>

              {/* Children comic settings */}
              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 sm:col-span-3 space-y-4">
                <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  <span>Revistinha Infantil: As Aventuras da Tiúba</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Tema da Historinha do Mês *
                    </label>
                    <input
                      type="text"
                      required
                      value={magazineTheme}
                      onChange={(e) => setMagazineTheme(e.target.value)}
                      placeholder="Ex: O Segredo da Castanheira Sagrada"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Número da Edição Colecionável *
                    </label>
                    <input
                      type="number"
                      required
                      value={magazineEdition}
                      onChange={(e) => setMagazineEdition(Number(e.target.value))}
                      placeholder="14"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground font-mono focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>

              {/* Artisan gift settings */}
              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 sm:col-span-3 space-y-4">
                <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-xs uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-gold-400" />
                  <span>Brinde Nobre do Produtor Artesanal</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Item Artesanal do Mês *
                    </label>
                    <input
                      type="text"
                      required
                      value={giftName}
                      onChange={(e) => setGiftName(e.target.value)}
                      placeholder="Ex: Colher Dosadora Artesanal em Madeira Nobre de Muirapiranga"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Comunidade / Origem do Artesão *
                    </label>
                    <input
                      type="text"
                      required
                      value={giftOrigin}
                      onChange={(e) => setGiftOrigin(e.target.value)}
                      placeholder="Ex: Comunidade Ribeirinha de Barreirinha - AM"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>

              {/* Honey Batches Allocation from Real System Lots */}
              <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/15 sm:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-gold-400" />
                    <span>Lotes de Mel Vinculados aos Planos</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-sans">
                    Lotes cadastrados no sistema: {lots.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentBox.honey_allocations.map((alloc) => (
                    <div key={alloc.plan_slug} className="p-4 rounded-xl bg-onyx-900 border border-gold-400/20 space-y-2">
                      <span className="font-serif font-bold text-xs text-foreground block">
                        {alloc.plan_name}
                      </span>
                      <div className="space-y-1">
                        {alloc.lot_titles.map((title, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-onyx-950 border border-white/5 text-[11px] text-stone-300 flex items-center justify-between">
                            <span className="truncate max-w-[140px]">{title}</span>
                            <span className="font-mono text-gold-400 text-[10px]">{alloc.lot_codes[idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </form>
        </div>
      )}

      {/* 3. SHIPMENTS & BULK TRACKING TAB */}
      {activeTab === 'shipments' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Gestão de Envios em Massa ({currentBox.cycle_month} {currentBox.cycle_year})
                </h3>
                <p className="text-xs text-stone-400 font-sans mt-0.5">
                  Exporte a lista completa de etiquetas para Correios / Melhor Envio e atualize os códigos de rastreio em lote.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportShippingCSV}
                  className="px-4 py-2 rounded-xl border border-gold-400/40 bg-gold-400/10 hover:bg-gold-400/20 text-gold-300 font-serif font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-gold-400" />
                  <span>Exportar Etiquetas (CSV)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAllTracking}
                  className="px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-gold"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Códigos em Lote</span>
                </button>
              </div>
            </div>

            {shipmentsSavedNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-sans flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Códigos de rastreio e status dos envios sincronizados com sucesso!</span>
              </div>
            )}

            {/* Shipments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-onyx-950 border-b border-gold-400/15 text-[11px] font-mono uppercase tracking-wider text-gold-400">
                  <tr>
                    <th className="py-3 px-4">Destinatário & Endereço</th>
                    <th className="py-3 px-4">Plano</th>
                    <th className="py-3 px-4">Transportadora</th>
                    <th className="py-3 px-4">Status do Envio</th>
                    <th className="py-3 px-4">Código de Rastreio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-400/10">
                  {shipments.map((sh) => {
                    const currentTrackingVal = editingTracking[sh.id] !== undefined 
                      ? editingTracking[sh.id] 
                      : (sh.tracking_code || '');

                    const currentStatusVal = editingStatus[sh.id] !== undefined
                      ? editingStatus[sh.id]
                      : sh.status;

                    return (
                      <tr key={sh.id} className="hover:bg-onyx-850/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{sh.subscriber_name}</div>
                          <div className="text-[11px] text-stone-300">
                            {sh.shipping_address.street}, {sh.shipping_address.number} - {sh.shipping_address.city}/{sh.shipping_address.state}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">CEP {sh.shipping_address.zipCode}</div>
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-gold-300">
                          {sh.plan_name}
                        </td>
                        <td className="py-3.5 px-4 text-stone-300 font-mono text-[11px]">
                          {sh.carrier}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={currentStatusVal}
                            onChange={(e) => {
                              const newSt = e.target.value as ShipmentStatus;
                              setEditingStatus(prev => ({ ...prev, [sh.id]: newSt }));
                            }}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-mono font-bold uppercase border bg-onyx-950 ${
                              currentStatusVal === 'delivered'
                                ? 'border-emerald-500/40 text-emerald-400'
                                : currentStatusVal === 'shipped'
                                ? 'border-blue-500/40 text-blue-400'
                                : 'border-amber-500/40 text-amber-400'
                            }`}
                          >
                            <option value="preparing">Em Separação</option>
                            <option value="shipped">Despachado</option>
                            <option value="delivered">Entregue</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            placeholder="Ex: BR984120391BR"
                            value={currentTrackingVal}
                            onChange={(e) => {
                              const val = e.target.value.toUpperCase();
                              setEditingTracking(prev => ({ ...prev, [sh.id]: val }));
                            }}
                            className="w-48 py-1.5 px-3 rounded-lg bg-onyx-950 border border-gold-400/20 text-gold-300 font-mono text-xs focus:border-gold-400 uppercase"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
