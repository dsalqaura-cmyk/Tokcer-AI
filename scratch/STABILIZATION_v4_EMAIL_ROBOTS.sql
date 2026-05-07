-- ============================================================
-- 🏮 TOKCER AI: EMAIL ROBOTS STABILIZATION (v4.1)
-- Fokus: Hardening Trigger Partner & Debugging Log
-- Tanggal: 7 Mei 2026
-- ============================================================

-- 0. TABEL DEBUG (Untuk melihat error jika email gagal)
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    recipient TEXT,
    subject TEXT,
    status_code TEXT,
    error_message TEXT,
    request_id TEXT
);

-- 1. FUNGSI: SEND AGREEMENT EMAIL (Langkah 1 Pendaftaran Partner)
CREATE OR REPLACE FUNCTION public.fn_send_agreement_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resend_api_key TEXT;
  v_agreement_url TEXT;
  v_http_response_id TEXT;
BEGIN
    -- Ambil API Key (Cek Partner Key dulu, fallback ke General)
    SELECT value INTO v_resend_api_key 
    FROM public.ai_configs 
    WHERE key = 'resend_api_key_partner';

    IF v_resend_api_key IS NULL OR v_resend_api_key = '' THEN
        SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';
    END IF;
    
    -- Link Agreement (Gunakan staging, cast ID ke text)
    v_agreement_url := 'https://staging.tokcer-ai.com/partner-agreement?id=' || NEW.id::text;

    -- Kirim Email jika Key ada
    IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' AND v_resend_api_key NOT LIKE '%mock%' THEN
      
      -- Gunakan net.http_post (Asynchronous)
      SELECT net.http_post(
        url := 'https://api.resend.com/emails',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_resend_api_key
        ),
        body := jsonb_build_object(
          'from', 'Tokcer AI <onboarding@tokcer-ai.com>',
          'to', ARRAY[NEW.email],
          'subject', '🏮 Langkah Terakhir: Setujui Skema Komisi Tokcer AI',
          'html', '
            <div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #0a0a0a; border-radius: 24px; color: #ffffff; border: 1px solid #1f2937;">
              <div style="text-align: center; margin-bottom: 40px;">
                <img src="https://dashboardstaging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="height: 48px; margin-bottom: 12px;">
                <p style="color: #9ca3af; font-size: 14px;">Partner Excellence Program</p>
              </div>
              
              <h2 style="font-size: 20px; margin-bottom: 20px; color: #ffffff; text-align: center;">Halo, ' || NEW.nama || '!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; text-align: center;">
                Terima kasih telah mendaftar sebagai Partner Tokcer AI. Data Anda telah kami terima.
              </p>
              
              <div style="background: #111111; padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px dashed #262626; text-align: center;">
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #ea580c; font-weight: 800; text-transform: uppercase;">Aksi Diperlukan:</p>
                <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                  Silakan baca dan setujui <b>Skema Komisi & Aturan Partner</b> melalui tombol di bawah ini untuk melanjutkan proses aktivasi.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="' || v_agreement_url || '" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-weight: 800; text-decoration: none; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);">
                  BACA & SETUJUI AGREEMENT
                </a>
              </div>
              
              <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f2937; text-align: center;">
                <p style="font-size: 11px; color: #4b5563;">&copy; 2026 Tokcer AI - Global Partner Program. All rights reserved.</p>
              </div>
            </div>'
        )
      ) INTO v_http_response_id;

      -- Log Aktivitas
      INSERT INTO public.email_logs (recipient, subject, request_id)
      VALUES (NEW.email, 'Agreement Partner', v_http_response_id);

    ELSE
      -- Log Error jika API Key bermasalah
      INSERT INTO public.email_logs (recipient, subject, error_message)
      VALUES (NEW.email, 'Agreement Partner', 'Resend API Key tidak ditemukan atau masih Mock Key');
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log jika terjadi error sistem
    INSERT INTO public.email_logs (recipient, subject, error_message)
    VALUES (NEW.email, 'Agreement Partner', SQLERRM);
    RETURN NEW;
END;
$$;

-- 2. FUNGSI: NOTIFY ADMIN REVIEW
CREATE OR REPLACE FUNCTION public.fn_notify_admin_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resend_api_key TEXT;
  v_http_response_id TEXT;
BEGIN
    -- Trigger hanya jika status berubah dari 'pending' ke 'agreed'
    IF NEW.status = 'agreed' AND OLD.status = 'pending' THEN
        
        SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key_partner';
        IF v_resend_api_key IS NULL OR v_resend_api_key = '' THEN
            SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';
        END IF;

        IF v_resend_api_key IS NOT NULL AND v_resend_api_key <> '' AND v_resend_api_key NOT LIKE '%mock%' THEN
          SELECT net.http_post(
            url := 'https://api.resend.com/emails',
            headers := jsonb_build_object(
              'Content-Type', 'application/json',
              'Authorization', 'Bearer ' || v_resend_api_key
            ),
            body := jsonb_build_object(
              'from', 'Tokcer AI <onboarding@tokcer-ai.com>',
              'to', ARRAY[NEW.email],
              'subject', '⏳ Pendaftaran Partner: Dalam Proses Review',
              'html', '
                <div style="font-family: ''Inter'', sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #0a0a0a; border-radius: 24px; color: #ffffff; border: 1px solid #1f2937;">
                  <div style="text-align: center; margin-bottom: 40px;">
                    <img src="https://dashboardstaging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="height: 48px; margin-bottom: 12px;">
                  </div>
                  
                  <h2 style="font-size: 20px; margin-bottom: 20px; color: #ffffff; text-align: center;">Agreement Diterima!</h2>
                  <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; text-align: center;">
                    Terima kasih <b>' || NEW.nama || '</b>, Anda telah menyetujui Skema Komisi Tokcer AI.
                  </p>
                  
                  <div style="background: rgba(34, 197, 94, 0.05); padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid rgba(34, 197, 94, 0.2); text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #22c55e; line-height: 1.6;">
                      Tim Admin kami sedang memverifikasi data Anda. Akun Partner & Dashboard Anda akan diaktifkan dalam waktu <b>maksimal 1x24 jam</b>.
                    </p>
                  </div>
                  
                  <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f2937; text-align: center;">
                    <p style="font-size: 11px; color: #4b5563;">&copy; 2026 Tokcer AI. All rights reserved.</p>
                  </div>
                </div>'
            )
          ) INTO v_http_response_id;

          INSERT INTO public.email_logs (recipient, subject, request_id)
          VALUES (NEW.email, 'Admin Review Notification', v_http_response_id);
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- RE-ENABLE TRIGGERS
DROP TRIGGER IF EXISTS tr_send_agreement_email ON public.partner_applications;
CREATE TRIGGER tr_send_agreement_email
AFTER INSERT ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.fn_send_agreement_email();

DROP TRIGGER IF EXISTS tr_notify_admin_review ON public.partner_applications;
CREATE TRIGGER tr_notify_admin_review
AFTER UPDATE ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.fn_notify_admin_review();
