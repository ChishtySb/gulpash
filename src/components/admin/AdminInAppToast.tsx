import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, AlertTriangle, CheckCircle2, X, ExternalLink, Volume2, Sparkles } from 'lucide-react';
import { AdminNotification } from '../../types';
import { NotificationService } from '../../lib/notifications';

interface AdminInAppToastProps {
  onSelectOrder?: (orderId: string) => void;
  onNavigateTab?: (section: string, subview?: string) => void;
}

export const AdminInAppToast: React.FC<AdminInAppToastProps> = ({
  onSelectOrder,
  onNavigateTab
}) => {
  const [currentToast, setCurrentToast] = useState<AdminNotification | null>(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const unsubscribe = NotificationService.subscribeInAppPopup((notif) => {
      setCurrentToast(notif);
      setProgress(100);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentToast) return;

    const duration = 8000; // 8 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setCurrentToast(null);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentToast]);

  if (!currentToast) return null;

  const handleAction = () => {
    if (currentToast.orderId && onSelectOrder) {
      onSelectOrder(currentToast.orderId);
    } else if (currentToast.type === 'LOW_STOCK' && onNavigateTab) {
      onNavigateTab('catalog', 'inventory');
    } else if (onNavigateTab) {
      onNavigateTab('orders', 'all');
    }
    setCurrentToast(null);
  };

  const getTypeStyles = () => {
    switch (currentToast.type) {
      case 'NEW_ORDER':
        return {
          badge: 'bg-amber-400 text-stone-950 font-extrabold',
          icon: ShoppingBag,
          accent: 'border-amber-400'
        };
      case 'NEW_PAYMENT_PROOF':
      case 'PAYMENT_PROOF_SUBMITTED':
      case 'PAYMENT_PROOF_RESUBMITTED':
        return {
          badge: 'bg-emerald-500 text-white font-bold',
          icon: CreditCard,
          accent: 'border-emerald-500'
        };
      case 'PAYMENT_VERIFIED':
        return {
          badge: 'bg-emerald-600 text-white font-bold',
          icon: CheckCircle2,
          accent: 'border-emerald-600'
        };
      case 'PAYMENT_ACTION_REQUIRED':
        return {
          badge: 'bg-rose-500 text-white font-bold',
          icon: AlertTriangle,
          accent: 'border-rose-500'
        };
      case 'LOW_STOCK':
        return {
          badge: 'bg-amber-500 text-black font-bold',
          icon: AlertTriangle,
          accent: 'border-amber-500'
        };
      default:
        return {
          badge: 'bg-stone-700 text-white font-bold',
          icon: Sparkles,
          accent: 'border-stone-400'
        };
    }
  };

  const style = getTypeStyles();
  const Icon = style.icon;

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="fixed top-4 right-4 z-[99999] max-w-md w-[calc(100vw-2rem)] sm:w-96 shadow-2xl rounded-xl border border-stone-800 bg-stone-950 text-white overflow-hidden animate-in slide-in-from-top-4 duration-300 backdrop-blur-md"
    >
      {/* Progress Bar */}
      <div 
        className="h-1 bg-amber-400 transition-all ease-linear" 
        style={{ width: `${progress}%` }} 
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${style.badge}`}>
              {currentToast.type.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              Just now
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentToast(null)}
            className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-3 mt-3">
          <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 shrink-0 text-amber-400">
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white tracking-tight truncate">
              {currentToast.title}
            </h4>
            <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
              {currentToast.message}
            </p>

            {currentToast.orderTotal && (
              <div className="mt-2 text-xs font-semibold text-amber-300 font-mono">
                Total: PKR {currentToast.orderTotal.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-stone-800/80 pt-3">
          <button
            type="button"
            onClick={() => setCurrentToast(null)}
            className="px-3 py-1.5 text-xs text-stone-400 hover:text-white rounded hover:bg-stone-900 transition-colors cursor-pointer"
          >
            Dismiss
          </button>

          <button
            type="button"
            id="toast-view-order-btn"
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <span>{currentToast.orderId ? 'View Order' : 'Review'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
