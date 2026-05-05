
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function checkEliteUser() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, tokens, ai_credits_remaining, subscription_plan')
    .eq('email', 'elite@tokcer-ai.com')
    .maybeSingle();

  if (error) {
    console.log('Error:', error.message);
  } else if (data) {
    console.log('--- DATA BE ELITE@TOKCER-AI.COM ---');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('User elite@tokcer-ai.com tidak ditemukan.');
  }
}
checkEliteUser();
