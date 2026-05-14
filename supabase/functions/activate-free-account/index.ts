import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, shopName, whatsapp, plan, billingCycle, ref, partnerId } = await req.json()

    // 1. Generate Password
    const generatedPassword = `Tokcer@${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Buat Akun via Admin API (Aman dari error GoTrue)
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email: email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { full_name: shopName }
    });

    if (authError) {
        if (authError.message.includes('already exists') || authError.message.includes('already registered')) {
             const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
             const existingUser = existingUsers.users.find(u => u.email === email);
             if (existingUser) {
                 authData.user = existingUser;
                 await supabaseClient.auth.admin.updateUserById(existingUser.id, { password: generatedPassword });
             } else {
                 throw new Error(`User exists but could not be retrieved: ${email}`);
             }
        } else {
            throw new Error(`Gagal membuat user: ${authError.message}`);
        }
    }
    
    const targetUserId = authData?.user?.id;
    if (!targetUserId) throw new Error("Gagal mendapatkan User ID");

    // 3. Catat ke Tabel Clients
    const { data: client, error: insertError } = await supabaseClient.from('clients').insert([{
        id: targetUserId, // Use the new user ID for the client ID
        partner_id: partnerId,
        shop_name: shopName,
        email: email,
        whatsapp: whatsapp,
        plan: plan,
        billing_cycle: billingCycle,
        payment_method: 'free',
        status: 'active',
        ref: ref
    }]).select().single();

    if (insertError) throw new Error(`Gagal mencatat data klien: ${insertError.message}`);

    // 4. Panggil RPC Modular
    const { data: rpcData, error: rpcError } = await supabaseClient.rpc('rpc_setup_client_account', {
        p_user_id: targetUserId,
        p_email: email,
        p_application_id: client.id,
        p_full_name: shopName,
        p_plan: plan,
        p_role: 'user'
    });

    if (rpcError) throw new Error(`Gagal setup akun (RPC): ${rpcError.message}`);

    // 5. Kirim Email Resend
    const { data: resendConfig } = await supabaseClient.from('ai_configs').select('value').eq('key', 'resend_api_key').maybeSingle();
    const RESEND_API_KEY = resendConfig?.value || Deno.env.get('RESEND_API_KEY');

    if (RESEND_API_KEY) {
        try {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Tokcer AI <onboarding@tokcer-ai.com>',
                    to: [email],
                    subject: '🏮 Selamat Datang di Tokcer AI - Akun Gratis Anda Telah Aktif!',
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
                                            <tr>
                                                <td align="center" style="padding: 40px 0 20px 0;">
                                                    <img src="https://staging.tokcer-ai.com/logo.png" alt="Tokcer AI" style="width: 180px; display: block;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 40px;">
                                                    <h2 style="color: #fff; font-size: 24px; font-weight: 900; margin-bottom: 10px; text-align: center;">Selamat Datang, ${shopName}!</h2>
                                                    <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                                                        Selamat bergabung di ekosistem <strong>Tokcer AI</strong>. Akun Anda telah aktif dengan paket <span style="color: #f97316;">${plan.toUpperCase()}</span>.
                                                    </p>
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
                                                    <div style="text-align: center; margin-bottom: 40px;">
                                                        <a href="https://staging.tokcer-ai.com/login" style="display: inline-block; background-color: #f97316; color: #fff; font-weight: 900; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);">MASUK KE DASHBOARD</a>
                                                    </div>
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
        } catch (emailErr) {
            console.error("Gagal kirim email:", emailErr.message);
        }
    }

    return new Response(JSON.stringify({ success: true, userId: targetUserId }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error("ACTIVATE FREE ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
  }
})
