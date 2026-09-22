import React, { useState, useEffect } from 'react';
import { 
  Bell, Smartphone, Volume2, VolumeX, Radio, Check, 
  Trash2, Send, ShieldCheck, AlertTriangle, ShoppingBag, 
  CreditCard, ExternalLink, RefreshCw, Layers, CheckCircle2,
  Sliders, Laptop, Info, Flame
} from 'lucide-react';
import { 
  AdminNotification, 
  AdminNotificationPreferences, 
  AdminPushSubscription, 
  Order 
} from '../../../types';
import { NotificationService, DEFAULT_NOTIFICATION_PREFS } from '../../../lib/notifications';

interface NotificationsSectionProps {
  orders: Order[];
  subview?: 'channels' | 'devices' | 'history';
  onNavigateSub?: (sub: 'channels' | 'devices' | 'history') => void;
  onSelectOrder?: (order: Order) => void;
  onNotify: (msg: string, status?: 'saving' | 'saved' | 'failed') => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  orders,
  subview = 'channels',
  onNavigateSub,
  onSelectOrder,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'devices' | 'history'>(subview);
  const [preferences, setPreferences] = useState<AdminNotificationPreferences>(() => NotificationService.getPreferences());
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => NotificationService.getNotifications());
  const [devices, setDevices] = useState<AdminPushSubscription[]>([]);
  const [isCurrentDeviceSubscribed, setIsCurrentDeviceSubscribed] = useState<boolean>(false);
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>(NotificationService.getPermissionStatus());
  const [isPushSupported, setIsPushSupported] = useState<boolean>(NotificationService.isPushSupported());
  const [isStandalone, setIsStandalone] = useState<boolean>(NotificationService.isStandalone());
  const [isTestingPush, setIsTestingPush] = useState<boolean>(false);
  const [isTogglingDevice, setIsTogglingDevice] = useState<string | null>(null);
  const [filterHistory, setFilterHistory] = useState<'all' | 'orders' | 'payments' | 'stock'>('all');
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  // Sync subview from props if provided
  useEffect(() => {
    if (subview && subview !== activeTab) {
      setActiveTab(subview);
    }
  }, [subview]);

  // Load subscriptions and status
  const refreshStatus = async () => {
    setIsPushSupported(NotificationService.isPushSupported());
    setIsStandalone(NotificationService.isStandalone());
    setBrowserPerm(NotificationService.getPermissionStatus());

    const isSub = await NotificationService.isSubscribedToPush();
    setIsCurrentDeviceSubscribed(isSub);

    setIsLoadingDevices(true);
    try {
      let list = await NotificationService.listSubscriptions();
      if (isSub && list.length === 0) {
        await NotificationService.syncCurrentDeviceSubscription();
        list = await NotificationService.listSubscriptions();
      }
      setDevices(list);
    } catch {
      // ignore
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    refreshStatus();
    NotificationService.fetchServerNotifications().then(list => {
      if (list && list.length > 0) setNotifications(list);
    });

    const unsubNotifs = NotificationService.subscribe(() => {
      setNotifications(NotificationService.getNotifications());
    });

    const unsubPush = NotificationService.subscribePushChanges(() => {
      refreshStatus();
    });

    return () => {
      unsubNotifs();
      unsubPush();
    };
  }, []);

  const handleTabChange = (tab: 'channels' | 'devices' | 'history') => {
    setActiveTab(tab);
    if (onNavigateSub) onNavigateSub(tab);
  };

  const handleSavePreferences = async (updated: AdminNotificationPreferences) => {
    setPreferences(updated);
    await NotificationService.savePreferences(updated);
    onNotify('Notification preferences updated.', 'saved');
  };

  const handleToggleCurrentDevicePush = async () => {
    if (isCurrentDeviceSubscribed) {
      onNotify('Disabling push for this device...', 'saving');
      const res = await NotificationService.unsubscribeFromPush();
      if (res.success) {
        setIsCurrentDeviceSubscribed(false);
        await refreshStatus();
        onNotify('Push notifications disabled on this device.', 'saved');
      } else {
        onNotify(res.error || 'Failed to unsubscribe.', 'failed');
      }
    } else {
      onNotify('Enabling push notifications...', 'saving');
      const res = await NotificationService.subscribeToPush();
      if (res.success) {
        setIsCurrentDeviceSubscribed(true);
        setBrowserPerm(NotificationService.getPermissionStatus());
        await refreshStatus();
        onNotify('Web Push enabled! You will now receive background alerts.', 'saved');
      } else {
        setBrowserPerm(NotificationService.getPermissionStatus());
        onNotify(res.error || 'Failed to enable push notifications.', 'failed');
      }
    }
  };

  const handleSendTestPush = async () => {
    setIsTestingPush(true);
    onNotify('Sending test push notification...', 'saving');
    try {
      const res = await NotificationService.sendTestPush();
      if (res.success) {
        onNotify(res.message || 'Test push dispatched successfully!', 'saved');
      } else {
        onNotify(res.error || 'Failed to send test push.', 'failed');
      }
    } catch (e: any) {
      onNotify(e.message || 'Error triggering test push.', 'failed');
    } finally {
      setIsTestingPush(false);
    }
  };

  const handleTestChime = () => {
    NotificationService.playSound(preferences.soundVolume);
    onNotify('Played luxury chime tone.', 'saved');
  };

  const handleToggleDevice = async (id: string) => {
    setIsTogglingDevice(id);
    try {
      const ok = await NotificationService.toggleSubscription(id);
      if (ok) {
        await refreshStatus();
        onNotify('Device status updated.', 'saved');
      } else {
        onNotify('Could not update device.', 'failed');
      }
    } finally {
      setIsTogglingDevice(null);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!confirm('Are you sure you want to remove this push subscription?')) return;
    try {
      const ok = await NotificationService.deleteSubscription(id);
      if (ok) {
        await refreshStatus();
        onNotify('Push device removed.', 'saved');
      }
    } catch {
      onNotify('Failed to delete device.', 'failed');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterHistory === 'orders') return n.type === 'NEW_ORDER' || n.type === 'ORDER_STATUS_CHANGED';
    if (filterHistory === 'payments') return n.type.includes('PAYMENT');
    if (filterHistory === 'stock') return n.type === 'LOW_STOCK';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-400/20 text-amber-400 rounded-md">
                <Bell className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Admin Notification System & Web Push
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-1.5 max-w-2xl leading-relaxed">
              Real-time in-app alerts, synthesized luxury chimes, and background mobile Web Push notifications for new orders and advance payments.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={handleTestChime}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-stone-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Chime</span>
            </button>

            <button
              type="button"
              onClick={handleSendTestPush}
              disabled={isTestingPush}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingPush ? 'Dispatching...' : 'Test Web Push'}</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 bg-white px-4 rounded-t-xl gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleTabChange('channels')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'channels'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Alert Channels & Triggers</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('devices')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'devices'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Registered Push Devices</span>
          {devices.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-stone-100 text-stone-700 text-[10px] rounded-full font-mono font-semibold">
              {devices.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('history')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Notification History</span>
          {notifications.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-stone-100 text-stone-700 text-[10px] rounded-full font-mono font-semibold">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CHANNELS & PREFERENCES */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          {/* Current Device Push Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-stone-800" />
                  <h3 className="text-sm font-bold text-stone-900">
                    This Device Web Push Status
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Enable background push notifications on this specific browser / PWA installation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  isCurrentDeviceSubscribed 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isCurrentDeviceSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  {isCurrentDeviceSubscribed ? 'Push Active' : 'Not Subscribed'}
                </span>

                <button
                  type="button"
                  id="toggle-device-push-btn"
                  onClick={handleToggleCurrentDevicePush}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs ${
                    isCurrentDeviceSubscribed
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {isCurrentDeviceSubscribed ? 'Disable on this Device' : 'Enable Push on this Device'}
                </button>
              </div>
            </div>

            {/* Diagnostic pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                  Browser Permission
                </span>
                <span className="font-semibold text-stone-800 mt-0.5 block capitalize">
                  {browserPerm}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                  Web Push API
                </span>
                <span className="font-semibold text-stone-800 mt-0.5 block">
                  {isPushSupported ? 'Supported & Ready' : 'Unsupported on this browser'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                  PWA Mode
                </span>
                <span className="font-semibold text-stone-800 mt-0.5 block">
                  {isStandalone ? 'Installed Standalone App' : 'Browser Window'}
                </span>
              </div>
            </div>
          </div>

          {/* Master & Delivery Channels */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Notification Delivery Channels
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select which notification surfaces you wish to trigger when events occur.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.masterEnabled}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    masterEnabled: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-xs font-bold text-stone-800">
                  {preferences.masterEnabled ? 'Master Enabled' : 'Muted'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Channel: In-App Bell */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-800">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">In-App Notification Bell</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Shows unread order count badge and history dropdown in Admin navigation.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.channels.inApp}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    channels: { ...preferences.channels, inApp: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer mt-1"
                />
              </div>

              {/* Channel: In-App Toast Popup */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-800">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Interactive Toast Popup</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Instant banner slides in with customer details, PKR total, and direct [View Order] button.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.channels.popup}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    channels: { ...preferences.channels, popup: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer mt-1"
                />
              </div>

              {/* Channel: Audio Chime */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-800">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Synthesized Luxury Chime</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        High-frequency dual sine harmonic alert for orders when admin is open.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.channels.sound}
                    onChange={(e) => handleSavePreferences({
                      ...preferences,
                      channels: { ...preferences.channels, sound: e.target.checked }
                    })}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer mt-1"
                  />
                </div>

                {/* Chime Volume Slider */}
                {preferences.channels.sound && (
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-4 text-xs text-stone-600">
                    <span className="text-[11px]">Volume ({Math.round(preferences.soundVolume * 100)}%)</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={preferences.soundVolume}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        soundVolume: parseFloat(e.target.value)
                      })}
                      onMouseUp={() => handleSavePreferences(preferences)}
                      onTouchEnd={() => handleSavePreferences(preferences)}
                      className="w-32 accent-amber-600"
                    />
                  </div>
                )}
              </div>

              {/* Channel: Background Push */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-800">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Background Web Push</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Standard W3C push alerts to registered mobile and desktop devices even when browser is closed.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.channels.push}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    channels: { ...preferences.channels, push: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer mt-1"
                />
              </div>
            </div>
          </div>

          {/* Event Triggers Matrix */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Notification Event Triggers
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Toggle which storefront events trigger notifications across the active channels.
              </p>
            </div>

            <div className="divide-y divide-stone-100">
              {/* Event: New Order */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-amber-100 text-amber-900 rounded">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      New Order Placed (Highest Priority)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Fires immediately when a customer completes checkout.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.events.newOrder}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    events: { ...preferences.events, newOrder: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Event: New Payment Proof */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-emerald-100 text-emerald-900 rounded">
                    <CreditCard className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      New Payment Proof Uploaded
                    </span>
                    <span className="text-[11px] text-stone-500">
                      When a customer uploads receipt screenshot for JazzCash, Easypaisa, or Bank Transfer.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.events.newPaymentProof}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    events: { ...preferences.events, newPaymentProof: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Event: Payment Proof Resubmitted */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-blue-100 text-blue-900 rounded">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Payment Proof Resubmitted
                    </span>
                    <span className="text-[11px] text-stone-500">
                      When customer uploads a corrected screenshot after rejection.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.events.paymentResubmitted}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    events: { ...preferences.events, paymentResubmitted: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Event: Payment Verified */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-emerald-100 text-emerald-900 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Payment Verified / Approved
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Confirmation that payment was successfully credited and marked approved.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.events.paymentVerified}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    events: { ...preferences.events, paymentVerified: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Event: Ready to Dispatch */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-stone-100 text-stone-900 rounded">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Order Ready to Dispatch
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Alerts fulfillment team when an order is verified and packed.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.events.readyToDispatch}
                  onChange={(e) => handleSavePreferences({
                    ...preferences,
                    events: { ...preferences.events, readyToDispatch: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {/* Event: Low Stock Alert */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-amber-100 text-amber-900 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Low Stock Threshold Alert
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Warns when a product stock count drops to {preferences.lowStockThreshold} units or below.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={preferences.lowStockThreshold}
                    onChange={(e) => handleSavePreferences({
                      ...preferences,
                      lowStockThreshold: parseInt(e.target.value, 10) || 3
                    })}
                    className="w-16 px-2 py-1 text-xs border border-stone-200 rounded text-center"
                    title="Units threshold"
                  />
                  <input
                    type="checkbox"
                    checked={preferences.events.lowStock}
                    onChange={(e) => handleSavePreferences({
                      ...preferences,
                      events: { ...preferences.events, lowStock: e.target.checked }
                    })}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED PUSH DEVICES */}
      {activeTab === 'devices' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Registered Administrator Push Devices ({devices.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Every mobile device, tablet, and desktop registered with standard VAPID push subscriptions.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshStatus}
              disabled={isLoadingDevices}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDevices ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {devices.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              <Smartphone className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="font-semibold text-stone-700">No push devices registered yet</p>
              <p className="text-stone-400 mt-1 max-w-sm mx-auto">
                Click "Enable Push on this Device" in the Alert Channels tab to receive real background push alerts.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {devices.map((device) => (
                <div key={device.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-stone-100 text-stone-700 rounded-lg shrink-0 mt-0.5">
                      {device.device_name?.includes('Phone') || device.device_name?.includes('Android') || device.device_name?.includes('iPhone') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-900">
                          {device.device_name || 'Admin Device'}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          device.enabled 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          {device.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-mono mt-0.5 truncate max-w-md">
                        {device.endpoint}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1">
                        <span>Registered: {new Date(device.created_at).toLocaleDateString()}</span>
                        {device.last_success_at && (
                          <span>Last Alert: {new Date(device.last_success_at).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={isTogglingDevice === device.id}
                      onClick={() => handleToggleDevice(device.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                        device.enabled
                          ? 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {device.enabled ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDevice(device.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOTIFICATION HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Notification History & Audit Log
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Full chronological log of dispatched events with direct links to orders.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-100 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterHistory('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterHistory === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterHistory('orders')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterHistory === 'orders' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Orders
                </button>
                <button
                  type="button"
                  onClick={() => setFilterHistory('payments')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterHistory === 'payments' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Payments
                </button>
                <button
                  type="button"
                  onClick={() => setFilterHistory('stock')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    filterHistory === 'stock' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Stock
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  NotificationService.markAllAsRead();
                  setNotifications(NotificationService.getNotifications());
                  onNotify('All notifications marked as read.', 'saved');
                }}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Mark All Read
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear notification history?')) {
                    NotificationService.clearAll();
                    setNotifications([]);
                    onNotify('History cleared.', 'saved');
                  }
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              <Bell className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p>No notifications match the selected filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredNotifications.map((n) => {
                const isNewOrder = n.type === 'NEW_ORDER';
                return (
                  <div key={n.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.read ? 'bg-stone-300' : isNewOrder ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                      }`} />

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-stone-900">
                            {n.title}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-mono uppercase">
                            {n.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1 font-mono">
                          <span>{new Date(n.timestamp).toLocaleString('en-PK')}</span>
                          {n.customerName && <span>Customer: {n.customerName}</span>}
                          {n.orderTotal && <span>PKR {n.orderTotal.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>

                    {n.orderId && (
                      <button
                        type="button"
                        onClick={() => {
                          NotificationService.markAsRead(n.id);
                          const found = orders.find(o => o.id === n.orderId);
                          if (found && onSelectOrder) {
                            onSelectOrder(found);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs text-amber-800 font-bold hover:underline shrink-0 px-2.5 py-1 rounded bg-amber-50 border border-amber-200/60"
                      >
                        <span>Open Order</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
