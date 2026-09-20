import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Admin authentication session is not active. Please sign in again.' });
    }

    const token = authHeader.substring(7);
    if (!SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing' });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ error: 'Admin session expired. Please sign in again.' });
    }

    const user = userData.user;
    const isAuthorizedAdmin = 
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin';

    if (!isAuthorizedAdmin) {
      return res.status(403).json({ error: 'Your account does not have permission to delete this media.' });
    }

    const { bucket, path: storagePath } = req.body || req.query || {};
    if (!bucket || !storagePath) {
      return res.status(400).json({ error: 'Missing bucket or path parameter' });
    }

    const allowedBuckets = ['product-images', 'hero-images', 'hero-videos', 'category-images', 'site-assets'];
    if (!allowedBuckets.includes(bucket)) {
      return res.status(403).json({ error: `Bucket "${bucket}" is not an authorized media bucket` });
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove([storagePath]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Admin storage delete handler error:', err);
    return res.status(500).json({ error: err.message || 'Server storage delete failed' });
  }
}
