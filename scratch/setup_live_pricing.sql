-- 1. Tabel Gudang Paket & Harga (LIVE)
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly INTEGER NOT NULL,
    price_yearly INTEGER NOT NULL,
    description TEXT,
    features TEXT[] -- Array fitur
);

-- 2. Isi data paket (Bapak bisa ganti angkanya di sini kapan saja)
INSERT INTO public.pricing_plans (id, name, price_monthly, price_yearly, features) VALUES
('starter', 'Starter Edition', 0, 0, ARRAY['50 Generasi AI', '1 Toko Marketplace', 'Analitik Dasar']),
('pro', 'Pro Edition', 499000, 5489000, ARRAY['300 Generasi AI', '3 Toko Marketplace', 'Naskah TikTok']),
('elite', 'Elite Edition', 999000, 10989000, ARRAY['1000 Generasi AI', '10 Toko Marketplace', 'Riset Tren']),
('ultimate', 'Ultimate Edition', 1999000, 21989000, ARRAY['Unlimited AI', 'Unlimited Toko', 'Analisis Kompetitor'])
ON CONFLICT (id) DO UPDATE SET 
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly;

-- 3. PERBAIKAN DATA LAMA (Sapu Bersih)
-- Kita ubah semua pendaftaran yang nyasar jadi Starter ke Ultimate (sesuai perintah Bapak)
UPDATE public.clients 
SET plan = 'ultimate' 
WHERE plan = 'starter' AND status = 'pending';

-- 4. Pastikan tabel clients punya kolom billing_cycle
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='billing_cycle') THEN
        ALTER TABLE public.clients ADD COLUMN billing_cycle TEXT DEFAULT 'Monthly';
    END IF;
END $$;
