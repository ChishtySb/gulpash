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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const client = getSupabaseClient();

    const { data: row, error: queryErr } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'vapid_keys')
      .maybeSingle();

    if (queryErr && queryErr.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        error: queryErr.message || 'Failed to query VAPID keys',
        code: 'DB_ERROR'
      });
    }

    let keys = row?.setting_value;

    if (!keys || !keys.publicKey || !keys.privateKey) {
      // Safely generate fresh VAPID keys if none exist in canonical persistence
      if (typeof webPush?.generateVAPIDKeys === 'function') {
        const generated = webPush.generateVAPIDKeys();
        keys = {
          publicKey: generated.publicKey,
          privateKey: generated.privateKey,
          subject: 'mailto:care@gulpash.online',
          created_at: new Date().toISOString()
        };

        await client.from('site_settings').upsert({
          setting_key: 'vapid_keys',
          setting_value: keys,
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });
      }
    }

    const publicKey = keys?.publicKey || '';

    if (!publicKey) {
      return res.status(500).json({
        success: false,
        error: 'VAPID public key is not configured.',
        code: 'VAPID_NOT_CONFIGURED'
      });
    }

    // Return sanitized public key only - NEVER expose privateKey
    return res.status(200).json({
      success: true,
      publicKey,
      initialized: true
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to retrieve VAPID public key',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
