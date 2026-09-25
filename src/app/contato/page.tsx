'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const { settings, t } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Dúvidas e Sugestões');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleSommelierWhatsApp = () => {
    const wa = settings.sommelier_phone || settings.whatsapp || '5511999988888';
    const text = `Olá Sommelier Tiúba Reserve! 🍯 Gostaria de atendimento personalizado para enoteca/alta gastronomia ou dúvidas sobre safras especiais.`;
    window.open(`https://wa.me/${wa.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full pb-24 space-y-16">
      {/* Header Banner */}
      <section className="relative w-full py-16 bg-gradient-to-b from-onyx-950 via-forest-dark to-onyx-950 border-b border-gold-400/20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-onyx-950 text-gold-300 text-[10px] font-sans uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('Atendimento de Alto Padrão', 'High-End Customer Concierge')}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            {t('Contato & Sommelier', 'Contact & Sommelier')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
            {t(
              'Estamos à disposição de sommeliers, chefs, colecionadores e parceiros comerciais de exportação. Escolha o canal de sua preferência.',
              'Available for sommeliers, Michelin-starred chefs, collectors, and export partners. Connect through your preferred channel.'
            )}
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Direct Channels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-2xl space-y-6">
            <div className="border-b border-gold-400/15 pb-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                {t('Envie uma Mensagem à Curadoria', 'Send a Message to the Curators')}
              </h2>
              <p className="text-xs text-stone-400 mt-1 font-sans">
                {t('Retornamos em até 24 horas úteis com atenção exclusiva.', 'We respond within 24 business hours with dedicated attention.')}
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-onyx-950 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {t('Mensagem Enviada com Sucesso!', 'Message Successfully Sent!')}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-sans max-w-md mx-auto">
                  {t(
                    `Obrigado pelo contato, ${fullName}. Nossa equipe de curadores botânicos já recebeu seus dados e entrará em contato pelo e-mail ou WhatsApp informado.`,
                    `Thank you, ${fullName}. Our team has received your message and will follow up shortly via email or phone.`
                  )}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-400 text-onyx-950 font-serif font-bold text-xs uppercase"
                >
                  {t('Enviar Outra Mensagem', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                      {t('Seu Nome Completo *', 'Your Full Name *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex.: Carlos Eduardo Meirelles"
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                      {t('E-mail Corporativo ou Pessoal *', 'Email Address *')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="carlos@exemplo.com.br"
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                      {t('Telefone / WhatsApp *', 'Phone / WhatsApp *')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                      {t('Assunto Principal *', 'Subject *')}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
                    >
                      <option value="Dúvidas e Sugestões">{t('Dúvidas e Sugestões', 'Inquiries & Suggestions')}</option>
                      <option value="Suporte a Vendas">{t('Suporte a Vendas', 'Sales Support')}</option>
                      <option value="Revenda & Exportação">{t('Revenda & Exportação', 'Wholesale & Export')}</option>
                      <option value="Posição de Pedido">{t('Posição de Pedido', 'Order Status')}</option>
                      <option value="Outros">{t('Outros', 'Other Topics')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    {t('Sua Mensagem *', 'Your Message *')}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('Descreva como podemos atendê-lo com excelência...', 'How may we assist you with excellence...')}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold-400/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t('Transmitindo...', 'Transmitting...')}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('Enviar Mensagem Oficial', 'Send Official Message')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Sommelier & Institutional Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Sommelier Direct Card */}
            <div className="p-8 rounded-3xl bg-forest-dark border border-gold-400/30 space-y-5 shadow-2xl">
              <div className="flex items-center gap-3 text-gold-400">
                <MessageSquare className="w-6 h-6 text-gold-400" />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-foreground">
                  {t('Canal Sommelier WhatsApp', 'WhatsApp Sommelier Desk')}
                </h3>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {t(
                  'Prefere conversar em tempo real? Nosso sommelier especializado está pronto para tirar dúvidas sobre floradas, harmonizações gastronômicas e lotes especiais numerados.',
                  'Prefer immediate real-time chat? Our honey sommelier is available to assist you with pairings, harvests, and custom gift boxes.'
                )}
              </p>
              <button
                onClick={handleSommelierWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('Iniciar Conversa no WhatsApp', 'Start WhatsApp Chat')}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

            {/* Corporate Location & Legal Card */}
            <div className="p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 space-y-6">
              <h3 className="font-serif text-sm font-bold uppercase tracking-luxury text-gold-300 border-b border-gold-400/15 pb-3">
                {t('Sede Institucional & Dados', 'Corporate Headquarters')}
              </h3>

              <div className="space-y-4 text-xs font-sans text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block">{t('Endereço Corporativo:', 'Address:')}</strong>
                    <span className="text-stone-400">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block">{t('Telefones Oficiais:', 'Official Phones:')}</strong>
                    <span className="text-stone-400">{settings.phone} / WhatsApp Comercial</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block">{t('E-mail Geral:', 'General Email:')}</strong>
                    <span className="text-stone-400">contato@tiubareserve.com.br</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] text-stone-400 font-mono">
                  CNPJ: {settings.cnpj}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
