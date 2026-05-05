-- RPC: DEDUCT TOKEN (HARDENED SECURITY)
-- Menjamin validasi token terjadi di level server.

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
BEGIN
    -- 1. Ambil saldo token terbaru
    SELECT ai_tokens INTO v_current_tokens 
    FROM public.profiles 
    WHERE id = p_user_id;

    -- 2. Validasi saldo
    IF v_current_tokens IS NULL OR v_current_tokens < p_amount THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Token tidak cukup. Sisa token: ' || COALESCE(v_current_tokens, 0)
        );
    END IF;

    -- 3. Lakukan pengurangan
    UPDATE public.profiles 
    SET ai_tokens = ai_tokens - p_amount 
    WHERE id = p_user_id;

    -- 4. Catat Log Usage
    INSERT INTO public.ai_usage_logs (user_id, feature, tokens_used)
    VALUES (p_user_id, p_feature, p_amount);

    RETURN json_build_object(
        'success', true,
        'new_balance', v_current_tokens - p_amount,
        'message', 'Token berhasil dipotong.'
    );
END;
$$;
