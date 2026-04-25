import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogxyohoexfkpugdtymu.supabase.co';
// Ganti dengan anon key yang valid atau gunakan environment variables (.env)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ3h5b2hvZXhma3B1Z2R0eW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgwNjE3OTYsImV4cCI6MTk5MzY3MDM3OX0.dummykey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
