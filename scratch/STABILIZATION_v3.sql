-- ============================================================
-- 🛡️ TOKCER AI: SYSTEM STABILIZATION (v3)
-- Execute this in your Supabase SQL Editor
-- ============================================================

-- 1. FIX AI_USAGE_LOGS SCHEMA (Sync with React Dashboard)
-- Pastikan semua kolom yang dibutuhkan React ada di sini
ALTER TABLE public.ai_usage_logs 
ADD COLUMN IF NOT EXISTS input_tokens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS output_tokens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prompt TEXT,
ADD COLUMN IF NOT EXISTS response TEXT,
ADD COLUMN IF NOT EXISTS cost_usd NUMERIC(15, 10) DEFAULT 0,
ADD COLUMN IF NOT EXISTS model TEXT DEFAULT 'DeepSeek-Flash-V4';

-- 2. HARDEN TOKEN DEDUCTION (Anti-Spam & Race Condition Proof)
CREATE OR REPLACE FUNCTION public.rpc_deduct_token(
    p_user_id UUID,
    p_feature TEXT,
    p_amount INTEGER DEFAULT 1
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_tokens INTEGER;
    v_user_plan TEXT;
    v_already_paid BOOLEAN;
BEGIN
    -- A. Cek Paket User
    SELECT plan, ai_tokens INTO v_user_plan, v_current_tokens 
    FROM public.profiles 
    WHERE id = p_user_id;

    -- B. Bypas untuk Paket Ultimate (Unlimited)
    IF v_user_plan = 'ultimate' THEN
        INSERT INTO public.ai_usage_logs (user_id, feature, input_tokens, model)
        VALUES (p_user_id, p_feature, p_amount, 'DeepSeek-Flash-V4');
        
        RETURN json_build_object(
            'success', true,
            'new_balance', v_current_tokens,
            'message', 'Paket Ultimate: Akses Tanpa Batas.'
        );
    END IF;

    -- C. Idempotency Check (Akses Harian)
    IF p_feature LIKE 'daily_access_%' THEN
        SELECT EXISTS (
            SELECT 1 FROM public.ai_usage_logs 
            WHERE user_id = p_user_id 
              AND feature = p_feature 
              AND created_at::date = CURRENT_DATE
        ) INTO v_already_paid;

        IF v_already_paid THEN
            RETURN json_build_object('success', true, 'new_balance', v_current_tokens, 'message', 'Sudah diakses hari ini.');
        END IF;
    END IF;

    -- D. ATOMIC UPDATE (Mencegah Kebobolan/Race Condition)
    -- Kita coba kurangi token LANGSUNG di query UPDATE
    UPDATE public.profiles 
    SET ai_tokens = ai_tokens - p_amount 
    WHERE id = p_user_id 
      AND ai_tokens >= p_amount
    RETURNING ai_tokens INTO v_current_tokens;

    -- Jika tidak ada baris yang terupdate, berarti token tidak cukup
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Token tidak cukup atau akun tidak ditemukan.'
        );
    END IF;

    -- E. Catat Log (Sesuai Skema Baru)
    INSERT INTO public.ai_usage_logs (user_id, feature, input_tokens, model)
    VALUES (p_user_id, p_feature, p_amount, 'DeepSeek-Flash-V4');

    RETURN json_build_object(
        'success', true,
        'new_balance', v_current_tokens,
        'message', 'Token berhasil dipotong secara aman.'
    );
END;
$$;
