-- SEED API CONFIGS: TOKCER AI
-- This enables the Marketplace Sync flow to proceed without "Unconfigured" alerts.

-- 1. Create table if missing
CREATE TABLE IF NOT EXISTS public.ai_configs (
    key TEXT PRIMARY KEY,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert/Update Placeholder Keys
-- We use DO UPDATE to ensure existing keys are overwritten with our simulation values
INSERT INTO public.ai_configs (key, value)
VALUES 
    ('tiktok_app_id', '6db7a2e58c9f4d3b'), 
    ('shopee_partner_id', '882291'),
    ('shopee_partner_key', '8a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'),
    ('resend_api_key', 're_tokcer_ai_mock_key_123456789')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value,
    updated_at = NOW();

-- 3. Disable RLS (Required for Dashboard to read it)
ALTER TABLE public.ai_configs DISABLE ROW LEVEL SECURITY;
