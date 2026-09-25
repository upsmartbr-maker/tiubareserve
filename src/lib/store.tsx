'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Lot, SiteSettings, User, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/data/products';
import { INITIAL_LOTS } from '@/lib/data/lots';
import { INITIAL_SETTINGS } from '@/lib/data/initialSettings';

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
    } catch (e) {
      console.error('Error hydrating store from localStorage', e);
    }
  }, []);

  // Sync products
  const addProduct = (prod: Product) => {
    setProducts(prev => {
      const updated = [prod, ...prev];
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (prod: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === prod.id ? prod : p));
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (isClient) localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
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
