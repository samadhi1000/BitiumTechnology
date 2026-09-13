export interface OfferPopupConfig {
  id?: string;
  is_active: boolean;
  campaign_name: string;
  badge_text: string;
  headline: string;
  subheadline: string;
  image_url: string;
  features: string[];
  promo_code: string;
  cta_text: string;
  cta_link: string;
  countdown_end?: string;
  show_delay_seconds: number;
  show_frequency: 'once_per_session' | 'once_per_day' | 'always';
  updated_at?: string;
}

export const DEFAULT_OFFER_POPUP: OfferPopupConfig = {
  is_active: true,
  campaign_name: 'Seasonal Mega Offer 2026',
  badge_text: '🔥 SPECIAL SEASONAL OFFER',
  headline: 'UP TO 40% OFF',
  subheadline: 'Exclusive discounts on Custom DTF Gang Sheets, Screen Exposed Prints & Premium Apparel.',
  image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
  features: ['⚡ 24H Express Dispatch', '✨ 1440 DPI HD Prints', '🛡️ 100% Guaranteed'],
  promo_code: 'BITIUM40',
  cta_text: 'Claim Offer & Shop Now',
  cta_link: '/gang-sheet',
  countdown_end: '',
  show_delay_seconds: 1.2,
  show_frequency: 'once_per_session',
};

const POPUP_STORAGE_KEY = 'bitium_offer_popup_config';
const POPUP_SEEN_KEY = 'bitium_offer_popup_seen';

export function getLocalOfferPopupConfig(): OfferPopupConfig {
  if (typeof window === 'undefined') return DEFAULT_OFFER_POPUP;
  try {
    const raw = localStorage.getItem(POPUP_STORAGE_KEY);
    return raw ? { ...DEFAULT_OFFER_POPUP, ...JSON.parse(raw) } : DEFAULT_OFFER_POPUP;
  } catch {
    return DEFAULT_OFFER_POPUP;
  }
}

export function setLocalOfferPopupConfig(config: OfferPopupConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export async function fetchOfferPopupConfig(): Promise<OfferPopupConfig> {
  try {
    const res = await fetch('/api/promo-popup', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.is_active === 'boolean') {
        setLocalOfferPopupConfig(data);
        return data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch offer popup config from API:', err);
  }
  return getLocalOfferPopupConfig();
}

export async function saveOfferPopupConfig(config: OfferPopupConfig): Promise<boolean> {
  setLocalOfferPopupConfig(config);
  try {
    const res = await fetch('/api/promo-popup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save offer popup config to API:', err);
    return false;
  }
}

export function shouldDisplayPopup(config: OfferPopupConfig, isPreview = false): boolean {
  if (isPreview) return true;
  if (!config.is_active) return false;
  if (typeof window === 'undefined') return false;

  try {
    if (config.show_frequency === 'always') return true;

    if (config.show_frequency === 'once_per_session') {
      const seenSession = sessionStorage.getItem(POPUP_SEEN_KEY);
      return !seenSession;
    }

    if (config.show_frequency === 'once_per_day') {
      const seenDay = localStorage.getItem(POPUP_SEEN_KEY);
      if (!seenDay) return true;
      const seenTime = parseInt(seenDay, 10);
      const oneDayMs = 24 * 60 * 60 * 1000;
      return Date.now() - seenTime > oneDayMs;
    }
  } catch {
    return true;
  }
  return true;
}

export function markPopupAsSeen(config: OfferPopupConfig) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
    localStorage.setItem(POPUP_SEEN_KEY, Date.now().toString());
  } catch {}
}
