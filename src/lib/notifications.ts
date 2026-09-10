import { AdminNotification, NotificationEventType, SiteSettings } from '../types';
import { StorageService } from './storage';

const NOTIFICATIONS_KEY = 'gulpash_admin_notifications_v1';

// Web Audio API synthesized luxury chime
class ChimePlayer {
  private audioCtx: AudioContext | null = null;

  play() {
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
      masterGain.gain.setValueAtTime(0.2, now);

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
      console.warn('Audio chime playback omitted or unsupported in this context:', e);
    }
  }
}

const chime = new ChimePlayer();

export const NotificationService = {
  // Subscription listener for reactive UI
  subscribe(listener: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('gulpash_notifications_changed', listener);
    return () => window.removeEventListener('gulpash_notifications_changed', listener);
  },

  // Sound playback
  playSound() {
    chime.play();
  },

  playOrderChime() {
    chime.play();
  },

  // Browser desktop notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  },

  async requestBrowserPermission(): Promise<boolean> {
    const perm = await this.requestPermission();
    return perm === 'granted';
  },

  getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  },

  // Show native browser desktop notification
  showBrowserNotification(title: string, body: string, tag?: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: tag || 'gulpash-notice'
      });
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  },

  // Get notifications
  getNotifications(): AdminNotification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return [];
  },

  // Save notifications
  saveNotifications(list: AdminNotification[]) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 100)));
      window.dispatchEvent(new CustomEvent('gulpash_notifications_changed'));
    } catch {}
  },

  // Dispatch new notification with deduplication
  notify(entry: {
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
    const settings = StorageService.getSettings();
    const notifConfig = settings.notifications;

    // Check if sound enabled
    if (notifConfig?.soundEnabled !== false) {
      this.playSound();
    }

    // Check if browser notifications enabled
    if (notifConfig?.browserNotificationsEnabled !== false) {
      this.showBrowserNotification(entry.title, entry.message, entry.orderNumber || entry.type);
    }

    const current = this.getNotifications();
    
    // Deduplicate: Don't add identical notification within 2 minutes for the same order/product and event
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

    const updated = [newNotification, ...current];
    this.saveNotifications(updated);

    // Also persist to server endpoint asynchronously if online
    if (typeof fetch !== 'undefined') {
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotification)
      }).catch(() => {});
    }
  },

  markAsRead(id: string) {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.saveNotifications(list);
    if (typeof fetch !== 'undefined') {
      fetch(`/api/notifications/${id}/read`, { method: 'PUT' }).catch(() => {});
    }
  },

  markAllAsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(list);
    if (typeof fetch !== 'undefined') {
      fetch('/api/notifications/read-all', { method: 'PUT' }).catch(() => {});
    }
  },

  clearAll() {
    this.saveNotifications([]);
  },

  getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }
};
