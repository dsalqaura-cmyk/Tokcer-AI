
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function injectRealData() {
  try {
    console.log('Searching for Approved Admin Partner...');
    const { data: partner, error: pError } = await supabase
      .from('partners')
      .select('id, affiliate_id')
      .eq('email', 'admin@tokcer-ai.com')
      .maybeSingle();

    if (pError) throw pError;
    if (!partner) {
      console.log('❌ Partner not found yet. Did you click "Approve" in the Admin Dashboard?');
      return;
    }

    const partnerId = partner.id;
    const affiliateId = partner.affiliate_id || 'ADMIN-SAMPLE';
    console.log('Found Partner ID:', partnerId);

    const dummyClients = [
      { shop_name: 'Fashion Hub Jakarta', email: 'fhub@sample.com', status: 'active', plan: 'pro', partner_id: partnerId, ref: affiliateId, commission_amount: 100000 },
      { shop_name: 'Gadget Store ID', email: 'gstore@sample.com', status: 'active', plan: 'elite', partner_id: partnerId, ref: affiliateId, commission_amount: 149600 },
      { shop_name: 'Beauty Care Official', email: 'bcare@sample.com', status: 'active', plan: 'ultimate', partner_id: partnerId, ref: affiliateId, commission_amount: 500000 },
      { shop_name: 'Home Decor Solution', email: 'hdecor@sample.com', status: 'active', plan: 'pro', partner_id: partnerId, ref: affiliateId, commission_amount: 100000 },
      { shop_name: 'Baby Shop Indonesia', email: 'bshop@sample.com', status: 'active', plan: 'ultimate', partner_id: partnerId, ref: affiliateId, commission_amount: 500000 },
      { shop_name: 'Starter Shop Test', email: 'starter@sample.com', status: 'active', plan: 'starter', partner_id: partnerId, ref: affiliateId, commission_amount: 0 }
    ];

    for (const client of dummyClients) {
       const { data: existing } = await supabase.from('clients').select('id').eq('email', client.email).maybeSingle();
       if (existing) {
         console.log(`Client ${client.email} already exists. Skipping.`);
         continue;
       }

       const { data: cData, error: cError } = await supabase.from('clients').insert([client]).select().single();
       if (cError) {
          console.error(`Error inserting ${client.email}:`, cError.message);
          continue;
       }
       
       if (cData) {
         console.log(`✅ Injected client: ${client.shop_name}`);
         await supabase.from('orders').insert([{
           user_id: cData.id,
           total_amount: client.plan === 'pro' ? 499000 : (client.plan === 'elite' ? 999000 : (client.plan === 'ultimate' ? 1999000 : 0)),
           status: 'paid'
         }]);
       }
    }

    console.log('🎉 REAL dummy data (in Database) successfully injected!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

injectRealData();
