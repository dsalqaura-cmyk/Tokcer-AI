-- ============================================================
-- 🏮 TOKCER AI: EMAIL ROBOTS STABILIZATION (v4)
-- Fokus: Pendaftaran Partner & User Starter Confirmation
-- Tanggal: 7 Mei 2026
-- ============================================================

-- 1. FUNGSI: SEND AGREEMENT EMAIL (Langkah 1 Pendaftaran Partner)
CREATE OR REPLACE FUNCTION public.fn_send_agreement_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resend_api_key TEXT;
  v_agreement_url TEXT;
BEGIN
    -- Ambil API Key Resend
    SELECT value INTO v_resend_api_key FROM public.ai_configs WHERE key = 'resend_api_key';
    
    -- Link Agreement (Gunakan staging sesuai blueprint)
    v_agreement_url := 'https://staging.tokcer-ai.com/partner-agreement?id=' || NEW.id;

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
              
              <p style="font-size: 12px; line-height: 1.6; color: #4b5563; margin-top: 40px; text-align: center;">
                Jika tombol tidak berfungsi, copy-paste link berikut ke browser Anda:<br>
                <span style="color: #6b7280;">' || v_agreement_url || '</span>
              </p>
              
              <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f2937; text-align: center;">
                <p style="font-size: 11px; color: #4b5563;">&copy; 2026 Tokcer AI - Global Partner Program. All rights reserved.</p>
              </div>
            </div>'
        )
      );
    END IF;

    RETURN NEW;
END;
$$;

-- TRIGGER: Jalankan saat pendaftaran partner baru (INSERT)
DROP TRIGGER IF EXISTS tr_send_agreement_email ON public.partner_applications;
CREATE TRIGGER tr_send_agreement_email
AFTER INSERT ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.fn_send_agreement_email();


-- 2. FUNGSI: NOTIFY ADMIN REVIEW (Setelah Partner Tanda Tangan)
CREATE OR REPLACE FUNCTION public.fn_notify_admin_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_resend_api_key TEXT;
BEGIN
    -- Trigger hanya jika status berubah dari 'pending' ke 'agreed'
    IF NEW.status = 'agreed' AND OLD.status = 'pending' THEN
        
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
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; text-align: center;">
                    Instruksi login dan password akan dikirimkan ke email ini setelah verifikasi selesai.
                  </p>
                  
                  <div style="margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f2937; text-align: center;">
                    <p style="font-size: 11px; color: #4b5563;">&copy; 2026 Tokcer AI. All rights reserved.</p>
                  </div>
                </div>'
            )
          );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- TRIGGER: Jalankan saat status berubah menjadi 'agreed'
DROP TRIGGER IF EXISTS tr_notify_admin_review ON public.partner_applications;
CREATE TRIGGER tr_notify_admin_review
AFTER UPDATE ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.fn_notify_admin_review();
