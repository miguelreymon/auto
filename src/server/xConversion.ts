import crypto from 'crypto';

export interface XConversionIdentifier {
  twclid?: string;
  hashed_email?: string;
  hashed_phone_number?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface XConversionItem {
  conversion_time: string;
  event_id: string;
  event_source_url?: string;
  conversion_id?: string;
  identifiers: XConversionIdentifier[];
}

export interface XConversionPayload {
  conversions: XConversionItem[];
}

export interface SendXConversionParams {
  eventId: string;
  conversionTime?: string;
  eventSourceUrl?: string;
  conversionId?: string;
  twclid?: string;
  email?: string;
  phone?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface XConversionResult {
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
  pixelId?: string;
  eventId?: string;
}

/**
 * Trims and lowercases email, then returns 64-character SHA-256 hex
 */
export function hashEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Formats phone number as E.164 (e.g. +34612345678), then returns 64-character SHA-256 hex
 */
export function hashPhoneNumber(phone: string): string {
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  } else if (!cleaned.startsWith('+')) {
    // Default Spanish numbers (9 digits) or generic numbers without plus
    if (cleaned.length === 9) {
      cleaned = `+34${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

/**
 * Sends a conversion to X (Twitter) Conversion API from server code
 */
export async function sendXConversion(params: SendXConversionParams): Promise<XConversionResult> {
  const pixelId = process.env.X_PIXEL_ID || 'rhtpe';
  const token = process.env.X_PIXEL_TOKEN;

  if (!token) {
    const errorMsg = 'X_PIXEL_TOKEN environment variable is not set';
    console.error(`[X Conversion API] ${errorMsg}`);
    return { success: false, error: errorMsg, pixelId, eventId: params.eventId };
  }

  const identifier: XConversionIdentifier = {};

  if (params.twclid && params.twclid.trim()) {
    identifier.twclid = params.twclid.trim();
  }

  if (params.email && params.email.trim() && params.email.includes('@')) {
    identifier.hashed_email = hashEmail(params.email);
  }

  if (params.phone && params.phone.trim()) {
    const hashedPhone = hashPhoneNumber(params.phone);
    if (hashedPhone) {
      identifier.hashed_phone_number = hashedPhone;
    }
  }

  if (params.ipAddress && params.ipAddress.trim()) {
    identifier.ip_address = params.ipAddress.trim();
  }

  if (params.userAgent && params.userAgent.trim()) {
    identifier.user_agent = params.userAgent.trim();
  }

  // Ensure at least one identifier is present
  const hasValidIdentifier =
    Boolean(identifier.twclid) ||
    Boolean(identifier.hashed_email) ||
    Boolean(identifier.hashed_phone_number) ||
    Boolean(identifier.ip_address && identifier.user_agent);

  if (!hasValidIdentifier) {
    console.warn('[X Conversion API] Warning: Conversion missing required identifiers (twclid, hashed_email, hashed_phone_number, or ip_address + user_agent)');
  }

  const payload: XConversionPayload = {
    conversions: [
      {
        conversion_time: params.conversionTime || new Date().toISOString(),
        event_id: params.eventId,
        ...(params.eventSourceUrl ? { event_source_url: params.eventSourceUrl } : {}),
        ...(params.conversionId ? { conversion_id: params.conversionId } : {}),
        identifiers: [identifier],
      },
    ],
  };

  const endpoint = `https://ads-api.x.com/12/measurement/conversions/${pixelId}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Pixel-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (!res.ok) {
      console.error(`[X Conversion API] Failed with status ${res.status}:`, responseData);
      return {
        success: false,
        status: res.status,
        data: responseData,
        error: `HTTP error ${res.status}`,
        pixelId,
        eventId: params.eventId,
      };
    }

    console.log(`[X Conversion API] Successfully tracked conversion for ${params.eventId}:`, responseData);
    return {
      success: true,
      status: res.status,
      data: responseData,
      pixelId,
      eventId: params.eventId,
    };
  } catch (err: any) {
    console.error('[X Conversion API] Network error:', err);
    return {
      success: false,
      error: err?.message || 'Network error',
      pixelId,
      eventId: params.eventId,
    };
  }
}
