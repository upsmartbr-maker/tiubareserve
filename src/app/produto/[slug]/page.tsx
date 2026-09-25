'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  MessageSquare, 
  ShieldCheck, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Check, 
  FlaskConical, 
  Truck,
  Award,
  ZoomIn
} from 'lucide-react';
import ShareModal from '@/components/boutique/ShareModal';
import SommelierModal from '@/components/boutique/SommelierModal';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { getProductBySlug, addToCart, settings, t } = useStore();
  const { addItem } = useCart();

  const product = getProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [shareOpen, setShareOpen] = useState(false);
  const [sommelierOpen, setSommelierOpen] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t('Produto não encontrado', 'Product not found')}
        </h1>
        <p className="text-xs text-stone-400 font-sans">
          {t('A variedade solicitada não existe ou foi temporariamente retirada de catálogo.', 'The requested variety does not exist or has been temporarily removed.')}
        </p>
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-400 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Voltar para a Boutique', 'Back to Boutique')}</span>
        </Link>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = (redirect = false) => {
    if (!product) return;
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
    setTimeout(() => {
      setAdded(false);
      if (redirect) router.push('/checkout');
    }, 800);
  };

  const currentPrice = product.promo_price || product.price;

  return (
    <div className="w-full pb-24 space-y-16">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone-400 hover:text-gold-400 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Voltar para a Loja do Mel', 'Back to Honey Boutique')}</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: 4-Photo HD Gallery with Interactive Zoom */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage with Zoom */}
            <div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold-400/30 bg-onyx-900 cursor-crosshair group shadow-2xl"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {(() => {
                const currentImg = product.images?.[selectedImage] || product.images?.[0] || product.image || '/images/hero-bottle.jpg';
                return (
                  <Image
                    src={currentImg}
                    alt={product.name}
                    fill
                    unoptimized={currentImg.startsWith('data:')}
                    className={`object-cover object-center transition-all duration-300 ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : undefined
                    }
                    priority
                  />
                );
              })()}

              {/* Hover Zoom Tip Badge */}
              <div className="absolute top-4 right-4 bg-onyx-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-400/20 text-[10px] text-gold-300 font-sans flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
                <span>{t('Passe o mouse para zoom em HD', 'Hover for HD zoom')}</span>
              </div>

              {/* Volume Tag */}
              <div className="absolute bottom-4 left-4 bg-onyx-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-400/30 text-xs font-serif font-bold text-gold-300 pointer-events-none">
                {product.volume} · Grand Cru
              </div>
            </div>

            {/* Thumbnail Selector (4 photos) */}
            <div className="grid grid-cols-4 gap-4">
              {(product.images || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-gold-400 shadow-lg shadow-gold-400/20 scale-[1.02]'
                      : 'border-gold-400/20 hover:border-gold-400/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={img || '/images/hero-bottle.jpg'} 
                    alt="" 
                    fill 
                    unoptimized={Boolean(img?.startsWith('data:'))}
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing, Specs, Buy Flow */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans">
                  {product.biome} · {product.floral_type}
                </span>
                <button
                  onClick={() => setShareOpen(true)}
                  className="p-2 rounded-full border border-gold-400/20 bg-onyx-900 text-stone-300 hover:text-gold-400 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                {product.name}
              </h1>
              <p className="font-serif text-base text-gold-300 italic">
                “{product.concept}”
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-sans block">
                    {t('Preço do Frasco Colecionador', 'Collector Flask Price')}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl font-bold text-gold-300">
                      R$ {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    {product.promo_price && (
                      <span className="text-sm text-stone-400 line-through font-serif">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-500/20 px-3 py-1 rounded-full font-sans font-medium">
                  {product.stock} {t('frascos em estoque', 'bottles in stock')}
                </span>
              </div>

              <p className="text-[11px] text-stone-400 font-sans">
                {t(
                  'Em até 3x sem juros no cartão ou com desconto especial no PIX com confirmação imediata.',
                  'Up to 3x interest-free on cards or immediate confirmation via PIX.'
                )}
              </p>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gold-400/30 rounded-xl bg-onyx-900 px-3 py-2.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-foreground font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-serif font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gold-400 hover:bg-gold-300 text-onyx-950 shadow-lg shadow-gold-400/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
                      <span>{t('Adicionado ao Carrinho!', 'Added to Cart!')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('Adicionar ao Carrinho', 'Add to Cart')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={() => handleAddToCart(true)}
                className="w-full py-3.5 px-6 rounded-xl border border-gold-400/40 bg-onyx-900 hover:bg-gold-400/10 text-gold-300 font-serif font-bold text-xs uppercase tracking-widest transition-all"
              >
                {t('Comprar Agora & Ir para o Checkout', 'Buy Now & Go to Checkout')}
              </button>
            </div>

            {/* Sommelier Advisor Link */}
            <div className="p-4 rounded-xl bg-onyx-900/60 border border-gold-400/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gold-400" />
                <div>
                  <span className="text-xs font-serif font-bold text-foreground block">
                    {t('Dúvidas sobre o produto?', 'Questions about this honey?')}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {t('Converse em tempo real com nosso Sommelier.', 'Chat in real-time with our Sommelier.')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSommelierOpen(true)}
                className="text-xs font-serif uppercase tracking-wider text-gold-400 hover:text-gold-300 underline font-semibold"
              >
                {t('Consultar', 'Consult')}
              </button>
            </div>

            {/* Guarantee and Shipping Highlights */}
            <div className="space-y-3 pt-2 text-xs text-stone-400 font-sans border-t border-gold-400/10">
              <p className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{t('Lacre de cera vegetal com código de rastreabilidade único.', 'Vegetable wax seal with unique batch traceability code.')}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{t('Embalagem de luxo para transporte seguro anti-impacto.', 'Shock-resistant luxury gift packaging for safe transit.')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Sensory Specs & Nutritional Table */}
        <div className="mt-20 border-t border-gold-400/20 pt-12 space-y-12">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {t('Ficha Técnica & Análise Sensorial', 'Technical Specifications & Sensory Profile')}
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sensory Matrix */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>{t('Análise de Degustação', 'Tasting Analysis')}</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block">Aroma</span>
                  <span className="text-stone-300">{product.sensory_profile.aroma}</span>
                </div>
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block">Sabor</span>
                  <span className="text-stone-300">{product.sensory_profile.flavor}</span>
                </div>
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold text-gold-400 block">Textura & Fluidez</span>
                  <span className="text-stone-300">{product.sensory_profile.texture}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-400 block">Acidez Mineral</span>
                  <span className="text-stone-300">{product.sensory_profile.acidity}</span>
                </div>
              </div>
            </div>

            {/* Nutritional & Chemical Table */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-gold-400" />
                <span>{t('Composição Físico-Química', 'Physical-Chemical Composition')}</span>
              </h3>
              <div className="space-y-2 text-xs divide-y divide-white/5">
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-400">Umidade Natural:</span>
                  <span className="text-gold-300 font-mono">{product.nutritional_info.moisture}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-400">Compostos Fenólicos:</span>
                  <span className="text-gold-300 font-mono">{product.nutritional_info.phenolic_compounds}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-400">Acidez Livre:</span>
                  <span className="text-gold-300 font-mono">{product.nutritional_info.acidity_meq}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-400">Índice HMF (Frescor):</span>
                  <span className="text-emerald-400 font-mono">{product.nutritional_info.hmf}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-400">Frutose / Glicose:</span>
                  <span className="text-gold-300 font-mono">{product.nutritional_info.fructose} / {product.nutritional_info.glucose}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
