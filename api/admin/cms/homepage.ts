import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      if (!SERVICE_ROLE_KEY) {
        return res.status(500).json({ error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing' });
      }
      const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false }
      });
      const { data, error } = await supabaseAdmin
        .from('homepage_cms')
        .select('*')
        .eq('section_key', 'hero')
        .single();

      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        hero: data?.data || null,
        record: data || null
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'PUT') {
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

    // 1. Independently verify Admin session via Supabase Auth
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ error: 'Admin session expired. Please sign in again.' });
    }

    const user = userData.user;
    const isAuthorizedAdmin = 
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin';

    if (!isAuthorizedAdmin) {
      return res.status(403).json({ error: 'Your account does not have administrator permissions (role: admin required).' });
    }

    // 2. Validate payload
    const body = req.body || {};
    const heroData = body.hero ? body.hero : (body.desktopImageUrl || body.image ? body : null);

    if (!heroData && !body.data) {
      return res.status(400).json({ error: 'Invalid payload: hero configuration is required' });
    }

    const finalHeroConfig = heroData || body.data;

    // 3. Upsert / update canonical row where section_key = 'hero'
    // Ensure we do NOT create duplicate rows:
    const { data: existingRows } = await supabaseAdmin
      .from('homepage_cms')
      .select('id, section_key')
      .eq('section_key', 'hero');

    let resultRecord: any = null;

    if (existingRows && existingRows.length > 0) {
      const canonicalId = existingRows[0].id;
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('homepage_cms')
        .update({
          data: finalHeroConfig,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', canonicalId)
        .select()
        .single();

      if (updateErr) {
        console.error('Server homepage_cms update error:', updateErr);
        return res.status(500).json({ error: `Database update error: ${updateErr.message}` });
      }
      resultRecord = updated;
    } else {
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from('homepage_cms')
        .insert({
          section_key: 'hero',
          data: finalHeroConfig,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertErr) {
        console.error('Server homepage_cms insert error:', insertErr);
        return res.status(500).json({ error: `Database insert error: ${insertErr.message}` });
      }
      resultRecord = inserted;
    }

    return res.status(200).json({
      success: true,
      hero: resultRecord.data,
      record: {
        id: resultRecord.id,
        section_key: resultRecord.section_key,
        updated_at: resultRecord.updated_at,
        is_active: resultRecord.is_active
      }
    });
  } catch (err: any) {
    console.error('Admin CMS update handler error:', err);
    return res.status(500).json({ error: err.message || 'Failed updating homepage CMS' });
  }
}
