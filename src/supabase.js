import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gejccutabxtyxsveczvd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlamNjdXRhYnh0eXhzdmVjenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3NDI3MzUsImV4cCI6MjExMTMxODczNX0.L16aK09J7rUe_R7aN4d_1F_vB6vJ5F_7n_hG_n_vM_A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
