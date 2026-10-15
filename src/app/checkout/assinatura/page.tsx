'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useStore } from '@/lib/store';
import { SubscriptionPlan, ShippingAddress } from '@/types';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  ArrowLeft, 
  Lock, 
  Package, 
  Truck, 
  Copy, 
  ExternalLink,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

function SubscriptionCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planSlugParam = searchParams.get('plano') || 'colmeia-amazonica';

  const { 
    subscriptionPlans, 
    createSubscription, 
    settings, 
    currentUser, 
    login,
    currentBox,
    t 
  } = useStore();

  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>(planSlugParam);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'pix'>('stripe');

  // Customer & Shipping state
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [cpf, setCpf] = useState('');

  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Credit Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Processing & Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdSubId, setCreatedSubId] = useState<string>('');
  const [pixPayloadCode, setPixPayloadCode] = useState<string>('');
  const [pixQrDataUrl, setPixQrDataUrl] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Sync plan from param if param updates
  useEffect(() => {
    if (planSlugParam) {
      setSelectedPlanSlug(planSlugParam);
    }
  }, [planSlugParam]);

  const activePlan: SubscriptionPlan = 
    subscriptionPlans.find(p => p.slug === selectedPlanSlug) || subscriptionPlans[1];

  // CEP lookup
  const handleCepBlur = async () => {
    const cleanCep = zipCode.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
        }
      } catch (err) {
        console.error('Erro ao buscar CEP', err);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !street || !number || !city || !state) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (paymentMethod === 'stripe' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvc)) {
      alert('Por favor, preencha os dados do cartão de crédito para faturamento mensal recorrente.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Auto sign-in or sync user if guest
      if (!currentUser) {
        login(email, 'client');
      }

      const shippingAddress: ShippingAddress = {
        fullName,
        phone,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      };

      const newSub = createSubscription({
        plan_slug: activePlan.slug,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        user_name: fullName,
        user_email: email,
        user_phone: phone,
      });

      setCreatedSubId(newSub.id);

      // If PIX, generate QR Code data URL
      if (paymentMethod === 'pix' && newSub.pix_code) {
        setPixPayloadCode(newSub.pix_code);
        try {
          const qrUrl = await QRCode.toDataURL(newSub.pix_code, {
            width: 260,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' }
          });
          setPixQrDataUrl(qrUrl);
        } catch (err) {
          console.error('Error generating PIX QR Code', err);
        }
      }

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#dfb743', '#d97706', '#f3da8c', '#ffffff']
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Subscription checkout error', err);
      alert('Ocorreu um erro ao processar sua assinatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPixCode = () => {
    if (pixPayloadCode) {
      navigator.clipboard.writeText(pixPayloadCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  // WhatsApp notification link
  const sommelierPhone = settings.whatsapp || settings.sommelier_phone || '5511999988888';
  const whatsappMessage = encodeURIComponent(
    `Olá, Curadoria Tiúba Reserve! Acabei de assinar o plano ${activePlan.name} (Assinatura #${createdSubId || 'NOVA'}) no valor de R$ ${activePlan.price.toFixed(2)}/mês. Gostaria de confirmar meu pedido e enviar o comprovante.`
  );
  const whatsappUrl = `https://wa.me/${sommelierPhone.replace(/\D/g, '')}?text=${whatsappMessage}`;

  if (isSuccess) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl p-8 sm:p-12 rounded-3xl bg-onyx-900 border border-gold-400/35 shadow-2xl space-y-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-gold-400/20 text-gold-400 border border-gold-400/40 flex items-center justify-center mx-auto shadow-gold">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
              Bem-vindo à Família Tiúba Reserve
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Assinatura Confirmada com Sucesso!
            </h1>
            <p className="text-stone-300 font-sans text-sm max-w-lg mx-auto">
              Parabéns! Sua jornada gastronômica no <strong>Plano {activePlan.name}</strong> está ativa. A caixa deste mês já está sendo preparada pelos nossos mestres meliponicultores.
            </p>
          </div>

          {/* Subscription Summary Card */}
          <div className="p-6 rounded-2xl bg-onyx-950 border border-gold-400/20 text-left space-y-3 text-xs font-sans">
            <div className="flex justify-between border-b border-gold-400/15 pb-2">
              <span className="text-stone-400">Código da Assinatura:</span>
              <span className="font-mono text-gold-300 font-bold">{createdSubId}</span>
            </div>
            <div className="flex justify-between border-b border-gold-400/15 pb-2">
              <span className="text-stone-400">Plano Escolhido:</span>
              <span className="font-semibold text-foreground">{activePlan.name}</span>
            </div>
            <div className="flex justify-between border-b border-gold-400/15 pb-2">
              <span className="text-stone-400">Mensalidade:</span>
              <span className="font-serif text-gold-300 font-bold text-sm">R$ {activePlan.price.toFixed(2)} / mês</span>
            </div>
            <div className="flex justify-between border-b border-gold-400/15 pb-2">
              <span className="text-stone-400">Forma de Pagamento:</span>
              <span className="uppercase font-mono text-foreground">{paymentMethod === 'stripe' ? 'Cartão de Crédito Recorrente (Stripe)' : 'PIX Mensal'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Endereço de Entrega:</span>
              <span className="text-stone-300 text-right max-w-[240px] truncate">{street}, {number} - {city}/{state}</span>
            </div>
          </div>

          {/* PIX Payment Instructions if method is PIX */}
          {paymentMethod === 'pix' && pixPayloadCode && (
            <div className="p-6 rounded-2xl bg-gold-400/5 border border-gold-400/30 space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 text-gold-300 text-xs font-mono">
                <QrCode className="w-4 h-4 text-gold-400" />
                <span>Cobrança do 1º Ciclo via PIX</span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Efetue o pagamento do seu primeiro ciclo para liberação imediata do envio da caixa de {currentBox.cycle_month}.
              </p>

              {pixQrDataUrl && (
                <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pixQrDataUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <button
                  onClick={copyPixCode}
                  className="px-5 py-2.5 rounded-full border border-gold-400 bg-gold-400/20 hover:bg-gold-400 text-gold-300 hover:text-onyx-950 font-serif text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPix ? 'Código PIX Copiado!' : 'Copiar Código PIX'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold tracking-wider transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Avisar Sommelier no WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/minha-conta/assinatura"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-gold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-onyx-950" />
              <span>Acessar Área do Assinante</span>
            </Link>

            <Link
              href="/loja"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-gold-400/30 hover:bg-onyx-850 text-gold-300 font-serif text-xs uppercase tracking-luxury transition-all flex items-center justify-center gap-2"
            >
              <span>Continuar Explorando a Boutique</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-onyx-950 text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/clube"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-serif text-stone-400 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Planos do Clube</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Ambiente Criptografado 256-Bit SSL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Checkout Form (Customer, Address, Payment) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-luxury font-serif text-gold-400 font-bold block mb-1">
                Checkout de Recorrência Mensal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Finalize sua Assinatura Tiúba
              </h1>
              <p className="text-xs text-stone-400 font-sans mt-1">
                Sem fidelidade. Pause, altere de plano ou cancele a qualquer momento pelo seu painel.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-8">
              
              {/* 1. SELEÇÃO DE PLANO */}
              <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
                <span className="font-serif text-sm font-bold text-foreground uppercase tracking-wider block">
                  1. Plano Selecionado
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {subscriptionPlans.map((p) => {
                    const isSelected = p.slug === selectedPlanSlug;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setSelectedPlanSlug(p.slug)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-gold-400 bg-gold-400/10 shadow-gold'
                            : 'border-white/10 bg-onyx-950 hover:border-gold-400/40 text-stone-300'
                        }`}
                      >
                        {p.is_featured && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-gold-400 text-onyx-950 text-[9px] font-bold uppercase">
                            Destaque
                          </span>
                        )}
                        <h4 className="font-serif text-xs font-bold text-foreground">
                          {p.name}
                        </h4>
                        <div className="text-xs font-mono text-gold-300 font-bold mt-1">
                          R$ {p.price.toFixed(0)}/mês
                        </div>
                        <span className="text-[10px] text-stone-400 font-sans block mt-1">
                          {p.bottles_count} {p.bottles_count === 1 ? 'Frasco' : 'Frascos'} + Revistinha
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. DADOS DO ASSINANTE */}
              <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
                <span className="font-serif text-sm font-bold text-foreground uppercase tracking-wider block">
                  2. Dados do Titular da Assinatura
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Dra. Cláudia Albuquerque"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      E-mail para Acesso e Notificações *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-8888"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      CPF (para emissão da Nota Fiscal) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. ENDEREÇO DE ENTREGA */}
              <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-foreground uppercase tracking-wider">
                    3. Endereço de Envio da Caixa Mensal
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans text-gold-300">
                    <Truck className="w-3.5 h-3.5 text-gold-400" />
                    <span>Frete Especial Incluso</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      CEP * {isLoadingCep && <span className="text-gold-400">(Buscando...)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Rua / Avenida / Alameda *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Rua Bela Cintra"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="1980"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Complemento (Apto, Bloco)
                    </label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 142"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Jardins"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      Estado (UF) *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="SP"
                      className="w-full py-2.5 px-4 rounded-xl bg-onyx-950 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 4. GATEWAYS DE RECORRÊNCIA (STRIPE / PIX) */}
              <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-6">
                <span className="font-serif text-sm font-bold text-foreground uppercase tracking-wider block">
                  4. Método de Cobrança Recorrente
                </span>

                {/* Gateway Switcher Tabs */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-gold-400 bg-gold-400/15 text-gold-300 shadow-gold'
                        : 'border-white/10 bg-onyx-950 text-stone-400 hover:border-gold-400/40'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-gold-400" />
                    <span className="font-serif text-xs font-bold uppercase tracking-wider">
                      Cartão de Crédito
                    </span>
                    <span className="text-[10px] text-stone-400 font-sans">
                      Stripe Billing Recorrente
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-gold-400 bg-gold-400/15 text-gold-300 shadow-gold'
                        : 'border-white/10 bg-onyx-950 text-stone-400 hover:border-gold-400/40'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-gold-400" />
                    <span className="font-serif text-xs font-bold uppercase tracking-wider">
                      PIX Recorrente
                    </span>
                    <span className="text-[10px] text-stone-400 font-sans">
                      Cobrança Mensal com QR Code
                    </span>
                  </button>
                </div>

                {/* Stripe Credit Card Inputs */}
                {paymentMethod === 'stripe' ? (
                  <div className="p-5 rounded-xl bg-onyx-950 border border-gold-400/20 space-y-4">
                    <div className="flex items-center justify-between text-xs text-stone-400 font-sans border-b border-gold-400/10 pb-3">
                      <span>Cobrança mensal automática no cartão</span>
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Seguro
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                        Número do Cartão de Crédito *
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'stripe'}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono tracking-widest"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                        Nome Impresso no Cartão *
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'stripe'}
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="CLAUDIA ALBUQUERQUE"
                        className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors uppercase font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                          Validade (MM/AA) *
                        </label>
                        <input
                          type="text"
                          required={paymentMethod === 'stripe'}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/29"
                          className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                          Código CVC / CVV *
                        </label>
                        <input
                          type="text"
                          required={paymentMethod === 'stripe'}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full py-2.5 px-4 rounded-xl bg-onyx-900 border border-gold-400/20 text-foreground text-xs focus:outline-none focus:border-gold-400 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-onyx-950 border border-gold-400/20 space-y-3 font-sans text-xs">
                    <div className="flex items-start gap-3 text-stone-300">
                      <QrCode className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Como funciona o PIX Recorrente:</strong>
                        <p className="text-stone-400 text-[11px] mt-1">
                          Ao confirmar, geramos o QR Code do seu 1º mês imediatamente. Nos meses seguintes, você recebe o lembrete de renovação com o link do PIX por e-mail e botão direto para o WhatsApp do nosso Sommelier.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-gold-400 via-amber-honey to-gold-500 text-onyx-950 font-serif font-bold text-xs uppercase tracking-luxury shadow-[0_0_25px_rgba(223,183,67,0.4)] hover:shadow-[0_0_35px_rgba(223,183,67,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processando Assinatura Segura...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-onyx-950" />
                    <span>Confirmar Assinatura Mensal - R$ {activePlan.price.toFixed(2)}/mês</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* RIGHT: Order Summary & Luxury Box Preview */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Box summary card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-gold-400/15 pb-4">
                <span className="font-serif text-sm font-bold text-foreground uppercase tracking-luxury">
                  Resumo da sua Caixa
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-400/15 text-gold-300 font-mono text-[10px] font-bold">
                  {currentBox.cycle_month} {currentBox.cycle_year}
                </span>
              </div>

              {/* Plan Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gold-300">
                      {activePlan.name}
                    </h3>
                    <p className="text-xs text-stone-400 font-sans">
                      {activePlan.tagline}
                    </p>
                  </div>
                  <span className="font-serif text-xl font-bold text-foreground">
                    R$ {activePlan.price.toFixed(2)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-onyx-950 border border-gold-400/15 space-y-2 text-xs font-sans text-stone-300">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Package className="w-4 h-4 text-gold-400" />
                    <span>{activePlan.honey_desc}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Package className="w-4 h-4 text-gold-400" />
                    <span>{activePlan.magazine_desc}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Package className="w-4 h-4 text-gold-400" />
                    <span>{activePlan.artisan_gift_desc}</span>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 pt-2 border-t border-gold-400/15 text-xs font-sans">
                <div className="flex justify-between text-stone-300">
                  <span>Mensalidade da Curadoria:</span>
                  <span className="font-mono text-foreground font-bold">R$ {activePlan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Frete para o seu CEP:</span>
                  <span className="font-mono text-emerald-400 font-bold uppercase">Incluso (Cortesia)</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Revistinha & Brinde Artesanal:</span>
                  <span className="font-mono text-emerald-400 font-bold uppercase">Incluso</span>
                </div>
                <div className="flex justify-between text-foreground font-serif text-base font-bold pt-3 border-t border-gold-400/20">
                  <span>Total do Ciclo Mensal:</span>
                  <span className="text-gold-300">R$ {activePlan.price.toFixed(2)}/mês</span>
                </div>
              </div>

              {/* Assurance badges */}
              <div className="space-y-2 text-[11px] text-stone-400 font-sans border-t border-gold-400/10 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold-400" />
                  <span>Sem carência: pause por 1 mês ou cancele com 1 clique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold-400" />
                  <span>Envio com rastreio imediato após a curadoria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold-400" />
                  <span>Embalagem isotérmica de segurança para méis nobres</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gold-400">Carregando Checkout do Clube Tiúba...</div>}>
      <SubscriptionCheckoutContent />
    </Suspense>
  );
}
