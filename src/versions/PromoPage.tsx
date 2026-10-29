import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  Zap, 
  MessageCircle, 
  ShieldCheck, 
  Lock, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  Download,
  Flame,
  Star,
  Globe,
  Clock,
  RefreshCw,
  Layers,
  Tag,
  Radar,
  HelpCircle,
  Hourglass
} from 'lucide-react';
import { LeadData } from '../types';
import { usePromoContent } from '../context/PromoContentContext';
import { PositionRadarSection } from '../components/PositionRadarSection';
import { SupabaseSync } from '../lib/supabase';
import { trackDualConversion, trackXWhatsAppPurchase } from '../lib/xPixel';
import portadaAutoPubli24 from '../assets/images/portadaautopubli24.webp';
import bizumLogo from '../assets/images/Bizum.png';

interface PromoPageProps {
  onOpenWhatsApp: () => void;
  onOpenDoubtModal?: () => void;
  onLeadCaptured: (lead: LeadData) => void;
  onOpenExtensionModal?: () => void;
  onOpenAdminLogin?: () => void;
  onNavigateToAffiliates?: () => void;
  onNavigateToCityLicense?: () => void;
}

export const PromoPage: React.FC<PromoPageProps> = ({
  onOpenWhatsApp,
  onOpenDoubtModal,
  onLeadCaptured,
  onOpenExtensionModal,
  onOpenAdminLogin,
  onNavigateToAffiliates,
  onNavigateToCityLicense,
}) => {
  const { content: promoContent } = usePromoContent();

  // Sticky Bar State (Se activa al pasar el botón principal del Hero)
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isBannerSticky, setIsBannerSticky] = useState(false);

  // Detección si el usuario ha entrado mediante un enlace desde WhatsApp
  const [isFromWhatsApp, setIsFromWhatsApp] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (sessionStorage.getItem('autopubli_from_whatsapp') === 'true') return true;
      const params = new URLSearchParams(window.location.search);
      const ref = (params.get('ref') || params.get('src') || params.get('source') || params.get('from') || params.get('utm_source') || '').toLowerCase();
      if (ref.includes('wa') || ref.includes('whatsapp')) return true;
      if (params.get('whatsapp') === '1' || params.get('whatsapp') === 'true') return true;
      const referrer = (document.referrer || '').toLowerCase();
      if (referrer.includes('whatsapp') || referrer.includes('wa.me') || referrer.includes('com.whatsapp')) return true;
    } catch {}
    return false;
  });

  useEffect(() => {
    if (isFromWhatsApp) {
      try {
        sessionStorage.setItem('autopubli_from_whatsapp', 'true');
      } catch {}
    }
  }, [isFromWhatsApp]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsBannerSticky(scrollY > 40);

      const heroBtn = document.getElementById('hero-cta-button');
      let isHeroPast = false;
      if (heroBtn) {
        const rect = heroBtn.getBoundingClientRect();
        // Aparece cuando el botón del Hero queda por encima del viewport
        isHeroPast = rect.bottom < 0;
      } else {
        isHeroPast = scrollY > 420;
      }

      // Ocultar la barra inferior cuando el formulario de pago (#oferta) esté visible en pantalla
      const offerSection = document.getElementById('oferta');
      let isOfferInView = false;
      if (offerSection) {
        const offerRect = offerSection.getBoundingClientRect();
        isOfferInView = offerRect.top <= window.innerHeight * 0.85 && offerRect.bottom >= 0;
      }

      setShowStickyBar(isHeroPast && !isOfferInView);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Contador dinámico fluctuante de anuncios activos (cambia a los 2s y luego cada 7s entre 3 y 11 unidades)
  const [activeAdsCount, setActiveAdsCount] = useState(2386);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const updateCount = () => {
      setActiveAdsCount((prev) => {
        // Salto aleatorio de entre 3 a 11 unidades
        const delta = Math.floor(Math.random() * (11 - 3 + 1)) + 3;
        // Va subiendo y bajando de forma natural en rango creíble
        const goUp = prev < 2365 ? true : prev > 2415 ? false : Math.random() > 0.48;
        return goUp ? prev + delta : prev - delta;
      });
    };

    // La primera vez cambia a los 2 segundos
    const initialTimeout = setTimeout(() => {
      updateCount();
      // Y después cada 7 segundos
      intervalId = setInterval(updateCount, 7000);
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Plan Selection State (Oferta: Hasta 3 Páginas Incluidas)
  const [selectedDuration, setSelectedDuration] = useState<'7days' | '30days'>('30days');
  const [includeUpsell, setIncludeUpsell] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bizum' | 'paysafecard'>('bizum');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paysafecardPin, setPaysafecardPin] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(false);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (couponCode.trim()) {
      setCouponError(true);
    }
  };

  const isSimpleMode = !!promoContent.offer.simpleMode;
  const bizumPhone = promoContent.offer.bizum.phone;
  const bizumConcept = promoContent.offer.bizum.concept;

  const basePrice = selectedDuration === '30days'
    ? promoContent.offer.durations.thirtyDays.price
    : promoContent.offer.durations.sevenDays.price;
  const isUpsellVisible = !!promoContent.offer.upsell && promoContent.offer.upsell.visible !== false;
  const isUpsellActive = isUpsellVisible && includeUpsell;
  const upsellPrice = promoContent.offer.upsell?.price ?? 9;
  const currentPrice = isUpsellActive ? basePrice + upsellPrice : basePrice;

  const formatPaysafecardPin = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Construye la URL de WhatsApp con el mensaje estructurado del cliente (+34622431478)
  const getWhatsAppTargetNumber = () => {
    const raw = (promoContent.offer.adminWhatsAppNumber || '34622431478').replace(/\D/g, '');
    // Si ya incluye prefijo internacional (como +34, más de 9 dígitos), usar directamente
    if (raw.length > 9) {
      return raw;
    }
    // Si es un número español local de 9 dígitos sin prefijo, añadir 34
    if (raw.length === 9) {
      return `34${raw}`;
    }
    return raw || '34622431478';
  };

  const getClientWhatsAppMessage = () => {
    const planName = selectedDuration === '30days'
      ? `${promoContent.offer.durations.thirtyDays.label} (${promoContent.offer.durations.thirtyDays.price}€)`
      : `${promoContent.offer.durations.sevenDays.label} (${promoContent.offer.durations.sevenDays.price}€)`;
    const payName = paymentMethod === 'bizum' ? 'Bizum' : 'Paysafecard (Efectivo)';
    const upsellDetails = isUpsellActive
      ? `\n✨ Módulo Extra: Creación de Anuncios con Variaciones (+${upsellPrice}€)`
      : '';
    const couponDetails = couponCode.trim()
      ? `\n🎟️ Código de afiliada / cupón: ${couponCode.trim()}`
      : '';
    
    return `¡Hola! Quiero activar AutoPubli24.\n\n📱 Mi teléfono de contacto: ${whatsappNumber}\n⏱️ Plan elegido: ${planName} (Hasta 3 portales incluidos)${upsellDetails}${couponDetails}\n💰 Importe total: ${currentPrice}€\n💳 Forma de pago preferida: ${payName}\n\n¿Me indicas cómo dejamos activo mi anuncio?`;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = whatsappNumber.trim();
    if (!cleanPhone) return;

    if (paymentMethod === 'paysafecard') {
      const cleanPin = paysafecardPin.replace(/\s+/g, '');
      if (cleanPin.length < 16) {
        alert('Por favor introduce los 16 dígitos del ticket Paysafecard antes de continuar.');
        return;
      }
    }

    const planLabel = selectedDuration === '30days'
      ? `Mes Completo (${promoContent.offer.durations.thirtyDays.price}€)`
      : `7 Días (${promoContent.offer.durations.sevenDays.price}€)`;
    const payLabel = paymentMethod === 'bizum' ? 'Bizum' : 'Paysafecard (Efectivo)';

    onLeadCaptured({
      name: isSimpleMode ? `Lead WhatsApp Simple (${payLabel})` : `Cliente Promo (${payLabel})`,
      phone: cleanPhone,
      email: !isSimpleMode && paymentMethod === 'paysafecard' ? `PIN: ${paysafecardPin}` : `Concepto: ${bizumConcept}`,
      interestedPlan: `Oferta Hasta 3 Páginas - ${planLabel}${isUpsellActive ? ` + Módulo Variaciones (+${upsellPrice}€)` : ''} (Total: ${currentPrice}€)`,
    });

    // Registrar en Supabase la solicitud con teléfono, método, importe y PIN/concepto
    SupabaseSync.savePaymentLead({
      phone: cleanPhone,
      method: paymentMethod,
      amount: currentPrice,
      plan: planLabel,
      concept: !isSimpleMode && paymentMethod === 'bizum' ? bizumConcept : undefined,
      pin: !isSimpleMode && paymentMethod === 'paysafecard' ? paysafecardPin : undefined,
    });

    setIsSubmitted(true);

    // Enviar evento de compra a X (Píxel web y Conversion API con deduplicación)
    trackXWhatsAppPurchase({
      phone: cleanPhone,
      planOrCity: `Oferta AutoPubli - ${planLabel}`,
      value: currentPrice,
    });

    // En Modo Formulario Simplificado, abre inmediatamente WhatsApp con el mensaje estructurado de venta
    if (isSimpleMode) {
      const fullTarget = getWhatsAppTargetNumber();
      const msg = getClientWhatsAppMessage();
      const waUrl = `https://wa.me/${fullTarget}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    }
  };

  const scrollToOffer = () => {
    const el = document.getElementById('oferta');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-slate-900 selection:bg-green-500 selection:text-white min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. NAVBAR BLANCA LIMPIA (AutoPubli24 · SIN BOTONES EN MÓVIL)             */}
      {/* ========================================================================= */}
      <nav className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 relative z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo AutoPubli24 (Limpio y directo en móvil) */}
          <a href="#" className="flex items-center gap-1 shrink-0 text-xl sm:text-2xl font-black tracking-tight text-slate-950">
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AutoPubli</span>
            <span className="text-[#00a651]">24</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#radar-posicion" className="text-emerald-700 hover:text-[#00a651] transition-colors flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Radar de Posición</span>
            </a>
            <a href="#como-funciona" className="hover:text-[#00a651] transition-colors">
              Cómo Funciona
            </a>
            {promoContent.socialProof?.visible !== false && (
              <a href="#opiniones" className="hover:text-[#00a651] transition-colors">
                Opiniones
              </a>
            )}
            <a href="#oferta" className="hover:text-[#00a651] transition-colors">
              Precios
            </a>
            <a
              href="/ciudades"
              onClick={(e) => {
                if (onNavigateToCityLicense) {
                  e.preventDefault();
                  onNavigateToCityLicense();
                }
              }}
              className="text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
              title="Comprar la herramienta con exclusividad para 1 o más ciudades"
            >
              <span>💼 Franquicia / Ciudades</span>
            </a>
          </div>

          {/* Action Buttons: Resolver Duda (móvil y PC) y Activar Ahora */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenExtensionModal && (
              <button
                onClick={onOpenExtensionModal}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Extensión</span>
              </button>
            )}

            {/* Botón ¿Necesitas ayuda?: Sustituye a WhatsApp en PC y se añade en móvil */}
            <button
              onClick={onOpenDoubtModal || onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-2xs"
              title="¿Necesitas ayuda? Escríbenos tu consulta"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¿Necesitas ayuda?</span>
            </button>

            <button
              onClick={scrollToOffer}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#00a651] hover:bg-green-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Activar Ahora</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* BANNER DE LÍMITE POR CIUDAD (STICKY BAR SUPERIOR)                         */}
      {/* ========================================================================= */}
      <aside 
        id="turbo-banner"
        aria-label="Aviso de plazas limitadas"
        className={`sticky top-0 z-40 bg-[#030712] text-white transition-all duration-200 border-b border-slate-900 rounded-none shadow-none ${
          isBannerSticky ? 'py-2 px-3' : 'py-2.5 px-3 sm:px-4'
        }`}
        style={{ borderRadius: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      >
        {isBannerSticky ? (
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-center text-xs sm:text-sm">
            <span className="w-2 h-2 rounded-full bg-[#00a651] shrink-0 shadow-[0_0_8px_#00a651] animate-pulse" />
            <span className="text-white font-medium">
              Hoy quedan <span className="text-[#00a651] font-bold">3 plazas disponibles</span>.
            </span>
            <button
              onClick={scrollToOffer}
              className="text-xs sm:text-sm font-bold text-white underline underline-offset-4 hover:text-[#00a651] transition-colors cursor-pointer shrink-0 inline-flex items-center gap-0.5 ml-1"
            >
              Reservar plaza →
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-[11px] xs:text-xs sm:text-sm text-center leading-snug" style={{ textAlign: 'center' }}>
            <span className="inline-flex items-center gap-1.5 align-baseline mr-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00a651] shrink-0 shadow-[0_0_8px_#00a651] animate-pulse inline-block" />
              <strong className="font-bold text-white">Límite por ciudad:</strong>
            </span>
            <span className="text-slate-200">Para garantizar siempre los primeros puestos.</span>{' '}
            <span className="text-[#00a651] font-bold">Hoy quedan 3 plazas disponibles.</span>{' '}
            <button
              onClick={scrollToOffer}
              className="font-bold text-white underline underline-offset-2 hover:text-[#00a651] transition-colors cursor-pointer inline-flex items-center ml-1"
            >
              <span className="xs:hidden">Reservar →</span>
              <span className="hidden xs:inline">Reservar plaza →</span>
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 4. HERO SECTION (ESTILO Y TIPOGRAFÍA WOW DINÁMICO)                        */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 border-b border-slate-200 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">

          {/* Titular Principal Dinámico con Tipografía Outfit 900 */}
          <h1 className="font-['Outfit',sans-serif] font-[900] text-[#0a1128] -tracking-[0.025em] leading-[1.12] text-[32px] xs:text-[40px] sm:text-[52px] lg:text-[62px] max-w-[360px] xs:max-w-lg sm:max-w-3xl mx-auto mb-6">
            <span className="block">{promoContent.hero?.titleLine1}</span>
            <span className="text-[#00a651] block font-[900] mt-1.5 sm:mt-2">
              {promoContent.hero?.titleHighlight}
            </span>
          </h1>

          {/* Subtítulo Dinámico con resaltado si contiene "Tú solo cobras" */}
          <p className="font-['Outfit',sans-serif] font-bold text-[#334155] text-[18px] xs:text-[20px] sm:text-[23px] leading-[1.45] max-w-[420px] sm:max-w-xl mx-auto mb-8 sm:mb-10 text-center">
            {promoContent.hero?.description?.includes('Tú solo cobras') ? (
              <>
                <span>{promoContent.hero.description.split('Tú solo cobras')[0].trim()}</span>
                <br />
                <span className="text-[#00a651] font-[900] underline underline-offset-4 decoration-2 decoration-[#00a651] inline-block mt-1 sm:mt-1.5">
                  Tú solo cobras.
                </span>
                {promoContent.hero.description.split('Tú solo cobras').slice(1).join('Tú solo cobras').replace(/^\./, '').trim()}
              </>
            ) : (
              <span className="whitespace-pre-line">{promoContent.hero?.description}</span>
            )}
          </p>

          {/* BOTÓN Y SELLOS DE CONFIANZA */}
          <div className="mb-8">
            <div className="flex justify-center mb-3.5">
              <button
                id="hero-cta-button"
                onClick={scrollToOffer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-9 py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-green-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-5 h-5 fill-current text-yellow-300" />
                <span>{promoContent.hero.ctaButton}</span>
              </button>
            </div>

            {/* LÍNEA DE SELLOS DE CONFIANZA */}
            <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs font-semibold text-slate-700">
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0" />
                <span>{promoContent.hero.trustBadges[0]}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <div className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00a651] shrink-0" />
                <span>{promoContent.hero.trustBadges[1]}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <div className="inline-flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-slate-900">{promoContent.hero.trustBadges[2]}</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Demostración en móvil) */}
          <div className="max-w-2xl mx-auto bg-slate-950 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl border-2 sm:border-4 border-slate-950">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 relative">
              <img
                src={portadaAutoPubli24}
                alt="Panel de control AutoPubli24 y rotación automática en nube"
                className="w-full aspect-[16/9] object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-slate-950/95 text-white flex items-center justify-between text-[11px] sm:text-xs font-bold border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="font-mono font-bold tracking-tight transition-all duration-300">
                    {activeAdsCount}
                  </span>
                  <span>Anuncios activos</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.5. RADAR DE VISIBILIDAD EN TIEMPO REAL (MILPASIONES.COM)               */}
      {/* ========================================================================= */}
      <PositionRadarSection
        onOpenCheckout={(phone) => {
          if (phone) {
            setWhatsappNumber(phone);
          }
          scrollToOffer();
        }}
        onOpenWhatsApp={(customMsg) => {
          if (customMsg) {
            const target = getWhatsAppTargetNumber();
            const waUrl = `https://wa.me/${target}?text=${encodeURIComponent(customMsg)}`;
            window.open(waUrl, '_blank');
          } else {
            onOpenWhatsApp();
          }
        }}
      />

      {/* ========================================================================= */}
      {/* 5. LO QUE TIENES QUE HACER (SOLO 3 PASOS) - ESTILO WOW DINÁMICO          */}
      {/* ========================================================================= */}
      <section id="como-funciona" className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-['Outfit',sans-serif] font-[900] text-3xl sm:text-4xl lg:text-[42px] text-[#0a1128] tracking-tight mb-10 sm:mb-14">
            {promoContent.benefits?.title || 'Lo Que Tienes Que Hacer (Solo 3 Pasos)'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 text-left">
            {(promoContent.benefits?.items || []).map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-7 sm:p-8 bg-slate-50/70 border border-slate-200/90 rounded-[28px] hover:border-[#00a651] transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-[900] text-[#00a651] block mb-3 font-mono">
                    {item.badge || `0${idx + 1}.`}
                  </span>
                  <h3 className="font-['Outfit',sans-serif] text-lg sm:text-xl font-bold text-[#0a1128] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5B. PORTALES PRINCIPALES (SLIDER HORIZONTAL INFINITO DE LOGOS)            */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-slate-50/80 border-b border-slate-200 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-green-800 bg-green-100 border border-green-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-2xs">
            {promoContent.portals.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight mb-3">
            {promoContent.portals.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed font-medium">
            {promoContent.portals.subtitle}
          </p>
        </div>

        {/* Slider / Marquee Horizontal Infinito de Logos */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Degradados difuminados en los bordes para transición suave */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

          <div className="flex animate-marquee gap-5 sm:gap-7 items-center w-max">
            {/* Repetimos la lista para hacer el bucle infinito 100% fluido y sin saltos */}
            {[
              ...promoContent.portals.logos,
              ...promoContent.portals.logos,
              ...promoContent.portals.logos,
              ...promoContent.portals.logos,
            ].map((portal, idx) => (
              <div
                key={`${portal.id}-${idx}`}
                className="shrink-0 flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#00a651] rounded-2xl shadow-xs hover:shadow-md transition-all h-20 sm:h-24 w-48 sm:w-56 group cursor-default"
              >
                <img
                  src={portal.logo}
                  alt={portal.name}
                  className="max-h-11 sm:max-h-13 w-auto max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5B-2. TECNOLOGÍA ANTI-BANEO CON IPS MÓVILES 4G/5G (EXACTO A LA CAPTURA)   */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-white border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight mb-3">
            {promoContent.antiBan.title}
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10 font-medium">
            {promoContent.antiBan.subtitle}
          </p>

          {/* Tarjeta con los 3 puntos numerados */}
          <div className="max-w-2xl mx-auto bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs text-left">
            <div className="space-y-5 sm:space-y-6">
              {promoContent.antiBan.items.map((item) => (
                <div key={item.number} className="flex items-start gap-3.5 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a651] text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {item.number}
                  </div>
                  <div className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                    <strong className="text-slate-950 font-bold">{item.boldTitle}</strong> {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5C. GARANTÍA DE DEVOLUCIÓN POR BIZUM EN 10 MINUTOS                         */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-white border-b border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4">
          
          {/* Logo Bizum Garantía */}
          <div className="flex items-center justify-center mx-auto mb-5">
            <img
              src={bizumLogo}
              alt="Bizum Garantía 100%"
              className="h-[68px] w-auto object-contain max-w-[240px]"
              style={{ height: '68px' }}
              loading="lazy"
            />
          </div>

          {/* Título de la Garantía */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight mb-4">
            {promoContent.guarantee.title}
          </h2>

          {/* Párrafo explicativo */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
            {promoContent.guarantee.descriptionBeforeBold}
            <strong className="font-bold text-slate-950">{promoContent.guarantee.boldText}</strong>
            {promoContent.guarantee.descriptionAfterBold}
          </p>

          {/* Botón CTA Verde */}
          <button
            onClick={scrollToOffer}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-green-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Zap className="w-5 h-5 fill-current text-white" />
            <span>{promoContent.guarantee.buttonText}</span>
          </button>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5D. PRUEBA SOCIAL (TESTIMONIOS Y CAPTURAS WHATSAPP DE EJEMPLO)            */}
      {/* ========================================================================= */}
      {promoContent.socialProof?.visible !== false && (
        <section id="opiniones" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200 text-center">
          <div className="max-w-5xl mx-auto px-4">
            
            <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-3">
                {promoContent.socialProof.title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                {promoContent.socialProof.subtitle}
              </p>
            </div>

            {/* Grid de 3 Testimonios tipo Chat WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left mb-8">
              {promoContent.socialProof.items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Encabezado del contacto con avatar */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-300">
                          {item.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs sm:text-sm font-bold text-slate-950">{item.author}</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">{item.city}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
                    </div>

                    {/* Globo de mensaje estilo WhatsApp */}
                    <div className="bg-[#f0fdf4] border border-green-200/80 rounded-xl rounded-tl-none p-3.5 mb-3 relative">
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {item.message}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-green-700 font-mono font-bold">
                        <span>{item.portal}</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge de resultado */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-black text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                      {item.resultBadge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Anuncio activo</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
              <span>{promoContent.socialProof.footerNote}</span>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. OFERTA Y FORMULARIO (HASTA 3 PÁGINAS INCLUIDAS)                       */}
      {/* ========================================================================= */}
      <section id="oferta" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          
          <span 
            className="text-xs font-black uppercase tracking-wider text-green-800 bg-green-100 border border-green-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-2xs"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {promoContent.offer.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
            {promoContent.offer.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-8 font-medium leading-relaxed">
            {promoContent.offer.subtitle}
          </p>

          {/* Formulario de Activación Directa */}
          <div className="bg-white border-2 sm:border-3 border-[#00a651] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-left">
            {isSubmitted ? (
              isSimpleMode ? (
                /* Pantalla coherente para MODO FORMULARIO SIMPLIFICADO (WHATSAPP) */
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                    <MessageCircle className="w-8 h-8 fill-current" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-900 border border-green-200 text-xs font-black uppercase tracking-wider mb-2">
                    <span>Conversación iniciada en WhatsApp</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    ¡Solicitud enviada a WhatsApp!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
                    Hemos abierto la conversación con tu solicitud para el teléfono <strong className="text-slate-950 font-bold">{whatsappNumber}</strong>. Si tu navegador ha bloqueado la ventana o se te ha cerrado, pulsa aquí para abrirla de nuevo:
                  </p>

                  <a
                    href={`https://wa.me/${getWhatsAppTargetNumber()}?text=${encodeURIComponent(getClientWhatsAppMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackXWhatsAppPurchase({
                        phone: whatsappNumber,
                        planOrCity: selectedDuration === '30days' ? 'Plan Mes Completo' : 'Plan 1 Semana',
                        value: currentPrice,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Volver a abrir WhatsApp con mi asesor →</span>
                  </a>

                  <p className="text-[11px] text-slate-400 font-medium mt-3">
                    Un asesor te responderá en WhatsApp en menos de 2 minutos para dejar tu anuncio activo.
                  </p>
                </div>
              ) : (
                /* Pantalla para MODO COMPLETO (BIZUM / PAYSAFECARD PENDIENTE DE VALIDACIÓN) */
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                    <Hourglass className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black uppercase tracking-wider mb-2">
                    <span>Activación en modo pendiente</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    {promoContent.offer.successMessage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                    {promoContent.offer.successMessage.description}
                  </p>

                  <div className="max-w-md mx-auto p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs text-slate-600 mb-6 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Teléfono a promocionar:</span>
                      <span className="font-mono font-bold text-slate-900">{whatsappNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Método de pago:</span>
                      <span className="font-bold text-slate-900">{paymentMethod === 'bizum' ? 'Bizum' : 'Paysafecard (Efectivo)'}</span>
                    </div>
                    {paymentMethod === 'bizum' ? (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-500">Concepto indicado:</span>
                        <span className="font-mono font-bold text-slate-900">{bizumConcept}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-500">PIN registrado:</span>
                        <span className="font-mono font-bold text-blue-900">{paysafecardPin}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="font-semibold text-slate-500">Importe a validar:</span>
                      <span className="font-bold text-emerald-700 text-sm">{currentPrice}€</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${getWhatsAppTargetNumber()}?text=${encodeURIComponent(
                      paymentMethod === 'bizum'
                        ? `Hola, ya he enviado el Bizum de ${currentPrice}€ con concepto ${bizumConcept} para el teléfono ${whatsappNumber}. Quedo a la espera de vuestra comprobación para confirmar la activación.`
                        : `Hola, he registrado el ticket Paysafecard (PIN: ${paysafecardPin}) de ${currentPrice}€ para el teléfono ${whatsappNumber}. Quedo a la espera de la validación para activar el servicio.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackXWhatsAppPurchase({
                        phone: whatsappNumber,
                        planOrCity: selectedDuration === '30days' ? 'Plan Mes Completo' : 'Plan 1 Semana',
                        value: currentPrice,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>
                      {paymentMethod === 'bizum'
                        ? 'Avisar por WhatsApp que ya he enviado el Bizum →'
                        : 'Avisar por WhatsApp que ya he indicado el PIN Paysafecard →'}
                    </span>
                  </a>
                  <p className="text-[11px] text-slate-400 font-medium mt-3">
                    {paymentMethod === 'bizum'
                      ? 'Revisaremos tu Bizum con el concepto y te confirmaremos por WhatsApp en cuanto quede validado.'
                      : 'Validaremos el PIN de tu ticket Paysafecard y te confirmaremos por WhatsApp de inmediato.'}
                  </p>
                </div>
              )
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-5">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    {promoContent.offer.formHeaderTitle}
                  </h3>
                </div>

                {/* Selección Simple de Duración */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    {promoContent.offer.durationStepTitle}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDuration('7days')}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        selectedDuration === '7days'
                          ? 'border-[#00a651] bg-green-50 text-slate-900 ring-2 ring-green-500/20 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">
                        {promoContent.offer.durations.sevenDays.label.includes('(') ? (
                          <>
                            <span>{promoContent.offer.durations.sevenDays.label.split('(')[0].trim()}</span>
                            <br />
                            <span className="text-[11px] font-semibold text-slate-500">
                              ({promoContent.offer.durations.sevenDays.label.split('(')[1]}
                            </span>
                          </>
                        ) : (
                          <span className="whitespace-pre-line">{promoContent.offer.durations.sevenDays.label}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 line-through mt-1">{promoContent.offer.durations.sevenDays.originalPrice}€</div>
                      <div className="text-base font-black text-slate-900 font-mono">{promoContent.offer.durations.sevenDays.price}€</div>
                      <div className="text-[10px] text-green-700 font-semibold mt-0.5">{promoContent.offer.durations.sevenDays.note}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDuration('30days')}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer relative ${
                        selectedDuration === '30days'
                          ? 'border-[#00a651] bg-green-50 text-slate-900 ring-2 ring-green-500/30 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="absolute -top-2.5 right-2 bg-amber-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase">
                        {promoContent.offer.durations.thirtyDays.badge}
                      </span>
                      <div className="text-xs font-bold leading-tight">
                        {promoContent.offer.durations.thirtyDays.label.includes('(') ? (
                          <>
                            <span>{promoContent.offer.durations.thirtyDays.label.split('(')[0].trim()}</span>
                            <br />
                            <span className="text-[11px] font-semibold text-slate-500">
                              ({promoContent.offer.durations.thirtyDays.label.split('(')[1]}
                            </span>
                          </>
                        ) : (
                          <span className="whitespace-pre-line">{promoContent.offer.durations.thirtyDays.label}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 line-through mt-1">{promoContent.offer.durations.thirtyDays.originalPrice}€</div>
                      <div className="text-base font-black text-green-700 font-mono">{promoContent.offer.durations.thirtyDays.price}€</div>
                      <div className="text-[10px] text-green-700 font-semibold mt-0.5">{promoContent.offer.durations.thirtyDays.note}</div>
                    </button>
                  </div>
                </div>

                {/* UPSELL OPCIONAL: Módulo de Creación de Nuevos Anuncios */}
                {isUpsellVisible && promoContent.offer.upsell && (
                  <div
                    onClick={() => setIncludeUpsell(!includeUpsell)}
                    className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                      includeUpsell
                        ? 'border-[#00a651] bg-emerald-50/80 ring-2 ring-[#00a651]/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <input
                        type="checkbox"
                        id="upsell-module"
                        checked={includeUpsell}
                        onChange={(e) => setIncludeUpsell(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded text-[#00a651] border-slate-300 focus:ring-[#00a651] cursor-pointer shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span 
                            className="text-xs sm:text-sm font-black text-slate-900 leading-snug"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {promoContent.offer.upsell.title}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-[#00a651] shrink-0 font-mono">
                            +{promoContent.offer.upsell.price}€
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {promoContent.offer.upsell.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Teléfono de WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    {promoContent.offer.whatsappStepTitle}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder={promoContent.offer.whatsappPlaceholder}
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-base focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <Smartphone className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {promoContent.offer.whatsappHelper}
                  </p>
                </div>

                {/* Código de Cupón / Afiliada (solo visible si está activado en admin) */}
                {promoContent.offer.showCouponField && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                      ¿Tienes un código de afiliada o cupón? (Opcional)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Introduce tu código aquí"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError(false);
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs sm:text-sm uppercase tracking-wider focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        <Tag className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 font-bold mt-1.5 flex items-center gap-1">
                        <span>❌ Cupón no válido</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Método de Pago: Bizum o Paysafecard */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    {promoContent.offer.paymentStepTitle}
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bizum')}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'bizum' ? 'border-[#00a651] bg-green-50 text-green-950 font-black' : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">🟢 BIZUM</div>
                      <span className="text-[10px] text-slate-500">{promoContent.offer.bizum.subtitle || "Pago al instante"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paysafecard')}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition-all cursor-pointer relative ${
                        paymentMethod === 'paysafecard' ? 'border-blue-600 bg-blue-50 text-blue-950 font-black' : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="absolute -top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">EFECTIVO</span>
                      <div className="text-xs sm:text-sm font-bold">🔵 PAYSAFECARD</div>
                      <span className="text-[10px] text-slate-500">En efectivo en estancos</span>
                    </button>
                  </div>

                  {/* EN MODO COMPLETO: muestra teléfono/concepto Bizum o casilla PIN Paysafecard */}
                  {/* EN MODO SIMPLIFICADO: se oculta completamente sin mostrar textos innecesarios */}
                  {!isSimpleMode && (
                    paymentMethod === 'bizum' ? (
                      <div className="p-4 bg-green-50 border-2 border-green-300 rounded-2xl space-y-3 text-xs shadow-2xs">
                      <div className="flex items-center justify-between pb-2 border-b border-green-200">
                        <span className="font-bold text-green-950 uppercase tracking-wider text-[11px]">
                          Datos para realizar el Bizum:
                        </span>
                        <span className="font-black text-emerald-800 text-sm font-mono">
                          Importe: {currentPrice}€
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-green-200">
                        <span className="text-slate-600 font-medium">1. Teléfono al que enviarlo:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm font-mono text-slate-900">{bizumPhone}</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bizumPhone.replace(/\s+/g, ''), 'phone')}
                            className="text-[10px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            {copiedField === 'phone' ? '¡Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-green-200">
                        <span className="text-slate-600 font-medium">2. Concepto imprescindible:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-sm text-slate-900">{bizumConcept}</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bizumConcept, 'concept')}
                            className="text-[10px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            {copiedField === 'concept' ? '¡Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-green-800 font-medium leading-relaxed pt-1">
                        👉 Una vez enviado el Bizum de {currentPrice}€ desde tu app bancaria, pulsa el botón verde de abajo para registrar tu solicitud en estado pendiente de validación.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl space-y-3 text-xs shadow-2xs">
                      <div>
                        <span className="font-bold text-blue-950 uppercase tracking-wider text-[11px] block mb-1">
                          Paso previo: introduce tu código PIN de 16 dígitos
                        </span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Pide un ticket Paysafecard de <strong className="text-slate-900">{currentPrice}€</strong> en cualquier estanco e introduce aquí el código antes de enviar a comprobación:
                        </p>
                      </div>

                      <input
                        type="text"
                        required={paymentMethod === 'paysafecard'}
                        placeholder="0123 4567 8901 2345"
                        maxLength={19}
                        value={paysafecardPin}
                        onChange={(e) => setPaysafecardPin(formatPaysafecardPin(e.target.value))}
                        className="w-full px-4 py-3 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl font-mono text-base sm:text-lg tracking-widest text-slate-900 text-center font-bold outline-none"
                      />

                      <p className="text-[10px] text-blue-800 font-medium text-center">
                        🔒 Validaremos los 16 dígitos de tu ticket para activar las subidas automáticas.
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm sm:text-base rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-current text-yellow-300" />
                  <span>
                    {isUpsellActive
                      ? `ACTIVAR CON MÓDULO VARIACIONES (${currentPrice}€)`
                      : `${promoContent.offer.submitButtonPrefix} (${currentPrice}€)`}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[11px] text-center text-slate-500 font-medium">
                  {promoContent.offer.trustFooter}
                </p>

                {/* Nota contextual para quien ya viene por WhatsApp (solo visible si el usuario entró mediante enlace de WhatsApp) */}
                {isFromWhatsApp && promoContent.offer.directChatHelper && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
                    <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                      {promoContent.offer.directChatHelper}
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PREGUNTAS FRECUENTES SOBRE EL PAGO POR BIZUM (ANTES DEL FOOTER)        */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-slate-50/70 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4">
          
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 mb-2 inline-block">
              {promoContent.faq.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              {promoContent.faq.titleLine1} <br className="hidden sm:inline" />
              {promoContent.faq.titleLine2}
            </h2>
          </div>

          <div className="space-y-4">
            {promoContent.faq.items.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs text-left">
                <h3 className="font-bold text-slate-950 text-base sm:text-lg mb-1.5">
                  {item.question}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER (BLANCO Y LIMPIO · EXACTO A LA CAPTURA)                        */}
      {/* ========================================================================= */}
      <footer className="py-10 sm:py-14 bg-white text-slate-600 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Logo Central AutoPubli24 */}
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mb-3">
            <span>AutoPubli</span>
            <span className="text-[#00a651]">24</span>
          </div>

          {/* Texto Descriptivo */}
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed mb-6">
            {promoContent.footer.description}
          </p>

          {/* Enlaces y Garantías */}
          <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700 mb-6">
            <div className="inline-flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0" />
              <span>Listo en 2 minutos</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="inline-flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#00a651] shrink-0" />
              <span>Funciona con el móvil apagado</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="inline-flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#00a651]" />
              <span>Garantía 100%</span>
            </div>
            <span className="text-slate-300">·</span>
            <a
              href="/afiliados"
              onClick={(e) => {
                if (onNavigateToAffiliates) {
                  e.preventDefault();
                  onNavigateToAffiliates();
                }
              }}
              className="text-[#00a651] hover:underline font-bold text-xs inline-flex items-center gap-1"
            >
              <span>Gana 10€ como Afiliado</span>
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="/ciudades"
              onClick={(e) => {
                if (onNavigateToCityLicense) {
                  e.preventDefault();
                  onNavigateToCityLicense();
                }
              }}
              className="text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full font-extrabold text-xs inline-flex items-center gap-1 shadow-2xs"
            >
              <span>💼 Licencia Exclusiva por Ciudad</span>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] sm:text-xs text-slate-400">
            {promoContent.footer.copyright}
          </p>

        </div>
      </footer>

      {/* Sticky Bottom Bar (Aparece únicamente al scrollear por debajo del botón principal del Hero) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl transition-all duration-300 ease-in-out ${
          showStickyBar ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Mensaje descriptivo en barra */}
          <div className="hidden xs:flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <div className="text-left">
              <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                {promoContent.stickyBar.title}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                {promoContent.stickyBar.subtitle}
              </p>
            </div>
          </div>

          {/* Botón CTA Sticky */}
          <button
            onClick={scrollToOffer}
            className="w-full xs:w-auto flex-1 xs:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 bg-[#00a651] hover:bg-green-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-green-600/25 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-current text-yellow-300" />
            <span>{promoContent.stickyBar.buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Botón Flotante de Ayuda (?) siempre situado en la zona inferior por encima del sticky */}
      <div
        className={`fixed right-4 sm:right-6 z-55 transition-all duration-300 ease-in-out ${
          showStickyBar ? 'bottom-20 sm:bottom-22' : 'bottom-5 sm:bottom-6'
        }`}
      >
        <button
          onClick={onOpenDoubtModal || onOpenWhatsApp}
          className="group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 bg-emerald-50/90 hover:bg-emerald-100 backdrop-blur-md border border-emerald-300 text-emerald-900 font-bold rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer select-none"
          aria-label="¿Necesitas ayuda? Haz tu consulta"
          title="¿Necesitas ayuda? Haz tu consulta aquí"
        >
          {/* Icono de interrogación */}
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
          </div>

          {/* Texto descriptivo: Visible completo en tablet/desktop, y en móvil al hacer hover */}
          <span className="hidden sm:inline font-bold text-xs sm:text-sm tracking-tight text-emerald-900">
            ¿Necesitas ayuda?
          </span>
        </button>
      </div>

    </div>
  );
};
