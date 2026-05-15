-- ============================================================
-- 🏮 TOKCER AI: MASTER FLOW ACTIVATION (v7.2) - FIXED IDENTITY
-- ============================================================

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
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    IF v_user_id IS NULL THEN
        v_user_id := gen_random_uuid();
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated', 
            p_email, crypt(p_password, gen_salt('bf')), 
            now(), '{"provider":"email","providers":["email"]}'::jsonb, 
            jsonb_build_object('full_name', p_full_name), now(), now()
        );
        
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES (gen_random_uuid(), v_user_id, jsonb_build_object('sub', v_user_id, 'email', p_email, 'email_verified', true), 'email', p_email, NOW(), NOW(), NOW());
    ELSE
        UPDATE auth.users SET encrypted_password = crypt(p_password, gen_salt('bf')), updated_at = NOW() WHERE id = v_user_id;
        
        IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_user_id) THEN
            INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
            VALUES (gen_random_uuid(), v_user_id, jsonb_build_object('sub', v_user_id, 'email', p_email, 'email_verified', true), 'email', p_email, NOW(), NOW(), NOW());
        ELSE
            UPDATE auth.identities SET identity_data = jsonb_build_object('sub', v_user_id, 'email', p_email, 'email_verified', true) WHERE user_id = v_user_id AND provider = 'email';
        END IF;
    END IF;

    -- Partner Data Update
    UPDATE public.partners SET id = v_user_id, status = 'active' WHERE email = p_email;
    UPDATE public.partner_applications SET status = 'activated', agreed_at = NOW() WHERE id = p_application_id;

    -- Create/Update Client Account
    INSERT INTO public.clients (email, shop_name, status, plan, expired_at, created_at)
    VALUES (p_email, p_full_name, 'active', 'ultimate', v_expiry, NOW())
    ON CONFLICT (email) DO UPDATE SET status = 'active', plan = 'ultimate', expired_at = v_expiry;

    UPDATE public.profiles SET subscription_plan = 'ultimate' WHERE id = v_user_id;

    RETURN json_build_object('success', true);
END;
$$;
