
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function pushToPartnerApps() {
  try {
    console.log('Pushing Admin application with AGREED status...');
    
    // Check if already exists to avoid clutter
    const { data: existing } = await supabase.from('partner_applications').select('id').eq('email', 'admin@tokcer-ai.com').maybeSingle();
    
    if (existing) {
       console.log('Existing application found. Updating to AGREED...');
       const { error: updateError } = await supabase.from('partner_applications')
        .update({ status: 'agreed', agreed_at: new Date().toISOString() })
        .eq('id', existing.id);
       if (updateError) throw updateError;
    } else {
       const { error } = await supabase.from('partner_applications').insert([{
        nama: 'Admin Simulation Account',
        email: 'admin@tokcer-ai.com',
        whatsapp: '08123456789',
        media_link: 'https://tokcer-ai.com',
        niche: 'Bisnis',
        followers: '> 100k',
        promo_methods: ['WA Blast', 'Social Media'],
        promo_strategy: 'SIMULATION DATA FOR DEMO PURPOSES',
        status: 'agreed',
        agreed_at: new Date().toISOString()
      }]);
      if (error) throw error;
    }

    console.log('✅ Success! Admin application is now in AGREED status.');
    console.log('Go to Dashboard Admin -> Approval Center -> Partner Applications.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

pushToPartnerApps();
