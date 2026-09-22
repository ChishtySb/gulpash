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

  return { ok: true, user, client };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

    // Retrieve current subscriptions from canonical site_settings
    const { data: row } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'admin_push_subscriptions')
      .maybeSingle();

    let subs: any[] = (row?.setting_value && Array.isArray(row.setting_value)) ? row.setting_value : [];

    // 1. GET: List subscriptions (safe fields only)
    if (req.method === 'GET') {
      const safeSubs = subs.map(s => ({
        id: s.id,
        endpoint: s.endpoint,
        device_name: s.device_name || 'Admin Device',
        user_agent: s.user_agent,
        enabled: s.enabled !== false,
        created_at: s.created_at,
        updated_at: s.updated_at,
        last_success_at: s.last_success_at,
        failure_count: s.failure_count || 0
      }));

      return res.status(200).json({
        success: true,
        subscriptions: safeSubs
      });
    }

    // 2. POST: Register new subscription or handle action fallbacks
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
        }
      }

      const { action, id, subscription, deviceName } = body || {};

      // Support action fallback for toggle
      if (action === 'toggle' && id) {
        const idx = subs.findIndex(s => s.id === id || s.endpoint === id);
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

      // Support action fallback for delete
      if (action === 'delete' && id) {
        const initialLen = subs.length;
        subs = subs.filter(s => s.id !== id && s.endpoint !== id);

        await client.from('site_settings').upsert({
          setting_key: 'admin_push_subscriptions',
          setting_value: subs,
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });

        return res.status(200).json({ success: true, removed: initialLen - subs.length });
      }

      // Standard Registration
      if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
        return res.status(400).json({
          success: false,
          error: 'Invalid push subscription payload: endpoint, p256dh, and auth are required.',
          code: 'INVALID_PAYLOAD'
        });
      }

      const existingIdx = subs.findIndex(s => s.endpoint === subscription.endpoint);
      const now = new Date().toISOString();

      const record = {
        id: existingIdx >= 0 ? subs[existingIdx].id : `sub-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        user_id: authResult.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        device_name: deviceName || (existingIdx >= 0 ? subs[existingIdx].device_name : 'Admin Device'),
        user_agent: req.headers['user-agent'] || '',
        enabled: true,
        created_at: existingIdx >= 0 ? subs[existingIdx].created_at : now,
        updated_at: now,
        last_success_at: existingIdx >= 0 ? subs[existingIdx].last_success_at : null,
        failure_count: 0
      };

      if (existingIdx >= 0) {
        subs[existingIdx] = record;
      } else {
        subs.unshift(record);
      }

      await client.from('site_settings').upsert({
        setting_key: 'admin_push_subscriptions',
        setting_value: subs,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

      return res.status(200).json({
        success: true,
        subscription: {
          id: record.id,
          endpoint: record.endpoint,
          device_name: record.device_name,
          enabled: record.enabled,
          created_at: record.created_at
        }
      });
    }

    // 3. DELETE query param support
    if (req.method === 'DELETE') {
      const target = req.query?.id || req.query?.endpoint;
      if (!target) {
        return res.status(400).json({ success: false, error: 'Subscription ID required' });
      }

      const initialLen = subs.length;
      subs = subs.filter(s => s.id !== target && s.endpoint !== target);

      await client.from('site_settings').upsert({
        setting_key: 'admin_push_subscriptions',
        setting_value: subs,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

      return res.status(200).json({ success: true, removed: initialLen - subs.length });
    }

    // 4. PUT query param support
    if (req.method === 'PUT') {
      const target = req.query?.id || req.query?.endpoint;
      if (!target) {
        return res.status(400).json({ success: false, error: 'Subscription ID required' });
      }

      const idx = subs.findIndex(s => s.id === target || s.endpoint === target);
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

    return res.status(405).json({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error processing push subscription',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
