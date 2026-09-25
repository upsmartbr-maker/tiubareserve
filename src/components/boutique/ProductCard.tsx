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
    addToCart(product, quantity);
    addItem(
      {
        id: product.id,
        title: product.name,
        subtitle: product.subtitle,
        price: currentPrice,
        image: product.images[0] || '/images/hero-bottle.jpg',
        volume: product.volume,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="group relative flex flex-col bg-onyx-850 border border-gold-400/20 hover:border-gold-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/80">
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="bg-onyx-950/80 backdrop-blur-md border border-gold-400/30 text-gold-300 text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold">
            {product.volume}
          </span>
          {product.promo_price && (
            <span className="bg-amber-honey/90 text-onyx-950 text-[9px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
              {t('Edição Especial', 'Special Edition')}
            </span>
          )}
        </div>

        {/* Share Button (Top Right) */}
        <button
          onClick={() => setShareOpen(true)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-onyx-950/70 backdrop-blur-md border border-gold-400/20 text-stone-300 hover:text-gold-400 hover:border-gold-400 transition-colors"
          title={t('Compartilhar Produto', 'Share Product')}
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Product Image Stage */}
        <Link href={`/produto/${product.slug}`} className="relative w-full aspect-[4/5] overflow-hidden bg-onyx-900 block">
          <Image
            src={product.images[0] || '/images/hero-bottle.jpg'}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-850 via-transparent to-transparent opacity-60" />
        </Link>

        {/* Details Container */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-luxury text-gold-400/80 font-bold block mb-1">
              {product.biome} · {product.bee_species.split(' ')[0]}
            </span>
            <Link href={`/produto/${product.slug}`}>
              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-gold-300 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-stone-400 font-sans italic mt-1 line-clamp-2">
              "{product.concept}"
            </p>
          </div>

          {/* Pricing & Stock Indicator */}
          <div className="flex items-baseline justify-between border-t border-gold-400/10 pt-4">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-wider text-stone-400 block">
                {t('Valor por Frasco', 'Price per Flask')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-bold text-gold-300">
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
              <span className="text-[10px] text-emerald-400/90 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded font-sans">
                {product.stock} {t('disponíveis', 'in stock')}
              </span>
            </div>
          </div>

          {/* Quantity and Buy Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-gold-400/20 rounded-lg bg-onyx-900 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-stone-400 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-semibold text-foreground font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1 text-stone-400 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add / Quick Buy Button */}
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-serif font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gold-400 hover:bg-gold-300 text-onyx-950 hover:shadow-lg hover:shadow-gold-400/20'
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
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <button
                onClick={() => setSommelierOpen(true)}
                className="text-gold-400/90 hover:text-gold-300 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('Falar com Sommelier', 'Ask Sommelier')}</span>
              </button>

              <Link
                href={`/produto/${product.slug}`}
                className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{t('Ver Detalhes', 'View Specs')}</span>
                <ArrowRight className="w-3 h-3" />
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
