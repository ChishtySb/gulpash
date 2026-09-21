import { getSupabaseAdmin } from '../_orderPipeline.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const client = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data: row } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'admin_notifications')
      .maybeSingle();

    const notifs = (row?.setting_value && Array.isArray(row.setting_value)) ? row.setting_value : [];
    return res.status(200).json(notifs);
  }

  if (req.method === 'POST') {
    const newNotif = req.body;
    if (!newNotif) return res.status(400).json({ error: 'Payload missing' });

    const { data: row } = await client
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'admin_notifications')
      .maybeSingle();

    const list = (row?.setting_value && Array.isArray(row.setting_value)) ? row.setting_value : [];
    list.unshift({ ...newNotif, id: newNotif.id || `notif-${Date.now()}`, timestamp: new Date().toISOString() });
    const trimmed = list.slice(0, 150);

    await client.from('site_settings').upsert({
      setting_key: 'admin_notifications',
      setting_value: trimmed,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' });

    return res.status(200).json({ success: true, count: trimmed.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
