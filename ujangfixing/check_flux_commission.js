import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gejccutabxtyxsveczvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("=== MENGECEK DATA FLUX@MAILINATOR.COM ===");
  
  // 1. Cek di tabel partners
  const { data: partner, error: pError } = await supabase
    .from('partners')
    .select('*')
    .eq('email', 'flux@mailinator.com');
  
  if (pError) console.error("❌ Gagal cek tabel partners:", pError.message);
  else console.log("📊 Data di tabel partners:", partner);

  // 2. Cek di tabel clients
  const { data: client, error: cError } = await supabase
    .from('clients')
    .select('*')
    .eq('email', 'flux@mailinator.com');
  
  if (cError) console.error("❌ Gagal cek tabel clients:", cError.message);
  else console.log("📊 Data di tabel clients:", client);
}

check();
