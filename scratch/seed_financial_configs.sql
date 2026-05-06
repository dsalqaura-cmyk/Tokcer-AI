-- ============================================================
-- 🏮 TOKCER AI: FINANCIAL CONFIGURATION SEED
-- Jalankan ini untuk mengatur harga paket & target revenue
-- ============================================================

INSERT INTO public.ai_configs (key, value) VALUES
('price_starter', '0'),
('price_pro', '499000'),
('price_elite', '999000'),
('price_ultimate', '1999000'),
('target_revenue_monthly', '100000000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
