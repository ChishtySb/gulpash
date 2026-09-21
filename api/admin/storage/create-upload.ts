import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ALLOWED_BUCKETS = ['hero-images', 'hero-videos', 'product-images', 'category-images', 'site-assets'];
const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm'];
const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif'
];

const MAX_VIDEO_BYTES = 35 * 1024 * 1024; // 35 MB
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

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
    // 1. Validate Bearer Supabase JWT
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

    // 2. Independently verify Admin session via Supabase Auth
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ error: 'Admin session expired or invalid. Please sign in again.' });
    }

    const user = userData.user;
    const isAuthorizedAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin';

    if (!isAuthorizedAdmin) {
      return res.status(403).json({ error: 'Forbidden: Your account does not have admin permissions to authorize media uploads.' });
    }

    // 3. Extract & Validate metadata
    const { bucket, filename, mimeType, fileSize, pathPrefix } = req.body || {};

    if (!bucket || !filename || !mimeType) {
      return res.status(400).json({ error: 'Missing required metadata: bucket, filename, and mimeType are required.' });
    }

    // 4. Whitelist permitted Admin media buckets (Strict: payment-proofs prohibited)
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return res.status(403).json({ error: `Bucket "${bucket}" is not an authorized media bucket.` });
    }

    // 5. Validate MIME type
    const isVideo = mimeType.startsWith('video/') || filename.endsWith('.mp4') || filename.endsWith('.webm');
    if (isVideo) {
      if (!ALLOWED_VIDEO_MIMES.includes(mimeType)) {
        return res.status(400).json({
          error: `Unsupported video format "${mimeType}". Allowed video formats: MP4 (video/mp4) and WebM (video/webm).`
        });
      }
      if (fileSize && Number(fileSize) > MAX_VIDEO_BYTES) {
        return res.status(400).json({
          error: `Video file size exceeds the 35 MB limit (${(Number(fileSize) / (1024 * 1024)).toFixed(1)} MB). Please compress your video.`
        });
      }
    } else {
      if (!ALLOWED_IMAGE_MIMES.includes(mimeType)) {
        return res.status(400).json({
          error: `Unsupported image format "${mimeType}". Allowed image formats: JPG, PNG, WebP, GIF, SVG, AVIF.`
        });
      }
      if (fileSize && Number(fileSize) > MAX_IMAGE_BYTES) {
        return res.status(400).json({
          error: `Image file size exceeds the 10 MB limit (${(Number(fileSize) / (1024 * 1024)).toFixed(1)} MB).`
        });
      }
    }

    // 6. Generate a unique safe storage path
    const rawExt = (filename.split('.').pop() || (isVideo ? 'mp4' : 'jpg')).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanBase = filename
      .substring(0, filename.lastIndexOf('.') || filename.length)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanBase}.${rawExt}`;
    const cleanPrefix = (pathPrefix || '').replace(/^\/+|\/+$/g, '');
    const storagePath = cleanPrefix ? `${cleanPrefix}/${cleanName}` : cleanName;

    // 7. Create a short-lived Supabase signed upload target
    const { data: signData, error: signErr } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(storagePath);

    if (signErr || !signData) {
      console.error('Supabase createSignedUploadUrl error:', signErr);
      return res.status(500).json({ error: signErr?.message || 'Failed to generate signed upload authorization' });
    }

    // 8. Retrieve public CDN URL for the target path
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(signData.path);

    // 9. Return ONLY the minimum upload information needed by the browser
    return res.status(200).json({
      success: true,
      signedUrl: signData.signedUrl,
      token: signData.token,
      path: signData.path,
      bucket,
      publicUrl: publicUrlData?.publicUrl || ''
    });
  } catch (err: any) {
    console.error('Create signed upload authorization error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error while creating upload authorization' });
  }
}
