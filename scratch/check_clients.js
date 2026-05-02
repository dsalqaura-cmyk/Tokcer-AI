
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function checkClients() {
  try {
    const { data, error, count } = await supabase.from('clients').select('tier', { count: 'exact' });
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Total Clients in DB:', count);
      console.log('Clients Tiers:', data.map(c => c.tier));
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

checkClients();
