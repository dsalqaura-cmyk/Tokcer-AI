
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function setupAdminPartner() {
  try {
    const { data: partner } = await supabase
      .from('partners')
      .select('id')
      .eq('email', 'admin@tokcer-ai.com')
      .maybeSingle();

    let partnerId = partner?.id;

    if (!partnerId) {
      console.log('Admin partner not found. Creating one...');
      const { data: newPartner, error: createError } = await supabase
        .from('partners')
        .insert([{
          full_name: 'Admin Tokcer Sample',
          email: 'admin@tokcer-ai.com'
        }])
        .select()
        .single();
      
      if (createError) throw createError;
      partnerId = newPartner.id;
    }

    console.log('Partner ID for Admin:', partnerId);

    const dummyClients = [
      { shop_name: 'Sample Store 1', email: 'sample1@test.com', status: 'active', plan: 'pro', partner_id: partnerId },
      { shop_name: 'Sample Store 2', email: 'sample2@test.com', status: 'active', plan: 'pro', partner_id: partnerId },
      { shop_name: 'Sample Store 3', email: 'sample3@test.com', status: 'active', plan: 'elite', partner_id: partnerId },
      { shop_name: 'Sample Store 4', email: 'sample4@test.com', status: 'active', plan: 'pro', partner_id: partnerId },
      { shop_name: 'Sample Store 5', email: 'sample5@test.com', status: 'active', plan: 'ultimate', partner_id: partnerId },
      { shop_name: 'Sample Store 6', email: 'sample6@test.com', status: 'active', plan: 'starter', partner_id: partnerId },
    ];

    for (const client of dummyClients) {
       const { data: existing } = await supabase.from('clients').select('id').eq('email', client.email).maybeSingle();
       if (existing) continue;

       const { data: cData, error: cError } = await supabase.from('clients').insert([client]).select().single();
       if (!cError && cData) {
         await supabase.from('orders').insert([{
           user_id: cData.id,
           total_amount: client.plan === 'pro' ? 499000 : (client.plan === 'elite' ? 999000 : (client.plan === 'ultimate' ? 1999000 : 0)),
           status: 'paid'
         }]);
       }
    }

    console.log('✅ Dummy data successfully injected for Admin Partner.');
  } catch (err) {
    console.error('Setup Error:', err);
  }
}

setupAdminPartner();
