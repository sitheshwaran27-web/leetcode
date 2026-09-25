import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

export const isSupabaseConfigured = () => {
  return (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co' &&
    process.env.SUPABASE_URL !== 'https://example.supabase.co' &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key' &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example'
  );
};

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
