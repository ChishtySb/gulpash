import { WhatsAppAssistanceSettings, SiteSettings } from '../types';
import { getSupabaseClient } from './supabaseClient';

export const DEFAULT_WHATSAPP_NUMBER_VISIBLE = '03006392025';
export const DEFAULT_WHATSAPP_NUMBER_DESTINATION = '923006392025';
export const DEFAULT_WHATSAPP_MESSAGE = 'Assalam o Alaikum GulPash, I am inquiring about your luxury collection on gulpash.online';
export const DEFAULT_WHATSAPP_LABEL = 'WhatsApp Assistance';

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppAssistanceSettings = {
  enabled: true,
  number: DEFAULT_WHATSAPP_NUMBER_VISIBLE,
  destinationNumber: DEFAULT_WHATSAPP_NUMBER_DESTINATION,
  displayLabel: DEFAULT_WHATSAPP_LABEL,
  defaultMessage: DEFAULT_WHATSAPP_MESSAGE,
  showFloatingButton: true,
  showInHeader: true,
  showInFooter: true,
  showOnProductPages: true,
  showInOrderAssistance: true
};

/**
 * Normalizes any Pakistani or international phone number for WhatsApp click-to-chat.
 * 
 * Rules:
 * VISIBLE: 03006392025
 * WHATSAPP DESTINATION: 923006392025
 * - Strips non-digits
 * - 03006392025 -> 923006392025
 * - Prevents accidental 9203006392025 (strips the 0 after 92)
 * - Keeps existing 923006392025 intact
 * - 3006392025 -> 923006392025
 */
export function normalizeWhatsAppDestination(rawNumber?: string | null): string {
  if (!rawNumber || typeof rawNumber !== 'string') {
    return DEFAULT_WHATSAPP_NUMBER_DESTINATION;
  }

  // Remove all non-digits
  let digits = rawNumber.replace(/\D/g, '');

  // If empty, return default
  if (!digits) return DEFAULT_WHATSAPP_NUMBER_DESTINATION;

  // Accidental leading zeros / country code prefixes
  if (digits.startsWith('0092')) {
    digits = digits.slice(2);
  }

  // Accidental 920300... (accidental 0 between 92 and 3)
  if (digits.startsWith('9203') && digits.length === 13) {
    digits = '92' + digits.slice(3);
  }

  // Pakistani standard 11 digits starting with 03 (e.g. 03006392025)
  if (digits.startsWith('03') && digits.length === 11) {
    return '92' + digits.slice(1);
  }

  // Pakistani 10 digits without leading 0 (e.g. 3006392025)
  if (digits.startsWith('3') && digits.length === 10) {
    return '92' + digits;
  }

  // Already 923... with 12 digits
  if (digits.startsWith('92') && digits.length === 12) {
    return digits;
  }

  // Generic fallback: if starts with 0 and length >= 10, replace leading 0 with 92
  if (digits.startsWith('0') && digits.length >= 10) {
    return '92' + digits.slice(1);
  }

  return digits || DEFAULT_WHATSAPP_NUMBER_DESTINATION;
}

/**
 * Formats visible customer-facing number.
 * "Do NOT display +92 format to the customer unless the existing UI specifically requires international formatting."
 * Preferred visible format: 03006392025
 */
export function formatWhatsAppVisible(rawNumber?: string | null, forceInternational = false): string {
  if (!rawNumber || typeof rawNumber !== 'string') {
    return DEFAULT_WHATSAPP_NUMBER_VISIBLE;
  }

  const dest = normalizeWhatsAppDestination(rawNumber);

  if (forceInternational) {
    if (dest.startsWith('92') && dest.length === 12) {
      return `+92 ${dest.slice(2, 5)} ${dest.slice(5)}`;
    }
    return `+${dest}`;
  }

  // Local Pakistani display format: 03006392025
  if (dest.startsWith('92') && dest.length === 12) {
    return '0' + dest.slice(2);
  }

  return rawNumber.trim();
}

/**
 * Builds a valid wa.me link with encoded optional message.
 */
export function getWhatsAppUrl(destinationNumber?: string | null, message?: string | null): string {
  const dest = normalizeWhatsAppDestination(destinationNumber);
  const msg = (message || '').trim();
  if (msg) {
    return `https://wa.me/${dest}?text=${encodeURIComponent(msg)}`;
  }
  return `https://wa.me/${dest}`;
}

/**
 * Extracts and sanitizes the WhatsAppAssistanceSettings from SiteSettings.
 */
export function resolveWhatsAppSettings(settings?: SiteSettings | null): WhatsAppAssistanceSettings {
  if (!settings) {
    return { ...DEFAULT_WHATSAPP_CONFIG };
  }

  const baseConfig = settings.whatsappAssistance || {
    enabled: true,
    number: settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER_VISIBLE,
    displayLabel: DEFAULT_WHATSAPP_LABEL,
    defaultMessage: settings.whatsappDefaultMessage || DEFAULT_WHATSAPP_MESSAGE,
    showFloatingButton: true,
    showInHeader: true,
    showInFooter: true,
    showOnProductPages: true,
    showInOrderAssistance: true
  };

  // Ensure old numbers (like 923218489999 or 03218489999) are updated
  let rawNumber = baseConfig.number;
  if (!rawNumber || rawNumber.includes('8489999')) {
    rawNumber = DEFAULT_WHATSAPP_NUMBER_VISIBLE;
  }

  const visible = formatWhatsAppVisible(rawNumber);
  const destination = normalizeWhatsAppDestination(visible);

  return {
    enabled: baseConfig.enabled !== false,
    number: visible,
    destinationNumber: destination,
    displayLabel: baseConfig.displayLabel || DEFAULT_WHATSAPP_LABEL,
    defaultMessage: baseConfig.defaultMessage || DEFAULT_WHATSAPP_MESSAGE,
    showFloatingButton: baseConfig.showFloatingButton !== false,
    showInHeader: baseConfig.showInHeader !== false,
    showInFooter: baseConfig.showInFooter !== false,
    showOnProductPages: baseConfig.showOnProductPages !== false,
    showInOrderAssistance: baseConfig.showInOrderAssistance !== false
  };
}

/**
 * Synchronizes WhatsApp settings with Supabase store settings table.
 * Follows:
 * ADMIN SETTING -> SAVE -> SUPABASE -> STOREFRONT -> WHATSAPP BUTTON/LINK
 */
export async function syncWhatsAppToSupabase(whatsappConfig: WhatsAppAssistanceSettings): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const payload = {
      setting_key: 'whatsapp_assistance',
      setting_value: {
        ...whatsappConfig,
        destinationNumber: normalizeWhatsAppDestination(whatsappConfig.number),
        updatedAt: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'setting_key' });

    if (error) {
      console.warn('Supabase site_settings upsert note:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase WhatsApp sync error:', err);
    return false;
  }
}

/**
 * Loads WhatsApp settings directly from Supabase store settings table.
 */
export async function fetchWhatsAppFromSupabase(): Promise<WhatsAppAssistanceSettings | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'whatsapp_assistance')
      .maybeSingle();

    if (error || !data || !data.setting_value) {
      return null;
    }

    const val = data.setting_value as Partial<WhatsAppAssistanceSettings>;
    return {
      enabled: val.enabled !== false,
      number: formatWhatsAppVisible(val.number || DEFAULT_WHATSAPP_NUMBER_VISIBLE),
      destinationNumber: normalizeWhatsAppDestination(val.number || val.destinationNumber || DEFAULT_WHATSAPP_NUMBER_DESTINATION),
      displayLabel: val.displayLabel || DEFAULT_WHATSAPP_LABEL,
      defaultMessage: val.defaultMessage || DEFAULT_WHATSAPP_MESSAGE,
      showFloatingButton: val.showFloatingButton !== false,
      showInHeader: val.showInHeader !== false,
      showInFooter: val.showInFooter !== false,
      showOnProductPages: val.showOnProductPages !== false,
      showInOrderAssistance: val.showInOrderAssistance !== false
    };
  } catch {
    return null;
  }
}
