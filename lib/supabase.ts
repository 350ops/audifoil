import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import { Database } from "./database.types";

// Hardcoded for now - in production, use EAS secrets
const supabaseUrl = "https://cikeyqrsslkczzzklixf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2V5cXJzc2xrY3p6emtsaXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQwNTMsImV4cCI6MjA4NDc5MDA1M30.-aV3veBqpf6Yv3jdE43q0ZRZKR-MGn6P036KBQymvNE";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
