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

    // 1. Dapatkan data transaksi
    const { data: trx, error: trxError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('order_id', order_id)
      .single()

    if (trxError || !trx) return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })

    // 2. Logic Lunas
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      if (fraud_status === 'accept' || !fraud_status) {
        
        let targetUserId = trx.user_id;
        const email = customer_details?.email || trx.raw_notification?.user_data?.email;
        const nama = customer_details?.first_name || customer_details?.full_name || trx.raw_notification?.user_data?.nama || 'User Tokcer';
        
        // Generate a random password
        const generatedPassword = `Tokcer@${Math.floor(1000 + Math.random() * 9000)}`;

        if (!targetUserId && email) {
            console.log(`🐣 PROFESSIONAL CREATE: Creating account for ${email}`);

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
                
                // SEND PROFESSIONAL WELCOME EMAIL WITH THE WORKING SENDER ADDRESS
                if (RESEND_API_KEY) {
                    console.log("✉️ Sending professional welcome email via Resend...");
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: 'Tokcer AI <onboarding@tokcer-ai.com>', // ALAMAT SAKTI YANG TERVERIFIKASI
                            to: [email],
                            subject: '🏮 Akun Tokcer AI Anda Telah Aktif!',
                            html: `
                                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; padding: 40px; border-radius: 20px; background: #fff;">
                                    <div style="text-align: center; margin-bottom: 30px;">
                                        <h1 style="color: #ff5722; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">TOKC <span style="color: #333;">ER</span></h1>
                                        <p style="color: #666; font-size: 14px;">Marketplace Solution for Smart Sellers</p>
                                    </div>
                                    <h2 style="color: #111; font-size: 20px;">Selamat Datang, ${nama}!</h2>
                                    <p style="color: #444; line-height: 1.6; font-size: 15px;">
                                        Pembayaran Anda telah kami terima dengan sukses. Akun Tokcer AI Anda sekarang sudah aktif dengan paket <strong style="text-transform: uppercase; color: #ff5722;">${trx.plan_name}</strong>.
                                    </p>
                                    <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #f1f5f9;">
                                        <p style="margin: 0 0 10px 0; font-weight: bold; color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Detail Login Anda:</p>
                                        <p style="margin: 5px 0; color: #475569; font-size: 15px;">Email: <strong>${email}</strong></p>
                                        <p style="margin: 5px 0; color: #475569; font-size: 15px;">Password: <strong style="color: #ff5722;">${generatedPassword}</strong></p>
                                    </div>
                                    <div style="text-align: center; margin: 35px 0;">
                                        <a href="https://staging.tokcer-ai.com/login" style="background: #ff5722; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(255,87,34,0.3);">Masuk ke Dashboard</a>
                                    </div>
                                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                                    <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
                                        &copy; 2026 Tokcer AI. Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini.
                                    </p>
                                </div>
                            `
                        })
                    });
                }
            }
        }

        // C. Update Status & Paket
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
