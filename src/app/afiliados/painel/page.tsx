'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Award, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  ChevronRight,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Affiliate, AffiliateSaleStatus } from '@/types';

export default function AffiliateDashboardPage() {
  const { 
    affiliates, 
    affiliateSales, 
    updateAffiliatePixKey,
    createAffiliate,
    currentUser,
    t 
  } = useStore();

  // Active affiliate code selection (defaults to CHEFANA or first active)
  const defaultAffiliate = affiliates.find(a => a.status === 'active') || affiliates[0];
  const [selectedCode, setSelectedCode] = useState<string>(defaultAffiliate?.code || 'CHEFANA');

  // Currently viewed affiliate
  const currentAffiliate = useMemo(() => {
    return affiliates.find(a => a.code.toUpperCase() === selectedCode.toUpperCase()) || defaultAffiliate;
  }, [affiliates, selectedCode, defaultAffiliate]);

  // PIX key state
  const [pixInput, setPixInput] = useState(currentAffiliate?.pix_key || '');
  const [pixSaved, setPixSaved] = useState(false);

  // Link copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter state for sales table
  const [statusFilter, setStatusFilter] = useState<'all' | AffiliateSaleStatus>('all');

  // Create new affiliate modal / inline form toggle
  const [showNewAffiliateModal, setShowNewAffiliateModal] = useState(false);
  const [newAffiliateForm, setNewAffiliateForm] = useState({
    name: '',
    email: '',
    code: '',
    pix_key: '',
  });

  // Sales linked to this affiliate
  const sales = useMemo(() => {
    if (!currentAffiliate) return [];
    return affiliateSales.filter(s => s.affiliate_id === currentAffiliate.id || s.affiliate_code === currentAffiliate.code);
  }, [affiliateSales, currentAffiliate]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    if (statusFilter === 'all') return sales;
    return sales.filter(s => s.status === statusFilter);
  }, [sales, statusFilter]);

  // Metrics calculation
  const totalSalesCount = sales.length;
  const totalGrossRevenue = sales.reduce((acc, s) => acc + s.gross_amount, 0);
  const totalPendingCommissions = sales
    .filter(s => s.status === 'pending' || s.status === 'approved')
    .reduce((acc, s) => acc + s.commission_amount, 0);
  const totalPaidCommissions = sales
    .filter(s => s.status === 'paid')
    .reduce((acc, s) => acc + s.commission_amount, 0);

  // Referral URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.tiubareserve.com.br';
  const referralUrl = `${baseUrl}/?ref=${currentAffiliate?.code || 'TIUBA10'}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard && currentAffiliate) {
      navigator.clipboard.writeText(currentAffiliate.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (!currentAffiliate) return;
    const text = `Olá! Conheça os méis nobres e raros de abelha nativa Tiúba da Amazônia na TIÚBA RESERVE. Utilizando meu código exclusivo ${currentAffiliate.code}, você garante ${currentAffiliate.discount_rate}% de desconto especial em seu pedido: ${referralUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSavePix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAffiliate) return;
    updateAffiliatePixKey(currentAffiliate.id, pixInput);
    setPixSaved(true);
    setTimeout(() => setPixSaved(false), 3000);
  };

  const handleCreateAffiliateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffiliateForm.code || !newAffiliateForm.name) return;

    const created = createAffiliate({
      name: newAffiliateForm.name,
      email: newAffiliateForm.email || 'embaixador@tiubareserve.com.br',
      code: newAffiliateForm.code.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      commission_rate: 10.0,
      discount_rate: 5.0,
      pix_key: newAffiliateForm.pix_key,
      status: 'active',
    });

    setSelectedCode(created.code);
    setPixInput(created.pix_key || '');
    setShowNewAffiliateModal(false);
    setNewAffiliateForm({ name: '', email: '', code: '', pix_key: '' });
  };

  return (
    <div className="w-full min-h-screen bg-onyx-950 py-12 px-4 sm:px-6 lg:px-8 text-foreground font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Code Switcher for Quick Simulation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-4">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold-400/50" />
            <Link href="/afiliados" className="hover:text-gold-300 transition-colors">Embaixadores</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold-400/50" />
            <span className="text-gold-300 font-semibold">Painel de Comissões</span>
          </div>

          {/* Quick switcher to test different ambassadors */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Visualizando Embaixador:</span>
            <select
              value={currentAffiliate?.code || ''}
              onChange={(e) => {
                setSelectedCode(e.target.value);
                const aff = affiliates.find(a => a.code === e.target.value);
                if (aff) setPixInput(aff.pix_key || '');
              }}
              className="bg-onyx-900 border border-gold-400/30 text-gold-300 text-xs rounded-lg px-3 py-1.5 focus:border-gold-400 focus:outline-none font-mono"
            >
              {affiliates.map((aff) => (
                <option key={aff.id} value={aff.code}>
                  {aff.code} ({aff.name}) - {aff.status.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowNewAffiliateModal(true)}
              className="text-xs text-gold-400 hover:text-gold-200 underline ml-2 whitespace-nowrap"
            >
              + Novo Cadastro
            </button>
          </div>
        </div>

        {/* 1. Header & Ambassador Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-onyx-900 via-onyx-950 to-onyx-900 border border-gold-400/30 p-6 sm:p-8 shadow-2xl shadow-black/80">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Ambassador Info & Code Badge */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-[11px] font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                <span>Embaixador Exclusivo Tiúba Reserve</span>
              </div>

              <div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  {currentAffiliate?.name || 'Embaixador Convidado'}
                </h1>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Comissão por Venda: <strong className="text-gold-300 font-mono">{currentAffiliate?.commission_rate}%</strong> · Desconto Concedido: <strong className="text-gold-300 font-mono">{currentAffiliate?.discount_rate}% OFF</strong>
                </p>
              </div>

              {/* Code Highlight Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-onyx-950 border border-gold-400/40 shadow-inner">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                    Seu Código:
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-gold-400 tracking-widest">
                    {currentAffiliate?.code || 'N/A'}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-gold-400/10 hover:bg-gold-400/20 text-gold-300 transition-colors"
                    title="Copiar Código"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  currentAffiliate?.status === 'active' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : currentAffiliate?.status === 'pending'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  Status: {currentAffiliate?.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Right: Referral Sharing & PIX Key Management */}
            <div className="lg:col-span-6 space-y-4 bg-onyx-900/60 p-5 sm:p-6 rounded-2xl border border-gold-400/20">
              
              {/* Shareable Link */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-bold block">
                  Link Direto de Indicação (com cupom embutido):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="flex-1 bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-400/15 hover:bg-gold-400/25 border border-gold-400/40 text-gold-300 text-xs font-semibold transition-all whitespace-nowrap"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-semibold transition-all whitespace-nowrap"
                    title="Compartilhar no WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* PIX Key Form */}
              <form onSubmit={handleSavePix} className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-bold block">
                  Chave PIX para Depósito de Comissões:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="CPF, CNPJ, E-mail, Celular ou Chave Aleatória"
                      value={pixInput}
                      onChange={(e) => setPixInput(e.target.value)}
                      className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-stone-500 focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gold-400 text-onyx-950 hover:bg-gold-300 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-md shadow-gold-400/20"
                  >
                    {pixSaved ? 'Salvo!' : 'Salvar PIX'}
                  </button>
                </div>
                {pixSaved && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Chave PIX atualizada com sucesso para recebimento.</span>
                  </p>
                )}
              </form>

            </div>

          </div>
        </div>

        {/* 2. Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Sales */}
          <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-lg relative overflow-hidden group hover:border-gold-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Vendas Realizadas
              </span>
              <div className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-serif text-3xl font-bold text-foreground">
                {totalSalesCount}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Pedidos com seu cupom
              </p>
            </div>
          </div>

          {/* Gross Revenue */}
          <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-lg relative overflow-hidden group hover:border-gold-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Faturamento Gerado
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-serif text-3xl font-bold text-foreground">
                R$ {totalGrossRevenue.toFixed(2).replace('.', ',')}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Volume bruto movimentado
              </p>
            </div>
          </div>

          {/* Pending Commissions */}
          <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-lg relative overflow-hidden group hover:border-gold-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                Comissões a Receber
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-serif text-3xl font-bold text-amber-300">
                R$ {totalPendingCommissions.toFixed(2).replace('.', ',')}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Status: Pendente / Aprovada
              </p>
            </div>
          </div>

          {/* Paid Commissions */}
          <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-lg relative overflow-hidden group hover:border-gold-400/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Comissões Já Pagas
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-serif text-3xl font-bold text-emerald-400">
                R$ {totalPaidCommissions.toFixed(2).replace('.', ',')}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Transferido via PIX
              </p>
            </div>
          </div>

        </div>

        {/* 3. Sales Table Section (LGPD Compliant) */}
        <div className="bg-onyx-900 border border-gold-400/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2 text-gold-400">
                <Layers className="w-5 h-5" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Extrato de Vendas Realizadas
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Acompanhe em tempo real cada compra efetuada com seu código de divulgação.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-onyx-950 rounded-xl border border-gold-400/20 text-xs">
              {(['all', 'pending', 'approved', 'paid', 'canceled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all uppercase tracking-wider text-[11px] ${
                    statusFilter === st
                      ? 'bg-gold-400 text-onyx-950 font-bold shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {st === 'all' ? 'Todas' : st === 'pending' ? 'Pendente' : st === 'approved' ? 'Aprovada' : st === 'paid' ? 'Paga' : 'Cancelada'}
                </button>
              ))}
            </div>
          </div>

          {/* LGPD Compliant Banner Notice */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gold-400/5 border border-gold-400/20 text-xs text-stone-300">
            <Info className="w-4 h-4 text-gold-400 shrink-0" />
            <span>
              <strong>Privacidade & Conformidade LGPD:</strong> Em respeito à legislação de proteção de dados, nomes, e-mails, telefones e endereços completos dos compradores são mantidos em sigilo absoluto. Apenas o Estado (UF) e o resumo dos itens são exibidos.
            </span>
          </div>

          {/* Table */}
          {filteredSales.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-onyx-950 border border-gold-400/20 flex items-center justify-center mx-auto text-stone-500">
                <Filter className="w-5 h-5" />
              </div>
              <p className="text-sm text-stone-300 font-serif">
                Nenhuma venda encontrada com os filtros selecionados.
              </p>
              <p className="text-xs text-stone-500">
                Compartilhe seu link exclusivo nas suas redes ou contatos para começar a faturar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gold-400/20 text-[11px] font-serif uppercase tracking-wider text-gold-400/90 pb-3">
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Itens / Quantidade</th>
                    <th className="py-3 px-3">Valor da Venda</th>
                    <th className="py-3 px-3">Desconto Aplicado</th>
                    <th className="py-3 px-3">Destino (UF)</th>
                    <th className="py-3 px-3">Sua Comissão</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredSales.map((sale) => {
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
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="space-y-1">
                            {sale.items_summary.map((item, idx) => (
                              <div key={idx} className="text-stone-200 truncate">
                                <span className="font-mono text-gold-400 font-semibold">{item.quantity}x</span> {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-stone-200 whitespace-nowrap">
                          R$ {sale.gross_amount.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-stone-400 whitespace-nowrap">
                          {sale.discount_amount > 0 ? `- R$ ${sale.discount_amount.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2.5 py-1 rounded bg-onyx-950 border border-gold-400/30 text-gold-300 font-mono font-bold text-[11px]">
                            {sale.shipping_state || 'BR'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-sm font-bold text-gold-400 whitespace-nowrap">
                          R$ {sale.commission_amount.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            sale.status === 'paid'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : sale.status === 'approved'
                              ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                              : sale.status === 'pending'
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'bg-red-500/15 border-red-500/30 text-red-400'
                          }`}>
                            {sale.status === 'paid' && '✓ Pago'}
                            {sale.status === 'approved' && '● Aprovado'}
                            {sale.status === 'pending' && '⏳ Pendente'}
                            {sale.status === 'canceled' && '✕ Cancelado'}
                          </span>
                          {sale.paid_at && (
                            <span className="block text-[9px] text-stone-500 font-mono mt-0.5">
                              Pago em: {new Date(sale.paid_at).toLocaleDateString('pt-BR')}
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

      </div>

      {/* Modal: Cadastro de Novo Embaixador */}
      {showNewAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-onyx-900 border border-gold-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-foreground space-y-6">
            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
              <div className="flex items-center gap-2 text-gold-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold">Cadastrar Novo Embaixador</h3>
              </div>
              <button
                onClick={() => setShowNewAffiliateModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAffiliateSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Nome do Divulgador / Influenciador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chef Fernanda Sommelier"
                  value={newAffiliateForm.name}
                  onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-foreground focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  E-mail do Embaixador
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
                  Código Desejado (até 10 letras/números) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="Ex: TIUBAVIP ou CHEF10"
                  value={newAffiliateForm.code}
                  onChange={(e) => setNewAffiliateForm(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                  className="w-full bg-onyx-950 border border-gold-400/30 rounded-xl px-3 py-2 text-gold-300 font-mono font-bold uppercase focus:border-gold-400 focus:outline-none"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Padrão do programa: 10% de comissão e 5% de desconto para seus seguidores.
                </span>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Chave PIX para Depósito
                </label>
                <input
                  type="text"
                  placeholder="Chave PIX (CPF/Email/Telefone)"
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
                  className="px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-bold uppercase tracking-wider shadow-lg shadow-gold-400/20"
                >
                  Ativar Embaixador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
