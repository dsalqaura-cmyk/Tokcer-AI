-- ============================================================
-- 🏮 TOKCER AI: MASTER FLOW ACTIVATION (v7.1) - FIXED IDENTITY
-- Separating Partner Flow and Emergency User Flow
-- ============================================================

-- BERSIHKAN VERSI LAMA AGAR TIDAK BENTROK
DROP FUNCTION IF EXISTS public.rpc_activate_partner(text, uuid, text, text);
DROP FUNCTION IF EXISTS public.rpc_activate_emergency_user(text, uuid, text, text);
DROP FUNCTION IF EXISTS public.rpc_activate_account(text, uuid, text, text, text, text);

-- 1. FUNGSI KHUSUS PARTNER (DOUBLE ACCESS)
CREATE OR REPLACE FUNCTION public.rpc_activate_partner(
    p_email TEXT,
    p_application_id UUID,
    p_full_name TEXT,
    p_password TEXT
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID;
    v_resend_api_key TEXT;
    v_html TEXT;
    v_expiry TIMESTAMP := NOW() + INTERVAL '60 days';
BEGIN
    -- A. Auth Management
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    IF v_user_id IS NULL THEN
        v_user_id := gen_random_uuid();
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES ('00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated', p_email, crypt(p_password, gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW());
        
        -- FIX: Tambahkan provider_id (Email) agar tidak melanggar Not-Null Constraint
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES (gen_random_uuid(), v_user_id, json_build_object('sub', v_user_id, 'email', p_email), 'email', p_email, NOW(), NOW(), NOW());
    ELSE
        UPDATE auth.users SET encrypted_password = crypt(p_password, gen_salt('bf')), updated_at = NOW() WHERE id = v_user_id;
    END IF;

    -- B. Partner Data (PERMANENT FIX: Sinkronisasi ID Auth ke ID Partner)
    UPDATE public.partners SET id = v_user_id, status = 'active' WHERE email = p_email;
    UPDATE public.partner_applications SET status = 'activated', agreed_at = NOW() WHERE id = p_application_id;

    -- C. Double Access: Create/Update Client Account (Ultimate 60 Days)
    INSERT INTO public.clients (email, shop_name, status, plan, expired_at, created_at)
    VALUES (p_email, p_full_name, 'active', 'ultimate', v_expiry, NOW())
    ON CONFLICT (email) DO UPDATE SET status = 'active', plan = 'ultimate', expired_at = v_expiry;

    UPDATE public.profiles SET subscription_plan = 'ultimate' WHERE id = v_user_id;

    -- D. Send Email
    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';
    v_html := '<div style="font-family:sans-serif; background:#000; color:#fff; padding:40px; border-radius:20px; border:1px solid #333;">' ||
              '<img src="https://tokcer-ai.com/logo.png" style="height:40px; margin-bottom:20px;">' ||
              '<h2>Selamat Bergabung Partner!</h2><p>Akun Partner & User Ultimate (60 Hari) Anda telah aktif.</p>' ||
              '<div style="background:#111; padding:20px; border:1px dashed #444; border-radius:12px; margin:20px 0;">' ||
              'Email: <b>' || p_email || '</b><br>Password: <b style="color:#ea580c; font-size:18px;">' || p_password || '</b></div><br>' ||
              '<a href="https://staging.tokcer-ai.com/login" style="background:#ea580c; color:#fff; padding:14px 28px; text-decoration:none; border-radius:10px; font-weight:bold; display:inline-block;">LOGIN SEKARANG</a></div>';
    
    IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' THEN
        PERFORM net.http_post(url := 'https://api.resend.com/emails', headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_resend_api_key),
        body := jsonb_build_object('from', 'Tokcer AI <onboarding@tokcer-ai.com>', 'to', ARRAY[p_email], 'subject', '🏮 Akses Partner & User Aktif!', 'html', v_html));
    END IF;

    RETURN json_build_object('success', true);
END;
$$;

-- 2. FUNGSI KHUSUS EMERGENCY USER (MANUAL ACTIVATION)
CREATE OR REPLACE FUNCTION public.rpc_activate_emergency_user(
    p_email TEXT,
    p_client_id UUID,
    p_full_name TEXT,
    p_password TEXT
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID;
    v_resend_api_key TEXT;
    v_html TEXT;
    v_expiry TIMESTAMP := NOW() + INTERVAL '60 days';
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    IF v_user_id IS NOT NULL THEN
        UPDATE auth.users SET encrypted_password = crypt(p_password, gen_salt('bf')), updated_at = NOW() WHERE id = v_user_id;
    END IF;

    UPDATE public.clients SET status = 'active', plan = 'ultimate', expired_at = v_expiry WHERE id = p_client_id;
    IF v_user_id IS NOT NULL THEN UPDATE public.profiles SET subscription_plan = 'ultimate' WHERE id = v_user_id; END IF;

    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';
    v_html := '<div style="font-family:sans-serif; background:#000; color:#fff; padding:40px; border-radius:20px; border:1px solid #333;">' ||
              '<img src="https://tokcer-ai.com/logo.png" style="height:40px; margin-bottom:20px;">' ||
              '<h2>Akun Tokcer AI Aktif (Emergency)!</h2><p>Pembayaran Anda telah diverifikasi manual. Kami berikan bonus Ultimate 60 Hari.</p>' ||
              '<div style="background:#111; padding:20px; border:1px dashed #444; border-radius:12px; margin:20px 0;">' ||
              'Email: <b>' || p_email || '</b><br>Password: <b style="color:#ea580c; font-size:18px;">' || p_password || '</b></div><br>' ||
              '<a href="https://staging.tokcer-ai.com/login" style="background:#ea580c; color:#fff; padding:14px 28px; text-decoration:none; border-radius:10px; font-weight:bold; display:inline-block;">LOGIN SEKARANG</a></div>';
    
    IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' THEN
        PERFORM net.http_post(url := 'https://api.resend.com/emails', headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_resend_api_key),
        body := jsonb_build_object('from', 'Tokcer AI <onboarding@tokcer-ai.com>', 'to', ARRAY[p_email], 'subject', '🚀 Akun Emergency Aktif!', 'html', v_html));
    END IF;

    RETURN json_build_object('success', true);
END;
$$;
