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

async function verifyAdminAuth(req: any) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Unauthorized: Admin authentication session required.', code: 'UNAUTHORIZED' };
  }

  const token = authHeader.substring(7);
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser(token);

  if (error || !data?.user) {
    return { ok: false, status: 401, error: 'Admin session expired or invalid. Please sign in again.', code: 'SESSION_EXPIRED' };
  }

  const user = data.user;
  const isAuthorized =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    user.email === 'admin@gulpash.online' ||
    user.email === 'admin@gulpash.com';

  if (!isAuthorized) {
    return { ok: false, status: 403, error: 'Forbidden: Administrator permissions required.', code: 'FORBIDDEN' };
  }

  return { ok: true, client };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.ok) {
      return res.status(authResult.status).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const client = authResult.client;
    const targetId = req.query?.id;

    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Subscription ID is required in URL.' });
    }

    const { data: row } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'admin_push_subscriptions')
      .maybeSingle();

    let subs: any[] = (row?.setting_value && Array.isArray(row.setting_value)) ? row.setting_value : [];

    if (req.method === 'DELETE') {
      const initialLen = subs.length;
      subs = subs.filter(s => s.id !== targetId && s.endpoint !== targetId);

      await client.from('site_settings').upsert({
        setting_key: 'admin_push_subscriptions',
        setting_value: subs,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

      return res.status(200).json({ success: true, removed: initialLen - subs.length });
    }

    if (req.method === 'PUT') {
      const idx = subs.findIndex(s => s.id === targetId || s.endpoint === targetId);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Subscription not found' });
      }

      subs[idx].enabled = !subs[idx].enabled;
      subs[idx].updated_at = new Date().toISOString();

      await client.from('site_settings').upsert({
        setting_key: 'admin_push_subscriptions',
        setting_value: subs,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

      return res.status(200).json({ success: true, enabled: subs[idx].enabled });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
