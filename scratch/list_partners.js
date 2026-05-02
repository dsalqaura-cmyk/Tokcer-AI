
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function listPartners() {
  const { data, error } = await supabase.from('partners').select('id, full_name, email');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Partners in DB:', data);
  }
}
listPartners();
