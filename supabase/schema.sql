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

-- ========================================================
-- 6. CLUBE DE ASSINATURA RECORRENTE (TIÚBA CLUB)
-- ========================================================

-- 6.1 SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    interval VARCHAR(20) DEFAULT 'month' CHECK (interval IN ('month', 'quarter', 'year')),
    tagline TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.2 SUBSCRIPTIONS (RECORRÊNCIA DO ASSINANTE)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled', 'past_due')),
    payment_method VARCHAR(50) DEFAULT 'stripe' CHECK (payment_method IN ('stripe', 'pix')),
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    shipping_address JSONB NOT NULL,
    pix_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.3 SUBSCRIPTION BOXES (CURADORIA DA CAIXA DO MÊS - BOX PLANNER)
CREATE TABLE IF NOT EXISTS public.subscription_boxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_month VARCHAR(50) NOT NULL,
    cycle_year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    bee_magazine_theme VARCHAR(255) NOT NULL,
    artisan_gift_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.4 SUBSCRIPTION SHIPMENTS (GESTÃO DE ENVIOS DO CICLO)
CREATE TABLE IF NOT EXISTS public.subscription_shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    box_id UUID REFERENCES public.subscription_boxes(id) ON DELETE SET NULL,
    tracking_code VARCHAR(100),
    status VARCHAR(50) DEFAULT 'preparing' CHECK (status IN ('preparing', 'shipped', 'delivered')),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- RLS POLICIES FOR SUBSCRIPTION CLUB
-- ========================================================

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_shipments ENABLE ROW LEVEL SECURITY;

-- Plans: Public read, Admin manage
CREATE POLICY "Public read subscription plans" ON public.subscription_plans
    FOR SELECT USING (active = true OR auth.role() = 'service_role');

CREATE POLICY "Admin write subscription plans" ON public.subscription_plans
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Boxes: Public read current, Admin manage
CREATE POLICY "Public read subscription boxes" ON public.subscription_boxes
    FOR SELECT USING (true);

CREATE POLICY "Admin write subscription boxes" ON public.subscription_boxes
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Subscriptions: User read/insert own, Admin all
CREATE POLICY "Users read own subscriptions" ON public.subscriptions
    FOR SELECT USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Users create own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Shipments: User read own, Admin manage
CREATE POLICY "Users read own shipments" ON public.subscription_shipments
    FOR SELECT USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin' OR subscription_id IN (
        SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admin manage shipments" ON public.subscription_shipments
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- ========================================================
-- INITIAL SEED FOR SUBSCRIPTION PLANS & CURRENT BOX
-- ========================================================

INSERT INTO public.subscription_plans (name, slug, price, interval, tagline, description, features, is_featured, active) VALUES
(
    'Néctar Essencial',
    'nectar-essencial',
    99.00,
    'month',
    'A pureza da Tiúba para o dia a dia familiar',
    'A porta de entrada ideal para degustar méis nativos da Amazônia com leveza, acompanhado da revistinha infantil.',
    '["1 Frasco de Mel Nobre Tiúba 150ml (safra rotativa)", "1 Edição da Revistinha Infantil As Aventuras da Tiúba", "1 Brinde Botânico (sementes melíferas nativas)", "Sem fidelidade: pause ou cancele quando quiser"]'::jsonb,
    false,
    true
),
(
    'Colmeia Amazônica',
    'colmeia-amazonica',
    189.00,
    'month',
    'O equilíbrio perfeito de sabores e experiências em família',
    'Nossa assinatura mais aclamada por sommeliers e famílias. Combina floradas raras e artefatos de colecionador.',
    '["2 Frascos de Mel de Tiúba 150ml (edições combinadas: Amazonas + Bifloral)", "1 Edição Ilustrada + Encarte de atividades sem telas", "1 Brinde Nobre do Produtor (colher dosadora de madeira nobre)", "Ficha sensorial de harmonização com queijos e pratos", "Sem fidelidade: pause ou cancele quando quiser"]'::jsonb,
    true,
    true
),
(
    'Guardião da Floresta',
    'guardiao-da-floresta',
    290.00,
    'month',
    'Alta Reserva, filantropia ecológica e privilégios exclusivos',
    'A experiência máxima da meliponicultura amazônica com lotes numerados de tiragem ultralimitada e certificado nominado.',
    '["3 Frascos de Mel (2 regulares + 1 lote numerado de safra ultralimitada)", "Certificado de Guardião da Colmeia com coordenadas geográficas GPS", "1 Edição da Revistinha Infantil + Minibrinde infantil colecionável", "1 Brinde de Luxo (cerâmica regional amazônica ou vela de cerume puro)", "15% de desconto vitalício em qualquer pedido avulso na Boutique", "Frete prioritário grátis"]'::jsonb,
    false,
    true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subscription_boxes (cycle_month, cycle_year, title, description, bee_magazine_theme, artisan_gift_name) VALUES
(
    'Outubro',
    '2026',
    'Edição Outubro 2026 - Florada do Dossel Amazônico',
    'Méis colhidos em floradas altas com notas florais adocicadas, acompanhado de historinha ecológica sobre a polinização das castanheiras.',
    'O Segredo da Castanheira Sagrada',
    'Colher Dosadora Artesanal em Madeira Nobre de Muirapiranga'
)
ON CONFLICT DO NOTHING;

-- ========================================================
-- 7. PROGRAMA DE AFILIADOS / EMBAIXADORES & COMISSÕES
-- ========================================================

-- 7.1 AFFILIATES TABLE
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    code VARCHAR(10) UNIQUE NOT NULL,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00 NOT NULL,
    discount_rate NUMERIC(5, 2) DEFAULT 5.00 NOT NULL,
    pix_key TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT affiliate_code_format CHECK (code ~ '^[A-Z0-9]{2,10}$')
);

-- Extend Orders table with affiliate tracking columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS affiliate_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;

-- 7.2 AFFILIATE SALES (VENDAS ANONIMIZADAS - LGPD COMPLIANT)
CREATE TABLE IF NOT EXISTS public.affiliate_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    items_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
    gross_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    net_amount NUMERIC(10, 2) NOT NULL,
    commission_amount NUMERIC(10, 2) NOT NULL,
    shipping_state VARCHAR(2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'canceled')),
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_proof_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- RLS POLICIES FOR AFFILIATES MODULE
-- ========================================================

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;

-- Affiliates Policies
CREATE POLICY "Public read active affiliate codes" ON public.affiliates
    FOR SELECT USING (status = 'active' OR auth.role() = 'service_role');

CREATE POLICY "Affiliates read own profile" ON public.affiliates
    FOR SELECT USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Affiliates update own pix" ON public.affiliates
    FOR UPDATE USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admin manage affiliates" ON public.affiliates
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Affiliate Sales Policies (LGPD: Affiliates can only see their sales summary, never customer PII)
CREATE POLICY "Affiliates read own sales" ON public.affiliate_sales
    FOR SELECT USING (
        affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()) 
        OR auth.jwt() ->> 'role' = 'admin' 
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Admin manage affiliate sales" ON public.affiliate_sales
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- ========================================================
-- SEED DATA FOR DEMO AFFILIATES
-- ========================================================

INSERT INTO public.affiliates (name, email, code, commission_rate, discount_rate, pix_key, status) VALUES
('Chef Ana Gastronomia', 'chef.ana@altareserva.com.br', 'CHEFANA', 10.00, 5.00, 'chef.ana@altareserva.com.br', 'active'),
('Tiúba Oficial Ambassador', 'embaixador@tiubareserve.com.br', 'TIUBA10', 10.00, 5.00, '48.912.430/0001-85', 'active'),
('Sommelier Silva', 'marcelo.couto@sommelier.com', 'SOMMELIER', 12.00, 8.00, '11991235566', 'active'),
('Clube Gourmet SP', 'contato@gourmetsp.com.br', 'GOURMET', 10.00, 5.00, 'pix@gourmetsp.com.br', 'pending')
ON CONFLICT (code) DO NOTHING;


