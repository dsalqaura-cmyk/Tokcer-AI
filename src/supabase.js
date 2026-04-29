import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iogxyohoexfkpugdtymu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_t5UJoRgPkBG3V4tGEhoYDQ_QH9Xf14a'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
