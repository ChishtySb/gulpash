import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Independently verify Admin session via Supabase Auth
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ error: 'Admin session expired. Please sign in again.' });
    }

    const user = userData.user;
    const isAuthorizedAdmin = 
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin';

    if (!isAuthorizedAdmin) {
      return res.status(403).json({ error: 'Your account does not have permission to upload this media.' });
    }

    const { bucket, path: storagePath, data, mimeType } = req.body || {};
    if (!bucket || !storagePath || !data) {
      return res.status(400).json({ error: 'Missing required parameters (bucket, path, data)' });
    }

    const allowedBuckets = ['product-images', 'hero-images', 'hero-videos', 'category-images', 'site-assets'];
    if (!allowedBuckets.includes(bucket)) {
      return res.status(403).json({ error: `Bucket "${bucket}" is not an authorized media bucket` });
    }

    let base64Content = data;
    let detectedMime = mimeType || 'image/jpeg';
    if (data.startsWith('data:')) {
      const match = data.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        base64Content = match[2];
      }
    }

    const buffer = Buffer.from(base64Content, 'base64');

    const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: detectedMime,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadErr) {
      console.error('Server storage upload error:', uploadErr);
      return res.status(500).json({ error: uploadErr.message });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return res.status(200).json({
      success: true,
      url: publicUrlData.publicUrl,
      storagePath: uploadData.path,
      bucket
    });
  } catch (err: any) {
    console.error('Admin storage upload handler error:', err);
    return res.status(500).json({ error: err.message || 'Server storage upload failed' });
  }
}
