'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';

interface ShareModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ product, isOpen, onClose }: ShareModalProps) {
  const { t } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = typeof window !== 'undefined' ? `${window.location.origin}/produto/${product.slug}` : '';
  const shareTitle = `TIÚBA RESERVE · ${product.name}`;
  const shareText = `Descubra a raridade botânica do ${product.name} da TIÚBA RESERVE. Safra limitada da Amazônia: ${url}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-onyx-900 border border-gold-400/30 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
          <div className="flex items-center gap-2 text-gold-400">
            <Share2 className="w-5 h-5" />
            <h3 className="font-serif text-lg font-semibold uppercase tracking-wider text-foreground">
              {t('Compartilhar Criação', 'Share Creation')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-sm font-serif font-bold text-gold-300">{product.name}</p>
          <p className="text-xs text-stone-400 mt-1 italic">"{product.concept}"</p>
        </div>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-luxury text-stone-300 font-semibold block">
            {t('Link do Produto', 'Product Link')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-stone-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-onyx-950 font-semibold text-xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t('Copiado!', 'Copied!') : t('Copiar', 'Copy')}</span>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-stone-400 mb-3 text-center">
            {t('Compartilhar diretamente nas redes:', 'Share directly on networks:')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(tweetUrl, '_blank');
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600/20 border border-sky-500/40 text-sky-400 hover:bg-sky-600/30 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Twitter / X</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
