// Supabase Edge Function: midtrans-webhook
// Lokasi: supabase/functions/midtrans-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log("Midtrans Notification Received:", body)

    const { order_id, transaction_status, fraud_status } = body

    // 1. Find the transaction in our DB
    const { data: trx, error: trxError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('order_id', order_id)
      .single()

    if (trxError || !trx) throw new Error('Transaction not found')

    // 2. Logic: Settlement (Payment Successful)
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      if (fraud_status === 'accept' || !fraud_status) {
        
        // A. Update Transaction Status
        await supabaseClient
          .from('transactions')
          .update({ status: 'settlement', raw_notification: body })
          .eq('order_id', order_id)

        // B. UPGRADE USER PLAN & ADD TOKENS
        // Ambil data quota dari plan (Bisa disesuaikan)
        const newPlan = trx.plan_name.toLowerCase()
        const additionalTokens = trx.tokens_to_add || 0

        // Jalankan update profil
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ 
            subscription_plan: newPlan,
            ai_tokens: additionalTokens // Atau tambahkan ke saldo lama: ai_tokens: current + additionalTokens
          })
          .eq('id', trx.user_id)

        if (updateError) console.error("Error updating user profile:", updateError)
        
        console.log(`✅ Payment Success: User ${trx.user_id} upgraded to ${newPlan}`);
      }
    } 
    // 3. Logic: Failure/Expiry
    else if (['expire', 'cancel', 'deny'].includes(transaction_status)) {
        await supabaseClient
          .from('transactions')
          .update({ status: transaction_status, raw_notification: body })
          .eq('order_id', order_id)
    }

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })

  } catch (error) {
    console.error("Webhook Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
