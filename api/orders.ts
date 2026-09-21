import { fetchAuthoritativeOrders, createAuthoritativeOrder } from './_orderPipeline.ts';

export default async function handler(req: any, res: any) {
  // Always enforce JSON Content-Type and CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await fetchAuthoritativeOrders();
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to fetch authoritative orders',
          code: 'FETCH_ORDERS_FAILED'
        });
      }
      return res.status(200).json(result.orders);
    }

    if (req.method === 'POST') {
      let orderData = req.body;

      // Handle raw body string if not auto-parsed
      if (typeof orderData === 'string') {
        try {
          orderData = JSON.parse(orderData);
        } catch (parseErr) {
          return res.status(400).json({
            success: false,
            error: 'Invalid JSON payload received',
            code: 'INVALID_JSON_BODY'
          });
        }
      }

      if (!orderData || typeof orderData !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Order payload is required',
          code: 'EMPTY_PAYLOAD'
        });
      }

      const result = await createAuthoritativeOrder(orderData);

      if (!result.success || !result.order) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to persist order to database',
          code: 'ORDER_CREATION_FAILED'
        });
      }

      return res.status(200).json({
        success: true,
        order: result.order
      });
    }

    return res.status(405).json({
      success: false,
      error: `HTTP method ${req.method} is not allowed`,
      code: 'METHOD_NOT_ALLOWED'
    });
  } catch (fatalErr: any) {
    console.error('[API /orders] Unhandled execution error:', fatalErr);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while processing your order. Please try again.',
      code: 'UNHANDLED_EXCEPTION'
    });
  }
}

// Re-export canonical functions so internal scripts and dev server can consume directly
export { fetchAuthoritativeOrders, createAuthoritativeOrder };

