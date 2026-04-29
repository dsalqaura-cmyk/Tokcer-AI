import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gejccutabxtyxsveczvd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BUL3YFoT2mi5aSYbnccGwQ_L8UJFkqF'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
