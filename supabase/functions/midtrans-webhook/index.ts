// Supabase Edge Function: midtrans-webhook
// Lokasi: supabase/functions/midtrans-webhook/index.ts
// [PANCINGAN]: Baris ini sengaja ditambah agar memicu auto-deploy GitHub Actions 🎣

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // [PERBAIKAN UJANG]: Ambil Resend API Key dari database agar tidak kosong
    const { data: resendConfig } = await supabaseClient
      .from('ai_configs')
      .select('value')
      .eq('key', 'resend_api_key')
      .maybeSingle();
    
    const RESEND_API_KEY = resendConfig?.value || Deno.env.get('RESEND_API_KEY');

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
        
        // 1. Cari data Toko di tabel clients berdasarkan order_id
        let { data: client, error: clientError } = await supabaseClient
          .from('clients')
          .select('*')
          .eq('midtrans_order_id', order_id)
          .maybeSingle();

        let isRenewal = false;
        const userData = trx.raw_notification?.user_data;

        // Jika client tidak ditemukan berdasarkan order_id, cek berdasarkan email (untuk Renewal)
        if (!client && userData?.email) {
            const { data: existingClient } = await supabaseClient
                .from('clients')
                .select('*')
                .eq('email', userData.email)
                .maybeSingle();
            
            if (existingClient) {
                console.log("Client ditemukan berdasarkan email, ini adalah proses RENEWAL:", existingClient.email);
                isRenewal = true;
                client = existingClient;
                
                // Update order_id ke transaksi yang baru
                await supabaseClient.from('clients').update({ midtrans_order_id: order_id }).eq('id', client.id);
            }
        }

        // Jika benar-benar client baru (bukan renewal dan tidak ada order_id sebelumnya)
        if (!client) {
            console.log("Client tidak ditemukan, membuat data client baru dari data transaksi...");
            
            if (!userData) {
                console.error("Gagal: Data user tidak ditemukan di memori transaksi!");
                return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
            }

            const { data: newClient, error: createError } = await supabaseClient
                .from('clients')
                .insert([{
                    shop_name: userData.nama || 'Toko Tanpa Nama',
                    email: userData.email,
                    whatsapp: userData.phone,
                    plan: trx.plan_name,
                    billing_cycle: userData.billing_cycle || 'Monthly',
                    status: 'pending',
                    ref: userData.affiliateId || 'Direct',
                    metadata: { store_links: userData.storeLinks || {} },
                    midtrans_order_id: order_id
                }])
                .select()
                .maybeSingle();

            if (createError || !newClient) {
                console.error("Gagal membuat data client baru:", createError?.message);
                return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
            }

            client = newClient;
            console.log("Client baru berhasil dibuat otomatis:", client.id);
        }

        const email = client.email;
        const nama = client.shop_name;

        if (isRenewal) {
            console.log("Memanggil rpc_renew_subscription untuk:", email);
            const { data: rpcData, error: rpcError } = await supabaseClient.rpc('rpc_renew_subscription', {
                p_email: email,
                p_plan: trx.plan_name || client.plan,
                p_billing_cycle: userData?.billing_cycle || client.billing_cycle || 'Monthly'
            });

            if (rpcError) {
                console.error("Gagal rpc_renew_subscription:", rpcError);
            } else {
                console.log("Sukses renewal:", rpcData);
            }
        } else {
            const generatedPassword = `Tokcer@${Math.floor(1000 + Math.random() * 9000)}`;

            // Update client status sebelum aktivasi
            await supabaseClient
                .from('clients')
                .update({ status: 'active' })
                .eq('id', client.id);

            console.log("Memanggil rpc_activate_account untuk:", email);

            // 2. Panggil Fungsi Sakti Database untuk urus Komisi, Omzet, dan User (Pendaftaran Baru)
            const { data: rpcData, error: rpcError } = await supabaseClient.rpc('rpc_activate_account', {
                p_email: email,
                p_application_id: client.id,
                p_full_name: nama,
                p_plan: trx.plan_name || client.plan,
                p_role: 'user'
            });

        if (rpcError) {
            console.error("Gagal memanggil rpc_activate_account:", rpcError.message);
            throw new Error(`Gagal aktivasi via RPC: ${rpcError.message}`);
        }

        console.log("RPC Berhasil:", rpcData);
        
        // Ambil User ID yang baru dibuat/ditemukan oleh RPC
        const targetUserId = rpcData.user_id;

        // 3. Update Password agar user bisa login dengan password yang kita kirim di email
        if (targetUserId) {
            await supabaseClient.auth.admin.updateUserById(targetUserId, { password: generatedPassword });
            console.log("Password updated for user:", targetUserId);

            // Update status transaksi
            await supabaseClient.from('transactions').update({ 
                status: 'settlement', 
                payment_type: payment_type,
                user_id: targetUserId 
            }).eq('order_id', order_id);
        }

        // 4. Kirim Email Password
        if (RESEND_API_KEY && email) {
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
                                                            Pembayaran Anda telah diverifikasi. Selamat bergabung di ekosistem <strong>Tokcer AI</strong>. Akun Anda telah aktif dengan paket <span style="color: #f97316;">${client.plan.toUpperCase()}</span>.
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
                console.log("Email sukses terkirim ke:", email);
            } catch (emailErr) {
                console.error("Gagal kirim email password:", emailErr.message);
            }
        }
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 200 })
  }
})
