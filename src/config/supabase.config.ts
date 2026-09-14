export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};

if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  console.error('Missing Supabase configuration. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file for the correct Supabase project.');
}
