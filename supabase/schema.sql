-- ========================================================
-- TIÚBA RESERVE - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Mel Nobre de Abelha Tiúba (Melipona fasciculata, Bioma Amazônia)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    concept TEXT,
    concept_en TEXT,
    subtitle TEXT,
    subtitle_en TEXT,
    description TEXT NOT NULL,
    description_en TEXT NOT NULL,
    characteristics JSONB DEFAULT '[]'::jsonb,
    characteristics_en JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10, 2) NOT NULL,
    promo_price NUMERIC(10, 2),
    stock INTEGER DEFAULT 0,
    volume VARCHAR(50) DEFAULT '150 ml',
    images JSONB DEFAULT '[]'::jsonb,
    sensory_profile JSONB DEFAULT '{}'::jsonb,
    nutritional_info JSONB DEFAULT '{}'::jsonb,
    bee_species VARCHAR(100) DEFAULT 'Melipona compressipes fasciculata',
    biome VARCHAR(100) DEFAULT 'Amazônia',
    floral_type VARCHAR(100),
    lot_code_example VARCHAR(50),
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_type VARCHAR(100) NOT NULL,
    shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('stripe', 'mercadopago', 'pix')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'preparing', 'shipped', 'completed', 'cancelled')),
    tracking_code VARCHAR(100),
    proof_url TEXT,
    pix_code TEXT,
    pix_qr_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LOTS (RASTREABILIDADE)
CREATE TABLE IF NOT EXISTS public.lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    harvest_year VARCHAR(10) NOT NULL,
    region VARCHAR(255) NOT NULL,
    producer_name VARCHAR(255) NOT NULL,
    floral_source TEXT NOT NULL,
    bottle_date VARCHAR(50) NOT NULL,
    lab_cert_number VARCHAR(100) NOT NULL,
    lab_analysis_url TEXT,
    purity_guarantee TEXT,
    moisture_rate VARCHAR(20),
    acidity_level VARCHAR(20),
    bee_species VARCHAR(100) DEFAULT 'Melipona compressipes fasciculata',
    sensory_notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read active products, only admins can modify
CREATE POLICY "Public read products" ON public.products
    FOR SELECT USING (active = true OR auth.role() = 'service_role');

CREATE POLICY "Admin write products" ON public.products
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Lots: Anyone can search and read lots, only admins can modify
CREATE POLICY "Public read lots" ON public.lots
    FOR SELECT USING (true);

CREATE POLICY "Admin write lots" ON public.lots
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Settings: Anyone can read settings, only admins can modify
CREATE POLICY "Public read settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin write settings" ON public.site_settings
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Orders: Users can read their own orders; admins can read and update all
CREATE POLICY "Users read own orders" ON public.orders
    FOR SELECT USING (user_email = auth.jwt() ->> 'email' OR auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Users insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update orders" ON public.orders
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- ========================================================
-- SEED DATA (INITIAL DATA INSERTION)
-- ========================================================

-- Insert Initial Site Settings
INSERT INTO public.site_settings (key, value, type, description) VALUES
('cnpj', '48.912.430/0001-85', 'string', 'CNPJ da empresa'),
('address', 'Av. Brigadeiro Faria Lima, 3477 - 14º Andar, Itaim Bibi, São Paulo - SP', 'string', 'Endereço oficial'),
('phone', '+55 (11) 3197-8800', 'string', 'Telefone fixo institucional'),
('whatsapp', '5511999988888', 'string', 'WhatsApp para atendimento comercial e pedidos'),
('sommelier_phone', '5511999988888', 'string', 'WhatsApp direto com Sommelier de Méis'),
('instagram', 'https://instagram.com/tiubareserve', 'string', 'Perfil Instagram'),
('pix_key', '48.912.430/0001-85', 'string', 'Chave PIX da empresa'),
('pix_receiver_name', 'TIUBA RESERVE BRASIL LTDA', 'string', 'Favorecido do PIX'),
('pix_city', 'SAO PAULO', 'string', 'Cidade do favorecido'),
('fixed_shipping_price', '32.00', 'number', 'Valor do frete fixo nacional'),
('motoboy_enabled', 'true', 'boolean', 'Ativar serviço motoboy em SP'),
('motoboy_price', '28.00', 'number', 'Preço do motoboy express SP')
ON CONFLICT (key) DO NOTHING;
