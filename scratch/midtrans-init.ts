// Supabase Edge Function: midtrans-init
// Lokasi: supabase/functions/midtrans-init/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get user from Auth Header
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) throw new Error('Unauthorized')

    // 2. Get Request Body (Plan info)
    const { plan_name, amount, tokens } = await req.json()
    
    // 3. Generate Unique Order ID
    const orderId = `TOKCER-${Date.now()}-${user.id.slice(0, 4)}`

    // 4. Call Midtrans Snap API (PRODUCTION)
    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY') 
    const authString = btoa(`${serverKey}:`)
    
    const midtransResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        customer_details: {
          email: user.email,
          first_name: user.user_metadata?.full_name || 'Tokcer User'
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

    // 5. Save to transactions table
    await supabaseClient.from('transactions').insert({
      user_id: user.id,
      order_id: orderId,
      plan_name: plan_name,
      amount: amount,
      tokens_to_add: tokens,
      snap_token: midtransData.token,
      status: 'pending'
    })

    return new Response(
      JSON.stringify({ token: midtransData.token, orderId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
