import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, Check, Trash2, Volume2, VolumeX, Shield, 
  ShoppingBag, CreditCard, AlertTriangle, ExternalLink, X,
  CheckCheck, Sparkles, RefreshCw
} from 'lucide-react';
import { AdminNotification, AdminNotificationSettings } from '../../types';
import { NotificationService } from '../../lib/notifications';
import { StorageService } from '../../lib/storage';

interface AdminNotificationCenterProps {
  onSelectOrder?: (orderId: string) => void;
  onNavigateTab?: (section: string, subview?: string) => void;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({
  onSelectOrder,
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(NotificationService.getNotifications());
  const [unreadCount, setUnreadCount] = useState<number>(NotificationService.getUnreadCount());
  const [settings, setSettings] = useState<AdminNotificationSettings>(StorageService.getSettings().notifications || {
    soundEnabled: true,
    browserEnabled: false,
    orderAlerts: true,
    paymentProofAlerts: true,
    lowStockAlerts: true,
    lowStockThreshold: 5,
    soundVolume: 0.8
  });
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [filter, setFilter] = useState<'all' | 'orders' | 'payments' | 'stock'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const refreshList = () => {
    setNotifications(NotificationService.getNotifications());
    setUnreadCount(NotificationService.getUnreadCount());
  };

  useEffect(() => {
    refreshList();
    const unsubscribe = NotificationService.subscribe(() => {
      refreshList();
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: next };
    setSettings(updated);
    const siteSettings = StorageService.getSettings();
    siteSettings.notifications = updated;
    StorageService.saveSettings(siteSettings);
    if (next) {
      NotificationService.playOrderChime();
    }
  };

  const handleRequestBrowserPerm = async () => {
    const granted = await NotificationService.requestBrowserPermission();
    setBrowserPerm(granted ? 'granted' : 'denied');
    const updated = { ...settings, browserEnabled: granted };
    setSettings(updated);
    const siteSettings = StorageService.getSettings();
    siteSettings.notifications = updated;
    StorageService.saveSettings(siteSettings);
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
    refreshList();
  };

  const handleClearAll = () => {
    NotificationService.clearAll();
    refreshList();
  };

  const handleNotificationClick = (item: AdminNotification) => {
    NotificationService.markAsRead(item.id);
    refreshList();

    if (item.orderId && onSelectOrder) {
      onSelectOrder(item.orderId);
      setIsOpen(false);
    } else if (item.type === 'LOW_STOCK' && onNavigateTab) {
      onNavigateTab('products', 'inventory');
      setIsOpen(false);
    } else if (item.type === 'PAYMENT_PROOF_SUBMITTED' && onNavigateTab) {
      onNavigateTab('orders', 'proof_verification');
      setIsOpen(false);
    }
  };

  const filteredNotifications = notifications.filter(item => {
    if (filter === 'orders') return item.type === 'NEW_ORDER' || item.type === 'ORDER_STATUS_CHANGED';
    if (filter === 'payments') return item.type === 'PAYMENT_PROOF_SUBMITTED';
    if (filter === 'stock') return item.type === 'LOW_STOCK';
    return true;
  });

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      return new Date(isoString).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        id="admin-notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer focus:outline-none"
        title="Admin Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleSound}
                className="p-1 text-stone-300 hover:text-white rounded hover:bg-stone-800 transition-colors"
                title={settings.soundEnabled ? 'Mute sound chimes' : 'Unmute sound chimes'}
              >
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Permission Prompt Banner */}
          {browserPerm !== 'granted' && (
            <div className="bg-amber-50 border-b border-amber-200 p-2.5 px-3 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-[11px]">Enable desktop alerts for incoming orders</span>
              </div>
              <button
                type="button"
                onClick={handleRequestBrowserPerm}
                className="text-[10px] font-bold uppercase tracking-wider bg-amber-700 text-white px-2 py-1 rounded hover:bg-amber-800 transition-colors cursor-pointer shrink-0"
              >
                Enable
              </button>
            </div>
          )}

          {/* Quick Filter Bar */}
          <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-3 py-1.5 text-xs">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('orders')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filter === 'orders' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => setFilter('payments')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filter === 'payments' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Proofs
              </button>
              <button
                type="button"
                onClick={() => setFilter('stock')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filter === 'stock' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Stock
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-stone-500 hover:text-stone-900 flex items-center gap-0.5 hover:underline"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Read all</span>
                </button>
              )}
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-1" />
                <p className="text-xs">No notifications right now</p>
                <button
                  type="button"
                  onClick={() => {
                    NotificationService.notify({
                      type: 'NEW_ORDER',
                      title: 'Test Order Chime',
                      message: 'Customer placed an order of Rs. 14,500 via JazzCash.',
                      orderNumber: 'GP-TEST'
                    });
                  }}
                  className="mt-2 text-[10px] text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Send test order alert</span>
                </button>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = !item.read;
                let Icon = ShoppingBag;
                let iconColor = 'text-stone-700 bg-stone-100';

                if (item.type === 'NEW_ORDER') {
                  Icon = ShoppingBag;
                  iconColor = 'text-emerald-700 bg-emerald-50';
                } else if (item.type === 'PAYMENT_PROOF_SUBMITTED') {
                  Icon = CreditCard;
                  iconColor = 'text-indigo-700 bg-indigo-50';
                } else if (item.type === 'LOW_STOCK') {
                  Icon = AlertTriangle;
                  iconColor = 'text-amber-700 bg-amber-50';
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                      isUnread ? 'bg-stone-50/80 hover:bg-stone-100/90' : 'bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full shrink-0 ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h5 className={`text-xs truncate ${isUnread ? 'font-bold text-stone-900' : 'font-medium text-stone-700'}`}>
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-stone-400 whitespace-nowrap">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      {item.orderNumber && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-stone-200 text-stone-800 rounded">
                            #{item.orderNumber}
                          </span>
                          {item.paymentMethod && (
                            <span className="text-[9px] text-stone-500">
                              via {item.paymentMethod}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs px-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] text-stone-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear history</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  NotificationService.playOrderChime();
                }}
                className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3 text-stone-400" />
                <span>Test chime</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
