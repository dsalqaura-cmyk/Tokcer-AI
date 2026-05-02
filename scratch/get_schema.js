
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function getPartnerSchema() {
  // We can't get schema directly via JS, but we can try to select one and see columns
  const { data, error } = await supabase.from('partners').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Partner Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data in partners table');
  }
}
getPartnerSchema();
