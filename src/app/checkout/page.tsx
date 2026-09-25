'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Truck, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageCircle, 
  Lock, 
  ArrowLeft, 
  ExternalLink,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { generatePixPayload, generatePixQrCodeDataUrl, generateWhatsAppProofUrl } from '@/lib/pix';
import { ShippingAddress, ShippingOption, PaymentMethod, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cart, 
    cartSubtotal, 
    createOrder, 
    settings, 
    currentUser, 
    login, 
    t 
  } = useStore();

  // Authentication State
  const [authEmail, setAuthEmail] = useState(currentUser?.email || '');
  const [authPassword, setAuthPassword] = useState('');
  const [isLogged, setIsLogged] = useState(Boolean(currentUser));

  // Address State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser?.full_name || '',
    phone: currentUser?.phone || '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    zipCode: '',
  });

  // Shipping Selection State
  const [selectedShipping, setSelectedShipping] = useState<string>('fixed');

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit Card fields (for Stripe / MP simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Finished Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [pixPayload, setPixPayload] = useState<string>('');
  const [pixQrUrl, setPixQrUrl] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Clean CEP & Motoboy qualification
  const cleanCep = address.zipCode.replace(/\D/g, '');
  const prefix3 = cleanCep.substring(0, 3);
  const isSpMotoboy = settings.motoboy_enabled && settings.motoboy_zip_prefixes.split(',').includes(prefix3);

  const isFreeShipping = cartSubtotal >= settings.free_shipping_threshold;

  // Available shipping options calculated dynamically
  const shippingOptions: ShippingOption[] = [
    {
      id: 'fixed',
      name: t('Frete Padrão Nacional (PAC Seguro)', 'Standard National Delivery (PAC)'),
      price: isFreeShipping ? 0 : settings.fixed_shipping_price,
      deadline: t('4 a 7 dias úteis', '4 to 7 business days'),
      description: t('Entrega monitorada para qualquer cidade do Brasil.', 'Monitored delivery across all Brazilian cities.'),
    },
    {
      id: 'sedex',
      name: t('SEDEX Prioritário com Seguro', 'Priority SEDEX with Insurance'),
      price: isFreeShipping ? 0 : settings.fixed_shipping_price + 18.0,
      deadline: t('1 a 3 dias úteis', '1 to 3 business days'),
      description: t('Despacho aéreo com máxima agilidade.', 'Air expedited dispatch with maximum speed.'),
    },
  ];

  if (isSpMotoboy) {
    shippingOptions.unshift({
      id: 'motoboy',
      name: t('Motoboy Express (São Paulo e Grande SP)', 'Motoboy Express (São Paulo Metro)'),
      price: isFreeShipping ? 0 : settings.motoboy_price,
      deadline: t('Mesmo dia ou até 24h', 'Same day or up to 24h'),
      description: t('Entrega exclusiva por mensageiro direto.', 'Dedicated courier direct delivery.'),
    });
  }

  // Active shipping cost
  const activeShippingObj = shippingOptions.find((o) => o.id === selectedShipping) || shippingOptions[0];
  const shippingCost = activeShippingObj.price;
  const grandTotal = cartSubtotal + shippingCost;

  // Auto-login or register handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail) {
      login(authEmail, 'client');
      setIsLogged(true);
      if (!address.fullName) {
        setAddress((prev) => ({ ...prev, fullName: authEmail.split('@')[0] }));
      }
    }
  };

  // Submit Final Order
  const handleFinalizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Generate PIX Data if method is PIX
      let generatedPixCode = '';
      let generatedQr = '';

      if (paymentMethod === 'pix') {
        generatedPixCode = generatePixPayload({
          key: settings.pix_key,
          receiverName: settings.pix_receiver_name,
          city: settings.pix_city,
          amount: grandTotal,
          txid: `TR${Date.now().toString().slice(-6)}`,
        });
        generatedQr = await generatePixQrCodeDataUrl(generatedPixCode);
        setPixPayload(generatedPixCode);
        setPixQrUrl(generatedQr);
      }

      // 2. Persist in Store
      const newOrder = createOrder({
        user_id: currentUser?.id || `anon-${Date.now()}`,
        user_email: authEmail || currentUser?.email || 'cliente@tiubareserve.com.br',
        user_name: address.fullName || 'Cliente Nobre',
        user_phone: address.phone || '(11) 99999-9999',
        items: cart,
        subtotal: cartSubtotal,
        shipping_type: activeShippingObj.name,
        shipping_cost: shippingCost,
        total_amount: grandTotal,
        shipping_address: address,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'pix' ? 'pending' : 'paid',
        pix_code: generatedPixCode,
        pix_qr_url: generatedQr,
      });

      setCompletedOrder(newOrder);
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    if (pixPayload && navigator.clipboard) {
      navigator.clipboard.writeText(pixPayload);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  // If order was already completed, show confirmation & PIX screen
  if (completedOrder) {
    const waUrl = generateWhatsAppProofUrl({
      whatsappNumber: settings.whatsapp,
      orderNumber: completedOrder.order_number,
      totalAmount: completedOrder.total_amount,
      customerName: completedOrder.user_name,
    });

    return (
      <div className="w-full min-h-[75vh] py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-gold-400/20 border border-gold-400/50 flex items-center justify-center mx-auto text-gold-400">
            <CheckCircle2 className="w-10 h-10 text-gold-400" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-luxury text-gold-400 font-bold font-sans">
              {t('Pedido Registrado com Sucesso', 'Order Successfully Registered')}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              {t('Obrigado pela sua Reserva Nobre!', 'Thank You for Your Noble Reservation!')}
            </h1>
            <p className="font-mono text-sm text-gold-300">
              {t('Pedido Número:', 'Order Number:')} <strong className="text-foreground">{completedOrder.order_number}</strong>
            </p>
          </div>

          {/* PIX Payment Section (Mandatory requirement) */}
          {completedOrder.payment_method === 'pix' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-onyx-950 border border-gold-400/30 text-left space-y-6">
              <div className="flex items-center gap-2 text-gold-400 border-b border-gold-400/20 pb-3">
                <QrCode className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold uppercase tracking-wider text-foreground">
                  {t('Pagamento via PIX Direto', 'Direct PIX Payment')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* QR Code Canvas */}
                <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 rounded-2xl bg-white shadow-xl">
                    {pixQrUrl ? (
                      <img
                        src={pixQrUrl}
                        alt="QR Code PIX Tiúba Reserve"
                        className="w-48 h-48 sm:w-56 sm:h-56"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-stone-200 animate-pulse rounded-lg" />
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 text-center font-sans">
                    {t('Aponte a câmera do aplicativo do seu banco', 'Point your banking app camera')}
                  </span>
                </div>

                {/* Copia e Cola & Mandatory WhatsApp Instruction */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <label className="text-xs uppercase tracking-luxury text-stone-400 font-bold block mb-1.5">
                      {t('Código PIX Copia e Cola:', 'PIX Copy and Paste Code:')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixPayload}
                        className="flex-1 bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-stone-300 font-mono focus:outline-none"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="px-4 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
                      >
                        {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedPix ? t('Copiado!', 'Copied!') : t('Copiar', 'Copy')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mandatory Instruction Box */}
                  <div className="p-4 rounded-xl bg-amber-honey/10 border border-amber-honey/40 space-y-3">
                    <p className="text-xs font-semibold text-amber-200 leading-relaxed">
                      ⚠️ <strong>{t('INSTRUÇÃO OBRIGATÓRIA:', 'MANDATORY INSTRUCTION:')}</strong>{' '}
                      {t(
                        'Após efetuar o pagamento, clique no botão abaixo para enviar o comprovante via WhatsApp.',
                        'After making the payment, click the button below to send the receipt via WhatsApp.'
                      )}
                    </p>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/30"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t('Enviar Comprovante via WhatsApp', 'Send Receipt via WhatsApp')}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credit Card confirmation */}
          {completedOrder.payment_method !== 'pix' && (
            <div className="p-6 rounded-2xl bg-onyx-950 border border-gold-400/20 text-center space-y-2">
              <span className="text-emerald-400 font-serif font-bold text-lg block">
                {t('Pagamento Aprovado com Sucesso', 'Payment Successfully Approved')}
              </span>
              <p className="text-xs text-stone-300 font-sans">
                {t(
                  'Sua transação foi processada com segurança pelo gateway oficial. O preparo do seu lote já foi iniciado.',
                  'Your transaction was securely processed. Preparation of your batch has begun.'
                )}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/rastreio?codigo=${completedOrder.items[0]?.product.lot_code_example || 'TR-BF-001'}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gold-400/30 text-gold-300 font-serif text-xs uppercase tracking-wider hover:bg-gold-400/10 transition-colors"
            >
              <span>{t('Consultar Laudo do Lote', 'Check Batch Lab Report')}</span>
            </Link>
            <Link
              href="/loja"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>{t('Voltar à Boutique', 'Return to Boutique')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no completed order
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {t('Seu carrinho está vazio', 'Your cart is empty')}
        </h1>
        <Link href="/loja" className="text-xs text-gold-400 uppercase tracking-wider underline">
          {t('Ir para a Boutique do Mel', 'Go to Honey Boutique')}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            {t('Ambiente Criptografado 256-bit', '256-bit Encrypted Environment')}
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t('Finalização de Compra & Pagamento', 'Checkout & Payment')}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-gold-400 text-xs font-sans">
          <Lock className="w-4 h-4" />
          <span>Checkout Seguro</span>
        </div>
      </div>

      <form onSubmit={handleFinalizeOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Auth, Shipping Address, Shipping Method, Payment Gateway */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Customer Auth */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300">
                  1. {t('Identificação do Cliente', 'Customer Identification')}
                </h3>
                {isLogged && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-mono">
                    ✓ {t('Autenticado', 'Authenticated')}
                  </span>
                )}
              </div>

              {!isLogged ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      {t('E-mail para Confirmação *', 'Confirmation Email *')}
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                      {t('Senha de Acesso (ou crie uma) *', 'Password (or create one) *')}
                    </label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-sans">
                    Logado como: <strong className="text-foreground">{authEmail || currentUser?.email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLogged(false)}
                    className="text-[11px] text-gold-400 hover:underline"
                  >
                    {t('Trocar de conta', 'Change account')}
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Address */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300 border-b border-white/5 pb-3">
                2. {t('Endereço de Entrega do Mel', 'Honey Shipping Address')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('Nome Completo do Destinatário *', 'Recipient Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Ex.: Dra. Helena Salles"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('Telefone / WhatsApp para Entrega *', 'Delivery Phone / WhatsApp *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('CEP de Destino *', 'ZIP / Postal Code *')}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    placeholder="01415-002"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                        {t('Rua / Avenida *', 'Street Address *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Rua Bela Cintra"
                        className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                        {t('Número *', 'Number *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        placeholder="1980"
                        className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('Complemento (Apto, Bloco)', 'Complement (Apt, Suite)')}
                  </label>
                  <input
                    type="text"
                    value={address.complement}
                    onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    placeholder="Apto 142"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('Bairro *', 'Neighborhood *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                    placeholder="Jardins"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('Cidade *', 'City *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="São Paulo"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    {t('Estado *', 'State *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="SP"
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Option Selection */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300 border-b border-white/5 pb-3">
                3. {t('Modalidade de Envio', 'Shipping Method')}
              </h3>

              <div className="space-y-3">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedShipping === opt.id
                        ? 'border-gold-400 bg-onyx-950 shadow-md shadow-gold-400/10'
                        : 'border-gold-400/20 bg-onyx-900/60 hover:border-gold-400/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingOption"
                        value={opt.id}
                        checked={selectedShipping === opt.id}
                        onChange={() => setSelectedShipping(opt.id)}
                        className="accent-gold-400"
                      />
                      <div>
                        <span className="font-serif font-bold text-xs sm:text-sm text-foreground block">
                          {opt.name}
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          Prazo: {opt.deadline} · {opt.description}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-gold-300">
                      {opt.price === 0 ? t('Cortesia', 'Free') : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Payment Gateways (Stripe, Mercado Pago, PIX Direto) */}
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/20 space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300 border-b border-white/5 pb-3">
                4. {t('Forma de Pagamento Segura', 'Secure Payment Method')}
              </h3>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-bold'
                      : 'border-gold-400/20 bg-onyx-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-gold-400" />
                  <span className="text-xs uppercase tracking-wider block">PIX Direto</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Confirmação Instantânea</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-bold'
                      : 'border-gold-400/20 bg-onyx-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-gold-400" />
                  <span className="text-xs uppercase tracking-wider block">Stripe Card</span>
                  <span className="text-[9px] text-stone-400 font-mono">Internacional</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mercadopago')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'mercadopago'
                      ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-bold'
                      : 'border-gold-400/20 bg-onyx-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-gold-400" />
                  <span className="text-xs uppercase tracking-wider block">Mercado Pago</span>
                  <span className="text-[9px] text-stone-400 font-mono">Brasil</span>
                </button>
              </div>

              {/* Dynamic Payment Details */}
              {paymentMethod === 'pix' ? (
                <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/15 space-y-2 text-xs text-stone-300 font-sans">
                  <p className="flex items-center gap-2 text-gold-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>{t('Geração de QR Code e Código Copia e Cola na próxima tela.', 'QR Code and Copy-Paste code generated on next screen.')}</span>
                  </p>
                  <p className="text-stone-400 leading-relaxed text-[11px]">
                    {t(
                      'Após a confirmação do pedido, você poderá ler o QR Code ou copiar a chave. Um botão direto para envio do comprovante pelo WhatsApp comercial estará disponível com os dados pré-preenchidos.',
                      'After order confirmation, scan the QR Code or copy the string. A direct button to send your receipt via WhatsApp will be pre-filled with order details.'
                    )}
                  </p>
                </div>
              ) : (
                /* Card Input Mock for Stripe / Mercado Pago */
                <div className="p-4 rounded-xl bg-onyx-950 border border-gold-400/15 space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      {t('Número do Cartão de Crédito', 'Credit Card Number')}
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                        {t('Validade (MM/AA)', 'Expiry (MM/YY)')}
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-onyx-900 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review & Final Submit */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-6">
              <h3 className="font-serif text-base font-bold text-foreground border-b border-gold-400/20 pb-3">
                {t('Itens do Seu Pedido', 'Items in Your Order')}
              </h3>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-gold-400/20 shrink-0 bg-onyx-950">
                      <Image
                        src={item.product.images[0] || '/images/hero-bottle.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-serif font-semibold text-foreground line-clamp-1">
                        {item.product.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {item.quantity}x {item.product.volume}
                      </span>
                    </div>
                    <span className="font-mono text-gold-300 font-bold shrink-0">
                      R$ {((item.product.promo_price || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-stone-200">
                    R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Frete ({activeShippingObj.name}):</span>
                  <span className="font-mono text-gold-300 font-bold">
                    {shippingCost === 0 ? t('Cortesia', 'Free') : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="flex justify-between text-foreground font-serif text-lg font-bold border-t border-gold-400/20 pt-3">
                  <span>Total Geral:</span>
                  <span className="gold-text">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold-400/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{t('Processando Reserva...', 'Processing Reservation...')}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('Confirmar Reserva & Gerar Pedido', 'Confirm Reservation & Place Order')}</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-stone-400 space-y-1 text-center font-sans">
                <p>🔒 Transação protegida com certificação SSL TLS 1.3</p>
                <p>Origem garantida e envio seguro em embalagem térmica anti-choque.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
