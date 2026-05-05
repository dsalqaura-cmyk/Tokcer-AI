// Supabase Edge Function: midtrans-init
// Lokasi: supabase/functions/midtrans-init/index.ts

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

    const { plan_name, amount, tokens, is_sandbox, user_data } = await req.json()
    
    // 1. Determine Environment & Keys
    const serverKey = is_sandbox 
      ? Deno.env.get('MIDTRANS_SERVER_KEY_SANDBOX') 
      : Deno.env.get('MIDTRANS_SERVER_KEY_PROD');
    
    const midtransUrl = is_sandbox 
      ? 'https://app.sandbox.midtrans.com/snap/v1/transactions' 
      : 'https://app.midtrans.com/snap/v1/transactions';

    const authString = btoa(`${serverKey}:`)
    const orderId = `TOKCER-${Date.now()}-${user_data.email.slice(0, 3)}`

    // 2. Call Midtrans API
    const midtransResponse = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: {
          email: user_data.email,
          first_name: user_data.nama,
          phone: user_data.phone
        },
        item_details: [{
          id: plan_name,
          price: amount,
          quantity: 1,
          name: `Tokcer AI - Paket ${plan_name.toUpperCase()}`
        }]
      })
    })

    const midtransData = await midtransResponse.json()
    if (!midtransResponse.ok) throw new Error(midtransData.error_messages?.join(', ') || 'Midtrans Error')

    // 3. AGGRESSIVE SAVE: Kita hanya kirim data yang PASTI diperbolehkan database
    const insertData: any = {
      order_id: orderId,
      plan_name: plan_name,
      amount: amount,
      tokens_to_add: tokens,
      snap_token: midtransData.token,
      status: 'pending',
      raw_notification: { user_data }
    };

    // Hanya isi user_id jika datanya ada (User Lama)
    // Jika User Baru, kolom ini tidak akan dikirim sama sekali agar tidak ditolak database
    if (user_data.user_id) {
        insertData.user_id = user_data.user_id;
    }

    const { error: dbError } = await supabaseClient.from('transactions').insert(insertData);
    
    if (dbError) {
        console.error("DB INSERT ERROR:", dbError.message);
        throw new Error(`Gagal mencatat transaksi: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({ token: midtransData.token, orderId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error("INIT ERROR:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
