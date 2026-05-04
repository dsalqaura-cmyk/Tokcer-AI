import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogxyohoexfkpugdtymu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ3h5b2hvZXhma3B1Z2R0eW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTMzNDIsImV4cCI6MjA5MjQyOTM0Mn0.OUqNWFg4HtbLr_Zs-mVTgqx7ydTUULQwo-7af3uQh_4'
);

async function readHistory() {
  const { data, error } = await supabase
    .from('ai_configs_history')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('AI Configs History Data:');
  console.log(JSON.stringify(data, null, 2));
}

readHistory();
