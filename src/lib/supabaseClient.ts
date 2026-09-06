// Supabase Client Wrapper for GulPash
// Compatible with both Next.js (NEXT_PUBLIC_*) and Vite (VITE_*)

export const SUPABASE_CONFIG = {
  url: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
       ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 
       '',
  anonKey: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
           ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || 
           ''
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
};
