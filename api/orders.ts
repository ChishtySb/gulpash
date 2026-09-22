import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSupabaseAdmin() {
  const key = SERVICE_ROLE_KEY || ANON_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase URL or Key is missing from server environment.');
  }
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false }
  });
}

function isUUID(str: any): boolean {
  if (typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function mapDbOrderToCanonical(dbOrder: any): any {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    customer: {
      fullName: dbOrder.customer_name || '',
      email: dbOrder.customer_email || '',
      phone: dbOrder.customer_phone || '',
      whatsapp: dbOrder.customer_whatsapp || dbOrder.customer_phone || '',
      address: dbOrder.address || '',
      apartment: dbOrder.apartment || undefined,
      city: dbOrder.city || '',
      province: dbOrder.province || 'Punjab',
      postalCode: dbOrder.postal_code || undefined,
      orderNotes: dbOrder.order_notes || undefined,
    },
    items: (dbOrder.order_items || []).map((it: any) => ({
      productId: it.product_id || '',
      title: it.title || '',
      size: it.size || 'Unstitched',
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,
      image: it.image_url || '',
      sku: it.sku || ''
    })),
    subtotal: Number(dbOrder.subtotal) || 0,
    shippingFee: Number(dbOrder.shipping_fee) || 0,
    discount: Number(dbOrder.discount) || 0,
    total: Number(dbOrder.total) || 0,
    paymentMethod: dbOrder.payment_method || 'Cash on Delivery (COD)',
    paymentType: (dbOrder.payment_method && dbOrder.payment_method.includes('COD')) ? 'Cash on Delivery' : 'Full Advance',
    paymentStatus: dbOrder.payment_status || 'Unpaid',
    status: dbOrder.order_status || 'Pending',
    trackingNumber: dbOrder.tracking_number || undefined,
    courierName: dbOrder.courier_name || undefined,
    createdAt: dbOrder.created_at || new Date().toISOString(),
    updatedAt: dbOrder.updated_at || new Date().toISOString()
  };
}

export async function fetchAuthoritativeOrders(): Promise<{ success: boolean; orders: any[]; error?: string }> {
  try {
    const client = getSupabaseAdmin();
    const { data: dbOrders, error } = await client
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[OrderPipeline] Failed to fetch orders from Supabase:', error);
      return { success: false, orders: [], error: error.message };
    }

    const orders = (dbOrders || []).map(mapDbOrderToCanonical);
    return { success: true, orders };
  } catch (err: any) {
    console.error('[OrderPipeline] Error fetching orders:', err);
    return { success: false, orders: [], error: err.message };
  }
}

export async function createAuthoritativeOrder(orderData: any): Promise<{
  success: boolean;
  order?: any;
  error?: string;
  details?: any;
}> {
  try {
    if (!orderData) {
      return { success: false, error: 'Empty order payload provided.' };
    }

    const customer = orderData.customer || {};
    const fullName = (customer.fullName || orderData.customerName || '').trim();
    const phone = (customer.phone || orderData.customerPhone || '').trim();
    const address = (customer.address || orderData.address || '').trim();
    const city = (customer.city || orderData.city || 'Lahore').trim();

    if (!fullName || !phone || !address) {
      return {
        success: false,
        error: 'Missing required customer details: Name, Phone, and Address are mandatory.'
      };
    }

    const rawItems = orderData.items || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return { success: false, error: 'Cannot create an empty order: at least one item required.' };
    }

    const orderId = isUUID(orderData.id) ? orderData.id : crypto.randomUUID();

    let orderNumber = orderData.orderNumber;
    if (!orderNumber || typeof orderNumber !== 'string' || !orderNumber.startsWith('GP-')) {
      orderNumber = `GP-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    const rawMethod = String(orderData.paymentMethod || '').trim();
    const isCod = rawMethod.toLowerCase().includes('cash on delivery') || rawMethod.toLowerCase().includes('cod');
    const dbPaymentMethod = isCod ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer';

    const rawPayStatus = String(orderData.paymentStatus || '').toLowerCase();
    const dbPaymentStatus = rawPayStatus === 'paid' ? 'Paid' : 'Unpaid';

    const dbAllowedOrderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    const dbOrderStatus = dbAllowedOrderStatuses.includes(orderData.status) ? orderData.status : 'Pending';

    const subtotal = Number(orderData.subtotal) || 0;
    const shippingFee = Number(orderData.shippingFee) || 0;
    const discount = Number(orderData.discount) || 0;
    const total = Number(orderData.total) || Math.max(0, subtotal + shippingFee - discount);

    const client = getSupabaseAdmin();

    const cleanEmail = (customer.email || orderData.customerEmail || '').trim();
    const customerEmail = cleanEmail || `${phone.replace(/\D/g, '') || 'guest'}@customer.gulpash.online`;

    const cleanNotes = (customer.orderNotes || orderData.orderNotes || '').trim();
    const methodNote = !isCod ? `[Method: ${rawMethod || 'Direct Bank Transfer'}]` : '';
    let proofNote = '';
    if (orderData.paymentProof) {
      const proofStr = typeof orderData.paymentProof === 'string' 
        ? orderData.paymentProof 
        : `Ref: ${orderData.paymentProof.transactionReference || orderData.paymentProof.trxId || 'N/A'} | Receipt: ${orderData.paymentProof.screenshotUrl || 'N/A'}`;
      proofNote = `[Payment Proof] ${proofStr}`;
    }
    const notesParts = [cleanNotes, methodNote, proofNote].filter(Boolean);
    const finalOrderNotes = notesParts.join(' | ');

    // 1. Insert Order Header
    const { data: orderRow, error: orderError } = await client
      .from('orders')
      .insert({
        id: orderId,
        order_number: orderNumber,
        customer_name: fullName,
        customer_email: customerEmail,
        customer_phone: phone,
        customer_whatsapp: (customer.whatsapp || customer.phone || phone).trim() || null,
        address: address,
        apartment: (customer.apartment || orderData.apartment || '').trim() || null,
        city: city,
        province: (customer.province || orderData.province || 'Punjab').trim(),
        postal_code: (customer.postalCode || orderData.postalCode || '').trim() || null,
        order_notes: finalOrderNotes || null,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        discount: discount,
        total: total,
        payment_method: dbPaymentMethod,
        payment_status: dbPaymentStatus,
        order_status: dbOrderStatus
      })
      .select()
      .single();

    if (orderError || !orderRow) {
      console.error('[OrderPipeline] Supabase order insertion failed:', orderError);
      return {
        success: false,
        error: `Supabase order persistence error: ${orderError?.message || 'Unknown database error'} (Code: ${orderError?.code || '500'})`,
        details: orderError
      };
    }

    // 2. Validate product IDs
    const candidateProductIds = rawItems
      .map((it: any) => it.productId)
      .filter((id: any) => isUUID(id));

    const existingProductIds = new Set<string>();
    if (candidateProductIds.length > 0) {
      try {
        const { data: matchedProducts } = await client
          .from('products')
          .select('id')
          .in('id', candidateProductIds);
        if (matchedProducts && Array.isArray(matchedProducts)) {
          matchedProducts.forEach((p: any) => existingProductIds.add(p.id));
        }
      } catch (prodLookupErr) {
        console.warn('[OrderPipeline] Could not lookup products:', prodLookupErr);
      }
    }

    const orderItemsRows = rawItems.map((it: any, idx: number) => {
      const validProductId = (isUUID(it.productId) && existingProductIds.has(it.productId))
        ? it.productId
        : null;

      const rawSku = (typeof it.sku === 'string' && it.sku.trim().length > 0) ? it.sku.trim() : null;
      const guaranteedSku = rawSku || (validProductId ? `SKU-${validProductId.slice(0, 8).toUpperCase()}` : `GP-ITEM-${idx + 1}`);

      return {
        order_id: orderId,
        product_id: validProductId,
        title: it.title || it.product?.title || 'Luxury Garment',
        size: it.size || 'Unstitched',
        price: Number(it.price) || 0,
        quantity: Math.max(1, Number(it.quantity) || 1),
        image_url: it.image || it.imageUrl || it.product?.images?.[0] || null,
        sku: guaranteedSku
      };
    });

    const { data: insertedItems, error: itemsError } = await client
      .from('order_items')
      .insert(orderItemsRows)
      .select();

    if (itemsError) {
      console.error('[OrderPipeline] Supabase order_items insertion failed, rolling back order:', itemsError);
      await client.from('orders').delete().eq('id', orderId);
      return {
        success: false,
        error: `Supabase order_items persistence error: ${itemsError.message} (Code: ${itemsError.code})`,
        details: itemsError
      };
    }

    const canonicalOrder = mapDbOrderToCanonical({
      ...orderRow,
      order_items: insertedItems || orderItemsRows
    });

    console.log(`[OrderPipeline] Order ${canonicalOrder.orderNumber} (${canonicalOrder.id}) successfully committed to Supabase!`);

    // 3. Persistent notification log in site_settings
    try {
      const { data: notifsRow } = await client
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'admin_notifications')
        .maybeSingle();

      const notifsList = (notifsRow?.setting_value && Array.isArray(notifsRow.setting_value))
        ? notifsRow.setting_value
        : [];

      const notifItem = {
        id: `notif-order-${canonicalOrder.id}`,
        type: 'NEW_ORDER',
        title: `New Order Received: #${canonicalOrder.orderNumber}`,
        message: `${canonicalOrder.customer.fullName} placed an order of PKR ${canonicalOrder.total.toLocaleString()} via ${canonicalOrder.paymentMethod}.`,
        orderId: canonicalOrder.id,
        orderNumber: canonicalOrder.orderNumber,
        orderTotal: canonicalOrder.total,
        customerName: canonicalOrder.customer.fullName,
        paymentMethod: canonicalOrder.paymentMethod,
        isRead: false,
        timestamp: new Date().toISOString()
      };

      notifsList.unshift(notifItem);
      const trimmedList = notifsList.slice(0, 150);

      await client.from('site_settings').upsert({
        setting_key: 'admin_notifications',
        setting_value: trimmedList,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });
    } catch (notifErr: any) {
      console.warn('[OrderPipeline] Note updating notification history:', notifErr?.message);
    }

    // 4. Supabase Realtime broadcast
    try {
      const channel = client.channel('admin-notifications');
      await channel.send({
        type: 'broadcast',
        event: 'NEW_ORDER',
        payload: {
          id: `notif-order-${canonicalOrder.id}`,
          title: `New Order: #${canonicalOrder.orderNumber}`,
          total: canonicalOrder.total,
          customer: canonicalOrder.customer.fullName,
          timestamp: new Date().toISOString()
        }
      });
      await client.removeChannel(channel);
    } catch (broadcastErr: any) {
      console.warn('[OrderPipeline] Realtime broadcast error:', broadcastErr?.message);
    }

    return {
      success: true,
      order: canonicalOrder
    };
  } catch (unexpectedErr: any) {
    console.error('[OrderPipeline] Unexpected error creating order:', unexpectedErr);
    return {
      success: false,
      error: unexpectedErr?.message || 'Unexpected server error while persisting order.'
    };
  }
}

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

      if (typeof orderData === 'string') {
        try {
          orderData = JSON.parse(orderData);
        } catch {
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
