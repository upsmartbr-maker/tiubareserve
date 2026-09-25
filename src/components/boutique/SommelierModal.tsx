'use client';

import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, Send } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { generateSommelierWhatsAppUrl } from '@/lib/pix';

interface SommelierModalProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function SommelierModal({ product, isOpen, onClose }: SommelierModalProps) {
  const { settings, t } = useStore();
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = settings.sommelier_phone || settings.whatsapp || '5511999988888';
    let message = `Olá Sommelier Tiúba Reserve! 🍯✨\n\n`;
    if (name) message += `Meu nome é *${name}*.\n`;
    if (product) message += `Tenho interesse no *${product.name}* (Safra 2026).\n`;
    if (question) message += `*Minha dúvida:* ${question}\n\n`;
    message += `Gostaria de uma consultoria para harmonização gastronômica e detalhes da florada.`;

    const url = `https://wa.me/${cleanNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-onyx-900 border border-gold-400/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
            <h3 className="font-serif text-lg font-semibold uppercase tracking-wider text-foreground">
              {t('Consultoria com Sommelier de Mel', 'Honey Sommelier Consultation')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-onyx-950 p-4 rounded-xl border border-gold-400/10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center shrink-0 text-gold-400 font-serif font-bold">
            TR
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-gold-300">
              {t('Atendimento Especializado em Meliponicultura Nobre', 'Noble Meliponiculture Advisory')}
            </h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              {t(
                'Nosso sommelier orienta chefs, enófilos e apreciadores sobre notas de prova, acidez, harmonização com queijos artesanais, charcutaria e alta confeitaria.',
                'Our sommelier guides chefs, oenophiles, and connoisseurs on tasting notes, natural acidity, pairings with artisanal cheeses, charcuterie, and fine pastry.'
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleStartChat} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-luxury text-stone-300 font-semibold block mb-1">
              {t('Seu Nome', 'Your Name')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Ex.: Helena Salles', 'E.g.: Helena Salles')}
              className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-luxury text-stone-300 font-semibold block mb-1">
              {t('Produto em Análise (Opcional)', 'Selected Product (Optional)')}
            </label>
            <input
              type="text"
              readOnly
              value={product ? product.name : t('Geral · Toda a Linha Tiúba Reserve', 'General · All Tiúba Reserve Line')}
              className="w-full bg-onyx-950/60 border border-gold-400/10 rounded-lg px-4 py-2 text-xs text-gold-300/80 font-serif"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-luxury text-stone-300 font-semibold block mb-1">
              {t('Qual é sua dúvida ou proposta de harmonização?', 'Your question or pairing idea?')}
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t(
                'Ex.: Gostaria de saber como o Mel de Tiúba do Amazonas harmoniza com queijo Canastra Curado...',
                'E.g.: I would like to know how Amazonas Tiúba Honey pairs with cured artisanal cheeses...'
              )}
              className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-gold/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('Conversar com o Sommelier no WhatsApp', 'Talk to Sommelier on WhatsApp')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
