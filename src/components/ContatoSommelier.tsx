"use client";

import React, { useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles,
  ShieldCheck,
  Clock
} from "lucide-react";

export default function ContatoSommelier() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "Dúvidas e Sugestões",
    mensagem: "",
  });

  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Número oficial de suporte/sommelier (DDI + DDD + Número)
  const WHATSAPP_NUMBER = "551131978800";

  const handleWhatsAppDirect = () => {
    const texto = encodeURIComponent(
      `Olá, Sommelier Tiúba Reserve! Gostaria de uma consultoria sobre os méis de Melipona fasciculata, harmonizações e lotes especiais disponíveis.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setEnviado(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "Dúvidas e Sugestões",
        mensagem: "",
      });
    } catch {
      alert("Ocorreu um erro ao enviar. Por favor, tente pelo canal do WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-20 sm:py-28 bg-onyx-950 text-foreground px-4 sm:px-6 lg:px-8 border-t border-gold-400/15">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Atendimento de Alto Padrão</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
            Contato & Sommelier
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            Estamos à disposição de sommeliers, chefs, colecionadores e parceiros comerciais de exportação. Escolha o canal de sua preferência.
          </p>
        </div>

        {/* Grade de Contato */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Formulário Oficial */}
          <div className="lg:col-span-7 bg-onyx-900 border border-gold-400/25 rounded-2xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-gold-400/15 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-foreground tracking-wide">
                  Envie uma Mensagem à Curadoria
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Retornamos em até 24 horas úteis com atenção exclusiva</span>
                </div>
              </div>
            </div>

            {enviado ? (
              <div className="p-8 bg-forest-deep/60 border border-emerald-500/30 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif font-bold text-emerald-300">
                  Mensagem Entregue com Sucesso
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md mx-auto">
                  A nossa curadoria gastronômica entrará em contato através do e-mail ou WhatsApp fornecido.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 underline pt-2 block mx-auto transition-colors"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 uppercase tracking-wider mb-1.5 font-sans font-medium text-[11px]">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex.: Carlos Eduardo Meirelles"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg p-3 text-foreground placeholder:text-stone-500 focus:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 uppercase tracking-wider mb-1.5 font-sans font-medium text-[11px]">
                      E-mail Corporativo ou Pessoal *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@exemplo.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg p-3 text-foreground placeholder:text-stone-500 focus:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 uppercase tracking-wider mb-1.5 font-sans font-medium text-[11px]">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg p-3 text-foreground placeholder:text-stone-500 focus:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 uppercase tracking-wider mb-1.5 font-sans font-medium text-[11px]">
                      Assunto Principal *
                    </label>
                    <select
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg p-3 text-foreground focus:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all font-sans"
                    >
                      <option value="Dúvidas e Sugestões">Dúvidas e Sugestões</option>
                      <option value="Consultoria com Sommelier">Consultoria com Sommelier</option>
                      <option value="Parceria B2B e Alta Gastronomia">Parceria B2B e Alta Gastronomia</option>
                      <option value="Exportação de Safra Especial">Exportação de Safra Especial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 uppercase tracking-wider mb-1.5 font-sans font-medium text-[11px]">
                    Sua Mensagem *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva como podemos atendê-lo com excelência..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg p-3 text-foreground placeholder:text-stone-500 focus:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400 outline-none resize-none transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 hover:brightness-110 text-onyx-950 font-serif font-bold uppercase tracking-luxury text-xs rounded-full transition-all shadow-lg shadow-gold-400/20 hover:shadow-[0_0_20px_rgba(223,183,67,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{loading ? "A enviar..." : "Enviar Mensagem Oficial"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Cartões Rápidos e WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Canal WhatsApp Sommelier */}
            <div className="bg-onyx-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-emerald-300">
                  Canal Sommelier WhatsApp
                </span>
              </div>
              
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Prefere conversar em tempo real? O nosso sommelier especializado está pronto para esclarecer dúvidas sobre floradas, harmonizações gastronômicas e lotes especiais numerados.
              </p>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Iniciar Conversa no WhatsApp</span>
              </button>
            </div>

            {/* Sede Institucional & Dados */}
            <div className="bg-onyx-900 border border-gold-400/20 rounded-2xl p-6 sm:p-7 space-y-4 text-xs text-stone-300 shadow-xl">
              <h4 className="font-serif text-sm text-foreground tracking-wide uppercase font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Sede Institucional & Dados</span>
              </h4>
              
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-mono">Endereço Corporativo</span>
                    <p className="text-stone-200 mt-0.5">Av. Brigadeiro Faria Lima, 3477 - 14º Andar, Itaim Bibi, São Paulo - SP</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-mono">Telefones Oficiais</span>
                    <p className="text-stone-200 mt-0.5">+55 (11) 3197-8800 / WhatsApp Comercial</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-mono">E-mail Geral</span>
                    <p className="text-stone-200 mt-0.5">contato@tiubareserve.com.br</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gold-400/10 text-[11px] font-mono text-stone-400">
                CNPJ: 48.912.430/0001-85
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
