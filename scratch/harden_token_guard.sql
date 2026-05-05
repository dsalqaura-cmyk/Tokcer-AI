-- ============================================================
-- 🏮 RPC: DEDUCT TOKEN (v2 - IDEMPOTENT DAILY ACCESS)
-- ============================================================
-- Fungsi ini menjamin:
-- 1. Token hanya dipotong jika saldo cukup.
-- 2. Fitur 'daily_access_' hanya dipotong 1x per hari (Server-side check).
-- 3. Semua penggunaan tercatat di ai_usage_logs.

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
    v_already_paid BOOLEAN;
BEGIN
    -- 1. Ambil saldo token terbaru
    SELECT ai_tokens INTO v_current_tokens 
    FROM public.profiles 
    WHERE id = p_user_id;

    -- 2. Cek apakah ini akses harian (Idempotency Check)
    -- Jika fitur diawali dengan 'daily_access_', cek apakah sudah ada log hari ini.
    IF p_feature LIKE 'daily_access_%' THEN
        SELECT EXISTS (
            SELECT 1 FROM public.ai_usage_logs 
            WHERE user_id = p_user_id 
              AND feature = p_feature 
              AND created_at::date = CURRENT_DATE
        ) INTO v_already_paid;

        IF v_already_paid THEN
            RETURN json_build_object(
                'success', true,
                'new_balance', v_current_tokens,
                'message', 'Fitur sudah dibayar untuk hari ini (Gratis akses ulang).'
            );
        END IF;
    END IF;

    -- 3. Validasi saldo jika belum dibayar
    IF v_current_tokens IS NULL OR v_current_tokens < p_amount THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Token tidak cukup. Sisa token: ' || COALESCE(v_current_tokens, 0)
        );
    END IF;

    -- 4. Lakukan pengurangan saldo
    UPDATE public.profiles 
    SET ai_tokens = ai_tokens - p_amount 
    WHERE id = p_user_id;

    -- 5. Catat Log Usage
    INSERT INTO public.ai_usage_logs (user_id, feature, tokens_used)
    VALUES (p_user_id, p_feature, p_amount);

    RETURN json_build_object(
        'success', true,
        'new_balance', v_current_tokens - p_amount,
        'message', 'Token berhasil dipotong.'
    );
END;
$$;
