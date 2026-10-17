export interface SensoryProfile {
  aroma: string;
  aroma_en: string;
  flavor: string;
  flavor_en: string;
  texture: string;
  texture_en: string;
  acidity: string;
  acidity_en: string;
  color: string;
  color_en: string;
}

export interface NutritionalInfo {
  serving_size: string; // ex: "20g (1 colher de sopa)"
  carbs: string;
  glucose: string;
  fructose: string;
  sucrose: string;
  moisture: string;
  minerals: string;
  phenolic_compounds: string;
  acidity_meq: string;
  ph: string;
  hmf: string;
}

export interface Product {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  concept: string;
  concept_en: string;
  subtitle: string;
  subtitle_en: string;
  description: string;
  description_en: string;
  characteristics: string[];
  characteristics_en: string[];
  price: number;
  promo_price?: number;
  stock: number;
  volume: string;
  images: string[];
  image?: string;
  foto1?: string;
  title?: string;
  sensory_profile: SensoryProfile;
  nutritional_info: NutritionalInfo;
  active: boolean;
  featured?: boolean;
  badge?: string;
  badge_en?: string;
  bee_species: string;
  biome: string;
  floral_type: string;
  lot_code_example: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'client' | 'admin';
  created_at: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ShippingOption {
  id: 'pac' | 'sedex' | 'motoboy' | 'fixed';
  name: string;
  price: number;
  deadline: string;
  description?: string;
}

export type PaymentMethod = 'pix' | 'stripe' | 'mercadopago';
export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  items: CartItem[];
  subtotal: number;
  shipping_type: string;
  shipping_cost: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: OrderStatus;
  tracking_code?: string;
  proof_url?: string;
  pix_code?: string;
  pix_qr_url?: string;
  affiliate_id?: string;
  affiliate_code?: string;
  discount_amount?: number;
  created_at: string;
  updated_at?: string;
}

export interface Lot {
  id: string;
  code: string;
  product_id: string;
  product_name: string;
  harvest_year: string;
  region: string;
  producer_name: string;
  floral_source: string;
  bottle_date: string;
  lab_cert_number: string;
  lab_analysis_url: string;
  purity_guarantee: string;
  moisture_rate: string;
  acidity_level: string;
  bee_species: string;
  sensory_notes: string;
  status: 'active' | 'archived';
  created_at: string;
}

export interface SiteSettings {
  cnpj: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  copyright: string;
  sommelier_phone: string;
  logo_url: string;
  favicon_url: string;
  stripe_publishable_key: string;
  stripe_secret_key: string;
  stripe_mode: 'test' | 'live';
  mp_public_key: string;
  mp_access_token: string;
  mp_mode: 'sandbox' | 'production';
  pix_key: string;
  pix_key_type: 'cnpj' | 'email' | 'phone' | 'random';
  pix_receiver_name: string;
  pix_city: string;
  fixed_shipping_price: number;
  free_shipping_threshold: number;
  motoboy_enabled: boolean;
  motoboy_price: number;
  motoboy_zip_prefixes: string; // Ex: "010,011,012,013,014,015,020,030,040,050"
}

export type SubscriptionInterval = 'month' | 'quarter' | 'year';
export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'past_due';
export type ShipmentStatus = 'preparing' | 'shipped' | 'delivered';

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  interval: SubscriptionInterval;
  tagline: string;
  description: string;
  features: string[];
  bottles_count: number;
  honey_desc: string;
  magazine_desc: string;
  artisan_gift_desc: string;
  exclusive_perks?: string[];
  is_featured?: boolean;
  badge?: string;
  active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  plan_id: string;
  plan_slug: string;
  plan_name: string;
  plan_price: number;
  status: SubscriptionStatus;
  payment_method: 'stripe' | 'pix';
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  next_billing_date: string;
  shipping_address: ShippingAddress;
  paused_until?: string;
  pix_code?: string;
  pix_qr_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface SubscriptionBoxHoneyAllocation {
  plan_slug: string;
  plan_name: string;
  lot_codes: string[];
  lot_titles: string[];
}

export interface SubscriptionBox {
  id: string;
  cycle_month: string;
  cycle_year: string;
  title: string;
  description: string;
  bee_magazine_theme: string;
  bee_magazine_edition: number;
  magazine_characters: string[];
  artisan_gift_name: string;
  artisan_gift_origin: string;
  honey_allocations: SubscriptionBoxHoneyAllocation[];
  created_at: string;
}

export interface SubscriptionShipment {
  id: string;
  subscription_id: string;
  box_id: string;
  subscriber_name: string;
  subscriber_email: string;
  subscriber_phone: string;
  plan_slug: string;
  plan_name: string;
  shipping_address: ShippingAddress;
  tracking_code?: string;
  carrier: string;
  status: ShipmentStatus;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
}

export type AffiliateStatus = 'pending' | 'active' | 'suspended';
export type AffiliateSaleStatus = 'pending' | 'approved' | 'paid' | 'canceled';

export interface Affiliate {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  code: string;
  commission_rate: number;
  discount_rate: number;
  pix_key?: string;
  status: AffiliateStatus;
  created_at: string;
  updated_at?: string;
}

export interface AffiliateSaleItem {
  name: string;
  quantity: number;
  unit_price: number;
}

export interface AffiliateSale {
  id: string;
  affiliate_id: string;
  affiliate_code?: string;
  order_id?: string;
  items_summary: AffiliateSaleItem[];
  gross_amount: number;
  discount_amount: number;
  net_amount: number;
  commission_amount: number;
  shipping_state: string; // Ex: "SP", "RJ", "AM"
  status: AffiliateSaleStatus;
  paid_at?: string;
  payment_proof_note?: string;
  created_at: string;
}

