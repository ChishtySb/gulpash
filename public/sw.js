// GulPash Admin - Production Service Worker
// Version: 1.0.0
const CACHE_NAME = 'gulpash-admin-static-v1';

// Static asset shell for caching
const PRECACHE_ASSETS = [
  '/',
  '/admin',
  '/manifest.json',
  '/favicon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// Install: Cache critical static assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache skipped for some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up legacy caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Conservative caching. NEVER cache API requests or authenticated mutations.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NEVER cache any API, Supabase, or backend mutations
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co') ||
    request.headers.get('Authorization')
  ) {
    // Network only
    return;
  }

  // 2. Navigation requests: Network-first with offline fallback to avoid stale admin bundle
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request).then((res) => res || caches.match('/admin') || caches.match('/')))
    );
    return;
  }

  // 3. Static assets (images, fonts, scripts): Stale-while-revalidate
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|css|js)$/) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone()).catch(() => {});
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

// ==========================================
// REAL WEB PUSH NOTIFICATION HANDLER
// ==========================================
self.addEventListener('push', (event) => {
  let payload = {};

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = {
        title: 'GulPash — New Order',
        body: event.data.text()
      };
    }
  } else {
    payload = {
      title: 'GulPash — New Order',
      body: 'A new order has been received in GulPash Atelier.'
    };
  }

  const title = payload.title || 'GulPash — New Order';
  const orderId = payload.data?.orderId;
  const orderNumber = payload.data?.orderNumber;
  const orderTotal = payload.data?.orderTotal;

  const targetUrl = payload.data?.url || (orderId ? `/admin?tab=orders&orderId=${orderId}` : '/admin');

  const options = {
    body: payload.body || `Order #${orderNumber || 'New'} received. Tap to view order.`,
    icon: payload.icon || '/pwa-192x192.png',
    badge: payload.badge || '/favicon.png',
    tag: payload.tag || (orderId ? `order-${orderId}` : `gulpash-order-${Date.now()}`),
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: targetUrl,
      orderId: orderId,
      orderNumber: orderNumber,
      orderTotal: orderTotal,
      timestamp: Date.now()
    },
    actions: [
      { action: 'open_order', title: 'Open Order' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      // Broadcast to any open admin tabs so in-app state updates immediately
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'GULPASH_PUSH_RECEIVED',
          payload: {
            title,
            body: options.body,
            orderId,
            orderNumber,
            orderTotal
          }
        });
      });
    })
  );
});

// ==========================================
// NOTIFICATION CLICK / DEEP-LINKING HANDLER
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const notificationData = event.notification.data || {};
  const targetUrl = notificationData.url || '/admin';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. Look for an already open Admin window
      for (const client of clientList) {
        if (client.url && client.url.includes('/admin') && 'focus' in client) {
          // Focus existing window and send message to select order
          client.focus();
          client.postMessage({
            type: 'GULPASH_OPEN_ORDER',
            orderId: notificationData.orderId,
            orderNumber: notificationData.orderNumber,
            url: targetUrl
          });
          if ('navigate' in client && targetUrl) {
            return client.navigate(targetUrl);
          }
          return client;
        }
      }

      // 2. If no window is open, open a new standalone window to the target order URL
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle explicit messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
