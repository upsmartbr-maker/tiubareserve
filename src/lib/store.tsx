'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Lot, 
  SiteSettings, 
  User, 
  OrderStatus,
  SubscriptionPlan,
  Subscription,
  SubscriptionBox,
  SubscriptionShipment,
  ShipmentStatus,
  SubscriptionStatus,
  ShippingAddress,
  Affiliate,
  AffiliateSale,
  AffiliateStatus,
  AffiliateSaleStatus,
  AffiliateSaleItem
} from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/data/products';
import { INITIAL_LOTS } from '@/lib/data/lots';
import { INITIAL_SETTINGS } from '@/lib/data/initialSettings';
import { INITIAL_AFFILIATES, INITIAL_AFFILIATE_SALES } from '@/lib/data/affiliateData';
import { 
  INITIAL_SUBSCRIPTION_PLANS, 
  INITIAL_SUBSCRIPTION_BOX, 
  DEMO_SUBSCRIPTIONS, 
  DEMO_SHIPMENTS 
} from '@/lib/data/subscriptionData';
import { generatePixPayload } from '@/lib/pix';

interface StoreContextType {
  // Products
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingCode?: string) => void;
  attachProofToOrder: (orderId: string, proofUrl: string) => void;

  // Subscriptions & Club
  subscriptionPlans: SubscriptionPlan[];
  subscriptions: Subscription[];
  currentBox: SubscriptionBox;
  shipments: SubscriptionShipment[];
  createSubscription: (data: {
    plan_slug: string;
    shipping_address: ShippingAddress;
    payment_method: 'stripe' | 'pix';
    user_name: string;
    user_email: string;
    user_phone: string;
  }) => Subscription;
  pauseSubscription: (subId: string) => void;
  resumeSubscription: (subId: string) => void;
  cancelSubscription: (subId: string) => void;
  updateSubscriptionAddress: (subId: string, address: ShippingAddress) => void;
  updateSubscriptionPaymentMethod: (subId: string, method: 'stripe' | 'pix') => void;
  updateSubscriptionBox: (box: SubscriptionBox) => void;
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, trackingCode?: string) => void;
  updateBulkShipmentTracking: (items: { id: string; tracking_code: string; status: ShipmentStatus }[]) => void;
  getUserSubscription: (email?: string) => Subscription | undefined;

  // Lots & Traceability
  lots: Lot[];
  getLotByCode: (code: string) => Lot | undefined;
  addLot: (lot: Lot) => void;
  updateLot: (lot: Lot) => void;

  // Settings
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Language
  lang: 'pt' | 'en';
  setLang: (lang: 'pt' | 'en') => void;
  t: (pt: string, en: string) => string;

  // Auth
  currentUser: User | null;
  login: (email: string, role?: 'client' | 'admin') => void;
  logout: () => void;
  isAdmin: boolean;

  // Affiliates & Commissions
  affiliates: Affiliate[];
  affiliateSales: AffiliateSale[];
  getAffiliateByCode: (code: string) => Affiliate | undefined;
  createAffiliate: (data: Omit<Affiliate, 'id' | 'created_at'>) => Affiliate;
  updateAffiliate: (id: string, data: Partial<Affiliate>) => void;
  updateAffiliatePixKey: (codeOrId: string, pixKey: string) => void;
  recordAffiliateSale: (params: {
    orderId: string;
    affiliateCode: string;
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    shippingState: string;
    isPaid?: boolean;
  }) => AffiliateSale | null;
  updateAffiliateSaleStatus: (saleId: string, status: AffiliateSaleStatus, proofNote?: string) => void;
  markAffiliateSaleAsPaid: (saleId: string, proofNote: string) => void;
  activeAffiliateRef: string | null;
  setActiveAffiliateRef: (code: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'tiuba_reserve_products_v1',
  LOTS: 'tiuba_reserve_lots_v1',
  ORDERS: 'tiuba_reserve_orders_v1',
  SETTINGS: 'tiuba_reserve_settings_v1',
  CART: 'tiuba_reserve_cart_v1',
  LANG: 'tiuba_reserve_lang_v1',
  USER: 'tiuba_reserve_user_v1',
  SUBSCRIPTION_PLANS: 'tiuba_reserve_sub_plans_v1',
  SUBSCRIPTIONS: 'tiuba_reserve_subs_v1',
  CURRENT_BOX: 'tiuba_reserve_current_box_v1',
  SHIPMENTS: 'tiuba_reserve_shipments_v1',
  AFFILIATES: 'tiuba_reserve_affiliates_v1',
  AFFILIATE_SALES: 'tiuba_reserve_affiliate_sales_v1',
  AFFILIATE_REF: 'tiuba_reserve_affiliate_ref',
};

// Seed initial demo orders so admin dashboard is never empty
const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'TR-89421',
    user_id: 'user-001',
    user_email: 'claudia.albuquerque@gastronomia.com.br',
    user_name: 'Dra. Cláudia Albuquerque',
    user_phone: '(11) 98765-4321',
    items: [
      { product: INITIAL_PRODUCTS[3], quantity: 2 }, // Amazonas
      { product: INITIAL_PRODUCTS[1], quantity: 1 }, // Bifloral
    ],
    subtotal: 800.0,
    shipping_type: 'Motoboy Express (São Paulo)',
    shipping_cost: 28.0,
    total_amount: 828.0,
    shipping_address: {
      fullName: 'Dra. Cláudia Albuquerque',
      phone: '(11) 98765-4321',
      street: 'Rua Bela Cintra',
      number: '1980',
      complement: 'Apto 142',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01415-002',
    },
    payment_method: 'pix',
    payment_status: 'paid',
    tracking_code: 'MOTO-EXPRESS-SP-89421',
    proof_url: '/images/certidao.png',
    created_at: '2026-09-24T14:15:00Z',
  },
  {
    id: 'ord-1002',
    order_number: 'TR-89422',
    user_id: 'user-002',
    user_email: 'marcelo.couto@sommelier.com',
    user_name: 'Chef Marcelo Couto',
    user_phone: '(21) 99123-5566',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Multifloral
      { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Tradicional
    ],
    subtotal: 434.0,
    shipping_type: 'SEDEX Express',
    shipping_cost: 35.0,
    total_amount: 469.0,
    shipping_address: {
      fullName: 'Chef Marcelo Couto',
      phone: '(21) 99123-5566',
      street: 'Avenida Atlântica',
      number: '2540',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22041-001',
    },
    payment_method: 'stripe',
    payment_status: 'preparing',
    tracking_code: 'BR849301928BR',
    created_at: '2026-09-24T18:40:00Z',
  },
  {
    id: 'ord-1003',
    order_number: 'TR-89423',
    user_id: 'user-003',
    user_email: 'fernanda.lacerda@artdevivre.com',
    user_name: 'Fernanda Lacerda',
    user_phone: '(11) 97654-1122',
    items: [
      { product: INITIAL_PRODUCTS[3], quantity: 1 }, // Amazonas
    ],
    subtotal: 290.0,
    shipping_type: 'PAC Encomenda',
    shipping_cost: 25.0,
    total_amount: 315.0,
    shipping_address: {
      fullName: 'Fernanda Lacerda',
      phone: '(11) 97654-1122',
      street: 'Alameda Gabriel Monteiro da Silva',
      number: '1450',
      neighborhood: 'Jardim Paulistano',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01442-001',
    },
    payment_method: 'pix',
    payment_status: 'pending',
    created_at: '2026-09-24T20:50:00Z',
  }
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [lots, setLots] = useState<Lot[]>(INITIAL_LOTS);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lang, setLangState] = useState<'pt' | 'en'>('pt');
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DEMO_SUBSCRIPTIONS);
  const [currentBox, setCurrentBox] = useState<SubscriptionBox>(INITIAL_SUBSCRIPTION_BOX);
  const [shipments, setShipments] = useState<SubscriptionShipment[]>(DEMO_SHIPMENTS);
  const [affiliates, setAffiliates] = useState<Affiliate[]>(INITIAL_AFFILIATES);
  const [affiliateSales, setAffiliateSales] = useState<AffiliateSale[]>(INITIAL_AFFILIATE_SALES);
  const [activeAffiliateRef, setActiveAffiliateRefState] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'admin-001',
    email: 'admin@tiubareserve.com.br',
    full_name: 'Curador Tiúba Reserve',
    phone: '+55 11 99998-8888',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z',
  });

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedLots = localStorage.getItem(LOCAL_STORAGE_KEYS.LOTS);
      if (savedLots) setLots(JSON.parse(savedLots));

      const savedOrders = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedLang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);
      if (savedLang === 'en' || savedLang === 'pt') setLangState(savedLang);

      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedPlans = localStorage.getItem(LOCAL_STORAGE_KEYS.SUBSCRIPTION_PLANS);
      if (savedPlans) setSubscriptionPlans(JSON.parse(savedPlans));

      const savedSubs = localStorage.getItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS);
      if (savedSubs) setSubscriptions(JSON.parse(savedSubs));

      const savedBox = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_BOX);
      if (savedBox) setCurrentBox(JSON.parse(savedBox));

      const savedShipments = localStorage.getItem(LOCAL_STORAGE_KEYS.SHIPMENTS);
      if (savedShipments) setShipments(JSON.parse(savedShipments));

      const savedAffiliates = localStorage.getItem(LOCAL_STORAGE_KEYS.AFFILIATES);
      if (savedAffiliates) setAffiliates(JSON.parse(savedAffiliates));

      const savedAffiliateSales = localStorage.getItem(LOCAL_STORAGE_KEYS.AFFILIATE_SALES);
      if (savedAffiliateSales) setAffiliateSales(JSON.parse(savedAffiliateSales));

      const savedRef = localStorage.getItem(LOCAL_STORAGE_KEYS.AFFILIATE_REF);
      if (savedRef) setActiveAffiliateRefState(savedRef);
    } catch (e) {
      console.error('Error hydrating store from localStorage', e);
    }
  }, []);

  // Sync products
  const addProduct = (prod: Product) => {
    setProducts(prev => {
      const updated = [prod, ...prev];
      if (isClient) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        } catch (e) {
          console.error("Limite do LocalStorage excedido ao salvar produtos:", e);
          alert("Aviso: A imagem é muito pesada para o armazenamento local. A foto foi comprimida, mas tente usar uma imagem mais leve ou o Supabase Storage.");
        }
      }
      return updated;
    });
  };

  const updateProduct = (prod: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === prod.id ? prod : p));
      if (isClient) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        } catch (e) {
          console.error("Limite do LocalStorage excedido ao salvar produtos:", e);
          alert("Aviso: A imagem é muito pesada para o armazenamento local. A foto foi comprimida, mas tente usar uma imagem mais leve ou o Supabase Storage.");
        }
      }
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (isClient) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
        } catch (e) {
          console.error("Erro ao sincronizar exclusão com localStorage:", e);
        }
      }
      return updated;
    });
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug);
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const updated = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (isClient) localStorage.removeItem(LOCAL_STORAGE_KEYS.CART);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + (item.product.promo_price || item.product.price) * item.quantity,
    0
  );

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Order => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: `TR-${randomCode}`,
      created_at: new Date().toISOString(),
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });

    clearCart();

    // Check if order used affiliate code and record commission
    if (newOrder.affiliate_code) {
      const affiliate = affiliates.find(
        a => a.code.toUpperCase() === newOrder.affiliate_code?.toUpperCase() && a.status === 'active'
      );
      if (affiliate) {
        const netAmount = Math.max(0, newOrder.subtotal - (newOrder.discount_amount || 0));
        const commAmount = Number(((netAmount * affiliate.commission_rate) / 100).toFixed(2));
        const saleRecord: AffiliateSale = {
          id: `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          affiliate_id: affiliate.id,
          affiliate_code: affiliate.code,
          order_id: newOrder.id,
          items_summary: newOrder.items.map(it => ({
            name: it.product.name,
            quantity: it.quantity,
            unit_price: it.product.promo_price || it.product.price,
          })),
          gross_amount: Number(newOrder.subtotal.toFixed(2)),
          discount_amount: Number((newOrder.discount_amount || 0).toFixed(2)),
          net_amount: Number(netAmount.toFixed(2)),
          commission_amount: commAmount,
          shipping_state: (newOrder.shipping_address?.state || 'SP').slice(0, 2).toUpperCase(),
          status: newOrder.payment_status === 'paid' ? 'approved' : 'pending',
          created_at: new Date().toISOString(),
        };

        setAffiliateSales(prev => {
          const updatedSales = [saleRecord, ...prev];
          if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATE_SALES, JSON.stringify(updatedSales));
          return updatedSales;
        });
      }
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingCode?: string) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            payment_status: status,
            tracking_code: trackingCode !== undefined ? trackingCode : o.tracking_code,
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });

    // Automatically synchronize affiliate commission status
    if (status === 'paid') {
      setAffiliateSales(prev => {
        let hasChanges = false;
        const updated = prev.map(sale => {
          if (sale.order_id === orderId && sale.status === 'pending') {
            hasChanges = true;
            return { ...sale, status: 'approved' as AffiliateSaleStatus };
          }
          return sale;
        });
        if (hasChanges && isClient) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATE_SALES, JSON.stringify(updated));
        }
        return updated;
      });
    } else if (status === 'cancelled') {
      setAffiliateSales(prev => {
        let hasChanges = false;
        const updated = prev.map(sale => {
          if (sale.order_id === orderId && sale.status !== 'paid') {
            hasChanges = true;
            return { ...sale, status: 'canceled' as AffiliateSaleStatus };
          }
          return sale;
        });
        if (hasChanges && isClient) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATE_SALES, JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const attachProofToOrder = (orderId: string, proofUrl: string) => {
    setOrders(prev => {
      const updated = prev.map(o =>
        o.id === orderId ? { ...o, proof_url: proofUrl, updated_at: new Date().toISOString() } : o
      );
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });
  };

  // Lots
  const getLotByCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    return lots.find(l => l.code.toUpperCase() === normalized);
  };

  const addLot = (lot: Lot) => {
    setLots(prev => {
      const updated = [lot, ...prev];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.LOTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateLot = (lot: Lot) => {
    setLots(prev => {
      const updated = prev.map(l => (l.id === lot.id ? lot : l));
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.LOTS, JSON.stringify(updated));
      return updated;
    });
  };

  // Subscriptions & Club Actions
  const createSubscription = ({
    plan_slug,
    shipping_address,
    payment_method,
    user_name,
    user_email,
    user_phone,
  }: {
    plan_slug: string;
    shipping_address: ShippingAddress;
    payment_method: 'stripe' | 'pix';
    user_name: string;
    user_email: string;
    user_phone: string;
  }): Subscription => {
    const selectedPlan = subscriptionPlans.find(p => p.slug === plan_slug) || subscriptionPlans[1];
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const subId = `sub-${Date.now()}`;
    let pixCode = undefined;

    if (payment_method === 'pix') {
      pixCode = generatePixPayload({
        key: settings.pix_key || '48.912.430/0001-85',
        receiverName: settings.pix_receiver_name || 'TIUBA RESERVE BRASIL LTDA',
        city: settings.pix_city || 'SAO PAULO',
        amount: selectedPlan.price,
        txid: `SUB${Date.now().toString().slice(-8)}`,
      });
    }

    const newSub: Subscription = {
      id: subId,
      user_id: currentUser?.id || `user-${Date.now()}`,
      user_email: user_email || currentUser?.email || 'assinante@tiubareserve.com.br',
      user_name: user_name || currentUser?.full_name || 'Assinante Tiúba',
      user_phone: user_phone || currentUser?.phone || '(11) 99999-9999',
      plan_id: selectedPlan.id,
      plan_slug: selectedPlan.slug,
      plan_name: selectedPlan.name,
      plan_price: selectedPlan.price,
      status: 'active',
      payment_method,
      stripe_subscription_id: payment_method === 'stripe' ? `sub_stripe_${Date.now()}` : undefined,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      next_billing_date: periodEnd.toISOString(),
      shipping_address,
      pix_code: pixCode,
      created_at: now.toISOString(),
    };

    // Auto-create first shipment for the current box
    const newShipment: SubscriptionShipment = {
      id: `ship-${Date.now()}`,
      subscription_id: newSub.id,
      box_id: currentBox.id,
      subscriber_name: newSub.user_name,
      subscriber_email: newSub.user_email,
      subscriber_phone: newSub.user_phone,
      plan_slug: newSub.plan_slug,
      plan_name: newSub.plan_name,
      shipping_address: newSub.shipping_address,
      carrier: newSub.shipping_address.city.toLowerCase().includes('são paulo') ? 'Motoboy Especial SP' : 'Correios SEDEX Prioritário',
      status: 'preparing',
      created_at: now.toISOString(),
    };

    setSubscriptions(prev => {
      const updated = [newSub, ...prev];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated;
    });

    setShipments(prev => {
      const updated = [newShipment, ...prev];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SHIPMENTS, JSON.stringify(updated));
      return updated;
    });

    return newSub;
  };

  const pauseSubscription = (subId: string) => {
    setSubscriptions(prev => {
      const updated = prev.map(s => {
        if (s.id === subId) {
          const pauseDate = new Date();
          pauseDate.setDate(pauseDate.getDate() + 30);
          return {
            ...s,
            status: 'paused' as SubscriptionStatus,
            paused_until: pauseDate.toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
        return s;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const resumeSubscription = (subId: string) => {
    setSubscriptions(prev => {
      const updated = prev.map(s => {
        if (s.id === subId) {
          return {
            ...s,
            status: 'active' as SubscriptionStatus,
            paused_until: undefined,
            updated_at: new Date().toISOString(),
          };
        }
        return s;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const cancelSubscription = (subId: string) => {
    setSubscriptions(prev => {
      const updated = prev.map(s => {
        if (s.id === subId) {
          return {
            ...s,
            status: 'canceled' as SubscriptionStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return s;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSubscriptionAddress = (subId: string, address: ShippingAddress) => {
    setSubscriptions(prev => {
      const updated = prev.map(s => (s.id === subId ? { ...s, shipping_address: address, updated_at: new Date().toISOString() } : s));
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSubscriptionPaymentMethod = (subId: string, method: 'stripe' | 'pix') => {
    setSubscriptions(prev => {
      const updated = prev.map(s => (s.id === subId ? { ...s, payment_method: method, updated_at: new Date().toISOString() } : s));
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSubscriptionBox = (box: SubscriptionBox) => {
    setCurrentBox(box);
    if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_BOX, JSON.stringify(box));
  };

  const updateShipmentStatus = (shipmentId: string, status: ShipmentStatus, trackingCode?: string) => {
    setShipments(prev => {
      const updated = prev.map(sh => {
        if (sh.id === shipmentId) {
          const isShipped = status === 'shipped';
          const isDelivered = status === 'delivered';
          return {
            ...sh,
            status,
            tracking_code: trackingCode !== undefined ? trackingCode : sh.tracking_code,
            shipped_at: isShipped ? (sh.shipped_at || new Date().toISOString()) : sh.shipped_at,
            delivered_at: isDelivered ? (sh.delivered_at || new Date().toISOString()) : sh.delivered_at,
          };
        }
        return sh;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SHIPMENTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateBulkShipmentTracking = (items: { id: string; tracking_code: string; status: ShipmentStatus }[]) => {
    setShipments(prev => {
      const updated = prev.map(sh => {
        const match = items.find(i => i.id === sh.id);
        if (match) {
          return {
            ...sh,
            status: match.status,
            tracking_code: match.tracking_code || sh.tracking_code,
            shipped_at: match.status === 'shipped' ? (sh.shipped_at || new Date().toISOString()) : sh.shipped_at,
            delivered_at: match.status === 'delivered' ? (sh.delivered_at || new Date().toISOString()) : sh.delivered_at,
          };
        }
        return sh;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SHIPMENTS, JSON.stringify(updated));
      return updated;
    });
  };

  const getUserSubscription = (email?: string): Subscription | undefined => {
    const targetEmail = email || currentUser?.email;
    if (!targetEmail) return subscriptions[0];
    return subscriptions.find(s => s.user_email.toLowerCase() === targetEmail.toLowerCase()) || subscriptions[0];
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  };

  // Language
  const setLang = (newLang: 'pt' | 'en') => {
    setLangState(newLang);
    if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, newLang);
  };

  const t = (pt: string, en: string) => (lang === 'en' ? en : pt);

  // Auth
  const login = (email: string, role: 'client' | 'admin' = 'client') => {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].toUpperCase(),
      phone: '+55 11 98888-7777',
      role,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(user);
    if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    if (isClient) localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  };

  // Affiliates & Commissions Management
  const getAffiliateByCode = (code: string) => {
    if (!code) return undefined;
    const clean = code.trim().toUpperCase();
    return affiliates.find(a => a.code.toUpperCase() === clean);
  };

  const createAffiliate = (data: Omit<Affiliate, 'id' | 'created_at'>): Affiliate => {
    const cleanCode = data.code.trim().toUpperCase();
    const newAff: Affiliate = {
      ...data,
      id: `aff-${Date.now()}`,
      code: cleanCode,
      commission_rate: Number(data.commission_rate) || 10.0,
      discount_rate: Number(data.discount_rate) || 5.0,
      created_at: new Date().toISOString(),
    };
    setAffiliates(prev => {
      const updated = [newAff, ...prev];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATES, JSON.stringify(updated));
      return updated;
    });
    return newAff;
  };

  const updateAffiliate = (id: string, data: Partial<Affiliate>) => {
    setAffiliates(prev => {
      const updated = prev.map(a => (a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a));
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATES, JSON.stringify(updated));
      return updated;
    });
  };

  const updateAffiliatePixKey = (codeOrId: string, pixKey: string) => {
    const target = codeOrId.trim().toUpperCase();
    setAffiliates(prev => {
      const updated = prev.map(a => {
        if (a.id === codeOrId || a.code.toUpperCase() === target) {
          return { ...a, pix_key: pixKey, updated_at: new Date().toISOString() };
        }
        return a;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATES, JSON.stringify(updated));
      return updated;
    });
  };

  const recordAffiliateSale = ({
    orderId,
    affiliateCode,
    items,
    subtotal,
    discountAmount,
    shippingState,
    isPaid = false,
  }: {
    orderId: string;
    affiliateCode: string;
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    shippingState: string;
    isPaid?: boolean;
  }): AffiliateSale | null => {
    const affiliate = affiliates.find(
      a => a.code.toUpperCase() === affiliateCode.trim().toUpperCase() && a.status === 'active'
    );
    if (!affiliate) return null;

    const netAmount = Math.max(0, subtotal - discountAmount);
    const commAmount = Number(((netAmount * affiliate.commission_rate) / 100).toFixed(2));

    const sale: AffiliateSale = {
      id: `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      affiliate_id: affiliate.id,
      affiliate_code: affiliate.code,
      order_id: orderId,
      items_summary: items.map(i => ({
        name: i.product.name,
        quantity: i.quantity,
        unit_price: i.product.promo_price || i.product.price,
      })),
      gross_amount: Number(subtotal.toFixed(2)),
      discount_amount: Number(discountAmount.toFixed(2)),
      net_amount: Number(netAmount.toFixed(2)),
      commission_amount: commAmount,
      shipping_state: shippingState.slice(0, 2).toUpperCase() || 'SP',
      status: isPaid ? 'approved' : 'pending',
      created_at: new Date().toISOString(),
    };

    setAffiliateSales(prev => {
      const filtered = prev.filter(s => s.order_id !== orderId);
      const updated = [sale, ...filtered];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATE_SALES, JSON.stringify(updated));
      return updated;
    });

    return sale;
  };

  const updateAffiliateSaleStatus = (saleId: string, status: AffiliateSaleStatus, proofNote?: string) => {
    setAffiliateSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          return {
            ...s,
            status,
            paid_at: status === 'paid' ? new Date().toISOString() : s.paid_at,
            payment_proof_note: proofNote !== undefined ? proofNote : s.payment_proof_note,
          };
        }
        return s;
      });
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATE_SALES, JSON.stringify(updated));
      return updated;
    });
  };

  const markAffiliateSaleAsPaid = (saleId: string, proofNote: string) => {
    updateAffiliateSaleStatus(saleId, 'paid', proofNote);
  };

  const setActiveAffiliateRef = (code: string | null) => {
    const clean = code ? code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) : null;
    setActiveAffiliateRefState(clean);
    if (isClient) {
      if (clean) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.AFFILIATE_REF, clean);
        document.cookie = `tiuba_ref=${clean}; max-age=${30 * 24 * 60 * 60}; path=/`;
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AFFILIATE_REF);
        document.cookie = `tiuba_ref=; max-age=0; path=/`;
      }
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <StoreContext.Provider
      value={{
        products,
        getProductBySlug,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        orders,
        createOrder,
        updateOrderStatus,
        attachProofToOrder,
        subscriptionPlans,
        subscriptions,
        currentBox,
        shipments,
        createSubscription,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        updateSubscriptionAddress,
        updateSubscriptionPaymentMethod,
        updateSubscriptionBox,
        updateShipmentStatus,
        updateBulkShipmentTracking,
        getUserSubscription,
        lots,
        getLotByCode,
        addLot,
        updateLot,
        settings,
        updateSettings,
        lang,
        setLang,
        t,
        currentUser,
        login,
        logout,
        isAdmin,
        affiliates,
        affiliateSales,
        getAffiliateByCode,
        createAffiliate,
        updateAffiliate,
        updateAffiliatePixKey,
        recordAffiliateSale,
        updateAffiliateSaleStatus,
        markAffiliateSaleAsPaid,
        activeAffiliateRef,
        setActiveAffiliateRef,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
