import { AdminNotification, NotificationEventType, AdminPushSubscription, AdminNotificationPreferences } from '../types';
import { getSupabaseClient } from './supabaseClient';
import { adminAuthService } from './adminAuth';
import { safeFetchJson } from './safeApi';

const NOTIFICATIONS_KEY = 'gulpash_admin_notifications_v1';
const PREFERENCES_KEY = 'gulpash_notification_preferences_v1';

// Web Audio API synthesized luxury chime with volume control
class ChimePlayer {
  private audioCtx: AudioContext | null = null;

  play(volume = 0.8) {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const masterGain = this.audioCtx.createGain();
      masterGain.connect(this.audioCtx.destination);
      const safeVol = Math.max(0.05, Math.min(1.0, volume)) * 0.25;
      masterGain.gain.setValueAtTime(safeVol, now);

      // Primary tone (D5 - 587.33 Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.7);

      // Harmonizing bell tone (A5 - 880 Hz, starts slightly delayed)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.001, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.4, now + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.12);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn('[Audio] Chime playback omitted or unsupported in this context:', e);
    }
  }
}

const chime = new ChimePlayer();

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const DEFAULT_NOTIFICATION_PREFS: AdminNotificationPreferences = {
  masterEnabled: true,
  channels: {
    inApp: true,
    popup: true,
    sound: true,
    push: true
  },
  events: {
    newOrder: true,
    newPaymentProof: true,
    paymentResubmitted: true,
    paymentVerified: true,
    paymentActionRequired: true,
    readyToDispatch: true,
    lowStock: true
  },
  lowStockThreshold: 3,
  soundVolume: 0.8
};

// Global PWA install prompt deferred event
let deferredInstallPrompt: any = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('gulpash_pwa_installable', { detail: { installable: true } }));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('gulpash_pwa_installable', { detail: { installable: false, installed: true } }));
  });
}

class NotificationManager {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private realtimeChannel: any = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initClient();
    }
  }

  private async initClient() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Register Service Worker
    await this.registerServiceWorker();

    // 2. Connect Supabase Realtime channel
    this.initRealtimeSubscription();

    // 3. Listen for postMessages from Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'GULPASH_PUSH_RECEIVED') {
          // Re-fetch notifications or emit change
          this.fetchServerNotifications().catch(() => {});
        } else if (event.data?.type === 'GULPASH_OPEN_ORDER') {
          const orderId = event.data.orderId;
          if (orderId) {
            window.dispatchEvent(new CustomEvent('gulpash_navigate_order', { detail: { orderId } }));
          }
        }
      });
    }

    // 4. Hydrate notifications from server
    this.fetchServerNotifications().catch(() => {});
  }

  // ---------------- SERVICE WORKER & PWA ----------------
  public async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      this.swRegistration = reg;

      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent('gulpash_sw_update_available'));
            }
          });
        }
      });

      return reg;
    } catch (err) {
      console.warn('[PWA] Service Worker registration failed:', err);
      return null;
    }
  }

  public async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (this.swRegistration) return this.swRegistration;
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      this.swRegistration = (await navigator.serviceWorker.getRegistration('/')) || null;
    }
    return this.swRegistration;
  }

  public isPushSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  public isInstallable(): boolean {
    return deferredInstallPrompt !== null;
  }

  public async promptInstall(): Promise<boolean> {
    if (!deferredInstallPrompt) return false;
    try {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      window.dispatchEvent(new CustomEvent('gulpash_pwa_installable', { detail: { installable: false } }));
      return outcome === 'accepted';
    } catch (err) {
      console.warn('[PWA] Install prompt failed:', err);
      return false;
    }
  }

  // ---------------- SUPABASE REALTIME ----------------
  public initRealtimeSubscription() {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel);
      }

      const channel = supabase.channel('admin-notifications', {
        config: { broadcast: { self: false } }
      });

      channel
        .on('broadcast', { event: 'NEW_ORDER' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'PAYMENT_VERIFIED' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'PAYMENT_ACTION_REQUIRED' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'NEW_PAYMENT_PROOF' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'PAYMENT_PROOF_RESUBMITTED' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'READY_TO_DISPATCH' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'LOW_STOCK' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .on('broadcast', { event: 'NOTIFICATION_RECEIVED' }, (event: any) => {
          this.handleIncomingBroadcast(event.payload);
        })
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('[Realtime] Subscribed to admin-notifications channel');
          }
        });

      this.realtimeChannel = channel;
    } catch (err) {
      console.warn('[Realtime] Failed to initialize broadcast subscription:', err);
    }
  }

  private handleIncomingBroadcast(payload: any) {
    if (!payload || !payload.type) return;

    const prefs = this.getPreferences();
    if (!prefs.masterEnabled) return;

    // Check event toggle
    const eventMap: Record<string, keyof typeof prefs.events> = {
      'NEW_ORDER': 'newOrder',
      'NEW_PAYMENT_PROOF': 'newPaymentProof',
      'PAYMENT_PROOF_SUBMITTED': 'newPaymentProof',
      'PAYMENT_PROOF_RESUBMITTED': 'paymentResubmitted',
      'PAYMENT_VERIFIED': 'paymentVerified',
      'PAYMENT_ACTION_REQUIRED': 'paymentActionRequired',
      'READY_TO_DISPATCH': 'readyToDispatch',
      'LOW_STOCK': 'lowStock'
    };
    const eventKey = eventMap[payload.type];
    if (eventKey && prefs.events[eventKey] === false) {
      return;
    }

    // Play chime if sound channel is enabled
    if (prefs.channels.sound) {
      this.playSound(prefs.soundVolume);
    }

    // Deduplicate against stored notifications
    const current = this.getNotifications();
    const isDup = current.some(n => 
      n.id === payload.id || 
      (n.type === payload.type && payload.orderId && n.orderId === payload.orderId && (Date.now() - new Date(n.timestamp).getTime() < 30000))
    );

    const notification: AdminNotification = {
      id: payload.id || `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: payload.type,
      title: payload.title || 'New Admin Notification',
      message: payload.message || '',
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      orderTotal: payload.orderTotal,
      customerName: payload.customerName,
      paymentMethod: payload.paymentMethod,
      productId: payload.productId,
      productTitle: payload.productTitle,
      stock: payload.stock,
      timestamp: payload.timestamp || new Date().toISOString(),
      read: false
    };

    if (!isDup) {
      const updated = [notification, ...current].slice(0, 150);
      this.saveNotifications(updated);
    }

    // Emit in-app toast popup event if popup channel is enabled
    if (prefs.channels.popup) {
      window.dispatchEvent(new CustomEvent('gulpash_in_app_popup', { detail: notification }));
    }

    // If document is in background or hidden, trigger browser notification if granted
    if (typeof document !== 'undefined' && document.hidden && this.getPermissionStatus() === 'granted') {
      this.showBrowserNotification(notification.title, notification.message, notification.orderNumber || notification.type);
    }
  }

  // ---------------- SOUND & CHIME ----------------
  public playSound(volume?: number) {
    const prefs = this.getPreferences();
    const vol = volume !== undefined ? volume : (prefs.soundVolume || 0.8);
    chime.play(vol);
  }

  public playOrderChime() {
    this.playSound(0.85);
  }

  // ---------------- BROWSER NOTIFICATIONS ----------------
  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }

  public async requestBrowserPermission(): Promise<boolean> {
    const perm = await this.requestPermission();
    return perm === 'granted';
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public showBrowserNotification(title: string, body: string, tag?: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/favicon.png',
        tag: tag || 'gulpash-notice'
      });
    } catch (e) {
      console.warn('[Notification] Browser notification failed:', e);
    }
  }

  // ---------------- WEB PUSH SUBSCRIPTIONS ----------------
  public async getVapidPublicKey(): Promise<string | null> {
    try {
      const res = await safeFetchJson<{ publicKey?: string }>(
        '/api/notifications/vapid-public-key',
        undefined,
        'VAPID key unavailable'
      );
      if (res.success && res.data?.publicKey) {
        return res.data.publicKey;
      }
      return null;
    } catch (err) {
      console.warn('[WebPush] Error fetching VAPID key:', err);
      return null;
    }
  }

  public async getPushSubscription(): Promise<PushSubscription | null> {
    const reg = await this.getRegistration();
    if (!reg || !('pushManager' in reg)) return null;
    try {
      return await reg.pushManager.getSubscription();
    } catch {
      return null;
    }
  }

  public async isSubscribedToPush(): Promise<boolean> {
    const sub = await this.getPushSubscription();
    return sub !== null;
  }

  public async subscribeToPush(deviceName?: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isPushSupported()) {
      return { success: false, error: 'Push notifications are not supported on this browser or platform.' };
    }

    const reg = await this.registerServiceWorker();
    if (!reg) {
      return { success: false, error: 'Could not register service worker.' };
    }

    const perm = await this.requestPermission();
    if (perm !== 'granted') {
      return { success: false, error: 'Notification permission was not granted by user.' };
    }

    const publicKey = await this.getVapidPublicKey();
    if (!publicKey) {
      return { success: false, error: 'Server VAPID public key is unavailable.' };
    }

    try {
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const applicationServerKey = urlBase64ToUint8Array(publicKey);
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
      }

      // Send to server with genuine admin token
      const token = await adminAuthService.getCurrentAccessToken();
      const res = await safeFetchJson(
        '/api/admin/push-subscriptions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            deviceName: deviceName || this.detectDeviceName()
          })
        },
        'Server rejected push registration.'
      );

      if (!res.success) {
        return { success: false, error: res.error || 'Server rejected push registration.' };
      }

      window.dispatchEvent(new CustomEvent('gulpash_push_subscription_changed'));
      return { success: true };
    } catch (err: any) {
      console.error('[WebPush] Subscription error:', err);
      return { success: false, error: err.message || 'Subscription failed.' };
    }
  }

  public async syncCurrentDeviceSubscription(): Promise<void> {
    try {
      const sub = await this.getPushSubscription();
      if (!sub) return;
      const token = await adminAuthService.getCurrentAccessToken();
      if (!token) return;

      await safeFetchJson(
        '/api/admin/push-subscriptions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            deviceName: this.detectDeviceName()
          })
        },
        'Background sync'
      );
    } catch (e) {
      console.warn('[WebPush] Automatic device sync skipped:', e);
    }
  }

  public async unsubscribeFromPush(): Promise<{ success: boolean; error?: string }> {
    try {
      const reg = await this.getRegistration();
      if (!reg) return { success: true };

      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();

        // Notify server
        const token = await adminAuthService.getCurrentAccessToken();
        if (token) {
          safeFetchJson(
            `/api/admin/push-subscriptions/${encodeURIComponent(endpoint)}`,
            {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            }
          ).catch(() => {});
        }
      }

      window.dispatchEvent(new CustomEvent('gulpash_push_subscription_changed'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unsubscribe failed.' };
    }
  }

  public async listSubscriptions(): Promise<AdminPushSubscription[]> {
    try {
      const token = await adminAuthService.getCurrentAccessToken();
      if (!token) return [];

      const res = await safeFetchJson<{ subscriptions?: AdminPushSubscription[] }>(
        '/api/admin/push-subscriptions',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        },
        'Could not list subscriptions'
      );

      if (res.success && Array.isArray(res.data?.subscriptions)) {
        return res.data.subscriptions;
      }
      return [];
    } catch {
      return [];
    }
  }

  public async toggleSubscription(id: string): Promise<boolean> {
    try {
      const token = await adminAuthService.getCurrentAccessToken();
      if (!token) return false;

      // 1. Try dynamic route
      const res = await safeFetchJson(
        `/api/admin/push-subscriptions/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (res.success) return true;

      // 2. Fallback to POST action
      const fallback = await safeFetchJson(
        '/api/admin/push-subscriptions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ action: 'toggle', id })
        }
      );

      return fallback.success;
    } catch {
      return false;
    }
  }

  public async deleteSubscription(id: string): Promise<boolean> {
    try {
      const token = await adminAuthService.getCurrentAccessToken();
      if (!token) return false;

      // 1. Try dynamic route
      const res = await safeFetchJson(
        `/api/admin/push-subscriptions/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (res.success) return true;

      // 2. Fallback to POST action
      const fallback = await safeFetchJson(
        '/api/admin/push-subscriptions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ action: 'delete', id })
        }
      );

      return fallback.success;
    } catch {
      return false;
    }
  }

  public async sendTestPush(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const token = await adminAuthService.getCurrentAccessToken();
      if (!token) {
        return { success: false, error: 'Admin session required.' };
      }

      const currentSub = await this.getPushSubscription();
      const res = await safeFetchJson<{ message?: string; error?: string }>(
        '/api/admin/push-subscriptions/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            endpoint: currentSub?.endpoint || null
          })
        },
        'Notification service is temporarily unavailable. Please retry.'
      );

      if (!res.success) {
        return {
          success: false,
          error: res.error || 'Notification service is temporarily unavailable. Please retry.'
        };
      }

      return {
        success: true,
        message: res.data?.message || 'Test push notification dispatched successfully!'
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Notification service is temporarily unavailable. Please retry.'
      };
    }
  }

  private detectDeviceName(): string {
    if (typeof window === 'undefined') return 'Admin Device';
    const ua = navigator.userAgent;
    let os = 'Device';
    if (ua.includes('iPhone')) os = 'iPhone';
    else if (ua.includes('iPad')) os = 'iPad';
    else if (ua.includes('Android')) os = 'Android Device';
    else if (ua.includes('Macintosh')) os = 'MacBook / iMac';
    else if (ua.includes('Windows')) os = 'Windows PC';
    else if (ua.includes('Linux')) os = 'Linux PC';

    let browser = 'Browser';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';

    return `${os} (${browser})`;
  }

  // ---------------- PREFERENCES ----------------
  public getPreferences(): AdminNotificationPreferences {
    try {
      const raw = localStorage.getItem(PREFERENCES_KEY);
      if (raw) {
        return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
      }
    } catch {}
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }

  public async savePreferences(prefs: AdminNotificationPreferences): Promise<void> {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
      window.dispatchEvent(new CustomEvent('gulpash_notification_prefs_changed', { detail: prefs }));

      const token = await adminAuthService.getCurrentAccessToken();
      if (token) {
        safeFetchJson('/api/admin/notifications/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(prefs)
        }).catch(() => {});
      }
    } catch {}
  }

  // ---------------- LOCAL NOTIFICATIONS STORE ----------------
  public getNotifications(): AdminNotification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return [];
  }

  public saveNotifications(list: AdminNotification[]) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 150)));
      window.dispatchEvent(new CustomEvent('gulpash_notifications_changed'));
    } catch {}
  }

  public async fetchServerNotifications(): Promise<AdminNotification[]> {
    try {
      const res = await safeFetchJson<AdminNotification[]>(
        '/api/notifications',
        undefined,
        'Could not fetch notifications'
      );
      if (res.success && Array.isArray(res.data)) {
        this.saveNotifications(res.data);
        return res.data;
      }
    } catch {}
    return this.getNotifications();
  }

  public notify(entry: {
    type: NotificationEventType;
    title: string;
    message: string;
    orderId?: string;
    orderNumber?: string;
    orderTotal?: number;
    customerName?: string;
    paymentMethod?: string;
    productId?: string;
    productTitle?: string;
    stock?: number;
  }) {
    const prefs = this.getPreferences();
    if (!prefs.masterEnabled) return;

    if (prefs.channels.sound) {
      this.playSound(prefs.soundVolume);
    }

    const current = this.getNotifications();
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isDuplicate = current.some(n => 
      n.type === entry.type && 
      ((entry.orderId && n.orderId === entry.orderId) || (entry.orderNumber && n.orderNumber === entry.orderNumber) || (entry.productId && n.productId === entry.productId)) &&
      new Date(n.timestamp).getTime() > twoMinutesAgo
    );

    if (isDuplicate) return;

    const newNotification: AdminNotification = {
      id: `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...entry,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updated = [newNotification, ...current].slice(0, 150);
    this.saveNotifications(updated);

    if (prefs.channels.popup) {
      window.dispatchEvent(new CustomEvent('gulpash_in_app_popup', { detail: newNotification }));
    }

    if (typeof window !== 'undefined') {
      safeFetchJson('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotification)
      }).catch(() => {});
    }
  }

  public markAsRead(id: string) {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.saveNotifications(list);
    if (typeof window !== 'undefined') {
      safeFetchJson(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PUT' }).catch(() => {});
    }
  }

  public markAllAsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(list);
    if (typeof window !== 'undefined') {
      safeFetchJson('/api/notifications/read-all', { method: 'PUT' }).catch(() => {});
    }
  }

  public clearAll() {
    this.saveNotifications([]);
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  // Reactive listeners
  public subscribe(listener: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('gulpash_notifications_changed', listener);
    return () => window.removeEventListener('gulpash_notifications_changed', listener);
  }

  public subscribeInAppPopup(listener: (notif: AdminNotification) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: any) => {
      if (e.detail) listener(e.detail);
    };
    window.addEventListener('gulpash_in_app_popup', handler);
    return () => window.removeEventListener('gulpash_in_app_popup', handler);
  }

  public subscribePushChanges(listener: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('gulpash_push_subscription_changed', listener);
    return () => window.removeEventListener('gulpash_push_subscription_changed', listener);
  }
}

export const NotificationService = new NotificationManager();
