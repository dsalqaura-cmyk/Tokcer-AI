import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gejccutabxtyxsveczvd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Fetching recent clients...");
  
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (clientError) {
    console.error("Error querying clients:", clientError);
  } else {
    console.log("Recent clients:", clients);
  }
}

check();
