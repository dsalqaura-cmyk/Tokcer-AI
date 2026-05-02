
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function forceInjectPartner() {
  try {
    const adminId = '81c19c28-9614-4a6d-b2f2-b8244c0ced29';
    console.log('Targeting Admin ID:', adminId);

    // 1. Force insert into partners table with ONLY ID and Email
    const { error: pError } = await supabase.from('partners').upsert([{
      id: adminId,
      email: 'admin@tokcer-ai.com'
    }]);

    if (pError) {
       console.error('❌ Failed to insert into partners table:', pError.message);
    } else {
       console.log('✅ Successfully inserted into partners table!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

forceInjectPartner();
