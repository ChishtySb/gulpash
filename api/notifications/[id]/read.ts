import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const id = req.query?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Notification ID required' });
    }

    const key = SERVICE_ROLE_KEY || ANON_KEY;
    const client = createClient(SUPABASE_URL, key, { auth: { persistSession: false } });

    const { data: row } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'admin_notifications')
      .maybeSingle();

    const list = (row?.setting_value && Array.isArray(row.setting_value))
      ? row.setting_value.map((n: any) => n.id === id ? { ...n, read: true } : n)
      : [];

    await client.from('site_settings').upsert({
      setting_key: 'admin_notifications',
      setting_value: list,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to mark as read' });
  }
}
