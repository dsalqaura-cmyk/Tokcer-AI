
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function checkPartnerApps() {
  try {
    const { data, error, count } = await supabase.from('partner_applications').select('*', { count: 'exact' });
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Total Partner Apps in DB:', count);
      console.log('Apps Data:', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

checkPartnerApps();
