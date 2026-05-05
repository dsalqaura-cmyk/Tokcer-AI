-- ============================================================
-- 🏮 TOKCER AI: HPP & MARGIN CALCULATOR DATABASE SCHEMA
-- ============================================================

-- 1. PLATFORM FEES (Master Data for Calculator Presets)
CREATE TABLE IF NOT EXISTS public.platform_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name TEXT NOT NULL, -- shopee, tiktok_shop, website
    category_name TEXT NOT NULL, -- fashion, elektronik, umum
    commission_percent NUMERIC DEFAULT 0,
    logistics_fixed_fee NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform_name, category_name)
);

-- Seed Initial Data (Mei 2026 Policy)
INSERT INTO public.platform_fees (platform_name, category_name, commission_percent, logistics_fixed_fee) VALUES
('shopee', 'fashion', 11, 0),
('shopee', 'elektronik', 5, 0),
('shopee', 'umum', 8, 0),
('tiktok_shop', 'fashion', 6, 5055),
('tiktok_shop', 'elektronik', 4, 5055),
('tiktok_shop', 'umum', 5, 5055),
('website', 'fashion', 2.5, 0),
('website', 'elektronik', 2.5, 0),
('website', 'umum', 2.5, 0)
ON CONFLICT (platform_name, category_name) DO UPDATE SET
commission_percent = EXCLUDED.commission_percent,
logistics_fixed_fee = EXCLUDED.logistics_fixed_fee;

-- 2. SKU CALCULATIONS (User Saved Data)
CREATE TABLE IF NOT EXISTS public.sku_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sku_name TEXT NOT NULL,
    
    -- Section A: HPP
    modal_beli NUMERIC DEFAULT 0,
    biaya_packaging NUMERIC DEFAULT 0,
    biaya_lain_lain NUMERIC DEFAULT 0,
    biaya_ongkir_inbound NUMERIC DEFAULT 0,
    total_hpp NUMERIC GENERATED ALWAYS AS (modal_beli + biaya_packaging + biaya_lain_lain + biaya_ongkir_inbound) STORED,
    
    -- Section B: Platform & Marketing
    platform TEXT,
    category TEXT,
    komisi_persen NUMERIC DEFAULT 0,
    logistik_flat NUMERIC DEFAULT 0,
    ads_persen NUMERIC DEFAULT 0,
    affiliator_persen NUMERIC DEFAULT 0,
    admin_fee_flat NUMERIC DEFAULT 0,
    
    -- Section C: Target & Actual
    target_margin_persen NUMERIC DEFAULT 20,
    harga_jual_aktual NUMERIC DEFAULT 0,
    diskon_voucher NUMERIC DEFAULT 0,
    estimasi_order_per_bulan INTEGER DEFAULT 200,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read platform fees" ON public.platform_fees FOR SELECT USING (true);
CREATE POLICY "Admins full access platform fees" ON public.platform_fees FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE public.sku_calculations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own calculations" ON public.sku_calculations FOR ALL USING (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_sku_calc_user_id ON public.sku_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_sku_calc_sku_name ON public.sku_calculations(sku_name);
