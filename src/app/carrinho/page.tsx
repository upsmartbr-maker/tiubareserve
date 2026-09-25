'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Check
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    clearCart, 
    settings, 
    t 
  } = useStore();

  const [cep, setCep] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [shippingOption, setShippingOption] = useState<'fixed' | 'motoboy' | 'sedex'>('fixed');

  const cleanCep = cep.replace(/\D/g, '');
  const prefix3 = cleanCep.substring(0, 3);
  const isSpMotoboy = settings.motoboy_enabled && settings.motoboy_zip_prefixes.split(',').includes(prefix3);

  const isFreeShipping = cartSubtotal >= settings.free_shipping_threshold;
  const shippingCost = isFreeShipping
    ? 0
    : shippingOption === 'motoboy' && isSpMotoboy
    ? settings.motoboy_price
    : settings.fixed_shipping_price;

  const total = cartSubtotal + shippingCost;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / settings.free_shipping_threshold) * 100));

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanCep.length === 8) {
      setShippingCalculated(true);
      if (isSpMotoboy) {
        setShippingOption('motoboy');
      } else {
        setShippingOption('fixed');
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-onyx-900 border border-gold-400/30 flex items-center justify-center text-gold-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t('Seu Carrinho está Vazio', 'Your Cart is Empty')}
        </h1>
        <p className="text-xs text-stone-400 max-w-md font-sans">
          {t(
            'Você ainda não selecionou nenhum dos nossos méis raros de abelha Tiúba. Explore nossa Boutique para degustar a Amazônia em sua essência.',
            'You haven’t selected any of our rare Tiúba honeys yet. Explore our Boutique to taste the true essence of the Amazon.'
          )}
        </p>
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all"
        >
          <span>{t('Explorar a Boutique do Mel', 'Explore Honey Boutique')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            {t('Reserva Exclusiva', 'Exclusive Reservation')}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            {t('Carrinho de Compras', 'Shopping Cart')}
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-400 font-sans flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('Limpar Carrinho', 'Clear Cart')}</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-2">
        <div className="flex justify-between text-xs font-sans">
          <span className="text-stone-300 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-gold-400" />
            {isFreeShipping ? (
              <strong className="text-emerald-400 font-serif">
                {t('Parabéns! Você conquistou Frete Cortesia para todo o Brasil.', 'Congratulations! You unlocked Complimentary National Shipping.')}
              </strong>
            ) : (
              <span>
                {t('Adicione mais', 'Add another')}{' '}
                <strong className="text-gold-300 font-mono">
                  R$ {(settings.free_shipping_threshold - cartSubtotal).toFixed(2).replace('.', ',')}
                </strong>{' '}
                {t('para garantir Frete Cortesia.', 'for Free Shipping.')}
              </span>
            )}
          </span>
          <span className="font-mono text-gold-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-onyx-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const unitPrice = item.product.promo_price || item.product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="p-5 sm:p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 flex flex-col sm:flex-row items-center gap-6"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-gold-400/20 shrink-0 bg-onyx-950">
                  <Image
                    src={item.product.images[0] || '/images/hero-bottle.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-sans tracking-luxury uppercase text-gold-400 font-bold block">
                    {item.product.volume} · {item.product.biome}
                  </span>
                  <Link href={`/produto/${item.product.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-foreground hover:text-gold-300 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-400 italic">
                    "{item.product.concept}"
                  </p>
                  <p className="text-xs font-mono text-gold-300 pt-1">
                    R$ {unitPrice.toFixed(2).replace('.', ',')} / frasco
                  </p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex sm:flex-col items-center justify-between sm:items-end gap-4 w-full sm:w-auto">
                  <div className="flex items-center border border-gold-400/20 rounded-lg bg-onyx-950 px-2 py-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-serif text-base font-bold text-gold-300">
                      R$ {itemTotal.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 transition-colors"
                      title={t('Remover item', 'Remove item')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Continuar Comprando Mais Méis', 'Continue Shopping More Honeys')}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & CEP Calculation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-foreground border-b border-gold-400/20 pb-4">
              {t('Resumo do Pedido', 'Order Summary')}
            </h3>

            {/* Subtotal */}
            <div className="space-y-3 text-xs font-sans">
              <div className="flex justify-between text-stone-300">
                <span>{t('Subtotal dos Frascos:', 'Bottles Subtotal:')}</span>
                <span className="font-mono text-gold-300 font-bold">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* CEP Simulation */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                  {t('Calcular Frete por CEP:', 'Calculate Shipping by ZIP:')}
                </label>
                <form onSubmit={handleSimulateShipping} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="01415-002"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase"
                  >
                    OK
                  </button>
                </form>

                {shippingCalculated && (
                  <div className="space-y-2 pt-1 text-xs">
                    {isFreeShipping ? (
                      <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-sans">
                        ✓ {t('Frete Grátis Qualificado!', 'Free Shipping Qualified!')}
                      </div>
                    ) : (
                      <>
                        {isSpMotoboy && (
                          <label className="flex items-center justify-between p-2.5 rounded-lg border border-gold-400/30 bg-onyx-950 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="shipping"
                                checked={shippingOption === 'motoboy'}
                                onChange={() => setShippingOption('motoboy')}
                                className="accent-gold-400"
                              />
                              <div>
                                <span className="font-bold text-gold-300 block">Motoboy Express SP</span>
                                <span className="text-[10px] text-stone-400">Entrega rápida em até 24h</span>
                              </div>
                            </div>
                            <span className="font-mono text-gold-300 font-bold">
                              R$ {settings.motoboy_price.toFixed(2).replace('.', ',')}
                            </span>
                          </label>
                        )}

                        <label className="flex items-center justify-between p-2.5 rounded-lg border border-gold-400/20 bg-onyx-950 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingOption === 'fixed'}
                              onChange={() => setShippingOption('fixed')}
                              className="accent-gold-400"
                            />
                            <div>
                              <span className="font-bold text-foreground block">Envio Nacional Seguro</span>
                              <span className="text-[10px] text-stone-400">PAC / SEDEX com seguro</span>
                            </div>
                          </div>
                          <span className="font-mono text-gold-300 font-bold">
                            R$ {settings.fixed_shipping_price.toFixed(2).replace('.', ',')}
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between text-stone-300 border-t border-white/5 pt-3">
                <span>{t('Frete Estimado:', 'Estimated Shipping:')}</span>
                <span className="font-mono text-gold-300 font-bold">
                  {shippingCost === 0 ? t('Grátis', 'Free') : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gold-400/20 pt-4 flex items-baseline justify-between">
              <span className="font-serif text-base font-bold text-foreground">
                {t('Total da Compra:', 'Order Total:')}
              </span>
              <span className="font-serif text-2xl font-bold gold-text">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold-400/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('Avançar para Checkout Seguro', 'Proceed to Secure Checkout')}</span>
            </button>

            <p className="text-[10px] text-stone-400 text-center font-sans">
              🔒 {t('Ambiente criptografado. Pagamentos protegidos por Stripe, Mercado Pago e PIX Central.', 'Encrypted environment. Protected by Stripe, Mercado Pago & Central Bank PIX.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
