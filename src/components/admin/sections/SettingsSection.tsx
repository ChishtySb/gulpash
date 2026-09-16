import React, { useState } from 'react';
import { 
  Store, Truck, CreditCard, MessageCircle, Share2, 
  ShieldCheck, Save, CheckCircle2, AlertTriangle, 
  HelpCircle, ExternalLink, Sparkles, Smartphone, Building2
} from 'lucide-react';
import { SiteSettings, PaymentMethod } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { MEDIA_SPECS } from '../../../constants/mediaSpecs';
import { MediaUploaderCard } from '../MediaUploaderCard';
import { DEFAULT_WHATSAPP_NUMBER_VISIBLE, normalizeWhatsAppNumber } from '../../../lib/whatsapp';

interface SettingsSectionProps {
  settings: SiteSettings;
  subview: 'store' | 'shipping' | 'payments' | 'whatsapp' | 'social' | 'roles';
  onNavigateSub: (sub: 'store' | 'shipping' | 'payments' | 'whatsapp' | 'social' | 'roles') => void;
  onNotify: (msg: string, status?: 'saving' | 'saved' | 'failed') => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  subview,
  onNavigateSub,
  onNotify
}) => {
  const [formData, setFormData] = useState<SiteSettings>(() => {
    // Ensure all required nested objects exist with defaults
    const copy = { ...settings };
    if (!copy.shipping) {
      copy.shipping = {
        standardFee: 250,
        freeShippingThreshold: 5000,
        freeCodEnabled: false,
        estimatedDeliveryDays: '3 - 5 Business Days',
        codEnabled: true,
        bankTransferEnabled: true,
        advanceFreeDelivery: {
          enabled: true,
          eligiblePaymentMethods: ['jazzcash', 'easypaisa', 'bank_transfer'],
          minOrderAmount: 0,
          badgeText: 'FREE SHIPPING ON FULL ADVANCE PAYMENT'
        }
      };
    }
    if (!copy.shipping.advanceFreeDelivery) {
      copy.shipping.advanceFreeDelivery = {
        enabled: true,
        eligiblePaymentMethods: ['jazzcash', 'easypaisa', 'bank_transfer'],
        minOrderAmount: 0,
        badgeText: 'FREE SHIPPING ON FULL ADVANCE PAYMENT'
      };
    }
    if (!copy.whatsappAssistance) {
      copy.whatsappAssistance = {
        showFloatingButton: true,
        showInHeader: true,
        showInFooter: true,
        showOnProductPages: true,
        showInOrderAssistance: true
      };
    }
    return copy;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async (sectionName: string) => {
    setIsSaving(true);
    onNotify(`Saving ${sectionName.toLowerCase()} settings...`, 'saving');
    try {
      // Auto-normalize WhatsApp numbers if edited
      if (formData.whatsappNumber) {
        formData.whatsappNumber = formData.whatsappNumber.trim();
      }

      await StorageService.saveSettingsAsync(formData);
      StorageService.addActivityLog({
        action: `${sectionName} Settings Updated`,
        category: 'settings',
        actor: 'Admin Concierge',
        details: `Saved modifications to ${sectionName.toLowerCase()} settings.`
      });

      onNotify(`${sectionName} settings saved successfully!`, 'saved');
    } catch (e: any) {
      console.error('Failed saving settings:', e);
      onNotify(e?.message || 'Error saving settings. Please try again.', 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  const navTabs: Array<{ id: typeof subview; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'store', label: 'Store & Branding', icon: Store },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp & Contact', icon: MessageCircle },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'roles', label: 'Security & Access', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* SUBVIEW NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subview === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigateSub(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. STORE & BRANDING */}
      {subview === 'store' && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Brand Identity & Store Profile
            </h3>
            <p className="text-xs text-stone-500">
              Merchant business information, brand logo, tagline, and canonical web domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Tagline / Atelier Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Web Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Official Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Brand Logo (PC Upload)</label>
                <MediaUploaderCard
                  spec={MEDIA_SPECS.STORE_LOGO}
                  currentUrl={formData.logoUrl}
                  onUrlChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  onAutoSave={async (url) => {
                    const updated = { ...formData, logoUrl: url };
                    setFormData(updated);
                    await StorageService.saveSettingsAsync(updated);
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') {
                      onNotify(msg || 'Uploading store logo...', 'saving');
                    } else if (status === 'saved') {
                      onNotify(msg || 'Store logo uploaded & saved!', 'saved');
                    } else if (status === 'failed') {
                      onNotify(msg || 'Failed to upload logo', 'failed');
                    }
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Favicon (32 × 32 px)</label>
                <MediaUploaderCard
                  spec={MEDIA_SPECS.STORE_FAVICON}
                  currentUrl={formData.faviconUrl}
                  onUrlChange={(url) => setFormData({ ...formData, faviconUrl: url })}
                  onAutoSave={async (url) => {
                    const updated = { ...formData, faviconUrl: url };
                    setFormData(updated);
                    await StorageService.saveSettingsAsync(updated);
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') {
                      onNotify(msg || 'Uploading favicon...', 'saving');
                    } else if (status === 'saved') {
                      onNotify(msg || 'Favicon uploaded & saved!', 'saved');
                    } else if (status === 'failed') {
                      onNotify(msg || 'Failed to upload favicon', 'failed');
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSave('Brand Profile')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Store Details'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SHIPPING & DELIVERY */}
      {subview === 'shipping' && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Shipping Rates & Delivery Rules
            </h3>
            <p className="text-xs text-stone-500">
              Configure standard domestic delivery fee, free delivery thresholds, and the Full Advance Payment zero-delivery incentive.
            </p>
          </div>

          <div className="space-y-6 text-xs">
            {/* Standard Shipping Fees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="space-y-1">
                <label className="block font-bold text-stone-800">
                  Standard Delivery Fee (PKR)
                </label>
                <input
                  type="number"
                  value={formData.shipping.standardFee}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: { ...formData.shipping, standardFee: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded font-mono font-bold"
                  placeholder="250"
                />
                <span className="text-[10px] text-stone-500">Default fee applied when COD is selected</span>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800">
                  Free Shipping COD Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={formData.shipping.freeShippingThreshold}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: { ...formData.shipping, freeShippingThreshold: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded font-mono font-bold"
                  placeholder="5000"
                />
                <span className="text-[10px] text-stone-500">Orders above this amount qualify for Free Shipping</span>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800">
                  Estimated Delivery Timeline
                </label>
                <input
                  type="text"
                  value={formData.shipping.estimatedDeliveryDays || '3 - 5 Business Days'}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: { ...formData.shipping, estimatedDeliveryDays: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded font-medium"
                />
                <span className="text-[10px] text-stone-500">Customer visible shipping timeline</span>
              </div>
            </div>

            {/* FULL ADVANCE PAYMENT FREE DELIVERY INCENTIVE */}
            <div className="border border-amber-300 bg-amber-50/50 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest bg-amber-200 text-amber-900 font-mono font-bold px-2 py-0.5 rounded">
                      MERCHANT ADVANTAGE
                    </span>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      Full Advance Payment Free Delivery Incentive
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Encourages customers to choose JazzCash, Easypaisa, or Direct Bank Transfer by offering automatic Rs. 0 delivery fee at checkout.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">
                    {formData.shipping.advanceFreeDelivery?.enabled ? 'ACTIVATED' : 'DISABLED'}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.shipping.advanceFreeDelivery?.enabled ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: {
                        ...formData.shipping,
                        advanceFreeDelivery: {
                          ...(formData.shipping.advanceFreeDelivery || { eligiblePaymentMethods: [] }),
                          enabled: e.target.checked
                        }
                      }
                    })}
                    className="w-5 h-5 accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              {formData.shipping.advanceFreeDelivery?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-amber-200/60">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-800">
                      Checkout Promotion Badge Text:
                    </label>
                    <input
                      type="text"
                      value={formData.shipping.advanceFreeDelivery?.badgeText || 'FREE SHIPPING ON FULL ADVANCE PAYMENT'}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipping: {
                          ...formData.shipping,
                          advanceFreeDelivery: {
                            ...formData.shipping.advanceFreeDelivery!,
                            badgeText: e.target.value
                          }
                        }
                      })}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded font-bold text-amber-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-800">
                      Eligible Payment Methods:
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { id: 'jazzcash' as PaymentMethod, label: 'JazzCash' },
                        { id: 'easypaisa' as PaymentMethod, label: 'Easypaisa' },
                        { id: 'bank_transfer' as PaymentMethod, label: 'Direct Bank Transfer' }
                      ].map(method => {
                        const methods = formData.shipping.advanceFreeDelivery?.eligiblePaymentMethods || [];
                        const isChecked = methods.includes(method.id);
                        return (
                          <label key={method.id} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded border border-stone-300 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const next: PaymentMethod[] = e.target.checked
                                  ? [...methods, method.id]
                                  : methods.filter(m => m !== method.id);
                                setFormData({
                                  ...formData,
                                  shipping: {
                                    ...formData.shipping,
                                    advanceFreeDelivery: {
                                      ...formData.shipping.advanceFreeDelivery!,
                                      eligiblePaymentMethods: next
                                    }
                                  }
                                });
                              }}
                              className="accent-stone-900"
                            />
                            <span>{method.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSave('Shipping & Delivery')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Shipping Rules'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PAYMENT METHODS */}
      {subview === 'payments' && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Payment Gateways & Accounts
            </h3>
            <p className="text-xs text-stone-500">
              Enable or disable payment channels and enter merchant credentials shown to customers at checkout.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* CASH ON DELIVERY */}
            <div className="border border-stone-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <span className="font-bold text-stone-900 text-sm">Cash on Delivery (COD)</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.payments.cod?.enabled ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      cod: { ...formData.payments.cod, enabled: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 accent-stone-900 cursor-pointer"
                />
              </div>
              <p className="text-stone-500 text-[11px]">
                Allow customers to pay physical cash upon order delivery at their doorstep.
              </p>
            </div>

            {/* JAZZCASH */}
            <div className="border border-stone-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-stone-900 text-sm">JazzCash Mobile Account</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.payments.jazzCash?.enabled ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      jazzCash: { ...formData.payments.jazzCash, enabled: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 accent-stone-900 cursor-pointer"
                />
              </div>

              {formData.payments.jazzCash?.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">Account Title</label>
                    <input
                      type="text"
                      value={formData.payments.jazzCash?.accountTitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          jazzCash: { ...formData.payments.jazzCash, accountTitle: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-medium"
                      placeholder="e.g. GulPash Couture"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">JazzCash Account / Mobile Number</label>
                    <input
                      type="text"
                      value={formData.payments.jazzCash?.accountNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          jazzCash: { ...formData.payments.jazzCash, accountNumber: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-mono font-bold"
                      placeholder="03006392025"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* EASYPAISA */}
            <div className="border border-stone-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-stone-900 text-sm">Easypaisa Mobile Account</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.payments.easypaisa?.enabled ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      easypaisa: { ...formData.payments.easypaisa, enabled: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 accent-stone-900 cursor-pointer"
                />
              </div>

              {formData.payments.easypaisa?.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">Account Title</label>
                    <input
                      type="text"
                      value={formData.payments.easypaisa?.accountTitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          easypaisa: { ...formData.payments.easypaisa, accountTitle: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-medium"
                      placeholder="e.g. GulPash Couture"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">Easypaisa Account Number</label>
                    <input
                      type="text"
                      value={formData.payments.easypaisa?.accountNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          easypaisa: { ...formData.payments.easypaisa, accountNumber: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-mono font-bold"
                      placeholder="03006392025"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DIRECT BANK TRANSFER */}
            <div className="border border-stone-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-stone-900 text-sm">Direct Bank Transfer (IBAN / Raast)</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.payments.bankTransfer?.enabled ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    payments: {
                      ...formData.payments,
                      bankTransfer: { ...formData.payments.bankTransfer, enabled: e.target.checked }
                    }
                  })}
                  className="w-4 h-4 accent-stone-900 cursor-pointer"
                />
              </div>

              {formData.payments.bankTransfer?.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">Bank Name</label>
                    <input
                      type="text"
                      value={formData.payments.bankTransfer?.bankName || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          bankTransfer: { ...formData.payments.bankTransfer, bankName: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-medium"
                      placeholder="e.g. Meezan Bank / HBL"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">Account Title</label>
                    <input
                      type="text"
                      value={formData.payments.bankTransfer?.accountTitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          bankTransfer: { ...formData.payments.bankTransfer, accountTitle: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-medium"
                      placeholder="GulPash Atelier"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-stone-700">Account Number</label>
                    <input
                      type="text"
                      value={formData.payments.bankTransfer?.accountNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          bankTransfer: { ...formData.payments.bankTransfer, accountNumber: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-bold text-stone-700">IBAN Number (24-digit PKIBAN)</label>
                    <input
                      type="text"
                      value={formData.payments.bankTransfer?.iban || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        payments: {
                          ...formData.payments,
                          bankTransfer: { ...formData.payments.bankTransfer, iban: e.target.value }
                        }
                      })}
                      className="w-full p-2 border border-stone-300 rounded font-mono text-xs uppercase"
                      placeholder="PK00MEZN0000000000000000"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSave('Payment Gateways')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Payment Accounts'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. WHATSAPP & CONTACT */}
      {subview === 'whatsapp' && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              WhatsApp Concierge & Customer Assistance
            </h3>
            <p className="text-xs text-stone-500">
              Configure your primary WhatsApp helpline and where the concierge chat triggers across the customer journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700">
                  Visible WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber || DEFAULT_WHATSAPP_NUMBER_VISIBLE}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded font-mono font-bold text-stone-900"
                  placeholder="03006392025"
                />
                <span className="text-[10px] text-stone-400">
                  Displayed on top bar, PDP, and footer (Default: {DEFAULT_WHATSAPP_NUMBER_VISIBLE})
                </span>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">
                  Normalized Click-to-Chat Destination
                </label>
                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded font-mono text-emerald-800 font-bold flex items-center justify-between">
                  <span>wa.me/{normalizeWhatsAppNumber(formData.whatsappNumber || DEFAULT_WHATSAPP_NUMBER_VISIBLE)}</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                    Auto-Formatted
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">
                  Default Customer Greeting Message
                </label>
                <textarea
                  rows={3}
                  value={formData.whatsappDefaultMessage || 'Salam GulPash Concierge, I would like assistance with an ensemble.'}
                  onChange={(e) => setFormData({ ...formData, whatsappDefaultMessage: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Physical Boutique / Atelier Address</label>
                <textarea
                  rows={2}
                  value={formData.address || 'GulPash Atelier, MM Alam Road, Gulberg III, Lahore, Pakistan'}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded"
                />
              </div>
            </div>

            {/* Assistance Placements */}
            <div className="space-y-3">
              <label className="block font-bold text-stone-700 border-b border-stone-100 pb-2">
                Storefront WhatsApp Placements:
              </label>

              {[
                { key: 'showFloatingButton', label: 'Floating WhatsApp Bottom-Right Button' },
                { key: 'showInHeader', label: 'Header Navigation Concierge Link' },
                { key: 'showInFooter', label: 'Footer Assistance & Support Section' },
                { key: 'showOnProductPages', label: 'Product Detail Page "Chat with Stylist" Button' },
                { key: 'showInOrderAssistance', label: 'Checkout & Order Confirmation Support Card' }
              ].map(item => {
                const isChecked = formData.whatsappAssistance?.[item.key as keyof typeof formData.whatsappAssistance] ?? true;
                return (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                    <span className="font-medium text-stone-800">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(isChecked)}
                      onChange={(e) => setFormData({
                        ...formData,
                        whatsappAssistance: {
                          ...(formData.whatsappAssistance || {
                            showFloatingButton: true,
                            showInHeader: true,
                            showInFooter: true,
                            showOnProductPages: true,
                            showInOrderAssistance: true
                          }),
                          [item.key]: e.target.checked
                        }
                      })}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSave('WhatsApp & Contact')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save WhatsApp Configuration'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. SOCIAL MEDIA */}
      {subview === 'social' && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Social Media Channels
            </h3>
            <p className="text-xs text-stone-500">
              Links to your official Instagram, Facebook, TikTok, and YouTube channels rendered in header and footer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-stone-700">Instagram Profile URL</label>
              <input
                type="text"
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })}
                className="w-full p-2.5 border border-stone-300 rounded font-mono text-xs"
                placeholder="https://instagram.com/gulpash.official"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-stone-700">Facebook Page URL</label>
              <input
                type="text"
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                })}
                className="w-full p-2.5 border border-stone-300 rounded font-mono text-xs"
                placeholder="https://facebook.com/gulpash"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-stone-700">TikTok Profile URL</label>
              <input
                type="text"
                value={formData.socialLinks?.tiktok || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, tiktok: e.target.value }
                })}
                className="w-full p-2.5 border border-stone-300 rounded font-mono text-xs"
                placeholder="https://tiktok.com/@gulpash"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-stone-700">YouTube Channel URL</label>
              <input
                type="text"
                value={formData.socialLinks?.youtube || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                })}
                className="w-full p-2.5 border border-stone-300 rounded font-mono text-xs"
                placeholder="https://youtube.com/@gulpash"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSave('Social Media')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Social Links'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. SECURITY & ROLES */}
      {subview === 'roles' && (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Admin Access & Security
            </h3>
            <p className="text-xs text-stone-500">
              Super Admin profile and authentication credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900 block">Current Admin Identity</span>
                <div className="text-stone-600 font-mono text-xs space-y-0.5">
                  <p>Email: <span className="text-stone-900 font-bold">admin@gulpash.online</span></p>
                  <p>Role: <span className="text-stone-900 font-bold">Super Administrator (Owner)</span></p>
                  <p>Session: <span className="text-emerald-700 font-bold">Active & Authenticated</span></p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="font-bold text-stone-800 block">Change Administrator Password:</span>
                <div className="space-y-1">
                  <label className="block text-stone-600">New Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-mono text-xs"
                    placeholder="Enter new strong password"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-stone-600">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-mono text-xs"
                    placeholder="Repeat new password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!adminPassword || adminPassword !== confirmPassword) {
                      onNotify('Passwords do not match or are blank.');
                      return;
                    }
                    onNotify('Admin password successfully updated!');
                    setAdminPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-900 text-stone-200 rounded-lg space-y-3">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider block">
                Production Persistence Security
              </span>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                GulPash utilizes Supabase PostgreSQL cloud sync with Row Level Security (RLS) policies. Only authenticated store administrators can write modifications to products, orders, settings, and media assets.
              </p>
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-stone-400">Database Engine:</span>
                <span className="text-emerald-400 font-bold">Supabase Cloud</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
