-- ============================================================
-- 🏮 TOKCER AI: ADVANCED ACTIVATION WITH PASSWORD SYNC (v5)
-- Support Unique Password Generation & Security Sync
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_activate_account(
    p_email TEXT,
    p_application_id UUID,
    p_full_name TEXT,
    p_password TEXT, -- Password unik yang di-generate dari React
    p_plan TEXT DEFAULT 'starter',
    p_role TEXT DEFAULT 'user'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_resend_api_key TEXT;
    v_subject TEXT;
    v_html TEXT;
    v_login_url TEXT := 'https://staging.tokcer-ai.com/login';
    v_logo_url TEXT := 'https://tokcer-ai.com/logo.png';
BEGIN
    -- 1. Cari User ID di auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;

    -- 2. PAKSA UPDATE PASSWORD (Agar sinkron dengan email)
    -- Menggunakan pgcrypto (standard Supabase)
    IF v_user_id IS NOT NULL THEN
        UPDATE auth.users 
        SET encrypted_password = crypt(p_password, gen_salt('bf')),
            updated_at = NOW(),
            raw_app_meta_data = raw_app_meta_data || jsonb_build_object('is_activated', true)
        WHERE id = v_user_id;
    END IF;

    -- 3. Ambil API Key Resend
    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';

    -- 4. Update Status di tabel operasional
    IF p_role = 'partner' THEN
        UPDATE public.partners SET status = 'active' WHERE email = p_email;
        UPDATE public.partner_applications SET status = 'agreed', agreed_at = NOW() WHERE id = p_application_id;
    ELSE
        UPDATE public.clients SET status = 'active' WHERE email = p_email;
    END IF;

    -- 5. Siapkan Konten Email dengan Password UNIK
    v_subject := CASE WHEN p_role = 'partner' THEN '🏮 Selamat Bergabung, Partner Tokcer AI!' ELSE '🚀 Akun Tokcer AI Anda Telah Aktif!' END;
    
    v_html := '<div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #333;">' ||
              '<img src="' || v_logo_url || '" style="height: 40px; margin-bottom: 20px;">' ||
              '<h2>Halo ' || p_full_name || '!</h2>' ||
              '<p>Akun Anda telah diaktifkan oleh Admin. Berikut adalah detail akses Anda:</p>' ||
              '<div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px dashed #444;">' ||
              '<p style="margin: 5px 0;">Email: <b>' || p_email || '</b></p>' ||
              '<p style="margin: 5px 0;">Password: <span style="color: #ea580c; font-size: 18px; font-family: monospace; letter-spacing: 2px;">' || p_password || '</span></p>' ||
              '</div>' ||
              '<p style="font-size: 13px; color: #888;">Demi keamanan, segera ubah password Anda setelah berhasil login.</p>' ||
              '<br><a href="' || v_login_url || '" style="background: #ea580c; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">MASUK DASHBOARD</a>' ||
              '</div>';

    -- 6. Kirim Email
    IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' THEN
        PERFORM net.http_post(
            url := 'https://api.resend.com/emails',
            headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_resend_api_key),
            body := jsonb_build_object(
                'from', 'Tokcer AI <onboarding@tokcer-ai.com>',
                'to', ARRAY[p_email],
                'subject', v_subject,
                'html', v_html
            )
        );
    END IF;

    RETURN json_build_object(
        'success', true,
        'message', 'Akses ' || p_role || ' berhasil diaktifkan dengan password baru.'
    );
END;
$$;
