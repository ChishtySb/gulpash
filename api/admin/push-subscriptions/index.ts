import { getSupabaseAdmin, getPushSubscriptions, savePushSubscriptionRecord } from '../../orderPipeline';

async function checkAdminAuth(req: any) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const client = getSupabaseAdmin();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const user = await checkAdminAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Admin session required' });
  }

  if (req.method === 'GET') {
    const subs = await getPushSubscriptions();
    return res.status(200).json({ success: true, subscriptions: subs });
  }

  if (req.method === 'POST') {
    const { subscription, deviceName } = req.body || {};
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({ error: 'Invalid push subscription payload' });
    }

    const record = await savePushSubscriptionRecord(
      subscription,
      deviceName,
      user.id,
      req.headers['user-agent']
    );

    return res.status(200).json({
      success: true,
      subscription: record
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
