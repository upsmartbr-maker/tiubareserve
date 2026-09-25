'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  Calendar, 
  Eye, 
  Sparkles,
  Package
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { orders, products, t } = useStore();

  // Metrics Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalOrdersCount = orders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const totalFlasks = orders.reduce(
    (acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  // Monthly Revenue Mock Data for visual bars
  const monthlyData = [
    { month: 'Mai', amount: 18400, height: '40%' },
    { month: 'Jun', amount: 24800, height: '55%' },
    { month: 'Jul', amount: 31200, height: '70%' },
    { month: 'Ago', amount: 39500, height: '85%' },
    { month: 'Set', amount: totalRevenue > 0 ? totalRevenue + 45000 : 54200, height: '95%' },
  ];

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            Visão Geral Executiva
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Dashboard Tiúba Reserve
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/produtos"
            className="px-4 py-2.5 rounded-xl border border-gold-400/30 bg-onyx-900 text-gold-300 hover:bg-gold-400/10 text-xs font-serif uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4 text-gold-400" />
            <span>Gerenciar Produtos</span>
          </Link>
          <Link
            href="/admin/pedidos"
            className="px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Todos os Pedidos</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-bold font-sans">
              Receita Total
            </span>
            <div className="p-2 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold gold-text block">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[11px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4% em relação ao mês anterior
            </span>
          </div>
        </div>

        {/* Metric 2: Orders Count */}
        <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-bold font-sans">
              Pedidos Realizados
            </span>
            <div className="p-2 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground block">
              {totalOrdersCount}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              Transações com PIX, Stripe e MP
            </span>
          </div>
        </div>

        {/* Metric 3: Average Ticket */}
        <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-bold font-sans">
              Ticket Médio
            </span>
            <div className="p-2 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 block">
              R$ {averageTicket.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              Média por pedido fechado
            </span>
          </div>
        </div>

        {/* Metric 4: Flasks Allocated */}
        <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-bold font-sans">
              Frascos Reservados
            </span>
            <div className="p-2 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-foreground block">
              {totalFlasks} frascos
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              Volume: {totalFlasks * 150} ml de Tiúba
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Chart Simulation */}
      <div className="p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">
              Evolução de Faturamento Mensal (Safra 2026)
            </h3>
            <p className="text-xs text-stone-400 font-sans">
              Receita consolidada de vendas diretas e enotecas parceiras
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-300">
            <Calendar className="w-4 h-4" />
            <span>Ano Corrente: 2026</span>
          </div>
        </div>

        {/* Interactive Bar Chart Graphic */}
        <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4 border-b border-gold-400/15">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
              <span className="text-[10px] font-mono text-stone-400 group-hover:text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity">
                R$ {(d.amount / 1000).toFixed(1)}k
              </span>
              <div
                className="w-full max-w-[50px] bg-gradient-to-t from-onyx-950 via-gold-600 to-gold-400 rounded-t-xl group-hover:from-gold-600 group-hover:to-gold-300 transition-all duration-500 shadow-md group-hover:shadow-gold-400/20"
                style={{ height: d.height }}
              />
              <span className="text-xs uppercase font-sans font-bold text-stone-300">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            Pedidos Recentes
          </h3>
          <Link
            href="/admin/pedidos"
            className="text-xs font-serif uppercase tracking-wider text-gold-400 hover:text-gold-300 flex items-center gap-1"
          >
            <span>Gerenciar todos ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-gold-400/15">
              <tr>
                <th className="py-3 px-4">Pedido Nº</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-foreground">
                    {order.order_number}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-foreground font-semibold block">{order.user_name}</span>
                    <span className="text-[10px] text-stone-400">{order.user_email}</span>
                  </td>
                  <td className="py-3 px-4 uppercase font-mono text-gold-300">
                    {order.payment_method}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.payment_status} />
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-gold-300">
                    R$ {order.total_amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/admin/pedidos"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-gold-400 hover:bg-gold-400/10 inline-flex transition-colors"
                      title="Ver detalhes do pedido"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-amber-950/70 text-amber-300 border-amber-500/30' },
    paid: { label: 'Pago', color: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' },
    preparing: { label: 'Em Separação', color: 'bg-sky-950/70 text-sky-300 border-sky-500/30' },
    shipped: { label: 'Enviado', color: 'bg-purple-950/70 text-purple-300 border-purple-500/30' },
    completed: { label: 'Concluído', color: 'bg-teal-950/70 text-teal-300 border-teal-500/30' },
    cancelled: { label: 'Cancelado', color: 'bg-red-950/70 text-red-300 border-red-500/30' },
  };

  const item = map[status] || map.pending;

  return (
    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${item.color}`}>
      {item.label}
    </span>
  );
}
