import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Client Wrapper for GulPash
// Compatible with both Next.js (NEXT_PUBLIC_*) and Vite (VITE_*)

// Canonical Supabase Project alzqexevrhcmzcluvatc Configuration
const DEFAULT_SUPABASE_URL = 'https://alzqexevrhcmzcluvatc.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsenFleGV2cmhjbXpjbHV2YXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTMxNDksImV4cCI6MjEwNDI2OTE0OX0.JL8NlBwYCpfN5zo0gXz-AP-rmmTZhlR-Y6yqGSpGsCo';

export const SUPABASE_CONFIG = {
  url: (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_URL) ||
       (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL) ||
       (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
       (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
       DEFAULT_SUPABASE_URL,
  anonKey: (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) ||
           (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
           (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
           (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
           DEFAULT_SUPABASE_ANON_KEY
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-alzqexevrhcmzcluvatc-auth-token'
      }
    });
  }
  return supabaseInstance;
};
