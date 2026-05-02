
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function scanDatabase() {
  const tables = ['partners', 'clients', 'profiles', 'partner_applications'];
  console.log('--- Database Column Scan ---');
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: Error - ${error.message}`);
    } else if (data.length > 0) {
      console.log(`Table ${table}: [${Object.keys(data[0]).join(', ')}]`);
    } else {
      // Try to get columns even if empty by selecting a non-existent column
      const { error: schemaError } = await supabase.from(table).select('non_existent_column_for_schema_check');
      const msg = schemaError?.message || '';
      console.log(`Table ${table} (Empty): ${msg}`);
    }
  }
}
scanDatabase();
