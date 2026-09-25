'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink, 
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, attachProofToOrder, settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newTrackingCode, setNewTrackingCode] = useState('');
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [proofUrlInput, setProofUrlInput] = useState('');

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewTrackingCode(order.tracking_code || '');
    setNewStatus(order.payment_status);
    setProofUrlInput(order.proof_url || '');
  };

  const handleSaveOrderChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, newStatus, newTrackingCode);
    if (proofUrlInput) {
      attachProofToOrder(selectedOrder.id, proofUrlInput);
    }

    // Update local modal state
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            payment_status: newStatus,
            tracking_code: newTrackingCode,
            proof_url: proofUrlInput,
          }
        : null
    );

    alert('Status do pedido e código de rastreamento atualizados com sucesso!');
  };

  const handleNotifyCustomerWhatsApp = (order: Order) => {
    const phone = order.user_phone ? order.user_phone.replace(/\D/g, '') : '';
    const text = `Olá ${order.user_name}! 🍯 Aqui é da curadoria TIÚBA RESERVE.\n\nInformamos que seu pedido *#${order.order_number}* foi atualizado para o status: *${newStatus.toUpperCase()}*.\n\nCódigo de Rastreamento: *${newTrackingCode || 'Em processamento com mensageiro'}*\nModalidade: ${order.shipping_type}\n\nVocê pode rastrear a qualquer momento no site oficial. Agradecemos sua confiança em nossos méis ancestrais! ✨`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            Gestão Operacional de Vendas
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Gestor de Pedidos & Comprovantes
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-onyx-900 border border-gold-400/20">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por Pedido, Nome ou E-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-onyx-950 border border-gold-400/20 rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs uppercase font-sans text-stone-400 font-bold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendente' },
            { id: 'paid', label: 'Pago' },
            { id: 'preparing', label: 'Em Separação' },
            { id: 'shipped', label: 'Enviado' },
            { id: 'completed', label: 'Concluído' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider shrink-0 transition-all ${
                statusFilter === st.id
                  ? 'bg-gold-400 text-onyx-950 font-bold'
                  : 'bg-onyx-950 border border-gold-400/20 text-stone-300 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-gold-400/15">
              <tr>
                <th className="py-3.5 px-4">Pedido Nº</th>
                <th className="py-3.5 px-4">Data / Hora</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Itens</th>
                <th className="py-3.5 px-4">Envio</th>
                <th className="py-3.5 px-4">Método</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4 text-right">Gerenciar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {order.order_number}
                  </td>
                  <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-foreground font-semibold block">{order.user_name}</span>
                    <span className="text-[10px] text-stone-400">{order.user_phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-stone-300">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} frascos
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-stone-300 block truncate max-w-[120px]" title={order.shipping_type}>
                      {order.shipping_type}
                    </span>
                    {order.tracking_code && (
                      <span className="text-[10px] font-mono text-gold-300">
                        Rastreio: {order.tracking_code}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 uppercase font-mono text-gold-300">
                    {order.payment_method}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.payment_status} />
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-gold-300">
                    R$ {order.total_amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(order)}
                      className="px-3 py-1.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-onyx-900 border border-gold-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-luxury text-gold-400 font-bold block">
                  Gerenciador do Pedido
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Pedido #{selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-onyx-950 border border-gold-400/15 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">
                  Destinatário
                </span>
                <p className="font-semibold text-foreground">{selectedOrder.user_name}</p>
                <p className="text-stone-400">{selectedOrder.user_email}</p>
                <p className="text-stone-400">{selectedOrder.user_phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">
                  Endereço de Entrega
                </span>
                <p className="text-stone-300">
                  {selectedOrder.shipping_address.street}, {selectedOrder.shipping_address.number}
                  {selectedOrder.shipping_address.complement ? ` - ${selectedOrder.shipping_address.complement}` : ''}
                </p>
                <p className="text-stone-400">
                  {selectedOrder.shipping_address.neighborhood} · {selectedOrder.shipping_address.city}/{selectedOrder.shipping_address.state}
                </p>
                <p className="font-mono text-gold-300">CEP: {selectedOrder.shipping_address.zipCode}</p>
              </div>
            </div>

            {/* Items in this order */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-bold block">
                Itens Adquiridos
              </span>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-onyx-950 border border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-onyx-900 shrink-0">
                        <Image src={item.product.images[0] || '/images/hero-bottle.jpg'} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">{item.product.name}</span>
                        <span className="text-[10px] text-stone-400">{item.product.volume} · Qtd: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono text-gold-300 font-bold">
                      R$ {((item.product.promo_price || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PIX Proof Viewer */}
            {selectedOrder.payment_method === 'pix' && (
              <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/20 space-y-3">
                <span className="text-xs uppercase font-bold text-gold-400 block">
                  Comprovante de Pagamento PIX
                </span>
                {selectedOrder.proof_url ? (
                  <div className="flex items-center gap-4">
                    <a
                      href={selectedOrder.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-300 hover:bg-gold-400/20 text-xs font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Visualizar Comprovante do Cliente</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-stone-400">
                      Nenhum link ou foto foi anexado ainda. Insira a URL do arquivo ou aprove manualmente abaixo:
                    </p>
                    <input
                      type="text"
                      placeholder="https://... ou caminho do comprovante"
                      value={proofUrlInput}
                      onChange={(e) => setProofUrlInput(e.target.value)}
                      className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Order Management Form: Status & Tracking */}
            <form onSubmit={handleSaveOrderChanges} className="space-y-4 border-t border-gold-400/20 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Alterar Status do Pedido *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-onyx-950 border border-gold-400/30 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  >
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago (Aprovado)</option>
                    <option value="preparing">Em Separação</option>
                    <option value="shipped">Enviado (Em trânsito)</option>
                    <option value="completed">Concluído (Entregue)</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Código de Rastreamento (Correios / Motoboy)
                  </label>
                  <input
                    type="text"
                    value={newTrackingCode}
                    onChange={(e) => setNewTrackingCode(e.target.value)}
                    placeholder="Ex.: BR894210928BR ou MOTO-SP-01"
                    className="w-full bg-onyx-950 border border-gold-400/30 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNotifyCustomerWhatsApp(selectedOrder)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notificar Cliente no WhatsApp</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
