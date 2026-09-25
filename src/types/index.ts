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
