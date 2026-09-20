import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const keyToUse = SERVICE_ROLE_KEY || ANON_KEY;
    if (!keyToUse) {
      return res.status(500).json({ error: 'Supabase credentials missing' });
    }

    const supabase = createClient(SUPABASE_URL, keyToUse, {
      auth: { persistSession: false }
    });

    const { data: heroRow, error } = await supabase
      .from('homepage_cms')
      .select('*')
      .eq('section_key', 'hero')
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      hero: heroRow?.data || null,
      record: heroRow || null
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
