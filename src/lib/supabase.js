import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the site hasn't been connected to Supabase yet, `configured` is false.
// Every hook and admin page checks this so the public site still renders
// (using the bundled static data) and the admin panel shows a setup notice
// instead of crashing.
export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = supabaseConfigured
  ? createClient(url, anonKey)
  : null;
