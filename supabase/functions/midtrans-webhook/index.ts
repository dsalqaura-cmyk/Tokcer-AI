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

    const { order_id, transaction_status, fraud_status, payment_type } = body

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
        
        let targetUserId = trx.user_id;

        // CASE: NEW REGISTRATION (user_id is null)
        if (!targetUserId && trx.raw_notification?.user_data) {
            const { email, nama, phone, platforms, storeLinks, business_type, affiliateId } = trx.raw_notification.user_data;
            
            console.log(`🐣 Creating new user account for: ${email}`);

            // A. Create Auth User (Admin bypass)
            const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
                email: email,
                email_confirm: true,
                user_metadata: { 
                    full_name: nama, 
                    phone: phone,
                    platforms: platforms,
                    store_links: storeLinks,
                    business_type: business_type,
                    affiliate_id: affiliateId
                }
            });

            if (createError) {
                // If user already exists, just find them
                if (createError.message.includes('already registered')) {
                    const { data: existingUser } = await supabaseClient.from('profiles').select('id').eq('email', email).single();
                    targetUserId = existingUser?.id;
                } else {
                    throw createError;
                }
            } else {
                targetUserId = newUser.user?.id;
            }
        }

        // B. Update Transaction Status
        await supabaseClient
          .from('transactions')
          .update({ 
              status: 'settlement', 
              payment_type: payment_type,
              raw_notification: body,
              user_id: targetUserId // Link the transaction to the newly created user
          })
          .eq('order_id', order_id)

        // C. UPGRADE USER PROFILE
        const newPlan = trx.plan_name.toLowerCase()
        const additionalTokens = trx.tokens_to_add || 0

        if (targetUserId) {
            const { error: updateError } = await supabaseClient
              .from('profiles')
              .update({ 
                subscription_plan: newPlan,
                ai_tokens: additionalTokens 
              })
              .eq('id', targetUserId)

            if (updateError) console.error("Error updating user profile:", updateError)
            console.log(`✅ Payment Success & Account Activated: User ${targetUserId} upgraded to ${newPlan}`);
        }
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
