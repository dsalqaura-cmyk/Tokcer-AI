// Supabase Edge Function: midtrans-webhook
// Lokasi: supabase/functions/midtrans-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { order_id, transaction_status, fraud_status, payment_type, customer_details } = body

    const { data: trx, error: trxError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('order_id', order_id)
      .single()

    if (trxError || !trx) return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      if (fraud_status === 'accept' || !fraud_status) {
        
        let targetUserId = trx.user_id;
        const email = customer_details?.email || trx.raw_notification?.user_data?.email;
        const nama = customer_details?.first_name || customer_details?.full_name || trx.raw_notification?.user_data?.nama || 'User Tokcer';
        const generatedPassword = `Tokcer@${Math.floor(1000 + Math.random() * 9000)}`;

        if (!targetUserId && email) {
            const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
                email: email,
                password: generatedPassword,
                email_confirm: true,
                user_metadata: { full_name: nama }
            });

            if (createError) {
                const { data: existingUser } = await supabaseClient.from('profiles').select('id').eq('email', email).single();
                targetUserId = existingUser?.id;
            } else {
                targetUserId = newUser.user?.id;
                
                if (RESEND_API_KEY) {
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: 'Tokcer AI <onboarding@tokcer-ai.com>',
                            to: [email],
                            subject: '🏮 Selamat Datang di Tokcer AI - Akun Anda Telah Aktif!',
                            html: `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
                                </head>
                                <body style="margin: 0; padding: 0; background-color: #000; font-family: 'Inter', sans-serif;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000; padding: 40px 20px;">
                                        <tr>
                                            <td align="center">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                                                    <!-- Header dengan Logo Asli -->
                                                    <tr>
                                                        <td align="center" style="padding: 40px 0 20px 0;">
                                                            <img src="https://staging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="width: 180px; display: block;">
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Body -->
                                                    <tr>
                                                        <td style="padding: 20px 40px;">
                                                            <h2 style="color: #fff; font-size: 24px; font-weight: 900; margin-bottom: 10px; text-align: center;">Selamat Datang, ${nama}!</h2>
                                                            <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                                                                Pembayaran Anda telah diverifikasi. Selamat bergabung di ekosistem <strong>Tokcer AI</strong>. Akun Anda telah aktif dengan paket <span style="color: #f97316;">${trx.plan_name.toUpperCase()}</span>.
                                                            </p>
                                                            
                                                            <!-- Akun Box -->
                                                            <div style="background-color: #111; border: 1px solid #222; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                                                                <p style="color: #71717a; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">Akses Login Anda</p>
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td style="padding-bottom: 10px;">
                                                                            <span style="color: #52525b; font-size: 13px;">Email Address:</span><br>
                                                                            <span style="color: #fff; font-size: 16px; font-weight: 700;">${email}</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <span style="color: #52525b; font-size: 13px;">Temporary Password:</span><br>
                                                                            <span style="color: #f97316; font-size: 18px; font-weight: 900;">${generatedPassword}</span>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                            
                                                            <!-- CTA Button -->
                                                            <div style="text-align: center; margin-bottom: 40px;">
                                                                <a href="https://staging.tokcer-ai.com/login" style="display: inline-block; background-color: #f97316; color: #fff; font-weight: 900; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);">MASUK KE DASHBOARD</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Footer -->
                                                    <tr>
                                                        <td style="background-color: #111; padding: 30px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
                                                            <p style="color: #52525b; font-size: 12px; line-height: 1.5; margin: 0;">
                                                                &copy; 2026 Tokcer AI Solutions.<br>
                                                                Anda menerima email ini karena melakukan pendaftaran di staging.tokcer-ai.com.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </body>
                                </html>
                            `
                        })
                    });
                }
            }
        }

        if (targetUserId) {
            await supabaseClient.from('transactions').update({ 
                status: 'settlement', 
                payment_type: payment_type,
                user_id: targetUserId 
            }).eq('order_id', order_id);

            await supabaseClient.from('profiles').update({ 
                subscription_plan: trx.plan_name.toLowerCase(),
                ai_tokens: trx.tokens_to_add || 0 
            }).eq('id', targetUserId);
        }
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 200 })
  }
})
