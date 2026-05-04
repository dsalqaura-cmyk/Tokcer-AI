-- MASTER SQL FIX: TOKCER AI ONBOARDING & ACTIVATION
-- Lokasi: Supabase SQL Editor

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 0.1 Update Profiles Table Schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 0;

-- 0.2 Update Partners Table Schema
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS affiliate_id TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS commission_rate INTEGER DEFAULT 20;

-- 1. Tabel Clients (Jika belum ada)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shop_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT,
    plan TEXT DEFAULT 'starter',
    billing_cycle TEXT DEFAULT 'Monthly',
    business_type TEXT,
    platforms TEXT[],
    ref TEXT DEFAULT 'Direct Web',
    status TEXT DEFAULT 'pending', -- 'pending', 'active', 'rejected'
    payment_proof_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Tabel Partner Applications
CREATE TABLE IF NOT EXISTS public.partner_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nama TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    media_link TEXT NOT NULL,
    niche TEXT NOT NULL,
    followers TEXT NOT NULL,
    promo_methods TEXT[],
    promo_strategy TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'agreed', 'active', 'rejected'
    agreed_at TIMESTAMPTZ
);

-- 3. Tabel Partner Ideas (Untuk menyimpan strategi pendaftaran)
CREATE TABLE IF NOT EXISTS public.partner_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft'
);

-- Aktifkan RLS untuk Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert to clients" ON public.clients;
CREATE POLICY "Allow public insert to clients" ON public.clients FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view all clients" ON public.clients;
CREATE POLICY "Admins can view all clients" ON public.clients FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Fungsi RPC Aktivasi Akun (OTAK ONBOARDING)
-- Fungsi ini akan:
-- a. Membuat user di auth.users (jika belum ada)
-- b. Menyetel password default: Tokcer@2026
-- c. Membuat profile di public.profiles
-- d. Update status pendaftaran menjadi 'active'
-- e. Memberikan saldo token awal

CREATE OR REPLACE FUNCTION public.rpc_activate_account(
    p_email TEXT,
    p_application_id UUID,
    p_full_name TEXT,
    p_plan TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_tokens INTEGER;
BEGIN
    -- 1. Tentukan jumlah token berdasarkan paket
    v_tokens := CASE 
        WHEN lower(p_plan) = 'starter' THEN 1000
        WHEN lower(p_plan) = 'pro' THEN 5000
        WHEN lower(p_plan) = 'elite' THEN 15000
        WHEN lower(p_plan) = 'ultimate' THEN 50000
        ELSE 1000
    END;

    -- 2. Cek apakah user sudah ada di auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;

    -- 3. Jika belum ada, buat user baru (Password default: Tokcer@2026)
    IF v_user_id IS NULL THEN
        -- Catatan: password di hash otomatis oleh Supabase jika menggunakan API, 
        -- tapi di SQL kita set default yang akan di-hash saat login pertama atau via admin
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, recovery_sent_at, last_sign_in_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, email_change, email_change_token_new, recovery_token
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
            p_email, crypt('Tokcer@2026', gen_salt('bf')), 
            now(), now(), now(), 
            '{"provider":"email","providers":["email"]}'::jsonb, 
            jsonb_build_object('full_name', p_full_name), 
            now(), now(), '', '', '', ''
        )
        RETURNING id INTO v_user_id;
    END IF;

    -- 4. Upsert ke public.profiles
    -- Catatan: Jangan overwrite role jika user sudah ada dan role-nya bukan 'user'
    INSERT INTO public.profiles (id, full_name, email, role, subscription_plan, ai_credits_remaining)
    VALUES (v_user_id, p_full_name, p_email, 'user', p_plan, v_tokens)
    ON CONFLICT (id) DO UPDATE 
    SET subscription_plan = EXCLUDED.subscription_plan,
        ai_credits_remaining = profiles.ai_credits_remaining + EXCLUDED.ai_credits_remaining,
        role = CASE WHEN profiles.role IN ('admin', 'partner') THEN profiles.role ELSE EXCLUDED.role END;

    -- 5. Update status di tabel clients (atau partner_applications)
    -- Coba update di clients
    UPDATE public.clients 
    SET status = 'active' 
    WHERE id = p_application_id OR email = p_email;

    -- Coba update di partner_applications (jika pendaftar adalah partner)
    -- Catatan: Tabel partner_applications mungkin punya skema beda, sesuaikan jika perlu
    BEGIN
        UPDATE public.partner_applications 
        SET status = 'active' 
        WHERE id = p_application_id OR email = p_email;
    EXCEPTION WHEN OTHERS THEN
        -- Abaikan jika tabel tidak ada
    END;

    RETURN json_build_object(
        'success', true,
        'message', 'Account activated successfully with password: Tokcer@2026',
        'user_id', v_user_id
    );
END;
$$;
