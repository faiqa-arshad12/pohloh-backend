import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure the environment variables are defined
const SUPABASE_URL: string = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY: string = process.env.SUPABASE_KEY || '';

// Create Supabase client for normal access
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: false,
    },
});

// Create Supabase client for server-side (SSr) access
const supabaseSSr: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
    },
});

export { supabase, supabaseSSr };
