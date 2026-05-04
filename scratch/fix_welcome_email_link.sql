-- SQL FIX: CORRECTING USER WELCOME EMAIL LINK
-- Execute this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.fn_send_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resend_api_key TEXT;
  v_response_status INT;
BEGIN
  -- 1. Only trigger if status changes to 'active'
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status <> 'active') THEN
    
    -- 2. Get Resend API Key from ai_configs
    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';

    IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' THEN
      -- 3. Send Email via Resend
      PERFORM net.http_post(
        url := 'https://api.resend.com/emails',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_resend_api_key
        ),
        body := jsonb_build_object(
          'from', 'Tokcer AI <onboarding@tokcer-ai.com>',
          'to', ARRAY[NEW.email],
          'subject', '🚀 Akun Tokcer AI Anda Telah Aktif!',
          'html', '
            <div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #0a0a0a; border-radius: 24px; color: #ffffff; border: 1px solid #1f2937;">
              <div style="text-align: center; margin-bottom: 40px;">
                <img src="https://dashboardstaging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="height: 48px; margin-bottom: 12px;">
                <p style="color: #9ca3af; font-size: 14px;">Elevate Your Marketplace Performance</p>
              </div>
              
              <h2 style="font-size: 20px; margin-bottom: 20px; color: #ffffff;">Halo, ' || NEW.shop_name || '!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">
                Pendaftaran toko Anda telah disetujui. Sekarang Anda sudah bisa mengakses fitur-fitur Tokcer AI untuk melejitkan performa jualan Anda.
              </p>
              
              <div style="background: #111111; padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid #262626;">
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #ea580c; font-weight: 800; text-transform: uppercase; tracking-widest: 0.1em;">Detail Login:</p>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">Username: <b style="color: #ffffff;">' || NEW.email || '</b></p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af;">Password: <b style="color: #ffffff;">Tokcer@2026</b></p>
              </div>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="https://staging.tokcer-ai.com/login" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-weight: 800; text-decoration: none; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);">
                  MASUK DASHBOARD
                </a>
              </div>
              
              <p style="font-size: 13px; line-height: 1.6; color: #6b7280; margin-top: 40px; text-align: center;">
                Jika Anda lupa password, silakan gunakan fitur "Lupa Password" di halaman login kami.
              </p>
              
              <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f2937; text-align: center;">
                <p style="font-size: 12px; color: #4b5563;">&copy; 2026 Tokcer AI - Marketplace AI Solution. All rights reserved.</p>
              </div>
            </div>'
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- RE-ENABLE THE CLIENT TRIGGER
DROP TRIGGER IF EXISTS tr_send_welcome_email ON public.clients;
CREATE TRIGGER tr_send_welcome_email
AFTER UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.fn_send_welcome_email();

-- ------------------------------------------------------------------
-- 2. FIX: PARTNER WELCOME EMAIL
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_send_partner_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resend_api_key TEXT;
BEGIN
  -- Trigger hanya jika status berubah jadi 'active'
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status <> 'active') THEN
    
    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';

    IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' THEN
      PERFORM net.http_post(
        url := 'https://api.resend.com/emails',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_resend_api_key
        ),
        body := jsonb_build_object(
          'from', 'Tokcer AI <onboarding@tokcer-ai.com>',
          'to', ARRAY[NEW.email],
          'subject', '🏮 Selamat Bergabung, Tokcer AI Partner!',
          'html', '
            <div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #0a0a0a; border-radius: 24px; color: #ffffff; border: 1px solid #1f2937;">
              <div style="text-align: center; margin-bottom: 40px;">
                <img src="https://dashboardstaging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="height: 48px; margin-bottom: 12px;">
                <p style="color: #9ca3af; font-size: 14px;">Partner Excellence Program</p>
              </div>
              
              <h2 style="font-size: 20px; margin-bottom: 20px; color: #ffffff;">Halo, ' || NEW.full_name || '!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">
                Akun partner Anda telah diaktifkan. Anda sekarang sudah bisa mulai memantau performa referral dan mengelola kampanye Anda.
              </p>
              
              <div style="background: #111111; padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid #262626;">
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #ea580c; font-weight: 800; text-transform: uppercase; tracking-widest: 0.1em;">Akses Login Partner:</p>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">Username: <b style="color: #ffffff;">' || NEW.email || '</b></p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af;">Password: <b style="color: #ffffff;">Tokcer@2026</b></p>
              </div>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="https://staging.tokcer-ai.com/login" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-weight: 800; text-decoration: none; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);">
                  MASUK DASHBOARD PARTNER
                </a>
              </div>
              
              <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f2937; text-align: center;">
                <p style="font-size: 12px; color: #4b5563;">&copy; 2026 Tokcer AI - Partner Program. All rights reserved.</p>
              </div>
            </div>'
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- RE-ENABLE THE PARTNER TRIGGER
DROP TRIGGER IF EXISTS tr_send_partner_welcome_email ON public.partners;
CREATE TRIGGER tr_send_partner_welcome_email
AFTER UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.fn_send_partner_welcome_email();
