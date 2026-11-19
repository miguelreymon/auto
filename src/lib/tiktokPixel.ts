/**
 * Client-side helper for TikTok Pixel tracking (ID: DBVM5J3C77UFHI4PO7IG)
 */

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, any>) => void;
      identify: (params: Record<string, any>) => void;
    };
  }
}

let lastContactTimestamp = 0;

/**
 * Track PageView on SPA route changes (initial load is handled by index.html base script)
 */
export function trackTikTokPageView(path?: string): void {
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.page === 'function') {
    try {
      window.ttq.page();
      console.debug('[TikTok Pixel] PageView recorded', path || window.location.pathname);
    } catch (e) {
      console.debug('[TikTok Pixel] Failed to fire PageView', e);
    }
  }
}

/**
 * Track WhatsApp / Lead contact conversions on TikTok Pixel with deduplication guard
 */
export function trackTikTokContact(details?: {
  contentName?: string;
  value?: number;
  currency?: string;
}): void {
  if (typeof window === 'undefined' || !window.ttq || typeof window.ttq.track !== 'function') {
    return;
  }

  const now = Date.now();
  if (now - lastContactTimestamp < 1500) {
    return;
  }
  lastContactTimestamp = now;

  try {
    const params: Record<string, any> = {
      content_name: details?.contentName || 'AutoPubli24 WhatsApp',
      content_type: 'product',
    };
    if (typeof details?.value === 'number' && details.value > 0) {
      params.value = details.value;
      params.currency = details.currency || 'EUR';
    }
    window.ttq.track('Contact', params);
    console.debug('[TikTok Pixel] Contact event recorded:', params);
  } catch (e) {
    console.debug('[TikTok Pixel] Failed to fire Contact event', e);
  }
}
