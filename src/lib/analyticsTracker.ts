import { supabase } from './supabase';

export interface PageVisitRecord {
  id: string;
  session_id: string;
  ip_pseudo?: string;
  country: string;
  country_code: string;
  city: string;
  region: string;
  page_path: string;
  referrer: string;
  traffic_source: 'whatsapp' | 'sms' | 'direct' | 'google' | 'instagram' | 'telegram' | 'tiktok' | 'twitter' | 'foro' | 'referral';
  source_label: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  duration_seconds: number;
  is_active: boolean;
  first_seen: string;
  last_ping: string;
}

const STORAGE_VISITS_KEY = 'autopubli_analytics_visits_v1';
const SESSION_ID_KEY = 'autopubli_session_id_v1';
const SESSION_SOURCE_KEY = 'autopubli_session_source_v1';

// Detección avanzada de fuente de tráfico: SMS, WhatsApp, Telegram, Google, directo, campañas
function detectTrafficSource(): { source: PageVisitRecord['traffic_source']; label: string } {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = (urlParams.get('utm_source') || '').toLowerCase();
    const utmMedium = (urlParams.get('utm_medium') || '').toLowerCase();
    const utmCampaign = (urlParams.get('utm_campaign') || '').toLowerCase();
    const sourceParam = (
      urlParams.get('source') ||
      urlParams.get('ref') ||
      urlParams.get('from') ||
      urlParams.get('canal') ||
      urlParams.get('origen') ||
      urlParams.get('medio') ||
      urlParams.get('s') ||
      urlParams.get('c') ||
      ''
    ).toLowerCase();
    const ref = (document.referrer || '').toLowerCase();

    let detected: { source: PageVisitRecord['traffic_source']; label: string } | null = null;

    // 1. Detección de SMS (enlaces enviados por mensajes de texto)
    if (
      utmSource === 'sms' ||
      utmMedium === 'sms' ||
      utmCampaign.includes('sms') ||
      sourceParam === 'sms' ||
      sourceParam === 'mensaje' ||
      sourceParam === 'text' ||
      urlParams.has('sms') ||
      urlParams.has('sms_id')
    ) {
      detected = { source: 'sms', label: '📱 Campaña SMS' };
    }

    // 2. Detección de WhatsApp (enlaces compartidos o enviados por WhatsApp)
    else if (
      utmSource === 'whatsapp' ||
      utmSource === 'wa' ||
      utmMedium === 'whatsapp' ||
      utmMedium === 'wa' ||
      utmCampaign.includes('whatsapp') ||
      utmCampaign.includes('wa') ||
      sourceParam === 'whatsapp' ||
      sourceParam === 'wa' ||
      urlParams.has('wa') ||
      urlParams.has('whatsapp') ||
      ref.includes('whatsapp') ||
      ref.includes('wa.me') ||
      ref.includes('api.whatsapp.com') ||
      ref.includes('web.whatsapp.com') ||
      ref.includes('com.whatsapp')
    ) {
      detected = { source: 'whatsapp', label: '💬 Enlace WhatsApp' };
    }

    // 3. Telegram
    else if (
      utmSource === 'telegram' ||
      sourceParam === 'telegram' ||
      sourceParam === 'tg' ||
      ref.includes('telegram') ||
      ref.includes('t.me') ||
      ref.includes('org.telegram')
    ) {
      detected = { source: 'telegram', label: '✈️ Telegram' };
    }

    // 4. Instagram / Facebook / TikTok / Twitter
    else if (ref.includes('instagram.com') || utmSource.includes('instagram') || sourceParam === 'ig') {
      detected = { source: 'instagram', label: '📸 Instagram' };
    } else if (ref.includes('tiktok.com') || utmSource.includes('tiktok')) {
      detected = { source: 'tiktok', label: '🎵 TikTok' };
    } else if (ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com')) {
      detected = { source: 'twitter', label: '🐦 Twitter / X' };
    }

    // 5. Google / Buscadores
    else if (ref.includes('google.') || utmSource.includes('google')) {
      detected = { source: 'google', label: '🔍 Búsqueda Google' };
    } else if (ref.includes('bing.') || ref.includes('yahoo.') || ref.includes('duckduckgo.')) {
      detected = { source: 'google', label: '🔍 Buscador Web' };
    }

    // 6. Foros y portales
    else if (ref.includes('forocoches') || ref.includes('foropasion') || ref.includes('sexforo') || ref.includes('pasion')) {
      const host = new URL(document.referrer).hostname;
      detected = { source: 'foro', label: `🌐 Foro (${host})` };
    }

    // 7. Otra web externa
    else if (ref && !ref.includes(window.location.hostname)) {
      try {
        const host = new URL(document.referrer).hostname.replace('www.', '');
        detected = { source: 'referral', label: `🔗 Enlace web (${host})` };
      } catch (_) {}
    }

    // Si se detectó una fuente específica en la URL o Referrer, guardarla en la sesión
    if (detected && detected.source !== 'direct') {
      sessionStorage.setItem(SESSION_SOURCE_KEY, JSON.stringify(detected));
      return detected;
    }

    // Si ya teníamos una fuente detectada en esta sesión (por ejemplo, entró por SMS y navega), conservarla
    const savedSource = sessionStorage.getItem(SESSION_SOURCE_KEY);
    if (savedSource) {
      try {
        const parsed = JSON.parse(savedSource);
        if (parsed?.source && parsed?.label) return parsed;
      } catch (_) {}
    }

    // 8. Tráfico directo o URL directa en navegador
    const directRes: { source: PageVisitRecord['traffic_source']; label: string } = {
      source: 'direct',
      label: '⚡ Directo / URL navegador',
    };
    sessionStorage.setItem(SESSION_SOURCE_KEY, JSON.stringify(directRes));
    return directRes;
  } catch (_) {
    return { source: 'direct', label: '⚡ Directo / URL navegador' };
  }
}

// Generar o recuperar sessionId único de esta pestaña/navegador
function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Navegador Web';
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Dispositivo';
}

// Datos de geolocalización IP en caché local
let cachedGeo: { country: string; countryCode: string; city: string; region: string } | null = null;

async function fetchGeoLocation(): Promise<{ country: string; countryCode: string; city: string; region: string }> {
  if (cachedGeo) return cachedGeo;

  try {
    // Intentar servicio geoip público y gratuito rápido (ipapi.co o geoplugin)
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      cachedGeo = {
        country: data.country_name || 'España',
        countryCode: data.country_code || 'ES',
        city: data.city || 'Madrid',
        region: data.region || 'Madrid',
      };
      return cachedGeo;
    }
  } catch (_) {
    // Fallback: inferir por zona horaria del navegador
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (tz.includes('Europe/Madrid') || tz.includes('Canary')) {
    cachedGeo = { country: 'España', countryCode: 'ES', city: tz.includes('Canary') ? 'Las Palmas' : 'Madrid', region: 'España' };
  } else if (tz.includes('America/Bogota')) {
    cachedGeo = { country: 'Colombia', countryCode: 'CO', city: 'Bogotá', region: 'Bogotá' };
  } else if (tz.includes('America/Mexico')) {
    cachedGeo = { country: 'México', countryCode: 'MX', city: 'Ciudad de México', region: 'CDMX' };
  } else if (tz.includes('America/Argentina') || tz.includes('Buenos_Aires')) {
    cachedGeo = { country: 'Argentina', countryCode: 'AR', city: 'Buenos Aires', region: 'Buenos Aires' };
  } else {
    cachedGeo = { country: 'España', countryCode: 'ES', city: 'Valencia', region: 'Valencia' };
  }

  return cachedGeo;
}

export const AnalyticsTracker = {
  sessionId: getOrCreateSessionId(),
  startTime: Date.now(),
  pingInterval: null as any,

  // Inicializar tracking de la visita actual
  async initTracking() {
    const geo = await fetchGeoLocation();
    const sessionId = this.sessionId;
    const now = new Date().toISOString();
    const traffic = detectTrafficSource();

    const visit: PageVisitRecord = {
      id: sessionId,
      session_id: sessionId,
      country: geo.country,
      country_code: geo.countryCode,
      city: geo.city,
      region: geo.region,
      page_path: window.location.pathname || '/',
      referrer: document.referrer ? new URL(document.referrer).hostname : 'Directo',
      traffic_source: traffic.source,
      source_label: traffic.label,
      device_type: detectDevice(),
      browser: detectBrowser(),
      os: detectOS(),
      duration_seconds: 0,
      is_active: true,
      first_seen: now,
      last_ping: now,
    };

    // Guardar en almacenamiento local
    this.saveLocalVisit(visit);

    // Intentar registrar en Supabase
    this.sendToSupabase(visit);

    // Enviar 'heartbeat' cada 10 segundos para medir el tiempo exacto que permanece el visitante
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = setInterval(() => {
      this.updateDuration();
    }, 10000);

    // Al cerrar o cambiar de pestaña
    window.addEventListener('beforeunload', () => {
      this.markInactive();
    });
  },

  updateDuration() {
    const elapsedSecs = Math.round((Date.now() - this.startTime) / 1000);
    const now = new Date().toISOString();

    const list = this.getLocalVisits();
    const index = list.findIndex((v) => v.session_id === this.sessionId);
    if (index !== -1) {
      list[index].duration_seconds = elapsedSecs;
      list[index].last_ping = now;
      list[index].is_active = true;
      try {
        localStorage.setItem(STORAGE_VISITS_KEY, JSON.stringify(list));
      } catch (_) {}

      // Intentar actualizar en Supabase
      this.sendToSupabase(list[index]);
    }
  },

  markInactive() {
    const list = this.getLocalVisits();
    const index = list.findIndex((v) => v.session_id === this.sessionId);
    if (index !== -1) {
      list[index].is_active = false;
      try {
        localStorage.setItem(STORAGE_VISITS_KEY, JSON.stringify(list));
      } catch (_) {}
    }
  },

  saveLocalVisit(visit: PageVisitRecord) {
    try {
      const list = this.getLocalVisits();
      const existing = list.findIndex((v) => v.session_id === visit.session_id);
      if (existing !== -1) {
        list[existing] = { ...list[existing], ...visit };
      } else {
        list.unshift(visit);
      }
      localStorage.setItem(STORAGE_VISITS_KEY, JSON.stringify(list.slice(0, 100)));
    } catch (_) {}
  },

  getLocalVisits(): PageVisitRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_VISITS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  },

  async sendToSupabase(visit: PageVisitRecord) {
    try {
      await supabase.from('page_visits').upsert(
        {
          id: visit.id,
          session_id: visit.session_id,
          country: visit.country,
          country_code: visit.country_code,
          city: visit.city,
          region: visit.region,
          page_path: visit.page_path,
          referrer: visit.referrer,
          traffic_source: visit.traffic_source,
          source_label: visit.source_label,
          device_type: visit.device_type,
          browser: visit.browser,
          os: visit.os,
          duration_seconds: visit.duration_seconds,
          is_active: visit.is_active,
          last_ping: visit.last_ping,
          created_at: visit.first_seen,
        },
        { onConflict: 'id' }
      );
    } catch (_) {
      // Si la tabla no está creada aún en Supabase, continúa funcionando perfectamente con localStorage
    }
  },

  // Obtener todas las visitas combinadas (Supabase + local)
  async fetchAllVisits(): Promise<PageVisitRecord[]> {
    try {
      const { data, error } = await supabase
        .from('page_visits')
        .select('*')
        .order('last_ping', { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          session_id: d.session_id || d.id,
          country: d.country || 'España',
          country_code: d.country_code || 'ES',
          city: d.city || 'Desconocida',
          region: d.region || '',
          page_path: d.page_path || '/',
          referrer: d.referrer || 'Directo',
          traffic_source: d.traffic_source || 'direct',
          source_label: d.source_label || (d.referrer?.includes('wa') ? '💬 Enlace WhatsApp' : '⚡ Directo / URL navegador'),
          device_type: d.device_type || 'mobile',
          browser: d.browser || 'Web',
          os: d.os || 'Móvil',
          duration_seconds: Number(d.duration_seconds) || 0,
          is_active: Boolean(d.is_active),
          first_seen: d.created_at || d.first_seen || new Date().toISOString(),
          last_ping: d.last_ping || new Date().toISOString(),
        }));
      }
    } catch (_) {}

    return this.getLocalVisits();
  },
};
