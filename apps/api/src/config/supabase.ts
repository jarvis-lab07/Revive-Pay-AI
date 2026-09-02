import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// For frontend operations acting as user
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// For backend admin operations bypassing RLS
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
