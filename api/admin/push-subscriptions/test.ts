import { createClient } from '@supabase/supabase-js';
import pkg from 'web-push';

const webPush = (pkg as any)?.default || pkg;

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
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

    // Retrieve VAPID keys
    const { data: vapidRow } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'vapid_keys')
      .maybeSingle();

    const vapidKeys = vapidRow?.setting_value;
    if (!vapidKeys || !vapidKeys.publicKey || !vapidKeys.privateKey) {
      return res.status(400).json({
        success: false,
        error: 'VAPID keys are not configured yet. Please open notifications settings to initialize.',
        code: 'VAPID_MISSING'
      });
    }

    // Set VAPID details on web-push
    webPush.setVapidDetails(
      vapidKeys.subject || 'mailto:care@gulpash.online',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    // Retrieve active push subscriptions
    const { data: subsRow } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'admin_push_subscriptions')
      .maybeSingle();

    const allSubs: any[] = (subsRow?.setting_value && Array.isArray(subsRow.setting_value))
      ? subsRow.setting_value
      : [];

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const targetEndpoint = body?.endpoint;
    let targets = allSubs.filter(s => s.enabled !== false);
    if (targetEndpoint) {
      targets = targets.filter(s => s.endpoint === targetEndpoint);
    }

    if (targets.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No active push subscription found for this device. Please enable notifications on this device first.',
        code: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    const payload = JSON.stringify({
      title: 'GulPash Admin — Push Alert Test',
      body: 'Instant order notifications are active for this device.',
      icon: '/pwa-192x192.png',
      badge: '/favicon.png',
      tag: `test-push-${Date.now()}`,
      data: {
        url: '/admin?tab=notifications',
        type: 'TEST_PUSH',
        timestamp: Date.now()
      }
    });

    let delivered = 0;
    let failed = 0;
    const deadEndpoints: string[] = [];

    await Promise.all(
      targets.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            },
            payload,
            { TTL: 60 }
          );
          delivered++;
        } catch (pushErr: any) {
          failed++;
          console.warn('[WebPush] Delivery failed for device:', pushErr?.statusCode || pushErr?.message);
          if (pushErr?.statusCode === 404 || pushErr?.statusCode === 410) {
            deadEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    // Prune unsubscribed/expired endpoints from canonical site_settings
    if (deadEndpoints.length > 0) {
      const pruned = allSubs.filter(s => !deadEndpoints.includes(s.endpoint));
      await client.from('site_settings').upsert({
        setting_key: 'admin_push_subscriptions',
        setting_value: pruned,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });
    }

    return res.status(200).json({
      success: true,
      message: delivered > 0
        ? `Test notification dispatched to ${delivered} active device(s).`
        : 'Notification dispatched to push gateway.',
      delivered,
      failed
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to dispatch test notification',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
