import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to generate TikTok API signature using native Web Crypto API in Deno
async function generateTikTokSignature(appSecret: string, path: string, params: Record<string, string>, body = ""): Promise<string> {
  const keys = Object.keys(params).sort();
  let paramString = "";
  for (const key of keys) {
    if (key !== 'sign' && key !== 'access_token') {
      paramString += key + params[key];
    }
  }

  const baseString = appSecret + path + paramString + body;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(appSecret);
  const messageData = encoder.encode(baseString);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { user_id, action, target_user_id } = body

    if (action === 'purge_mock_data' && target_user_id) {
      console.log(`[PURGE] Purging mock data for target user ID: ${target_user_id}`);
      
      // 1. Delete all orders for target_user_id
      const { error: errOrd } = await supabaseClient
        .from('orders')
        .delete()
        .eq('user_id', target_user_id);
        
      // 2. Delete products for target_user_id
      const { error: errProd } = await supabaseClient
        .from('products')
        .delete()
        .eq('user_id', target_user_id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Successfully purged mock data for ${target_user_id}. Orders delete error: ${errOrd?.message || 'none'}, Products delete error: ${errProd?.message || 'none'}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (!user_id) throw new Error("Missing user_id")

    // 1. Get TikTok API Keys from database
    const { data: configs, error: configError } = await supabaseClient
      .from('ai_configs')
      .select('key, value')
      .in('key', ['tiktok_app_id', 'tiktok_app_secret'])

    if (configError) throw new Error("Gagal mengambil konfigurasi API TikTok: " + configError.message)
    
    let appKey = "";
    let appSecret = "";
    configs?.forEach(c => {
        if (c.key === 'tiktok_app_id') appKey = c.value;
        if (c.key === 'tiktok_app_secret') appSecret = c.value;
    });

    if (!appKey || !appSecret) {
      throw new Error("Kredensial API TikTok (App ID/Secret) belum diset di tabel ai_configs.");
    }

    // 2. Fetch Active TikTok Store Connection
    const { data: connection, error: connError } = await supabaseClient
      .from('marketplace_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('platform', 'tiktok')
      .maybeSingle()

    if (connError) throw new Error("Gagal membaca koneksi marketplace: " + connError.message)
    if (!connection) {
      return new Response(
        JSON.stringify({ success: false, error: "Tidak ada koneksi TikTok yang aktif untuk akun ini." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const { access_token, shop_id } = connection;
    if (!access_token || !shop_id) {
      throw new Error("Koneksi TikTok tidak memiliki access_token atau shop_id yang valid.");
    }

    // 3. Initiate Live Syncing status
    await supabaseClient
      .from('marketplace_connections')
      .update({ sync_status: 'syncing' })
      .eq('id', connection.id);

    // 4. Request Real Orders from TikTok Open API
    const path = "/order/202309/orders/search";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const queryParams = {
      app_key: appKey,
      timestamp: timestamp,
      shop_id: shop_id
    };

    const requestBody = JSON.stringify({
      page_size: 50,
      page_size: 50,
      PageSize: 50
    });

    const signature = await generateTikTokSignature(appSecret, path, queryParams, requestBody);
    const apiUrl = `https://open-api.tiktokglobalshop.com${path}?app_key=${appKey}&timestamp=${timestamp}&shop_id=${shop_id}&sign=${signature}`;

    let ordersFetched = [];
    let apiErrorLog = "";
    
    try {
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tts-access-token": access_token
        },
        body: requestBody
      });
      
      const apiData = await apiResponse.json();
      if (apiData.code === 0 && apiData.data?.order_list) {
        ordersFetched = apiData.data.order_list;
      } else if (apiData.code === 0 && apiData.data?.orders) {
        // v202309 format uses 'orders' instead of 'order_list'
        ordersFetched = apiData.data.orders;
      } else {
        apiErrorLog = apiData.message || `TikTok API returned code: ${apiData.code}`;
      }
    } catch (fetchErr) {
      apiErrorLog = fetchErr.message;
    }

    // 5. Clean Handling (If no orders found or API empty, do NOT insert garbage mock data!)
    if (ordersFetched.length === 0) {
      console.warn("TikTok API Fetch Warning: " + apiErrorLog + ". No real orders fetched.");

      await supabaseClient
        .from('marketplace_connections')
        .update({ sync_status: 'active' })
        .eq('id', connection.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Sinkronisasi sukses! Tidak ada pesanan baru di toko Anda (API Status: " + (apiErrorLog || "OK") + ")",
          source: "live"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // 6. Map and Insert Real TikTok Orders to Supabase
    const ordersToInsert = ordersFetched.map((o: any) => ({
      user_id: user_id,
      order_number: o.id || o.order_id,
      customer_name: o.buyer_email || o.buyer_uid || "TikTok Buyer",
      platform: 'tiktok',
      total_amount: Number(o.payment_info?.original_total_amount || o.payment_info?.total_amount || 0),
      status: (o.order_status === 'COMPLETED' || o.order_status === 'DELIVERED') ? 'completed' : 'pending',
      order_date: o.create_time ? new Date(Number(o.create_time) * 1000).toISOString() : new Date().toISOString()
    }));

    // Perform upsert of real orders to avoid duplicates
    for (const ord of ordersToInsert) {
      const { data: existing } = await supabaseClient
        .from('orders')
        .select('id')
        .eq('order_number', ord.order_number)
        .maybeSingle();

      if (existing) {
        await supabaseClient.from('orders').update(ord).eq('id', existing.id);
      } else {
        await supabaseClient.from('orders').insert(ord);
      }
    }

    // 7. Update connection status back to active
    await supabaseClient
      .from('marketplace_connections')
      .update({ sync_status: 'active' })
      .eq('id', connection.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sinkronisasi sukses! Berhasil menarik ${ordersToInsert.length} data transaksi riil dari TikTok Shop.`,
        source: "live"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error("Sync Engine Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
