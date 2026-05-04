-- SEED PARTNER PRESENTATION DATA (ULTRA-DYNAMIC): TOKCER AI
-- Target: admin@tokcer-ai.com (Acting as Partner)

-- 0. Safety Check Schema (Tambah kolom yang kurang di tabel partners & buat tabel payouts)
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS total_omzet DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS commission_rate INTEGER DEFAULT 20;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS affiliate_id TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'bronze';

CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'rejected'
    period TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety: Tambah kolom kalau tabel payouts sudah terlanjur ada tapi lama
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS period TEXT;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 1. Cari ID asli admin berdasarkan email di auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@tokcer-ai.com' LIMIT 1;

    -- 2. Jika user belum ada di auth (sangat jarang), kita lewati atau buat (tapi asumsikan sudah ada dari seed sebelumnya)
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User admin@tokcer-ai.com tidak ditemukan. Jalankan seed profil admin dulu Pak!';
    END IF;

    -- 3. Upsert Data Partner (Platinum Tier)
    INSERT INTO public.partners (id, full_name, email, whatsapp, bank_name, bank_account, total_omzet, status, commission_rate, affiliate_id, tier)
    VALUES (
        v_user_id, 
        'Tokcer AI Master Partner', 
        'admin@tokcer-ai.com', 
        '08123456789', 
        'BCA', 
        '8899001122', 
        45000000, 
        'active', 
        20, 
        'TKC-PLAT-001',
        'platinum'
    )
    ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name,
        whatsapp = EXCLUDED.whatsapp,
        bank_name = EXCLUDED.bank_name,
        bank_account = EXCLUDED.bank_account,
        total_omzet = EXCLUDED.total_omzet,
        status = EXCLUDED.status,
        affiliate_id = EXCLUDED.affiliate_id,
        tier = 'platinum';

    -- 4. Mock Subscribers (Clients referred by this partner)
    DELETE FROM public.clients WHERE partner_id = v_user_id;
    INSERT INTO public.clients (partner_id, shop_name, email, plan, status, created_at)
    VALUES 
        (v_user_id, 'Glow & Lovely Store', 'glow@mail.com', 'ultimate', 'active', now() - interval '10 days'),
        (v_user_id, 'Gadget Mania ID', 'gadget@mail.com', 'ultimate', 'active', now() - interval '15 days'),
        (v_user_id, 'Fashionista Hijab', 'fashion@mail.com', 'elite', 'active', now() - interval '5 days'),
        (v_user_id, 'Baby Care Mart', 'baby@mail.com', 'elite', 'active', now() - interval '20 days'),
        (v_user_id, 'Healthy Food Hub', 'health@mail.com', 'pro', 'active', now() - interval '2 days'),
        (v_user_id, 'Home Decor Center', 'home@mail.com', 'pro', 'active', now() - interval '30 days'),
        (v_user_id, 'Sports Gear ID', 'sport@mail.com', 'ultimate', 'pending', now() - interval '1 day'),
        (v_user_id, 'Coffee Bean Shop', 'coffee@mail.com', 'elite', 'active', now() - interval '12 days'),
        (v_user_id, 'Beauty Tool Kit', 'beauty@mail.com', 'pro', 'active', now() - interval '25 days'),
        (v_user_id, 'Pet Lovers Store', 'pet@mail.com', 'ultimate', 'active', now() - interval '8 days');

    -- 5. Mock Payouts (History)
    DELETE FROM public.payouts WHERE partner_id = v_user_id;
    INSERT INTO public.payouts (partner_id, amount, status, period, created_at)
    VALUES 
        (v_user_id, 4500000, 'paid', 'Maret 2026', now() - interval '30 days'),
        (v_user_id, 5250000, 'paid', 'April 2026', now() - interval '5 days'),
        (v_user_id, 1200000, 'pending', 'Mei 2026 (Berjalan)', now());

END $$;

-- 6. Safety: Matikan RLS biar data muncul
ALTER TABLE public.partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
