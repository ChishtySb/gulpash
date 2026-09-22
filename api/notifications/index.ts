import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSupabaseClient() {
  const key = SERVICE_ROLE_KEY || ANON_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase configuration missing');
  }
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = getSupabaseClient();

    if (req.method === 'GET') {
      const { data: row, error } = await client
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'admin_notifications')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({
          success: false,
          error: error.message || 'Failed to query notifications',
          code: 'DB_QUERY_ERROR'
        });
      }

      const notifs = (row?.setting_value && Array.isArray(row.setting_value)) ? row.setting_value : [];
      return res.status(200).json(notifs);
    }

    if (req.method === 'POST') {
      let newNotif = req.body;
      if (typeof newNotif === 'string') {
        try {
          newNotif = JSON.parse(newNotif);
        } catch {
          return res.status(400).json({
            success: false,
            error: 'Invalid JSON payload received',
            code: 'INVALID_JSON'
          });
        }
      }

      if (!newNotif || typeof newNotif !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Payload missing or invalid',
          code: 'INVALID_PAYLOAD'
        });
      }

      const { data: row } = await client
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'admin_notifications')
        .maybeSingle();

      const list = (row?.setting_value && Array.isArray(row.setting_value)) ? row.setting_value : [];
      list.unshift({
        ...newNotif,
        id: newNotif.id || `notif-${Date.now()}`,
        timestamp: newNotif.timestamp || new Date().toISOString()
      });
      const trimmed = list.slice(0, 150);

      const { error: upsertErr } = await client.from('site_settings').upsert({
        setting_key: 'admin_notifications',
        setting_value: trimmed,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

      if (upsertErr) {
        return res.status(500).json({
          success: false,
          error: upsertErr.message || 'Failed to persist notification',
          code: 'UPSERT_FAILED'
        });
      }

      return res.status(200).json({ success: true, count: trimmed.length });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal notification handler error',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
