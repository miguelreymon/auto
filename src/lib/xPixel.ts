/**
 * Client-side helper for X (Twitter) Pixel tracking and Conversion API bridging
 */

declare global {
  interface Window {
    twq?: (...args: any[]) => void;
    X_EVENT_PURCHASE?: string;
  }
}

const TWCLID_KEY = 'autopubli_x_twclid';

/**
 * Capture twclid from current URL parameter on landing
 */
export function initTwclidCapture(): void {
  if (typeof window === 'undefined') return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const twclid = urlParams.get('twclid');
    if (twclid) {
      sessionStorage.setItem(TWCLID_KEY, twclid);
      localStorage.setItem(TWCLID_KEY, twclid);
    }
  } catch (err) {
    console.debug('Failed to store twclid', err);
  }
}

/**
 * Retrieve captured twclid from storage
 */
export function getStoredTwclid(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return sessionStorage.getItem(TWCLID_KEY) || localStorage.getItem(TWCLID_KEY) || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Track PageView for SPA navigations
 */
export function trackXPageView(path?: string): void {
  if (typeof window !== 'undefined' && typeof window.twq === 'function') {
    try {
      window.twq('event', 'PageView');
      console.debug('[X Pixel] PageView recorded', path || window.location.pathname);
    } catch (e) {
      console.debug('[X Pixel] Failed to fire PageView', e);
    }
  }
}

/**
 * Fire an event on the browser web pixel
 */
export function trackXWebEvent(
  eventId: string,
  conversionId?: string,
  extraParams?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && typeof window.twq === 'function') {
    const params: Record<string, any> = { ...extraParams };
    if (conversionId) {
      params.conversion_id = conversionId;
    }
    try {
      window.twq('event', eventId, params);
      console.debug('[X Pixel] Web event recorded:', eventId, params);
    } catch (e) {
      console.debug('[X Pixel] Error triggering event', e);
    }
  }
}

/**
 * Dispatch a conversion event to our server endpoint to be forwarded
 * to the X Conversion API with full deduplication and identifier hashing.
 */
export async function trackXServerConversion(options: {
  eventId: string;
  conversionId?: string;
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
}): Promise<boolean> {
  try {
    const twclid = getStoredTwclid();
    const res = await fetch('/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: options.eventId,
        conversionId: options.conversionId,
        email: options.email,
        phone: options.phone,
        twclid,
        eventSourceUrl: options.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : ''),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[X Conversion] Client failed to notify backend:', err);
    return false;
  }
}

/**
 * Main function to record a "Comprar" conversion when a user opens a WhatsApp conversation
 * for ad activation, payment, or franchise purchase.
 */
export function trackXWhatsAppPurchase(details?: {
  phone?: string;
  planOrCity?: string;
  value?: number;
  conversionId?: string;
}): string {
  const conversionId = details?.conversionId || `wa-order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const value = details?.value ?? 25;

  // 1. Disparar evento de Compra estándar en el píxel de X (navegador)
  trackXWebEvent('Purchase', conversionId, {
    value,
    currency: 'EUR',
    num_items: 1,
    content_name: details?.planOrCity || 'AutoPubli24 Activacion',
    content_type: 'product',
  });

  // Si existe un tag de evento específico de X Ads (ej. tw-rhtpe-xxxxx), dispararlo también
  if (typeof window !== 'undefined' && window.X_EVENT_PURCHASE) {
    trackXWebEvent(window.X_EVENT_PURCHASE, conversionId, {
      value,
      currency: 'EUR',
    });
  }

  // 2. Disparar evento de Compra en el servidor mediante X Conversion API
  trackXServerConversion({
    eventId: (typeof window !== 'undefined' && window.X_EVENT_PURCHASE) ? window.X_EVENT_PURCHASE : 'purchase',
    conversionId,
    phone: details?.phone,
  });

  return conversionId;
}

/**
 * Dual tracking: fires both web pixel and server Conversion API with identical conversion_id for deduplication
 */
export function trackDualConversion(options: {
  eventId: string;
  conversionId?: string;
  email?: string;
  phone?: string;
  extraParams?: Record<string, any>;
}): void {
  const conversionId = options.conversionId || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // 1. Web pixel in browser
  trackXWebEvent(options.eventId, conversionId, options.extraParams);

  // 2. Server API via backend
  trackXServerConversion({
    eventId: options.eventId,
    conversionId,
    email: options.email,
    phone: options.phone,
  });
}
