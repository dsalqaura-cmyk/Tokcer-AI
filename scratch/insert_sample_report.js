import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gejccutabxtyxsveczvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTkxOTUsImV4cCI6MjA5MjY5NTE5NX0.rJfuHK_2HsGaXWoVCKOwNNzfKlPJ-tHAaL8dmdocB1c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSample() {
  const sampleData = {
    report_week: "W1",
    date_start: "2024-04-24",
    date_end: "2024-05-01",
    gross_income_idr: 15000000,
    total_mrr_idr: 8495000,
    mrr_pro_idr: 1996000, // 4 * 499k
    mrr_elite_idr: 2997000, // 3 * 999k
    mrr_ultimate_idr: 3998000, // 2 * 1.999k
    total_partner_payout_idr: 2500000,
    net_revenue_idr: 12500000,
    active_subscribers_starter: 120,
    active_subscribers_pro: 4,
    active_subscribers_elite: 3,
    active_subscribers_ultimate: 2,
    total_active_paid: 9,
    wins: "Pertumbuhan MRR naik 15% dari minggu lalu berkat kampanye Ramadhan.",
    issues: "Terdapat sedikit delay pada verifikasi pembayaran manual.",
    actions: "Optimasi alur verifikasi pembayaran dan push marketing untuk paket Elite."
  };

  try {
    const { data, error } = await supabase
      .from('weekly_reports')
      .insert([sampleData])
      .select();

    if (error) {
      if (error.code === '42P01') {
        console.error('Error: Table "weekly_reports" does not exist. Please create it first using the SQL provided.');
      } else {
        console.error('Error inserting sample data:', JSON.stringify(error, null, 2));
      }
    } else {
      console.log('Sample data inserted successfully:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

insertSample();
