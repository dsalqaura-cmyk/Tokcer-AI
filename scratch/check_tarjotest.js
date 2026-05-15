import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gejccutabxtyxsveczvd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking partners for tarjotest...");
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .ilike('email', 'tarjotest@mailinator.com');
    
  if (error) {
    console.error("Error querying partners:", error);
  } else {
    console.log("Partners found by email:", data);
  }

  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('*')
    .ilike('email', 'tarjotest@mailinator.com');

  if (profError) {
    console.error("Error querying profiles:", profError);
  } else {
    console.log("Profiles found by email:", profiles);
  }
}

check();
