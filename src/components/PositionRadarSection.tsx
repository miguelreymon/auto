import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Lock
} from 'lucide-react';

interface PositionRadarSectionProps {
  onOpenCheckout?: (phone?: string) => void;
  onOpenWhatsApp?: (customMsg?: string) => void;
}

export interface AdditionalAd {
  url: string;
  title: string;
  image: string | null;
  city?: string;
  category?: string;
  rank?: number | null;
  page?: number | null;
  lastEditedTime?: string;
  isCensored?: boolean;
}

export interface ScanResult {
  portalId?: string;
  portalName?: string;
  portalUrl?: string;
  logoUrl?: string;
  badgeColor?: string;
  url: string;
  title: string;
  image: string | null;
  city: string;
  category: string;
  categoryUrl: string | null;
  pageUrl?: string;
  hasVipPlacement?: boolean;
  isEstimated?: boolean;
  rank: number;
  page: number;
  positionInPage: number;
  visibilityScore: number;
  status: 'podium' | 'medium' | 'invisible';
  statusText: string;
  publishedDate: string;
  lastEditedTime: string;
  checkedAt: string;
  additionalAds?: AdditionalAd[];
}

export const PositionRadarSection: React.FC<PositionRadarSectionProps> = ({
  onOpenCheckout,
  onOpenWhatsApp,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [portalsList, setPortalsList] = useState<ScanResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scanSteps = [
    'Conectando en tiempo real con MilPasiones, PasiónValencia y MundoSexAnuncio...',
    'Rastreando listados, categorías y páginas simultáneas...',
    'Localizando anuncio(s) activos asociados a tu teléfono...',
    'Verificando logos oficiales y presencia multicanal...',
  ];

  const handleScan = async (overridePhone?: string) => {
    const rawInput = overridePhone !== undefined ? overridePhone : phoneNumber;

    if (!rawInput.trim()) {
      setErrorMessage('Por favor, introduce tu número de teléfono de 9 dígitos.');
      return;
    }

    setErrorMessage(null);
    setPortalsList([]);
    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const url = `/api/check-position?phone=${encodeURIComponent(rawInput.trim())}&province=all`;
      const response = await fetch(url);
      const data = await response.json();

      clearInterval(stepInterval);
      setScanStep(3);

      setTimeout(() => {
        setIsScanning(false);
        if (data.found) {
          const list: ScanResult[] = (data.portals && data.portals.length > 0)
            ? data.portals
            : (data.ad ? [data.ad] : []);

          if (list.length > 0) {
            setPortalsList(list);
          } else {
            setErrorMessage('No encontramos ningún anuncio activo con este teléfono en los portales analizados.');
          }
        } else {
          setErrorMessage(
            data.message ||
              'No se localizó ningún anuncio activo con este teléfono ni en MilPasiones.com ni en PasionValencia.es. Comprueba que el número coincida exactamente con el de tu anuncio.'
          );
        }
      }, 400);
    } catch {
      clearInterval(stepInterval);
      setIsScanning(false);
      setErrorMessage('Error de conexión temporal con los portales. Por favor, reintenta en unos instantes.');
    }
  };

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(clean);
    setErrorMessage(null);

    if (clean.length === 9 && !isScanning) {
      if ((window as any)._autoScanTimer) {
        clearTimeout((window as any)._autoScanTimer);
      }
      (window as any)._autoScanTimer = setTimeout(() => {
        handleScan(clean);
      }, 400);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    let clean = pasted.replace(/\D/g, '');
    if (clean.startsWith('34') && clean.length > 9) {
      clean = clean.slice(2);
    }
    clean = clean.slice(0, 9);
    setPhoneNumber(clean);
    setErrorMessage(null);

    if (clean.length === 9 && !isScanning) {
      setTimeout(() => {
        handleScan(clean);
      }, 200);
    }
  };

  // Helper para censurar parcialmente el título para que el anunciante lo reconozca pero se mantenga la privacidad
  const formatCensoredTitle = (title: string) => {
    if (!title) return 'Anuncio verificado [Censurado por privacidad]';
    
    const words = title.trim().split(/\s+/);
    if (words.length <= 2) {
      return `${words[0]} [██████ CENSURADO]`;
    }
    const visibleCount = Math.min(3, Math.max(2, Math.floor(words.length * 0.4)));
    const visibleWords = words.slice(0, visibleCount).join(' ');
    return `${visibleWords} ... [██████ CONTENIDO CENSURADO]`;
  };

  const formatCensoredPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 9) return '+34 ••• •• ••';
    return `+34 ${clean.slice(0, 3)} •• •• ${clean.slice(-2)}`;
  };

  const milpasionesAd = portalsList.find(p => p.portalId === 'milpasiones');
  const pasionValenciaAd = portalsList.find(p => p.portalId === 'pasionvalencia');



  return (
    <section id="radar-posicion" className="py-16 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-y border-slate-200">
      {/* Sutiles efectos de iluminación de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-green-50/80 via-transparent to-transparent pointer-events-none blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Encabezado Principal */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-['Outfit',sans-serif] font-[900] text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0a1128] mb-3">
            ¿En qué portales está tu anuncio <span className="text-[#00a651]">AHORA MISMO</span>?
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Introduce tu teléfono para escanear en qué portales estás activa con su logotipo oficial y verificar todas tus publicaciones.
          </p>
        </div>

        {/* Casilla de Teléfono Grande */}
        <div className="max-w-xl mx-auto mb-6 text-center">
          <div className="relative flex items-center justify-center max-w-lg mx-auto mb-2.5">
            {/* Bandera y Prefijo España */}
            <div className="absolute left-4 sm:left-6 flex items-center gap-1.5 text-slate-500 font-mono text-base sm:text-lg select-none pointer-events-none z-10">
              <span className="text-xl sm:text-2xl">🇪🇸</span>
              <span className="font-bold text-slate-700">+34</span>
            </div>

            {/* Input grande y centrado */}
            <input
              id="radar-phone-input"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{9}"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleScan();
              }}
              placeholder="600 00 00 00"
              maxLength={9}
              disabled={isScanning}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-300 focus:border-[#00a651] focus:ring-4 focus:ring-green-500/15 rounded-3xl py-4 sm:py-5 pl-20 sm:pl-28 pr-6 text-center text-slate-950 placeholder-slate-400 text-2xl sm:text-4xl font-mono font-bold tracking-widest outline-none shadow-md transition-all disabled:opacity-60"
            />
          </div>
        </div>

        {/* Estado de Escaneo Animado */}
        {isScanning && (
          <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden mb-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-emerald-300 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border border-emerald-400/40" />
              <div className="absolute inset-6 rounded-full border border-emerald-500/60" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse" />
              <div
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-emerald-500 animate-spin"
                style={{ animationDuration: '1.6s' }}
              />
            </div>

            {/* Logos analizados en el loader */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 flex-wrap">
              <div className="h-9 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center">
                <img src="/logos/milpasiones.png" alt="MilPasiones" className="h-5 object-contain" />
              </div>
              <span className="text-slate-400 font-black">+</span>
              <div className="h-9 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center">
                <img src="/logos/pasionvalencia.png" alt="PasionValencia" className="h-5 object-contain" />
              </div>
              <span className="text-slate-400 font-black">+</span>
              <div className="h-9 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center">
                <img src="/logos/mundosexanuncio.webp" alt="MundoSexAnuncio" className="h-5 object-contain" />
              </div>
            </div>

            <h3 className="font-['Outfit',sans-serif] font-bold text-xl sm:text-2xl text-[#0a1128] mb-2">
              Rastreando portales líderes en directo
            </h3>

            <p className="text-[#00a651] font-mono text-sm font-semibold mb-6 animate-pulse">
              {scanSteps[scanStep]}
            </p>

            <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
              {scanSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= scanStep ? 'bg-[#00a651]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje de Error */}
        {errorMessage && !isScanning && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 mb-8 flex items-start gap-4 max-w-2xl mx-auto animate-fadeIn">
            <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-left flex-1">
              <h4 className="font-bold text-rose-900 text-sm sm:text-base mb-1">
                No localizamos tu anuncio en esta búsqueda
              </h4>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                {errorMessage}
              </p>
              <div className="bg-white/80 p-3 rounded-xl border border-rose-200 text-xs text-slate-700 mb-3 space-y-1">
                <p>💡 <strong>Consejos de comprobación:</strong></p>
                <p>1. Asegúrate de introducir el <strong>mismo teléfono</strong> del anuncio.</p>
                <p>2. El sistema analiza automáticamente <strong>MilPasiones.com</strong>, <strong>PasionValencia.es</strong> y <strong>MundoSexAnuncio.com</strong>.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenWhatsApp) {
                    onOpenWhatsApp(`Hola, he probado el radar con el número ${phoneNumber} y no localizo mi anuncio en MilPasiones, PasionValencia ni MundoSexAnuncio. ¿Podéis comprobarlo?`);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>¿Prefieres que lo revisemos nosotros? Escríbenos por WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RESULTADOS ENCONTRADOS */}
        {/* ========================================================================= */}
        {portalsList.length > 0 && !isScanning && (
          <div className="space-y-8 animate-fadeIn">
            {/* TARJETAS DE ANUNCIOS CON LOGOTIPO OFICIAL + ANUNCIOS CENSURADOS */}
            <div className={portalsList.length > 1 ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'max-w-3xl mx-auto'}>
              {portalsList.map((portal, idx) => (
                <div
                  key={portal.portalId || idx}
                  className={`bg-white border-2 rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${
                    portal.portalId === 'pasionvalencia'
                      ? 'border-orange-300 hover:border-orange-400'
                      : portal.portalId === 'mundosexanuncio'
                      ? 'border-pink-300 hover:border-pink-400'
                      : 'border-rose-300 hover:border-rose-400'
                  }`}
                >
                  <div>
                    {/* Header de la tarjeta con el Logo oficial del portal */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 px-3 py-1 bg-slate-50 rounded-xl border border-slate-200 flex items-center shadow-2xs">
                          <img
                            src={
                              portal.logoUrl ||
                              (portal.portalId === 'pasionvalencia'
                                ? '/logos/pasionvalencia.png'
                                : portal.portalId === 'mundosexanuncio'
                                ? '/logos/mundosexanuncio.webp'
                                : '/logos/milpasiones.png')
                            }
                            alt={portal.portalName}
                            className="h-5 max-w-[130px] object-contain"
                          />
                        </div>
                        <span className="text-slate-400 text-xs">· Auditado {portal.checkedAt}</span>
                      </div>

                      {portal.url && (
                        <a
                          href={portal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 font-bold transition-colors cursor-pointer"
                        >
                          <span>Ver anuncio original</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* ======================================================== */}
                    {/* FICHA COMPLETA DEL ANUNCIO PRINCIPAL (CONSERVADA INTACTA) */}
                    {/* ======================================================== */}
                    <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5">
                      {/* Imagen Real del Anuncio */}
                      {portal.image ? (
                        <div className="relative shrink-0">
                          <img
                            src={portal.image}
                            alt={portal.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                          />
                          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#00a651] text-white text-[10px] font-black shadow-xs">
                            EN VIVO
                          </span>
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300">
                          <Phone className="w-8 h-8 text-slate-400" />
                        </div>
                      )}

                      {/* Datos del Anuncio: Título, Teléfono, Categoría, Fecha */}
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {portal.categoryUrl ? (
                            <a
                              href={portal.categoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-emerald-800 hover:text-emerald-600 truncate flex items-center gap-1"
                              title="Ver categoría completa"
                            >
                              <span>{portal.category || portal.city}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                            </a>
                          ) : (
                            <span className="truncate">{portal.category || portal.city}</span>
                          )}
                        </div>

                        {/* Título exacto del anuncio */}
                        <h4 className="font-['Outfit',sans-serif] font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
                          {portal.title}
                        </h4>

                        {/* Teléfono & Subido */}
                        <div className="flex flex-wrap items-center gap-x-2.5 text-xs text-slate-600 mb-1">
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            🇪🇸 +34 {phoneNumber}
                          </span>
                          <span className="text-emerald-700 font-semibold">Subido: {portal.lastEditedTime}</span>
                        </div>

                      </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* 3. ANUNCIOS ADICIONALES EN MODO CENSURADO (SOLICITADO POR EL USUARIO) */}
                    {/* ========================================================================= */}
                    {portal.additionalAds && portal.additionalAds.length > 0 ? (
                      <div className="mb-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4">
                        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h5 className="font-['Outfit',sans-serif] font-bold text-xs sm:text-sm text-slate-900">
                                {portal.additionalAds.length} {portal.additionalAds.length === 1 ? 'anuncio adicional' : 'anuncios adicionales'} en {portal.portalName}
                              </h5>
                              <span className="text-[10px] text-amber-700 font-semibold">
                                MODO CENSURADO POR PRIVACIDAD
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200 font-mono text-slate-500">
                            Mismo teléfono
                          </span>
                        </div>

                        {/* Listado de todos los anuncios adicionales en modo censurado */}
                        <div className="space-y-3">
                          {portal.additionalAds.map((ad, aIdx) => (
                            <div
                              key={aIdx}
                              className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs relative overflow-hidden transition-all hover:border-slate-300"
                            >
                              <div className="flex items-start gap-3">
                                {/* Imagen Censurada (Efecto Blur que deja intuir la foto real) */}
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                                  {ad.image ? (
                                    <img
                                      src={ad.image}
                                      alt="Anuncio adicional verificado"
                                      className="w-full h-full object-cover filter blur-[5px] scale-110"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                      <Phone className="w-5 h-5 text-slate-400" />
                                    </div>
                                  )}

                                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                                    <Lock className="w-4 h-4 drop-shadow-md text-amber-300 mb-0.5" />
                                    <span className="text-[8px] font-black tracking-wider uppercase bg-black/60 px-1 rounded">
                                      CENSURADO
                                    </span>
                                  </div>
                                </div>

                                {/* Título & Datos Censurados */}
                                <div className="flex-1 overflow-hidden">
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{ad.city || portal.city}</span>
                                    </span>
                                  </div>

                                  {/* Título censurado para verificación del anunciante */}
                                  <p className="font-['Outfit',sans-serif] font-bold text-slate-900 text-xs leading-snug mb-1">
                                    {formatCensoredTitle(ad.title)}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                                    <span className="font-mono font-semibold text-slate-700">
                                      {formatCensoredPhone(phoneNumber)}
                                    </span>
                                    <span>·</span>
                                    <span>{ad.lastEditedTime || 'Activo en el portal'}</span>
                                  </div>
                                </div>
                              </div>

                              {ad.url && (
                                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end text-[11px]">
                                  <a
                                    href={ad.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                                  >
                                    <span>Ver anuncio ↗</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Si solo tiene 1 anuncio en este portal */
                      <div className="mb-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>1 anuncio principal detectado en este portal.</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Soporta hasta 10 anuncios por cuenta
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pie de tarjeta con llamada a la acción individual */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Subido a las {portal.lastEditedTime} en {portal.city}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenWhatsApp) {
                          onOpenWhatsApp(`Hola, he comprobado mi teléfono (${phoneNumber}) en ${portal.portalName}. Quiero que AutoPubli 24/7 renueve todos mis anuncios automáticamente cada 20 min.`);
                        }
                      }}
                      className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                    >
                      Mejorar anuncios de {portal.portalName}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Garantías de Privacidad */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 mt-8">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00a651]" />
            <span>Auditoría 100% confidencial y sin registro</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00a651]" />
            <span>Rastreo directo con logotipo oficial</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00a651]" />
            <span>Protección de privacidad en modo censurado</span>
          </span>
        </div>
      </div>
    </section>
  );
};
