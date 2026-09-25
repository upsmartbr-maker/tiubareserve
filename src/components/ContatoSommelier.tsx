"use client";

import React, { useState } from "react";

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
  const WHATSAPP_NUMBER = "551131978800"; // Substitua pelo número real da Tiúba Reserve

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
      // Simulação ou chamada real à API (ex: /api/contact)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setEnviado(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "Dúvidas e Sugestões",
        mensagem: "",
      });
    } catch (error) {
      alert("Ocorreu um erro ao enviar. Por favor, tente pelo canal do WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-[#070605] text-[#f4ecd8] px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#d6b26d] font-semibold bg-[#1a140d] px-3 py-1 rounded border border-[#3b2d18]">
            Atendimento de Alto Padrão
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#fcf9f2] pt-2">
            Contato & Sommelier
          </h2>
          <p className="text-xs sm:text-sm text-[#a89a85] max-w-xl mx-auto">
            Estamos à disposição de sommeliers, chefs, colecionadores e parceiros comerciais de exportação. Escolha o canal de sua preferência.
          </p>
        </div>

        {/* Grade de Contacto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formulário Oficial */}
          <div className="lg:col-span-7 bg-[#0c0a08] border border-[#2b2216] rounded-lg p-6 sm:p-8">
            <h3 className="text-lg font-serif text-[#fcf9f2] tracking-wide">
              Envie uma Mensagem à Curadoria
            </h3>
            <p className="text-xs text-[#8e816f] mt-1 mb-6">
              Retornamos em até 24 horas úteis com atenção exclusiva.
            </p>

            {enviado ? (
              <div className="p-6 bg-[#162219] border border-[#234d34] rounded text-center space-y-3">
                <span className="text-2xl">🌿</span>
                <h4 className="text-base font-serif text-[#48bb78]">Mensagem Entregue com Sucesso</h4>
                <p className="text-xs text-[#ded4c3]">
                  A nossa curadoria gastronómica entrará em contacto através do e-mail ou WhatsApp fornecido.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="text-xs text-[#d6b26d] underline pt-2 block mx-auto"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a89a85] uppercase tracking-wider mb-1.5 font-medium">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex.: Carlos Eduardo Meirelles"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full bg-[#14100b] border border-[#332819] rounded p-3 text-[#fcf9f2] placeholder-[#5f5445] focus:border-[#d6b26d] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a89a85] uppercase tracking-wider mb-1.5 font-medium">
                      E-mail Corporativo ou Pessoal *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@exemplo.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#14100b] border border-[#332819] rounded p-3 text-[#fcf9f2] placeholder-[#5f5445] focus:border-[#d6b26d] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a89a85] uppercase tracking-wider mb-1.5 font-medium">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full bg-[#14100b] border border-[#332819] rounded p-3 text-[#fcf9f2] placeholder-[#5f5445] focus:border-[#d6b26d] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a89a85] uppercase tracking-wider mb-1.5 font-medium">
                      Assunto Principal *
                    </label>
                    <select
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      className="w-full bg-[#14100b] border border-[#332819] rounded p-3 text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                    >
                      <option value="Dúvidas e Sugestões">Dúvidas e Sugestões</option>
                      <option value="Consultoria com Sommelier">Consultoria com Sommelier</option>
                      <option value="Parceria B2B e Alta Gastronomia">Parceria B2B e Alta Gastronomia</option>
                      <option value="Exportação de Safra Especial">Exportação de Safra Especial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1.5 font-medium">
                    Sua Mensagem *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva como podemos atendê-lo com excelência..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className="w-full bg-[#14100b] border border-[#332819] rounded p-3 text-[#fcf9f2] placeholder-[#5f5445] focus:border-[#d6b26d] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#a38038] hover:brightness-110 text-black font-semibold uppercase tracking-[0.15em] rounded transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? "A enviar..." : "✈ Enviar Mensagem Oficial"}
                </button>
              </form>
            )}
          </div>

          {/* Cartões Rápidos e WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Canal WhatsApp Sommelier */}
            <div className="bg-[#0c0a08] border border-[#2b2216] rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#48bb78]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#fcf9f2]">
                  Canal Sommelier WhatsApp
                </span>
              </div>
              
              <p className="text-xs text-[#a89a85] leading-relaxed">
                Prefere conversar em tempo real? O nosso sommelier especializado está pronto para esclarecer dúvidas sobre floradas, harmonizações gastronómicas e lotes especiais numerados.
              </p>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3.5 bg-[#1ebd5e] hover:bg-[#18a852] text-black font-semibold text-xs tracking-wider uppercase rounded flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>💬</span> Iniciar Conversa no WhatsApp
              </button>
            </div>

            {/* Sede Institucional & Dados */}
            <div className="bg-[#0c0a08] border border-[#2b2216] rounded-lg p-6 space-y-4 text-xs text-[#c4b8a5]">
              <h4 className="font-serif text-sm text-[#fcf9f2] tracking-wide uppercase">
                Sede Institucional & Dados
              </h4>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#d6b26d]">📍</span>
                  <div>
                    <span className="text-[#8e816f] block uppercase tracking-wider text-[10px]">Endereço Corporativo</span>
                    <p>Av. Brigadeiro Faria Lima, 3477 - 14º Andar, Itaim Bibi, São Paulo - SP</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#d6b26d]">📞</span>
                  <div>
                    <span className="text-[#8e816f] block uppercase tracking-wider text-[10px]">Telefones Oficiais</span>
                    <p>+55 (11) 3197-8800 / WhatsApp Comercial</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#d6b26d]">✉</span>
                  <div>
                    <span className="text-[#8e816f] block uppercase tracking-wider text-[10px]">E-mail Geral</span>
                    <p>contato@tiubareserve.com.br</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c160f] text-[10px] text-[#7a6f5e]">
                CNPJ: 48.912.430/0001-85
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
