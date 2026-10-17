'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Award, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Edit3, 
  Check, 
  X, 
  Ban, 
  ShieldCheck, 
  QrCode, 
  ExternalLink, 
  Plus, 
  Percent, 
  FileText,
  Copy,
  AlertCircle
} from 'lucide-react';
import { Affiliate, AffiliateSale, AffiliateStatus, AffiliateSaleStatus } from '@/types';

export default function AdminAffiliatesPage() {
  const { 
    affiliates, 
    affiliateSales, 
    updateAffiliate, 
    createAffiliate, 
    markAffiliateSaleAsPaid,
    updateAffiliateSaleStatus 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'affiliates' | 'commissions'>('affiliates');

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [affiliateStatusFilter, setAffiliateStatusFilter] = useState<'all' | AffiliateStatus>('all');
  const [saleAffiliateFilter, setSaleAffiliateFilter] = useState<string>('all');
  const [saleStatusFilter, setSaleStatusFilter] = useState<'all' | AffiliateSaleStatus>('all');
  const [salePeriodFilter, setSalePeriodFilter] = useState<'all' | '7days' | '30days'>('all');

  // Modal: Edit Affiliate Rates
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [editForm, setEditForm] = useState({
    commission_rate: 10,
    discount_rate: 5,
    pix_key: '',
    status: 'active' as AffiliateStatus,
  });

  // Modal: Add New Affiliate
  const [showNewAffiliateModal, setShowNewAffiliateModal] = useState(false);
  const [newAffiliateForm, setNewAffiliateForm] = useState({
    name: '',
    email: '',
    code: '',
    commission_rate: 10,
    discount_rate: 5,
    pix_key: '',
    status: 'active' as AffiliateStatus,
  });

  // Modal: Mark as Paid
  const [payingSale, setPayingSale] = useState<AffiliateSale | null>(null);
  const [pixProofInput, setPixProofInput] = useState('');
  const [copiedPixKey, setCopiedPixKey] = useState(false);

  // Overall Statistics
  const totalAffiliates = affiliates.length;
  const activeAffiliates = affiliates.filter(a => a.status === 'active').length;
  const pendingAffiliates = affiliates.filter(a => a.status === 'pending').length;

  const totalCommissionsPending = affiliateSales
    .filter(s => s.status === 'pending' || s.status === 'approved')
    .reduce((acc, s) => acc + s.commission_amount, 0);

  const totalCommissionsPaid = affiliateSales
    .filter(s => s.status === 'paid')
    .reduce((acc, s) => acc + s.commission_amount, 0);

  // Filtered Affiliates List
  const filteredAffiliates = useMemo(() => {
    return affiliates.filter(aff => {
      const matchSearch = 
        aff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aff.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (aff.email && aff.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStatus = affiliateStatusFilter === 'all' || aff.status === affiliateStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [affiliates, searchTerm, affiliateStatusFilter]);

  // Filtered Commissions List
  const filteredSales = useMemo(() => {
    return affiliateSales.filter(sale => {
      const matchAffiliate = saleAffiliateFilter === 'all' || sale.affiliate_id === saleAffiliateFilter || sale.affiliate_code === saleAffiliateFilter;
      const matchStatus = saleStatusFilter === 'all' || sale.status === saleStatusFilter;

      let matchPeriod = true;
      if (salePeriodFilter !== 'all') {
        const saleDate = new Date(sale.created_at).getTime();
        const now = Date.now();
        const daysAgo = (now - saleDate) / (1000 * 60 * 60 * 24);
        if (salePeriodFilter === '7days') matchPeriod = daysAgo <= 7;
        if (salePeriodFilter === '30days') matchPeriod = daysAgo <= 30;
      }

      return matchAffiliate && matchStatus && matchPeriod;
    });
  }, [affiliateSales, saleAffiliateFilter, saleStatusFilter, salePeriodFilter]);

  // Handlers
  const handleOpenEditModal = (aff: Affiliate) => {
    setEditingAffiliate(aff);
    setEditForm({
      commission_rate: aff.commission_rate,
      discount_rate: aff.discount_rate,
      pix_key: aff.pix_key || '',
      status: aff.status,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAffiliate) return;

    updateAffiliate(editingAffiliate.id, {
      commission_rate: Number(editForm.commission_rate),
      discount_rate: Number(editForm.discount_rate),
      pix_key: editForm.pix_key,
      status: editForm.status,
    });

    setEditingAffiliate(null);
  };

  const handleToggleStatus = (aff: Affiliate, newStatus: AffiliateStatus) => {
    updateAffiliate(aff.id, { status: newStatus });
  };

  const handleCreateAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffiliateForm.name || !newAffiliateForm.code) return;

    createAffiliate({
      name: newAffiliateForm.name,
      email: newAffiliateForm.email,
      code: newAffiliateForm.code.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      commission_rate: Number(newAffiliateForm.commission_rate) || 10,
      discount_rate: Number(newAffiliateForm.discount_rate) || 5,
      pix_key: newAffiliateForm.pix_key,
      status: newAffiliateForm.status,
    });

    setShowNewAffiliateModal(false);
    setNewAffiliateForm({
      name: '',
      email: '',
      code: '',
      commission_rate: 10,
      discount_rate: 5,
      pix_key: '',
      status: 'active',
    });
  };

  const handleConfirmPayCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingSale) return;

    markAffiliateSaleAsPaid(payingSale.id, pixProofInput.trim() || 'Comprovante PIX Validado pelo Administrador');
    setPayingSale(null);
    setPixProofInput('');
  };

  const handleCopyAffiliatePix = (pixKey?: string) => {
    if (pixKey && navigator.clipboard) {
      navigator.clipboard.writeText(pixKey);
      setCopiedPixKey(true);
      setTimeout(() => setCopiedPixKey(false), 2500);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                Afiliados, Embaixadores & Comissões
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Gestão central de influenciadores, taxas de remuneração, cupons e liquidação de PIX.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/afiliados/painel"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-onyx-900 border border-gold-400/30 hover:border-gold-400 text-gold-300 text-xs font-semibold transition-all"
          >
            <span>Ver Painel Público</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
          </Link>
          <button
            onClick={() => setShowNewAffiliateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-onyx-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-gold-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Embaixador</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Afiliados Ativos
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-foreground">
              {activeAffiliates}
            </span>
            <span className="text-xs text-stone-400">de {totalAffiliates} cadastrados</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Aguardando Aprovação
            </span>
            <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-amber-300">
              {pendingAffiliates}
            </span>
            <span className="text-xs text-stone-400">novos pedidos</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Comissões a Pagar
            </span>
            <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl font-bold text-amber-300">
              R$ {totalCommissionsPending.toFixed(2).replace('.', ',')}
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">Pendentes de liquidação PIX</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Comissões Já Liquidadas
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl font-bold text-emerald-400">
              R$ {totalCommissionsPaid.toFixed(2).replace('.', ',')}
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">Total pago via PIX</p>
          </div>
        </div>

      </div>

      {/* Main Tabs Selection */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('affiliates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'affiliates'
              ? 'bg-gold-400 text-onyx-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-onyx-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Embaixadores & Códigos ({affiliates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'commissions'
              ? 'bg-gold-400 text-onyx-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-onyx-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>2. Extrato de Vendas & Pagamento PIX ({affiliateSales.length})</span>
        </button>
      </div>

      {/* TAB 1: AFFILIATES LIST */}
      {activeTab === 'affiliates' && (
        <div className="bg-onyx-900 border border-gold-400/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Controls: Search and Status Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por nome, código ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-stone-500 focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-stone-400">Filtrar Status:</span>
              <select
                value={affiliateStatusFilter}
                onChange={(e) => setAffiliateStatusFilter(e.target.value as any)}
                className="bg-onyx-950 border border-gold-400/20 text-xs rounded-xl px-3 py-2 text-stone-300 focus:border-gold-400 focus:outline-none font-mono"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="pending">Pendentes</option>
                <option value="suspended">Suspensos</option>
              </select>
            </div>
          </div>

          {/* Affiliates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold-400/20 text-[11px] font-serif uppercase tracking-wider text-gold-400 pb-3">
                  <th className="py-3 px-3">Embaixador / Contato</th>
                  <th className="py-3 px-3">Código Cupom</th>
                  <th className="py-3 px-3">Comissão (%)</th>
                  <th className="py-3 px-3">Desconto (%)</th>
                  <th className="py-3 px-3">Chave PIX</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredAffiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-onyx-850/60 transition-colors">
                    
                    {/* Name & Email */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-serif font-bold text-foreground text-sm block">
                          {aff.name}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {aff.email || 'Sem e-mail'}
                        </span>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-3 py-1 rounded-lg bg-onyx-950 border border-gold-400/40 text-gold-300 font-mono font-bold tracking-wider text-xs">
                        {aff.code}
                      </span>
                    </td>

                    {/* Commission Rate */}
                    <td className="py-3.5 px-3 font-mono font-bold text-gold-400">
                      {aff.commission_rate}%
                    </td>

                    {/* Discount Rate */}
                    <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">
                      {aff.discount_rate}%
                    </td>

                    {/* PIX Key */}
                    <td className="py-3.5 px-3 max-w-xs truncate">
                      {aff.pix_key ? (
                        <span className="font-mono text-stone-300 text-[11px] bg-onyx-950 px-2 py-1 rounded border border-white/5">
                          {aff.pix_key}
                        </span>
                      ) : (
                        <span className="text-stone-500 italic">Não cadastrada</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        aff.status === 'active'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : aff.status === 'pending'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-red-500/15 border-red-500/30 text-red-400'
                      }`}>
                        {aff.status === 'active' && 'Ativo'}
                        {aff.status === 'pending' && 'Pendente'}
                        {aff.status === 'suspended' && 'Suspenso'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Approve button if pending */}
                        {aff.status === 'pending' && (
                          <button
                            onClick={() => handleToggleStatus(aff, 'active')}
                            className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                            title="Aprovar Embaixador"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Suspend or Activate Toggle */}
                        {aff.status === 'active' ? (
                          <button
                            onClick={() => handleToggleStatus(aff, 'suspended')}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                            title="Bloquear / Suspender Código"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        ) : aff.status === 'suspended' ? (
                          <button
                            onClick={() => handleToggleStatus(aff, 'active')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            title="Reativar Código"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {/* Edit Rates Button */}
                        <button
                          onClick={() => handleOpenEditModal(aff)}
                          className="p-1.5 rounded-lg bg-gold-400/10 hover:bg-gold-400/20 text-gold-300 border border-gold-400/30"
                          title="Editar Taxas e Dados"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: COMMISSIONS STATEMENT & PIX PAYMENT */}
      {activeTab === 'commissions' && (
        <div className="bg-onyx-900 border border-gold-400/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Filtrar por Embaixador:
              </label>
              <select
                value={saleAffiliateFilter}
                onChange={(e) => setSaleAffiliateFilter(e.target.value)}
                className="w-full bg-onyx-950 border border-gold-400/20 text-xs rounded-xl px-3 py-2 text-stone-200 focus:border-gold-400 focus:outline-none font-mono"
              >
                <option value="all">Todos os Embaixadores</option>
                {affiliates.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Status da Comissão:
              </label>
              <select
                value={saleStatusFilter}
                onChange={(e) => setSaleStatusFilter(e.target.value as any)}
                className="w-full bg-onyx-950 border border-gold-400/20 text-xs rounded-xl px-3 py-2 text-stone-200 focus:border-gold-400 focus:outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovada (Pronta p/ Pagar)</option>
                <option value="paid">Já Paga (PIX Liquidado)</option>
                <option value="canceled">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                Período da Venda:
              </label>
              <select
                value={salePeriodFilter}
                onChange={(e) => setSalePeriodFilter(e.target.value as any)}
                className="w-full bg-onyx-950 border border-gold-400/20 text-xs rounded-xl px-3 py-2 text-stone-200 focus:border-gold-400 focus:outline-none"
              >
                <option value="all">Todo o Histórico</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
              </select>
            </div>

          </div>

          {/* Table */}
          {filteredSales.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm text-stone-300 font-serif">Nenhuma comissão encontrada para este filtro.</p>
              <p className="text-xs text-stone-500">Altere os filtros acima para visualizar outros registros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gold-400/20 text-[11px] font-serif uppercase tracking-wider text-gold-400 pb-3">
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Embaixador</th>
                    <th className="py-3 px-3">Itens</th>
                    <th className="py-3 px-3">Bruto / Desconto</th>
                    <th className="py-3 px-3">UF</th>
                    <th className="py-3 px-3">Comissão</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredSales.map((sale) => {
                    const aff = affiliates.find(a => a.id === sale.affiliate_id || a.code === sale.affiliate_code);
                    const formattedDate = new Date(sale.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={sale.id} className="hover:bg-onyx-850/60 transition-colors">
                        
                        <td className="py-3.5 px-3 font-mono text-stone-300 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-gold-300 block">
                            #{sale.affiliate_code || aff?.code}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {aff?.name || 'Embaixador'}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="space-y-0.5">
                            {sale.items_summary.map((it, idx) => (
                              <div key={idx} className="text-stone-300 truncate">
                                <span className="font-mono text-gold-400 font-semibold">{it.quantity}x</span> {it.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                          <span className="text-stone-200 block">
                            R$ {sale.gross_amount.toFixed(2).replace('.', ',')}
                          </span>
                          {sale.discount_amount > 0 && (
                            <span className="text-stone-400 text-[10px]">
                              Desc: - R$ {sale.discount_amount.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-onyx-950 border border-gold-400/30 text-gold-300 font-mono text-[11px]">
                            {sale.shipping_state || 'SP'}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-mono text-sm font-bold text-gold-400 whitespace-nowrap">
                          R$ {sale.commission_amount.toFixed(2).replace('.', ',')}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            sale.status === 'paid'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : sale.status === 'approved'
                              ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                              : sale.status === 'pending'
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'bg-red-500/15 border-red-500/30 text-red-400'
                          }`}>
                            {sale.status === 'paid' && '✓ Pago'}
                            {sale.status === 'approved' && '● Aprovada'}
                            {sale.status === 'pending' && '⏳ Pendente'}
                            {sale.status === 'canceled' && '✕ Cancelada'}
                          </span>
                          {sale.paid_at && (
                            <span className="block text-[9px] text-stone-500 font-mono mt-0.5">
                              Pago: {new Date(sale.paid_at).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {sale.status !== 'paid' ? (
                            <button
                              onClick={() => {
                                setPayingSale(sale);
                                setPixProofInput('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-onyx-950 font-bold text-[11px] uppercase tracking-wider transition-all shadow"
                            >
                              Marcar como Pago
                            </button>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">
                              Liquidado
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* Modal 1: Edit Affiliate Rates */}
      {editingAffiliate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-onyx-900 border border-gold-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-foreground space-y-6">
            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
              <div className="flex items-center gap-2 text-gold-400">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold">Editar Dados do Embaixador</h3>
              </div>
              <button
                onClick={() => setEditingAffiliate(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                  Nome & Código
                </label>
                <div className="p-3 rounded-xl bg-onyx-950 border border-white/5 flex justify-between items-center">
                  <span className="font-semibold text-foreground">{editingAffiliate.name}</span>
                  <span className="font-mono font-bold text-gold-400">{editingAffiliate.code}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Comissão (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={editForm.commission_rate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, commission_rate: Number(e.target.value) }))}
                    className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground font-mono focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={editForm.discount_rate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, discount_rate: Number(e.target.value) }))}
                    className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground font-mono focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Chave PIX
                </label>
                <input
                  type="text"
                  placeholder="Chave PIX para recebimento"
                  value={editForm.pix_key}
                  onChange={(e) => setEditForm(prev => ({ ...prev, pix_key: e.target.value }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Status da Conta
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-stone-200 focus:border-gold-400 focus:outline-none"
                >
                  <option value="active">Ativo (Permite vendas e cupons)</option>
                  <option value="pending">Pendente (Aguardando aprovação)</option>
                  <option value="suspended">Suspenso (Código bloqueado)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingAffiliate(null)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-bold uppercase tracking-wider shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create New Affiliate */}
      {showNewAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-onyx-900 border border-gold-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-foreground space-y-6">
            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
              <div className="flex items-center gap-2 text-gold-400">
                <Plus className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold">Cadastrar Novo Embaixador</h3>
              </div>
              <button
                onClick={() => setShowNewAffiliateModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAffiliate} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Nome do Embaixador / Parceiro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chef Rodolfo Sommelier"
                  value={newAffiliateForm.name}
                  onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  placeholder="contato@embaixador.com.br"
                  value={newAffiliateForm.email}
                  onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Código do Cupom (até 10 caracteres alfanuméricos) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="Ex: RODOLFO10"
                  value={newAffiliateForm.code}
                  onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-gold-300 font-mono font-bold uppercase focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Comissão (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={newAffiliateForm.commission_rate}
                    onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, commission_rate: Number(e.target.value) }))}
                    className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground font-mono focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={newAffiliateForm.discount_rate}
                    onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, discount_rate: Number(e.target.value) }))}
                    className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground font-mono focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Chave PIX
                </label>
                <input
                  type="text"
                  placeholder="Chave PIX (CPF/CNPJ/Email/Telefone)"
                  value={newAffiliateForm.pix_key}
                  onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, pix_key: e.target.value }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowNewAffiliateModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-bold uppercase tracking-wider shadow-md"
                >
                  Cadastrar Embaixador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Mark Commission as Paid (PIX Liquidation) */}
      {payingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-onyx-900 border border-gold-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-foreground space-y-6">
            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <DollarSign className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold">Liquidar Comissão via PIX</h3>
              </div>
              <button
                onClick={() => setPayingSale(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Sale & Affiliate Summary */}
            {(() => {
              const aff = affiliates.find(a => a.id === payingSale.affiliate_id || a.code === payingSale.affiliate_code);
              return (
                <div className="space-y-4 text-xs font-sans">
                  <div className="p-4 rounded-2xl bg-onyx-950 border border-gold-400/20 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Embaixador:</span>
                      <strong className="text-foreground">{aff?.name || 'Embaixador'} (#{payingSale.affiliate_code})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Valor da Comissão:</span>
                      <strong className="text-gold-400 font-mono text-sm">R$ {payingSale.commission_amount.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Destino (UF):</span>
                      <span className="font-mono text-stone-200">{payingSale.shipping_state}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
                      <span className="text-stone-400">Chave PIX do Afiliado:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gold-300 font-semibold bg-onyx-900 px-2 py-1 rounded flex-1 select-all truncate border border-gold-400/20">
                          {aff?.pix_key || 'Chave PIX não cadastrada'}
                        </span>
                        {aff?.pix_key && (
                          <button
                            type="button"
                            onClick={() => handleCopyAffiliatePix(aff.pix_key)}
                            className="p-1.5 rounded-lg bg-gold-400/10 hover:bg-gold-400/20 text-gold-300 border border-gold-400/30"
                            title="Copiar Chave PIX"
                          >
                            {copiedPixKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleConfirmPayCommission} className="space-y-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                        Código / Comprovante PIX (End-to-End) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: E2E-98421098412498214 ou link do comprovante"
                        value={pixProofInput}
                        onChange={(e) => setPixProofInput(e.target.value)}
                        className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground font-mono focus:border-gold-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setPayingSale(null)}
                        className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-onyx-950 font-bold uppercase tracking-wider shadow-lg"
                      >
                        Confirmar Pagamento
                      </button>
                    </div>
                  </form>
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
