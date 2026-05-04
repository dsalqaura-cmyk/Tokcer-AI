-- SEED PRESENTATION DATA (ULTRA-DYNAMIC + AUTO-SCHEMA): TOKCER AI
-- Target: admin@tokcer-ai.com

-- 0. Pastikan Tabel-Tabel Pendukung Ada
CREATE TABLE IF NOT EXISTS public.marketplace_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    shop_name TEXT,
    shop_id TEXT,
    sync_status TEXT DEFAULT 'idle',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT,
    stock INTEGER DEFAULT 0,
    price DECIMAL(15,2) DEFAULT 0.00,
    cost DECIMAL(15,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE,
    customer_name TEXT,
    platform TEXT,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    status TEXT DEFAULT 'completed',
    order_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature TEXT,
    prompt TEXT,
    response TEXT,
    tokens_used INTEGER DEFAULT 0,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost_usd DECIMAL(15,6) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 0.1 Matikan RLS (Biar data muncul di Dashboard)
ALTER TABLE public.marketplace_connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 1. Cari ID asli admin berdasarkan email
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@tokcer-ai.com' LIMIT 1;

    -- 2. Jika email belum ada, buat user baru
    IF v_user_id IS NULL THEN
        v_user_id := '81c19c28-9614-4a6d-b2f2-b8244c0ced29';
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, recovery_sent_at, last_sign_in_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, email_change, email_change_token_new, recovery_token
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated', 
            'admin@tokcer-ai.com', crypt('Dind@1983', gen_salt('bf')), 
            now(), now(), now(), 
            '{"provider":"email","providers":["email"]}'::jsonb, 
            '{"full_name":"Tokcer AI Admin"}'::jsonb, 
            now(), now(), '', '', '', ''
        );
    END IF;

    -- 3. Setup Profil (Ultimate)
    INSERT INTO public.profiles (id, full_name, email, role, subscription_plan, ai_credits_remaining, tokens)
    VALUES (v_user_id, 'Tokcer AI Admin', 'admin@tokcer-ai.com', 'admin', 'ultimate', 99999, 99999)
    ON CONFLICT (id) DO UPDATE 
    SET role = 'admin', subscription_plan = 'ultimate', tokens = 99999;

    -- 4. Mock Marketplace Connections
    DELETE FROM public.marketplace_connections WHERE user_id = v_user_id;
    INSERT INTO public.marketplace_connections (user_id, platform, shop_name, shop_id, sync_status)
    VALUES 
        (v_user_id, 'shopee', 'Tokcer Official Store', 'SHP88229', 'active'),
        (v_user_id, 'tiktok', 'Tokcer AI Beauty', 'TTK11022', 'active'),
        (v_user_id, 'lazada', 'Tokcer Gadget Center', 'LZD33991', 'active');

    -- 5. Mock Products (Catalog)
    DELETE FROM public.products WHERE user_id = v_user_id;
    INSERT INTO public.products (user_id, name, sku, stock, price, cost, description)
    VALUES 
        (v_user_id, 'Sunscreen Glowing SPF 50', 'SKIN-001', 120, 85000, 45000, 'Sunscreen pencerah kulit terbaik.'),
        (v_user_id, 'Earbuds Wireless Pro Z', 'GAD-099', 45, 299000, 180000, 'Audio kualitas studio tanpa kabel.'),
        (v_user_id, 'Smartwatch Fit X1', 'GAD-088', 30, 450000, 250000, 'Pelacak kesehatan dan notifikasi pintar.'),
        (v_user_id, 'Moisturizer Hyaluronic Acid', 'SKIN-002', 200, 125000, 60000, 'Melembabkan kulit selama 24 jam.'),
        (v_user_id, 'Kaos Oversize Premium Black', 'FASH-001', 80, 150000, 75000, 'Bahan cotton combed 24s adem.');

    -- 6. Mock Orders (Sales Data for Graph)
    DELETE FROM public.orders WHERE user_id = v_user_id;
    INSERT INTO public.orders (user_id, order_number, customer_name, platform, total_amount, status, order_date)
    SELECT 
        v_user_id,
        'ORD-' || to_char(now() - (i || ' days')::interval, 'YYYYMMDD') || '-' || i,
        'Customer ' || i,
        (ARRAY['shopee', 'tiktok', 'lazada'])[floor(random() * 3 + 1)],
        floor(random() * (1500000 - 50000 + 1) + 50000),
        'completed',
        now() - (i || ' days')::interval
    FROM generate_series(0, 30) AS i;

    -- 7. Mock AI Usage Logs (History)
    DELETE FROM public.ai_usage_logs WHERE user_id = v_user_id;
    INSERT INTO public.ai_usage_logs (user_id, feature, prompt, response, tokens_used)
    VALUES 
        (v_user_id, 'content_generator', 'Buat konten TikTok untuk Sunscreen SPF 50', 'Naskah video TikTok viral...', 1),
        (v_user_id, 'market_intel_analysis', 'Tren skincare 2026 di Indonesia', 'Hasil analisis tren pasar...', 1);

END $$;
