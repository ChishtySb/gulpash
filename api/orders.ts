import { fetchAuthoritativeOrders, createAuthoritativeOrder } from './orderPipeline';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const result = await fetchAuthoritativeOrders();
    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to fetch orders from database' });
    }
    return res.status(200).json(result.orders);
  }

  if (req.method === 'POST') {
    const orderData = req.body;
    const result = await createAuthoritativeOrder(orderData);
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to persist order to database',
        details: result.details
      });
    }
    return res.status(200).json({
      success: true,
      order: result.order
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
