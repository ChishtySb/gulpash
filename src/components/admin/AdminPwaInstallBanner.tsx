import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, ShieldCheck, X, Share } from 'lucide-react';
import { NotificationService } from '../../lib/notifications';

export const AdminPwaInstallBanner: React.FC = () => {
  const [isInstallable, setIsInstallable] = useState(NotificationService.isInstallable());
  const [isStandalone, setIsStandalone] = useState(NotificationService.isStandalone());
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setIsStandalone(NotificationService.isStandalone());
    setIsInstallable(NotificationService.isInstallable());

    const ua = typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS/.test(ua);
    setIsIosSafari(isIos && isSafari && !NotificationService.isStandalone());

    const handleInstallable = (e: any) => {
      setIsInstallable(e.detail?.installable);
      if (e.detail?.installed) {
        setIsStandalone(true);
      }
    };

    window.addEventListener('gulpash_pwa_installable', handleInstallable);
    return () => window.removeEventListener('gulpash_pwa_installable', handleInstallable);
  }, []);

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      const accepted = await NotificationService.promptInstall();
      if (accepted) {
        setIsStandalone(true);
        setIsInstallable(false);
      }
    } finally {
      setInstalling(false);
    }
  };

  if (dismissed) return null;

  // In standalone mode, show clean status indicator
  if (isStandalone) {
    return (
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-stone-900/60 border border-stone-800 rounded-full text-[11px] text-stone-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">GulPash Admin PWA</span>
        <span className="text-stone-400 font-mono text-[10px]">• Installed</span>
      </div>
    );
  }

  // If Chrome/Edge/Android provides native install prompt
  if (isInstallable) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-y sm:border sm:rounded-lg border-amber-500/30 text-amber-100 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500 text-stone-950 rounded-md shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Install GulPash Admin App</span>
            <p className="text-[11px] text-stone-300 hidden sm:block">
              Run fullscreen with instant real-time order alerts and background push notifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{installing ? 'Installing...' : 'Install App'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-stone-400 hover:text-white rounded"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari specific guide
  if (isIosSafari) {
    return (
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <Share className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Install Admin App on iOS: Tap <strong className="text-white">Share</strong> then <strong className="text-amber-300">"Add to Home Screen"</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-stone-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
};
