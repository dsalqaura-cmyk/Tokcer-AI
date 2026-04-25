-- 1. PROFILES: Table to store extended user information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at timestamp with time zone,
  full_name text,
  business_name text,
  business_type text,
  tier text DEFAULT 'Starter',
  status text DEFAULT 'Active',
  avatar_url text,
  website text
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. PRODUCTS: For Inventory Management
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  sku text,
  stock integer DEFAULT 0,
  price decimal DEFAULT 0,
  status text DEFAULT 'active',
  image_url text
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own products" ON products
  FOR ALL USING (auth.uid() = user_id);

-- 3. ANALYTICS: Daily performance tracking
CREATE TABLE IF NOT EXISTS analytics_daily (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date date DEFAULT current_date NOT NULL,
  revenue decimal DEFAULT 0,
  orders integer DEFAULT 0,
  health_score integer DEFAULT 100,
  UNIQUE(user_id, date)
);

ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics" ON analytics_daily
  FOR SELECT USING (auth.uid() = user_id);

-- 4. TICKETS: Support system
CREATE TABLE IF NOT EXISTS tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'Medium',
  status text DEFAULT 'Open',
  category text
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tickets" ON tickets
  FOR ALL USING (auth.uid() = user_id);

-- 5. PARTNER_REFERRALS: Track which partner brought which user
CREATE TABLE IF NOT EXISTS partner_referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  referred_user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'pending', -- pending, approved, paid
  commission_amount decimal DEFAULT 0
);

ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own referrals" ON partner_referrals
  FOR SELECT USING (auth.uid() = partner_id);
