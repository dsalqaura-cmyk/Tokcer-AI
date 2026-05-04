-- ============================================================
-- 🏮 TOKCER AI: PRODUCTION DATABASE SETUP SCRIPT (IDEMPOTENT v3)
-- ============================================================
-- Script ini 100% AMAN dijalankan berulang kali.
-- Semua CREATE TABLE menggunakan IF NOT EXISTS.
-- Semua kolom baru menggunakan ADD COLUMN IF NOT EXISTS.
-- Semua POLICY di-DROP dulu sebelum di-CREATE ulang.
-- Tanggal: 4 Mei 2026 | Total Tabel: 14 + 1 Storage Bucket
-- ============================================================


-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  subscription_plan TEXT DEFAULT 'starter',
  ai_tokens INTEGER DEFAULT 10,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'starter';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_tokens INTEGER DEFAULT 10;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- 2. CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  shop_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  plan TEXT DEFAULT 'starter',
  billing_cycle TEXT DEFAULT 'Monthly',
  business_type TEXT,
  platforms JSONB,
  ref TEXT,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_proof_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS partner_id UUID;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS shop_name TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter';
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'Monthly';
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS platforms JSONB;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS ref TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Partners can view own clients" ON public.clients;
CREATE POLICY "Partners can view own clients" ON public.clients FOR SELECT USING (auth.uid() = partner_id);
DROP POLICY IF EXISTS "Partners can insert clients" ON public.clients;
CREATE POLICY "Partners can insert clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = partner_id OR partner_id IS NULL);
DROP POLICY IF EXISTS "Admins full access clients" ON public.clients;
CREATE POLICY "Admins full access clients" ON public.clients FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_clients_partner_id ON public.clients(partner_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_ref ON public.clients(ref);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);


-- ============================================================
-- 3. PARTNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  whatsapp TEXT,
  bank_name TEXT,
  bank_account TEXT,
  ref_code TEXT,
  tier TEXT DEFAULT 'starter',
  total_omzet BIGINT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS ref_code TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'starter';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS total_omzet BIGINT DEFAULT 0;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'partners_ref_code_key') THEN
    ALTER TABLE public.partners ADD CONSTRAINT partners_ref_code_key UNIQUE (ref_code);
  END IF;
END; $$;

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Partners can view own data" ON public.partners;
CREATE POLICY "Partners can view own data" ON public.partners FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Partners can update own data" ON public.partners;
CREATE POLICY "Partners can update own data" ON public.partners FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins full access partners" ON public.partners;
CREATE POLICY "Admins full access partners" ON public.partners FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_partners_ref_code ON public.partners(ref_code);
CREATE INDEX IF NOT EXISTS idx_partners_total_omzet ON public.partners(total_omzet DESC);


-- ============================================================
-- 4. PARTNER_APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  shop_name TEXT,
  promo_strategy TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS nama TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS shop_name TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS promo_strategy TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.partner_applications;
CREATE POLICY "Anyone can insert applications" ON public.partner_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage applications" ON public.partner_applications;
CREATE POLICY "Admins can manage applications" ON public.partner_applications FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- 5. PARTNER_IDEAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partner_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.partner_ideas ADD COLUMN IF NOT EXISTS partner_id UUID;
ALTER TABLE public.partner_ideas ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.partner_ideas ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.partner_ideas ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE public.partner_ideas ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.partner_ideas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Partners can insert ideas" ON public.partner_ideas;
CREATE POLICY "Partners can insert ideas" ON public.partner_ideas FOR INSERT WITH CHECK (auth.uid() = partner_id OR partner_id IS NULL);
DROP POLICY IF EXISTS "Partners can view own ideas" ON public.partner_ideas;
CREATE POLICY "Partners can view own ideas" ON public.partner_ideas FOR SELECT USING (auth.uid() = partner_id);


-- ============================================================
-- 6. SUPPORT_TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'bug',
  description TEXT,
  screenshot_url TEXT,
  status TEXT DEFAULT 'open',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'bug';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert tickets" ON public.support_tickets;
CREATE POLICY "Users can insert tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage tickets" ON public.support_tickets;
CREATE POLICY "Admins can manage tickets" ON public.support_tickets FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- 7. PAYOUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount BIGINT DEFAULT 0,
  period TEXT,
  status TEXT DEFAULT 'pending',
  bank_name TEXT,
  bank_account TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS partner_id UUID;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS amount BIGINT DEFAULT 0;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS period TEXT;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.payouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Partners can view own payouts" ON public.payouts;
CREATE POLICY "Partners can view own payouts" ON public.payouts FOR SELECT USING (auth.uid() = partner_id);
DROP POLICY IF EXISTS "Admins full access payouts" ON public.payouts;
CREATE POLICY "Admins full access payouts" ON public.payouts FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- 8. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id TEXT,
  order_date TIMESTAMPTZ,
  product_name TEXT,
  quantity INTEGER DEFAULT 1,
  total_amount NUMERIC DEFAULT 0,
  platform TEXT,
  store_name TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_date TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS store_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON public.orders(order_date);


-- ============================================================
-- 9. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT,
  sku TEXT,
  price NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  category TEXT,
  platform TEXT,
  store_name TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own products" ON public.products;
CREATE POLICY "Users can view own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own products" ON public.products;
CREATE POLICY "Users can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);


-- ============================================================
-- 10. MARKETPLACE_CONNECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketplace_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  shop_name TEXT,
  shop_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  status TEXT DEFAULT 'connected',
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS shop_name TEXT;
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS shop_id TEXT;
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS access_token TEXT;
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS refresh_token TEXT;
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'connected';
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS connected_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.marketplace_connections ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

ALTER TABLE public.marketplace_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own connections" ON public.marketplace_connections;
CREATE POLICY "Users can manage own connections" ON public.marketplace_connections FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_user ON public.marketplace_connections(user_id);


-- ============================================================
-- 11. AI_CONFIGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS value TEXT;
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS updated_by UUID;
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.ai_configs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.ai_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage configs" ON public.ai_configs;
CREATE POLICY "Admins can manage configs" ON public.ai_configs FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Authenticated users can read configs" ON public.ai_configs;
CREATE POLICY "Authenticated users can read configs" ON public.ai_configs FOR SELECT USING (auth.role() = 'authenticated');


-- ============================================================
-- 12. AI_CONFIGS_HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_configs_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ai_configs_history ADD COLUMN IF NOT EXISTS config_key TEXT;
ALTER TABLE public.ai_configs_history ADD COLUMN IF NOT EXISTS old_value TEXT;
ALTER TABLE public.ai_configs_history ADD COLUMN IF NOT EXISTS new_value TEXT;
ALTER TABLE public.ai_configs_history ADD COLUMN IF NOT EXISTS changed_by UUID;
ALTER TABLE public.ai_configs_history ADD COLUMN IF NOT EXISTS changed_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.ai_configs_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage config history" ON public.ai_configs_history;
CREATE POLICY "Admins can manage config history" ON public.ai_configs_history FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- 13. AI_USAGE_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  feature TEXT,
  prompt TEXT,
  response TEXT,
  tokens_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS feature TEXT;
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS prompt TEXT;
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS response TEXT;
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 1;
ALTER TABLE public.ai_usage_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own logs" ON public.ai_usage_logs;
CREATE POLICY "Users can insert own logs" ON public.ai_usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
DROP POLICY IF EXISTS "Users can view own logs" ON public.ai_usage_logs;
CREATE POLICY "Users can view own logs" ON public.ai_usage_logs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all logs" ON public.ai_usage_logs;
CREATE POLICY "Admins can view all logs" ON public.ai_usage_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_ai_logs_user ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON public.ai_usage_logs(created_at);


-- ============================================================
-- 14. PRICING_PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly NUMERIC DEFAULT 0,
  price_yearly NUMERIC DEFAULT 0,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS price_monthly NUMERIC DEFAULT 0;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS price_yearly NUMERIC DEFAULT 0;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read pricing" ON public.pricing_plans;
CREATE POLICY "Anyone can read pricing" ON public.pricing_plans FOR SELECT USING (true);


-- ============================================================
-- 💾 SEED: PRICING PLANS
-- ============================================================
INSERT INTO public.pricing_plans (id, name, price_monthly, price_yearly, features, is_active) VALUES
  ('starter', 'Starter Edition (Early Stage)', 0, 0, '["Dashboard Basic", "CSV Import"]', true),
  ('pro', 'Pro Edition', 499000, 5489000, '["Dashboard Full", "AI Generator", "CSV Import"]', true),
  ('elite', 'Elite Edition', 999000, 10989000, '["All Pro Features", "Analytics AI", "Priority Support"]', true),
  ('ultimate', 'Ultimate Edition', 1999000, 21989000, '["All Elite Features", "Market Intel", "Marketplace Sync", "Dedicated Support"]', true)
ON CONFLICT (id) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  name = EXCLUDED.name;


-- ============================================================
-- 💾 SEED: COMMISSION RATES
-- ============================================================
INSERT INTO public.ai_configs (key, value, description) VALUES
  ('commission_rates_v3', '{"pro":{"starter":100000,"bronze":100000,"silver":100000,"gold":100000,"platinum":100000},"elite":{"starter":119600,"bronze":119600,"silver":149600,"gold":179500,"platinum":199400},"ultimate":{"starter":249700,"bronze":249700,"silver":299600,"gold":374600,"platinum":449500}}', 'Official Partner Commission Rates per Tier'),
  ('annual_plan_bonuses', '{"pro":100000,"elite":250000,"ultimate":500000}', 'One-Time Annual Plan Bonuses'),
  ('tier_requirements', '{"bronze":{"min_closings":3},"silver":{"min_closings":5,"min_elite":2},"gold":{"min_closings":8,"min_elite":2},"platinum":{"min_closings":15,"min_elite":5}}', 'Tier Upgrade Requirements')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;


-- ============================================================
-- 📦 STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true) ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 🔄 TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['profiles','clients','partners','support_tickets','ai_configs'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', tbl, tbl);
  END LOOP;
END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, subscription_plan, ai_tokens)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), 'user', 'starter', 10)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- ✅ VERIFIKASI
-- ============================================================
SELECT table_name, '✅ EXISTS' AS status
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles','clients','partners','partner_applications',
    'partner_ideas','support_tickets','payouts',
    'orders','products','marketplace_connections',
    'ai_configs','ai_configs_history','ai_usage_logs','pricing_plans'
  )
ORDER BY table_name;

-- 🏮 SCRIPT SELESAI — Aman dijalankan ulang kapan saja.
