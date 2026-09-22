import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const DEFAULT_PREFERENCES = {
  soundEnabled: true,
  desktopPushEnabled: true,
  toastAlertsEnabled: true,
  inAppNotificationEnabled: true,
  channels: {
    inApp: true,
    toast: true,
    sound: true,
    backgroundPush: true
  },
  events: {
    newOrder: true,
    orderStatusChange: true,
    paymentProofUploaded: true,
    lowStock: true,
    customerInquiry: false
  }
};

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
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

    if (req.method === 'GET') {
      const { data: row } = await client
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'notification_preferences')
        .maybeSingle();

      const prefs = row?.setting_value ? {
        ...DEFAULT_PREFERENCES,
        ...row.setting_value,
        channels: { ...DEFAULT_PREFERENCES.channels, ...(row.setting_value.channels || {}) },
        events: { ...DEFAULT_PREFERENCES.events, ...(row.setting_value.events || {}) }
      } : DEFAULT_PREFERENCES;

      return res.status(200).json({ success: true, preferences: prefs });
    }

    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }

      const { data: row } = await client
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'notification_preferences')
        .maybeSingle();

      const existing = row?.setting_value || DEFAULT_PREFERENCES;
      const updated = {
        ...existing,
        ...(body || {}),
        channels: { ...(existing.channels || DEFAULT_PREFERENCES.channels), ...(body?.channels || {}) },
        events: { ...(existing.events || DEFAULT_PREFERENCES.events), ...(body?.events || {}) }
      };

      await client.from('site_settings').upsert({
        setting_key: 'notification_preferences',
        setting_value: updated,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

      return res.status(200).json({ success: true, preferences: updated });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error handling preferences',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
