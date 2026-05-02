
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gejccutabxtyxsveczvd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c');

async function pushToPartnerApps() {
  try {
    console.log('Pushing Admin application to database...');
    const { data, error } = await supabase.from('partner_applications').insert([{
      nama: 'Admin Simulation Account',
      email: 'admin@tokcer-ai.com',
      phone: '08123456789',
      media_link: 'https://tokcer-ai.com',
      niche: 'Bisnis',
      followers: '> 100k',
      promo_methods: ['WA Blast', 'Social Media'],
      promo_strategy: 'SIMULATION DATA FOR DEMO PURPOSES',
      status: 'pending'
    }]);

    if (error) throw error;
    console.log('✅ Success! Admin application is now in PENDING status.');
    console.log('Please go to Internal Dashboard -> Approvals and Approve it.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

pushToPartnerApps();
