
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function tembakDatabaseRiil() {
  try {
    const realAdminId = '81c19c28-9614-4a6d-b2f2-b8244c0ced29';
    console.log('Shooting real database with ID:', realAdminId);

    const dummyClients = [
      { shop_name: 'Fashion Hub Jakarta', email: 'fhub@sample.com', status: 'active', plan: 'Pro', partner_id: realAdminId, ref: 'ADMIN-STAGING' },
      { shop_name: 'Gadget Store ID', email: 'gstore@sample.com', status: 'active', plan: 'Elite', partner_id: realAdminId, ref: 'ADMIN-STAGING' },
      { shop_name: 'Beauty Care Official', email: 'bcare@sample.com', status: 'active', plan: 'Ultimate', partner_id: realAdminId, ref: 'ADMIN-STAGING' },
      { shop_name: 'Home Decor Solution', email: 'hdecor@sample.com', status: 'active', plan: 'Pro', partner_id: realAdminId, ref: 'ADMIN-STAGING' },
      { shop_name: 'Baby Shop Indonesia', email: 'bshop@sample.com', status: 'active', plan: 'Ultimate', partner_id: realAdminId, ref: 'ADMIN-STAGING' },
      { shop_name: 'Starter Shop Test', email: 'starter@sample.com', status: 'active', plan: 'Starter', partner_id: realAdminId, ref: 'ADMIN-STAGING' }
    ];

    for (const client of dummyClients) {
       const { error } = await supabase.from('clients').upsert([client], { onConflict: 'email' });
       if (error) console.error(`❌ Error for ${client.email}:`, error.message);
       else console.log(`✅ Success for ${client.email}`);
    }
    
    console.log('🎉 MISSION ACCOMPLISHED: Database has been populated!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

tembakDatabaseRiil();
