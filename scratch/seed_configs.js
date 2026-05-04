import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gejccutabxtyxsveczvd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjQyOTM0Mn0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c'
);

const configs = [
  { key: 'deepseek_api_key', value: 'sk-0909c279401740929944d6736203914a', type: 'api_key' },
  { key: 'resend_api_key', value: 're_FzYp7S9x_8K5m2N1L3P6Q9R0T4V7W8X9Z', type: 'api_key' },
  { key: 'tiktok_app_id', value: 'aw2v6u1n8x9z', type: 'marketplace_config' },
  { key: 'shopee_partner_id', value: '2006543', type: 'marketplace_config' },
  { key: 'ai_total_topup', value: '10.00', type: 'billing' }
];

async function seedConfigs() {
  console.log('🚀 Seeding AI Configs...');
  for (const config of configs) {
    const { error } = await supabase
      .from('ai_configs')
      .upsert(config, { onConflict: 'key' });
    
    if (error) {
      console.error(`❌ Error seeding ${config.key}:`, error.message);
    } else {
      console.log(`✅ ${config.key} saved successfully.`);
    }
  }
  console.log('✨ All configs saved to Database!');
}

seedConfigs();
