import { ensureVapidConfigured } from '../_orderPipeline.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicKey } = await ensureVapidConfigured();
    return res.status(200).json({ success: true, publicKey });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to retrieve VAPID public key' });
  }
}
