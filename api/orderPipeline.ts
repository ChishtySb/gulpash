import { createClient, SupabaseClient } from '@supabase/supabase-js';
import webPush from 'web-push';
import crypto from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminClient) return supabaseAdminClient;
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase configuration missing (SUPABASE_URL / SERVICE_ROLE_KEY)');
  }
  supabaseAdminClient = createClient(SUPABASE_URL, key, {
    auth: { persistSession: false }
  });
  return supabaseAdminClient;
}

let vapidConfigured = false;
let vapidPublicKeyCached: string | null = null;

export async function ensureVapidConfigured(): Promise<{ publicKey: string }> {
  if (vapidConfigured && vapidPublicKeyCached) {
    return { publicKey: vapidPublicKeyCached };
  }

  const client = getSupabaseAdmin();
  const { data: row } = await client
    .from('site_settings')
    .select('*')
    .eq('setting_key', 'vapid_keys')
    .maybeSingle();

  let keys = row?.setting_value;
  if (!keys || !keys.publicKey || !keys.privateKey) {
    // Generate fresh VAPID keys if none exist in site_settings
    const generated = webPush.generateVAPIDKeys();
    keys = {
      publicKey: generated.publicKey,
      privateKey: generated.privateKey,
      subject: 'mailto:care@gulpash.online',
      created_at: new Date().toISOString()
    };
    await client.from('site_settings').upsert({
      setting_key: 'vapid_keys',
      setting_value: keys,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' });
  }

  webPush.setVapidDetails(
    keys.subject || 'mailto:care@gulpash.online',
    keys.publicKey,
    keys.privateKey
  );

  vapidConfigured = true;
  vapidPublicKeyCached = keys.publicKey;
  return { publicKey: keys.publicKey };
}

export async function getPushSubscriptions(): Promise<any[]> {
  const client = getSupabaseAdmin();
  const { data: row } = await client
    .from('site_settings')
    .select('*')
    .eq('setting_key', 'admin_push_subscriptions')
    .maybeSingle();

  if (row?.setting_value && Array.isArray(row.setting_value)) {
    return row.setting_value;
  }
  return [];
}

export async function savePushSubscriptionRecord(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  deviceName?: string,
  userId?: string,
  userAgent?: string
): Promise<any> {
  const client = getSupabaseAdmin();
  const subs = await getPushSubscriptions();
  const existingIdx = subs.findIndex((s: any) => s.endpoint === subscription.endpoint);
  const now = new Date().toISOString();

  const record = {
    id: existingIdx >= 0 ? subs[existingIdx].id : `sub-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    user_id: userId || 'admin',
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    device_name: deviceName || (existingIdx >= 0 ? subs[existingIdx].device_name : 'Admin Device'),
    user_agent: userAgent || '',
    enabled: true,
    created_at: existingIdx >= 0 ? subs[existingIdx].created_at : now,
    updated_at: now,
    last_success_at: existingIdx >= 0 ? subs[existingIdx].last_success_at : null,
    failure_count: 0
  };

  if (existingIdx >= 0) {
    subs[existingIdx] = record;
  } else {
    subs.unshift(record);
  }

  await client.from('site_settings').upsert({
    setting_key: 'admin_push_subscriptions',
    setting_value: subs,
    updated_at: now
  }, { onConflict: 'setting_key' });

  return record;
}

export async function togglePushSubscription(idOrEndpoint: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  const subs = await getPushSubscriptions();
  const idx = subs.findIndex((s: any) => s.id === idOrEndpoint || s.endpoint === idOrEndpoint);
  if (idx === -1) return false;

  subs[idx].enabled = !subs[idx].enabled;
  subs[idx].updated_at = new Date().toISOString();

  await client.from('site_settings').upsert({
    setting_key: 'admin_push_subscriptions',
    setting_value: subs,
    updated_at: new Date().toISOString()
  }, { onConflict: 'setting_key' });

  return subs[idx].enabled;
}

export async function deletePushSubscription(idOrEndpoint: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  const subs = await getPushSubscriptions();
  const filtered = subs.filter((s: any) => s.id !== idOrEndpoint && s.endpoint !== idOrEndpoint);
  if (filtered.length === subs.length) return false;

  await client.from('site_settings').upsert({
    setting_key: 'admin_push_subscriptions',
    setting_value: filtered,
    updated_at: new Date().toISOString()
  }, { onConflict: 'setting_key' });

  return true;
}

export async function sendWebPushToAdmins(payload: {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}): Promise<{ delivered: number; failed: number; reason?: string }> {
  try {
    await ensureVapidConfigured();
  } catch (err: any) {
    console.warn('[WebPush] VAPID configuration error:', err?.message);
    return { delivered: 0, failed: 0, reason: err?.message };
  }

  const subs = await getPushSubscriptions();
  const activeSubs = subs.filter((s: any) => s.enabled);
  if (activeSubs.length === 0) {
    return { delivered: 0, failed: 0, reason: 'No active subscriptions' };
  }

  const pushString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/pwa-192x192.png',
    badge: payload.badge || '/favicon.png',
    tag: payload.tag || (payload.data?.orderId ? `order-${payload.data.orderId}` : `gulpash-${Date.now()}`),
    data: payload.data || { url: '/admin' }
  });

  let delivered = 0;
  let failed = 0;
  const deadEndpoints: string[] = [];

  for (const sub of activeSubs) {
    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        },
        pushString,
        { TTL: 86400, urgency: 'high' }
      );
      sub.last_success_at = new Date().toISOString();
      sub.failure_count = 0;
      delivered++;
    } catch (err: any) {
      failed++;
      console.warn(`[WebPush] Push delivery failed (${err.statusCode || err.message})`);
      if (err.statusCode === 410 || err.statusCode === 404) {
        deadEndpoints.push(sub.endpoint);
      } else {
        sub.failure_count = (sub.failure_count || 0) + 1;
        if (sub.failure_count >= 5) {
          sub.enabled = false;
        }
      }
    }
  }

  if (deadEndpoints.length > 0 || delivered > 0) {
    const client = getSupabaseAdmin();
    const remaining = subs.filter((s: any) => !deadEndpoints.includes(s.endpoint));
    await client.from('site_settings').upsert({
      setting_key: 'admin_push_subscriptions',
      setting_value: remaining,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' });
  }

  return { delivered, failed };
}

export function isUUID(str: string | null | undefined): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function mapDbOrderToCanonical(dbOrder: any): any {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    customer: {
      fullName: dbOrder.customer_name || 'Customer',
      email: dbOrder.customer_email || '',
      phone: dbOrder.customer_phone || '',
      whatsapp: dbOrder.customer_whatsapp || dbOrder.customer_phone || '',
      address: dbOrder.address || '',
      apartment: dbOrder.apartment || undefined,
      city: dbOrder.city || '',
      province: dbOrder.province || '',
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

    // Determine safe, valid UUID for orders.id
    const orderId = isUUID(orderData.id) ? orderData.id : crypto.randomUUID();

    // Determine unique order number
    let orderNumber = orderData.orderNumber;
    if (!orderNumber || typeof orderNumber !== 'string' || !orderNumber.startsWith('GP-')) {
      orderNumber = `GP-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    // Strict constraint mapping for Postgres schema
    // 1. payment_method: 'Cash on Delivery (COD)' OR 'Direct Bank Transfer'
    const rawMethod = String(orderData.paymentMethod || '').toLowerCase();
    const dbPaymentMethod = (rawMethod.includes('cash on delivery') || rawMethod.includes('cod'))
      ? 'Cash on Delivery (COD)'
      : 'Direct Bank Transfer';

    // 2. payment_status: 'Unpaid' OR 'Paid'
    const rawPayStatus = String(orderData.paymentStatus || '');
    const dbPaymentStatus = rawPayStatus.toLowerCase() === 'paid' ? 'Paid' : 'Unpaid';

    // 3. order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'
    const allowedOrderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    const dbOrderStatus = allowedOrderStatuses.includes(orderData.status) ? orderData.status : 'Pending';

    // Calculate verified totals
    const subtotal = Number(orderData.subtotal) || 0;
    const shippingFee = Number(orderData.shippingFee) || 0;
    const discount = Number(orderData.discount) || 0;
    const total = Number(orderData.total) || Math.max(0, subtotal + shippingFee - discount);

    const client = getSupabaseAdmin();

    // 1. Insert Order Header Row
    const { data: orderRow, error: orderError } = await client
      .from('orders')
      .insert({
        id: orderId,
        order_number: orderNumber,
        customer_name: fullName,
        customer_email: (customer.email || orderData.customerEmail || '').trim(),
        customer_phone: phone,
        customer_whatsapp: (customer.whatsapp || customer.phone || phone).trim(),
        address: address,
        apartment: (customer.apartment || orderData.apartment || '').trim() || null,
        city: city,
        province: (customer.province || orderData.province || 'Punjab').trim(),
        postal_code: (customer.postalCode || orderData.postalCode || '').trim() || null,
        order_notes: (customer.orderNotes || orderData.orderNotes || '').trim() || null,
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

    // 2. Validate product IDs against existing products in Supabase
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

    // Prepare and Insert Order Items Rows
    const orderItemsRows = rawItems.map((it: any) => {
      const validProductId = (isUUID(it.productId) && existingProductIds.has(it.productId))
        ? it.productId
        : null;

      return {
        order_id: orderId,
        product_id: validProductId,
        title: it.title || it.product?.title || 'Luxury Garment',
        size: it.size || 'Unstitched',
        price: Number(it.price) || 0,
        quantity: Math.max(1, Number(it.quantity) || 1),
        image_url: it.image || it.imageUrl || it.product?.images?.[0] || null,
        sku: it.sku || null
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

    // Construct Canonical Order Object
    const canonicalOrder = mapDbOrderToCanonical({
      ...orderRow,
      order_items: insertedItems || orderItemsRows
    });

    console.log(`[OrderPipeline] Order ${canonicalOrder.orderNumber} (${canonicalOrder.id}) successfully committed to Supabase!`);

    // 3. PERSISTENT AUDIT NOTIFICATION LOG in site_settings
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

    // 4. SUPABASE REALTIME BROADCAST
    try {
      const channel = client.channel('admin-notifications');
      await channel.send({
        type: 'broadcast',
        event: 'NEW_ORDER',
        payload: {
          id: `notif-order-${canonicalOrder.id}`,
          type: 'NEW_ORDER',
          title: `New Order: #${canonicalOrder.orderNumber}`,
          message: `${canonicalOrder.customer.fullName} placed an order of PKR ${canonicalOrder.total.toLocaleString()} (${canonicalOrder.paymentMethod}).`,
          orderId: canonicalOrder.id,
          orderNumber: canonicalOrder.orderNumber,
          orderTotal: canonicalOrder.total,
          customerName: canonicalOrder.customer.fullName,
          paymentMethod: canonicalOrder.paymentMethod,
          timestamp: new Date().toISOString()
        }
      });
    } catch (realtimeErr: any) {
      console.warn('[OrderPipeline] Note broadcasting Realtime event:', realtimeErr?.message);
    }

    // 5. DISPATCH MOBILE WEB PUSH (Requirement 10 & 12)
    try {
      await sendWebPushToAdmins({
        title: `New Order: #${canonicalOrder.orderNumber}`,
        body: `${canonicalOrder.customer.fullName} placed an order of PKR ${canonicalOrder.total.toLocaleString()} (${canonicalOrder.paymentMethod}).`,
        icon: '/pwa-192x192.png',
        badge: '/favicon.png',
        tag: `order-${canonicalOrder.id}`,
        data: {
          url: `/admin?tab=orders&orderId=${canonicalOrder.id}`,
          orderId: canonicalOrder.id,
          orderNumber: canonicalOrder.orderNumber,
          orderTotal: canonicalOrder.total,
          customerName: canonicalOrder.customer.fullName,
          type: 'NEW_ORDER',
          timestamp: Date.now()
        }
      });
    } catch (pushErr: any) {
      console.warn('[OrderPipeline] Note sending Web Push alert:', pushErr?.message);
    }

    return {
      success: true,
      order: canonicalOrder
    };
  } catch (fatalErr: any) {
    console.error('[OrderPipeline] Fatal error during order creation:', fatalErr);
    return {
      success: false,
      error: `Internal server failure during order creation: ${fatalErr?.message || fatalErr}`
    };
  }
}
