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
  Clock
} from 'lucide-react';
import { LeadData } from '../types';
import { usePromoContent } from '../context/PromoContentContext';

interface PromoPageProps {
  onOpenWhatsApp: () => void;
  onLeadCaptured: (lead: LeadData) => void;
  onOpenExtensionModal?: () => void;
  onOpenAdminLogin?: () => void;
}

export const PromoPage: React.FC<PromoPageProps> = ({
  onOpenWhatsApp,
  onLeadCaptured,
  onOpenExtensionModal,
  onOpenAdminLogin,
}) => {
  const { content: promoContent } = usePromoContent();

  // Sticky Bar State (Se activa al pasar el botón principal del Hero)
  const [showStickyBar, setShowStickyBar] = useState(false);

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
      const heroBtn = document.getElementById('hero-cta-button');
      if (heroBtn) {
        const rect = heroBtn.getBoundingClientRect();
        // Aparece cuando el botón del Hero queda por encima del viewport
        setShowStickyBar(rect.bottom < 0);
      } else {
        setShowStickyBar(window.scrollY > 420);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Plan Selection State (Oferta: Hasta 3 Páginas Incluidas)
  const [selectedDuration, setSelectedDuration] = useState<'7days' | '30days'>('30days');
  const [paymentMethod, setPaymentMethod] = useState<'bizum' | 'paysafecard'>('bizum');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paysafecardPin, setPaysafecardPin] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isSimpleMode = !!promoContent.offer.simpleMode;
  const bizumPhone = promoContent.offer.bizum.phone;
  const bizumConcept = promoContent.offer.bizum.concept;

  const prices = {
    '7days': promoContent.offer.durations.sevenDays.price,
    '30days': promoContent.offer.durations.thirtyDays.price,
  };

  const currentPrice = prices[selectedDuration];

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

  // Construye la URL de WhatsApp con el mensaje estructurado del cliente
  const getWhatsAppTargetNumber = () => {
    const targetRaw = (promoContent.offer.adminWhatsAppNumber || promoContent.offer.bizum.phone || '600000000').replace(/\D/g, '');
    return targetRaw.startsWith('34') ? targetRaw : `34${targetRaw}`;
  };

  const getClientWhatsAppMessage = () => {
    const planName = selectedDuration === '30days'
      ? `${promoContent.offer.durations.thirtyDays.label} (${promoContent.offer.durations.thirtyDays.price}€)`
      : `${promoContent.offer.durations.sevenDays.label} (${promoContent.offer.durations.sevenDays.price}€)`;
    const payName = paymentMethod === 'bizum' ? 'Bizum' : 'Paysafecard (Efectivo)';
    
    return `¡Hola! Quiero activar AutoPubli24.\n\n📱 Mi teléfono de contacto: ${whatsappNumber}\n⏱️ Plan elegido: ${planName}\n💳 Forma de pago preferida: ${payName}\n\n¿Me indicas cómo dejamos activo mi anuncio?`;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = whatsappNumber.trim();
    if (!cleanPhone) return;

    if (!isSimpleMode && paymentMethod === 'paysafecard') {
      const cleanPin = paysafecardPin.replace(/\s+/g, '');
      if (cleanPin.length < 16) {
        alert('Por favor introduce los 16 dígitos del ticket Paysafecard.');
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
      email: !isSimpleMode && paymentMethod === 'paysafecard' ? `PIN: ${paysafecardPin}` : '',
      interestedPlan: `Oferta Hasta 3 Páginas - ${planLabel}`,
    });

    setIsSubmitted(true);

    // En Modo Simplificado, abre inmediatamente WhatsApp con el mensaje estructurado
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
      {/* BANNER MODO TURBO FIJO Y PERMANENTE ARRIBA (STICKY AL HACER SCROLL)       */}
      {/* ========================================================================= */}
      <div 
        id="turbo-banner"
        className="sticky top-0 z-40 bg-[#00a651] text-white py-2 px-3 sm:px-4 shadow-md text-center transition-all border-b border-green-700/20"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap text-xs sm:text-sm">
          <div className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-white">
            <Flame className="w-4 h-4 fill-current text-yellow-300 shrink-0 animate-pulse" />
            <span>{promoContent.turboBanner.title || 'MODO TURBO ACTIVADO:'}</span>
          </div>
          <span className="font-semibold text-white/95">
            {promoContent.turboBanner.text || 'Renovación automática cada 20 minutos las 24 horas · Tus anuncios siempre arriba en primera posición'}
          </span>
          {promoContent.turboBanner.cta ? (
            <button
              onClick={scrollToOffer}
              className="inline-flex items-center gap-1 font-black text-yellow-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer text-xs sm:text-sm active:scale-95 whitespace-nowrap ml-1"
            >
              <span>{promoContent.turboBanner.cta}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NAVBAR BLANCA LIMPIA (AutoPubli24 · SIN BOTONES EN MÓVIL)             */}
      {/* ========================================================================= */}
      <nav className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 relative z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo AutoPubli24 (Limpio y directo en móvil) */}
          <a href="#" className="flex items-center gap-1 shrink-0 text-xl sm:text-2xl font-black tracking-tight text-slate-950">
            <span>AutoPubli</span>
            <span className="text-[#00a651]">24</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#como-funciona" className="hover:text-[#00a651] transition-colors">
              Cómo Funciona
            </a>
            <a href="#demo" className="hover:text-[#00a651] transition-colors">
              Probar Demo
            </a>
            <a href="#opiniones" className="hover:text-[#00a651] transition-colors">
              Opiniones
            </a>
            <a href="#oferta" className="hover:text-[#00a651] transition-colors">
              Precios
            </a>
          </div>

          {/* Action Buttons: VISIBLE ÚNICAMENTE EN ORDENADOR (MD+), OCULTO EN MÓVIL */}
          <div className="hidden md:flex items-center gap-2.5">
            {onOpenExtensionModal && (
              <button
                onClick={onOpenExtensionModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Extensión</span>
              </button>
            )}

            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-green-50 hover:bg-green-100 border border-green-300 text-green-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-green-600 fill-current shrink-0" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={scrollToOffer}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00a651] hover:bg-green-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Activar Ahora</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 4. HERO SECTION (100% OPTIMIZADO PARA MÓVIL)                              */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-16 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-black mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>{promoContent.hero.badge}</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-4">
            {promoContent.hero.titleLine1}{' '}
            <span className="text-[#00a651] block sm:inline">{promoContent.hero.titleHighlight}</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto mb-6 leading-relaxed">
            {promoContent.hero.description}
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
                src="/src/assets/images/autopubli_dashboard_1791066162940.jpg"
                alt="Panel de control AutoPubli24 y rotación automática en nube"
                className="w-full aspect-[16/9] object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-slate-950/95 text-white flex items-center justify-between text-[11px] sm:text-xs font-bold border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Rotación cada 20 min activa
                </span>
                <span className="text-slate-300 font-mono">Móvil apagado en nube</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4B. BANNER TÉCNICO: CONTROL DE PLAZAS POR CIUDAD                          */}
      {/* ========================================================================= */}
      <div className="bg-slate-950 text-white py-3 sm:py-3.5 px-4 border-y border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00a651]"></span>
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-200">
              <span className="font-bold text-white">{promoContent.urgencyBanner.label}</span> {promoContent.urgencyBanner.text}{' '}
              <span className="text-[#00a651] font-bold">{promoContent.urgencyBanner.highlight}</span>
            </p>
          </div>

          <button
            onClick={scrollToOffer}
            className="text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer shrink-0 transition-colors whitespace-nowrap"
          >
            {promoContent.urgencyBanner.cta}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BLOQUE DE BENEFICIOS CLAVE CON IMÁGENES REALES                         */}
      {/* ========================================================================= */}
      <section id="como-funciona" className="py-10 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full mb-2 inline-block">
              {promoContent.benefits.badge}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-950">
              {promoContent.benefits.title}
            </h2>
            {promoContent.benefits.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                {promoContent.benefits.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6">
            {promoContent.benefits.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-slate-50 border-2 border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                    {idx === 0 && <Smartphone className="w-5 h-5" />}
                    {idx === 1 && <ShieldCheck className="w-5 h-5" />}
                    {idx >= 2 && <Lock className="w-5 h-5" />}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
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

          <div className="flex animate-marquee gap-5 sm:gap-7 items-center">
            {/* Duplicamos la lista para hacer el bucle infinito 100% fluido y sin cortes */}
            {[...promoContent.portals.logos, ...promoContent.portals.logos].map((portal, idx) => (
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
          
          {/* Icono de Escudo con Check en círculo verde */}
          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-[#00a651] text-[#00a651] flex items-center justify-center mx-auto mb-5 shadow-2xs">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
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

      {/* ========================================================================= */}
      {/* 6. OFERTA Y FORMULARIO (HASTA 3 PÁGINAS INCLUIDAS)                       */}
      {/* ========================================================================= */}
      <section id="oferta" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          
          <span className="text-xs font-black uppercase tracking-wider text-green-800 bg-green-100 border border-green-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-2xs">
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
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {isSimpleMode ? '¡Solicitud Lista para WhatsApp!' : promoContent.offer.successMessage.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
                  {isSimpleMode
                    ? `Hemos preparado tu solicitud para el teléfono ${whatsappNumber} con tu plan de ${currentPrice}€ (${paymentMethod === 'bizum' ? 'Bizum' : 'Paysafecard'}). Pulsa el botón para continuar la conversación y dejarlo configurado:`
                    : promoContent.offer.successMessage.description}
                </p>
                <a
                  href={`https://wa.me/${getWhatsAppTargetNumber()}?text=${encodeURIComponent(
                    isSimpleMode
                      ? getClientWhatsAppMessage()
                      : `Hola, acabo de tramitar el pago de ${currentPrice}€ por ${paymentMethod.toUpperCase()} para el teléfono ${whatsappNumber}. Por favor activadme las 3 páginas del servicio.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm rounded-xl shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>
                    {isSimpleMode ? 'Continuar por WhatsApp Ahora →' : promoContent.offer.successMessage.whatsappConfirmButtonText}
                  </span>
                </a>
              </div>
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
                      <div className="text-xs font-bold">{promoContent.offer.durations.sevenDays.label}</div>
                      <div className="text-[11px] text-slate-400 line-through">{promoContent.offer.durations.sevenDays.originalPrice}€</div>
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
                      <div className="text-xs font-bold">{promoContent.offer.durations.thirtyDays.label}</div>
                      <div className="text-[11px] text-slate-400 line-through">{promoContent.offer.durations.thirtyDays.originalPrice}€</div>
                      <div className="text-base font-black text-green-700 font-mono">{promoContent.offer.durations.thirtyDays.price}€</div>
                      <div className="text-[10px] text-green-700 font-semibold mt-0.5">{promoContent.offer.durations.thirtyDays.note}</div>
                    </button>
                  </div>
                </div>

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
                      <span className="text-[10px] text-slate-500">Desde tu banco al instante</span>
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
                  {/* EN MODO SIMPLIFICADO: queda completamente oculto */}
                  {!isSimpleMode && (
                    paymentMethod === 'bizum' ? (
                      <div className="p-3.5 bg-green-50 border border-green-300 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Teléfono Bizum:</span>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-sm font-mono text-slate-900">{bizumPhone}</strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(bizumPhone.replace(/\s+/g, ''), 'phone')}
                              className="text-[10px] font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded cursor-pointer"
                            >
                              {copiedField === 'phone' ? '¡Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-green-200">
                          <span className="text-slate-600">Concepto:</span>
                          <strong className="font-mono text-slate-900">{bizumConcept}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-blue-50 border border-blue-300 rounded-xl space-y-2 text-xs">
                        <p className="font-semibold text-blue-950 text-[11px]">
                          Pide un ticket Paysafecard de <strong className="text-slate-900">{currentPrice}€</strong> en cualquier estanco e introduce aquí tu código PIN:
                        </p>
                        <input
                          type="text"
                          required={paymentMethod === 'paysafecard'}
                          placeholder="0123 4567 8901 2345"
                          maxLength={19}
                          value={paysafecardPin}
                          onChange={(e) => setPaysafecardPin(formatPaysafecardPin(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg font-mono text-base tracking-widest text-slate-900"
                        />
                      </div>
                    )
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm sm:text-base rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-current text-yellow-300" />
                  <span>{promoContent.offer.submitButtonPrefix} ({currentPrice}€)</span>
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
            <button
              onClick={scrollToOffer}
              className="text-slate-900 font-bold hover:text-[#00a651] transition-colors cursor-pointer"
            >
              Activar Anuncio
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-green-600 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#00a651] fill-current" />
              <span>WhatsApp de Ayuda</span>
            </button>
            <span className="text-slate-300">·</span>
            <div className="inline-flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#00a651]" />
              <span>Garantía 100%</span>
            </div>
            <span className="text-slate-300">·</span>
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-[11px]"
              title="Acceso de Administrador"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Admin</span>
            </button>
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

    </div>
  );
};
