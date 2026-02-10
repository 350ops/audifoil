import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cikeyqrsslkczzzklixf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2V5cXJzc2xrY3p6emtsaXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQwNTMsImV4cCI6MjA4NDc5MDA1M30.-aV3veBqpf6Yv3jdE43q0ZRZKR-MGn6P036KBQymvNE';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Convenience export matching the old `supabase` import
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
