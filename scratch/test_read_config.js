import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gejccutabxtyxsveczvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c'
)

async function test() {
  console.log("Memulai pengetesan membaca tabel ai_configs via Node.js...");
  const { data, error } = await supabase
    .from('ai_configs')
    .select('*')
    .eq('key', 'midtrans_server_key')
    .maybeSingle();
    
  if (error) {
    console.error("Gagal membaca database:", error.message);
  } else if (!data) {
    console.log("⚠️ PERINGATAN: Key 'midtrans_server_key' TIDAK DITEMUKAN di tabel ai_configs!");
  } else {
    console.log("✅ BERHASIL! Key ditemukan di database.");
    console.log("Isi Config:", { key: data.key, value: data.value ? '***Terisi***' : '***Kosong***' });
  }
}

test();
