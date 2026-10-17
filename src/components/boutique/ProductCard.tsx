'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  Share2, 
  MessageSquare, 
  ArrowRight, 
  Plus, 
  Minus, 
  Sparkles,
  Check
} from 'lucide-react';
import ShareModal from './ShareModal';
import SommelierModal from './SommelierModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, t } = useStore();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [sommelierOpen, setSommelierOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const currentPrice = product.promo_price || product.price;

  const handleAdd = () => {
    const mainImg = product.images?.[0] || product.image || (product as any).foto1 || '/images/hero-bottle.jpg';
    addToCart(product, quantity);
    addItem(
      {
        id: product.id,
        title: product.name,
        subtitle: product.subtitle,
        price: currentPrice,
        image: mainImg,
        volume: product.volume,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const mainPhoto = product.images?.[0] || product.image || (product as any).foto1 || '/images/hero-bottle.jpg';

  const customBadge = product.badge || (product as any).tag || (product.promo_price ? t('Edição Especial', 'Special Edition') : null);
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <>
      <div className="group relative flex flex-col bg-onyx-850 border border-gold-400/20 hover:border-gold-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/80">
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="bg-onyx-950/90 backdrop-blur-md border border-gold-400/30 text-gold-300 text-xs font-sans uppercase tracking-widest px-3 py-1 rounded-full font-semibold">
            {product.volume}
          </span>
          {customBadge && (
            <span className="bg-amber-honey text-onyx-950 text-xs font-sans uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-md">
              {customBadge}
            </span>
          )}
        </div>

        {/* Share Button (Top Right) */}
        <button
          onClick={() => setShareOpen(true)}
          className="absolute top-3.5 right-3.5 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-onyx-950/80 backdrop-blur-md border border-gold-400/20 text-stone-300 hover:text-gold-400 hover:border-gold-400 transition-colors"
          title={t('Compartilhar Produto', 'Share Product')}
          aria-label={t('Compartilhar Produto', 'Share Product')}
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Product Image Stage */}
        <Link href={`/produto/${product.slug}`} className="relative w-full aspect-[4/5] overflow-hidden bg-onyx-900 block" aria-label={`Ver detalhes de ${product.name}`}>
          <Image
            src={mainPhoto}
            alt={product.name}
            fill
            unoptimized={mainPhoto.startsWith('data:')}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-850 via-transparent to-transparent opacity-60" />
        </Link>

        {/* Details Container */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
          <div>
            <span className="text-xs font-sans uppercase tracking-luxury text-gold-400 font-bold block mb-1">
              {product.biome} · {product.bee_species.split(' ')[0]}
            </span>
            <Link href={`/produto/${product.slug}`}>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-gold-300 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-stone-300 font-sans italic mt-1.5 line-clamp-2 leading-relaxed">
              &ldquo;{product.concept}&rdquo;
            </p>
          </div>

          {/* Pricing & Stock Indicator */}
          <div className="flex items-baseline justify-between border-t border-gold-400/15 pt-4">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-stone-300 block mb-0.5">
                {t('Valor por Frasco', 'Price per Flask')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-gold-300">
                  R$ {currentPrice.toFixed(2).replace('.', ',')}
                </span>
                {product.promo_price && (
                  <span className="text-xs text-stone-400 line-through">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded font-sans font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {t(`Últimas ${product.stock} unidades`, `Only ${product.stock} left`)}
                </span>
              ) : (
                <span className="text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded font-sans font-medium">
                  {product.stock} {t('disponíveis', 'in stock')}
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Buy Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-gold-400/25 rounded-xl bg-onyx-900 px-1 py-0.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="min-h-[44px] min-w-[36px] flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-7 text-center text-sm font-semibold text-foreground font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="min-h-[44px] min-w-[36px] flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add / Quick Buy Button */}
              <button
                onClick={handleAdd}
                className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gold-400 hover:bg-gold-300 text-onyx-950 hover:shadow-lg hover:shadow-gold-400/20 active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('Adicionado!', 'Added!')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('Comprar', 'Purchase')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Sommelier & Details row */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => setSommelierOpen(true)}
                className="min-h-[44px] text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors font-medium py-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('Falar com Sommelier', 'Ask Sommelier')}</span>
              </button>

              <Link
                href={`/produto/${product.slug}`}
                className="min-h-[44px] text-stone-300 hover:text-gold-300 flex items-center gap-1.5 transition-colors font-medium py-1"
              >
                <span>{t('Ver Detalhes', 'View Specs')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        product={product}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
      <SommelierModal
        product={product}
        isOpen={sommelierOpen}
        onClose={() => setSommelierOpen(false)}
      />
    </>
  );
}
