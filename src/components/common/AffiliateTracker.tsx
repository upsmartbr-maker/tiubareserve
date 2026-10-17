'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sparkles, X, Gift } from 'lucide-react';

function TrackerContent() {
  const searchParams = useSearchParams();
  const { setActiveAffiliateRef, getAffiliateByCode } = useStore();
  const [notification, setNotification] = useState<{
    code: string;
    affiliateName?: string;
    discountRate?: number;
  } | null>(null);

  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      const cleanCode = refParam.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
      if (cleanCode.length >= 2) {
        // Save to store, localStorage and 30-day cookie
        setActiveAffiliateRef(cleanCode);

        // Check if affiliate exists to show friendly welcome banner
        const aff = getAffiliateByCode(cleanCode);
        setNotification({
          code: cleanCode,
          affiliateName: aff?.name,
          discountRate: aff ? aff.discount_rate : 5,
        });

        const timer = setTimeout(() => {
          setNotification(null);
        }, 8000);

        return () => clearTimeout(timer);
      }
    } else {
      // Check existing cookie/localStorage if not already loaded
      try {
        const stored = localStorage.getItem('tiuba_reserve_affiliate_ref');
        if (stored) {
          setActiveAffiliateRef(stored);
        }
      } catch (e) {
        // Ignore localStorage error
      }
    }
  }, [searchParams, setActiveAffiliateRef, getAffiliateByCode]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-onyx-900/95 backdrop-blur-md border border-gold-400/40 p-4 rounded-2xl shadow-2xl shadow-black/60 flex items-start gap-3 text-foreground">
        <div className="w-9 h-9 rounded-full bg-gold-400/20 border border-gold-400/50 flex items-center justify-center shrink-0 text-gold-400">
          <Gift className="w-4 h-4 animate-bounce" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-1.5 text-gold-400 font-semibold font-serif uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Indicação de Embaixador</span>
          </div>
          <p className="mt-1 text-stone-300 leading-relaxed">
            Você ativou o cupom <strong className="text-gold-300 font-mono">#{notification.code}</strong>
            {notification.affiliateName ? ` (${notification.affiliateName})` : ''}.
          </p>
          <p className="text-[11px] text-gold-400/90 mt-0.5 font-medium">
            ✦ {notification.discountRate}% de desconto garantido no seu checkout!
          </p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-stone-400 hover:text-stone-200 transition-colors p-1"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
