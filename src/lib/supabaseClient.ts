import { createBrowserClient } from '@supabase/ssr';

// Set environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from .env.local");
}

// Create a singleton Supabase client for the browser
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);