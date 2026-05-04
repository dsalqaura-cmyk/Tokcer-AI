import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gejccutabxtyxsveczvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c'
);

async function readConfigs() {
  const { data, error } = await supabase
    .from('ai_configs')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('AI Configs Data (from gejccutabxtyxsveczvd):');
  console.log(JSON.stringify(data, null, 2));
}

readConfigs();
