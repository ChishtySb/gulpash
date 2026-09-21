import { getSupabaseAdmin, sendWebPushToAdmins } from '../../_orderPipeline.ts';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await checkAdminAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Admin session required' });
  }

  const result = await sendWebPushToAdmins({
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

  return res.status(200).json({
    success: true,
    message: result.delivered > 0
      ? `Test push delivered to ${result.delivered} active device(s)!`
      : 'Notification dispatched to registered devices.',
    result
  });
}
