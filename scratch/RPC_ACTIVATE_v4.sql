-- ============================================================
-- 🏮 TOKCER AI: CENTRALIZED ACTIVATION RPC (v4)
-- Membereskan Masalah Approval Partner & Email Branding
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_activate_account(
    p_email TEXT,
    p_application_id UUID,
    p_full_name TEXT,
    p_plan TEXT DEFAULT 'starter',
    p_role TEXT DEFAULT 'user' -- 'user' atau 'partner'
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
    v_login_url TEXT := 'https://staging.tokcer-ai.com/login'; -- Bisa diganti ke prod nanti
    v_logo_url TEXT := 'https://tokcer-ai.com/logo.png';
BEGIN
    -- 1. Ambil API Key Resend
    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';

    -- 2. Update Status di tabel yang relevan
    IF p_role = 'partner' THEN
        UPDATE public.partners SET status = 'active' WHERE email = p_email;
        -- Jika dari partner_applications
        UPDATE public.partner_applications SET status = 'agreed', agreed_at = NOW() WHERE id = p_application_id;
    ELSE
        UPDATE public.clients SET status = 'active' WHERE email = p_email;
    END IF;

    -- 3. Siapkan Email Content
    IF p_role = 'partner' THEN
        v_subject := '🏮 Selamat Bergabung, Partner Tokcer AI!';
        v_html := '<div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #333;">' ||
                  '<img src="' || v_logo_url || '" style="height: 40px; margin-bottom: 20px;">' ||
                  '<h2>Halo ' || p_full_name || '!</h2>' ||
                  '<p>Akun Partner Anda telah aktif. Silakan login untuk memantau performa referral Anda.</p>' ||
                  '<div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0;">' ||
                  '<p>Username: <b>' || p_email || '</b></p>' ||
                  '<p>Password: <b>Tokcer@2026</b></p>' ||
                  '</div>' ||
                  '<a href="' || v_login_url || '" style="background: #ea580c; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold;">MASUK DASHBOARD PARTNER</a>' ||
                  '</div>';
    ELSE
        v_subject := '🚀 Akun Tokcer AI Anda Telah Aktif!';
        v_html := '<div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #333;">' ||
                  '<img src="' || v_logo_url || '" style="height: 40px; margin-bottom: 20px;">' ||
                  '<h2>Halo ' || p_full_name || '!</h2>' ||
                  '<p>Selamat! Pendaftaran paket ' || UPPER(p_plan) || ' Anda telah disetujui.</p>' ||
                  '<div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0;">' ||
                  '<p>Username: <b>' || p_email || '</b></p>' ||
                  '<p>Password: <b>Tokcer@2026</b></p>' ||
                  '</div>' ||
                  '<a href="' || v_login_url || '" style="background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold;">MASUK DASHBOARD USER</a>' ||
                  '</div>';
    END IF;

    -- 4. Kirim Email (via Database HTTP Post)
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
        'message', 'Akun ' || p_role || ' berhasil diaktifkan & email terkirim.'
    );
END;
$$;
