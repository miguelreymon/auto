import React, { useState } from 'react';
import { 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Flame, 
  ArrowRight, 
  Clock, 
  Globe, 
  Check, 
  Sparkles, 
  HelpCircle, 
  MessageCircle, 
  AlertCircle,
  Download,
  Monitor
} from 'lucide-react';
import { PricingPlan, LeadData } from '../types';
import { downloadExtensionZip } from '../utils/extensionFiles';
import { MobileWebRunner } from '../components/MobileWebRunner';
import { SecureAccountLinker } from '../components/SecureAccountLinker';
import { MultiAdGenerator } from '../components/MultiAdGenerator';

interface VersionFourProps {
  onOpenWhatsApp: () => void;
  onLeadCaptured: (lead: LeadData) => void;
  onOpenExtensionModal?: () => void;
}

export const VersionFour: React.FC<VersionFourProps> = ({
  onOpenWhatsApp,
  onLeadCaptured,
  onOpenExtensionModal,
}) => {
  // In-page Bizum terminal state
  const [selectedPack, setSelectedPack] = useState<'1web' | '5webs'>('5webs');
  const [selectedDuration, setSelectedDuration] = useState<'7days' | '30days'>('30days');

  const pricingMatrix = {
    '1web': {
      '7days': { 
        price: 15, 
        anchor: 39, 
        name: 'Pack 1 Web · 7 Días de Prueba', 
        daily: '2,14€ / día', 
        discount: '-61%',
        desc: 'Ideal para probar en Milanuncios o Milpasiones sin riesgo'
      },
      '30days': { 
        price: 35, 
        anchor: 99, 
        name: 'Pack 1 Web · Mes Completo (30 Días)', 
        daily: '1,16€ / día', 
        discount: '-65%',
        desc: 'Un mes completo de renovaciones cada 20 min en 1 portal'
      }
    },
    '5webs': {
      '7days': { 
        price: 29, 
        anchor: 79, 
        name: 'Pack 5 Webs · 7 Días de Prueba', 
        daily: '5,80€ por web', 
        discount: '-63%',
        desc: 'Prueba en 5 portales a la vez durante una semana'
      },
      '30days': { 
        price: 59, 
        anchor: 199, 
        name: 'Pack 5 Webs · Mes Completo (⭐ MÁS VENDIDO)', 
        daily: '¡Solo 11,80€ al mes por portal!', 
        discount: '-70%',
        desc: 'Máxima cobertura en 5 portales simultáneos 24 horas al día'
      }
    }
  };

  const currentPlan = pricingMatrix[selectedPack][selectedDuration];
  const selectedPlanPrice = currentPlan.price;
  const selectedPlanName = currentPlan.name;

  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bizumStep, setBizumStep] = useState<'input' | 'verifying' | 'active'>('input');
  
  // Payment Method State: Bizum vs Paysafecard
  const [paymentMethod, setPaymentMethod] = useState<'bizum' | 'paysafecard'>('bizum');
  const [paysafecardPin, setPaysafecardPin] = useState<string>('');

  const formatPaysafecardPin = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  };

  // Interactive Schedule Selector State
  const [activeSchedule, setActiveSchedule] = useState<'24h' | 'night' | 'custom'>('24h');

  const bizumPhone = '613 48 92 10';
  const bizumConcept = 'PUB-8492';

  // State for in-page extension download
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const handleDownloadZipDirect = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadExtensionZip();
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber.trim()) return;

    if (paymentMethod === 'paysafecard') {
      const cleanPin = paysafecardPin.replace(/\s+/g, '');
      if (cleanPin.length < 16) {
        alert('Por favor, introduce los 16 dígitos del ticket Paysafecard o pulsa en enviar foto por WhatsApp.');
        return;
      }
    }

    setBizumStep('verifying');

    // Simulate instant payment hook detection
    setTimeout(() => {
      setBizumStep('active');
      onLeadCaptured({
        name: paymentMethod === 'paysafecard' ? 'Cliente Paysafecard Efectivo' : 'Cliente Bizum Directo',
        phone: whatsappNumber,
        email: paymentMethod === 'paysafecard' ? `PIN: ${paysafecardPin}` : '',
        interestedPlan: `${selectedPlanName} (${paymentMethod === 'paysafecard' ? 'Paysafecard' : 'Bizum'})`,
      });
    }, 2800);
  };

  const portalsList = [
    { name: 'Milanuncios & Milpasiones', status: '100% Compatible', interval: 'Cada 20 min', rank: 'Rotación Activa' },
    { name: 'Loquosex & NuevoLoquo', status: '100% Compatible', interval: 'Cada 20 min', rank: 'Rotación Activa' },
    { name: 'Agenda69 & Clasificados', status: '100% Compatible', interval: 'Cada 20 min', rank: 'Rotación Activa' },
    { name: 'PasionValencia & Foros', status: '100% Compatible', interval: 'Cada 20 min', rank: 'Rotación Activa' },
  ];

  return (
    <div className="bg-white text-slate-900 selection:bg-green-500 selection:text-white">
      {/* 1. TOP NOTICE: BIZUM & PAYSAFECARD NO CARD BANNER */}
      <div className="bg-green-600 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-black flex items-center justify-center gap-2">
        <Smartphone className="w-4 h-4 shrink-0" />
        <span>PAGO SEGURO POR BIZUM O PAYSAFECARD (EN EFECTIVO EN ESTANCOS) · CERO DATOS DE TARJETA · ACTIVACIÓN AL SEGUNDO</span>
      </div>

      {/* 2. HERO: VALUE PROPOSITION */}
      <section className="pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-black mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>SIN INSTALAR NADA · PAGO POR BIZUM O EFECTIVO EN ESTANCOS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-4">
            Tus Anuncios Saliendo Sin Parar Todo el Día Cada 20 Minutos{' '}
            <span className="text-green-600 block sm:inline">Pagas por BIZUM o PAYSAFECARD y Se Activa al Instante</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            Sin promesas falsas ni tarjetas. Haces un Bizum o compras un código Paysafecard con dinero en metálico en cualquier estanco, y nuestro robot <strong className="text-slate-900 font-bold">mantiene tus anuncios saliendo continuamente arriba cada 20 minutos</strong>.
          </p>

          {/* Hero Feature Visual Image */}
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border-3 border-green-500 shadow-xl bg-white mb-8">
            <img
              src="/src/assets/images/bizum_instant_payment_success_1790956839105.jpg"
              alt="Móvil con confirmación de pago por Bizum y anuncio posicionado en el número 1"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="p-3.5 bg-green-50 border-t border-green-200 flex items-center justify-between text-xs sm:text-sm font-bold text-green-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                Pago Bizum Verificado al Instante
              </span>
              <span className="text-green-700 font-mono">Activación: &lt; 30 segundos</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TERMINAL DE COMPRA POR BIZUM DIRECTA EN LA PÁGINA (COMPRAR SIN SALIR) */}
      <section id="terminal-bizum" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase text-green-700 bg-green-100 px-3 py-1 rounded-full">
              OFERTA DE LANZAMIENTO · TARIFAS CON DESCUENTO BIZUM
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mt-2">
              Elige Tu Plan y Actívalo en 30 Segundos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1">
              Sin suscripciones automáticas ni tarjetas. Pagas exactamente los días que quieras disfrutar mediante Bizum seguro.
            </p>
          </div>

          {/* TARJETAS DE ANCLAJE COMPARATIVAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            {/* Tarjeta 1: Pack 1 Web */}
            <div 
              onClick={() => setSelectedPack('1web')}
              className={`p-6 rounded-3xl border-3 transition-all cursor-pointer bg-white relative ${
                selectedPack === '1web' 
                  ? 'border-green-500 shadow-xl ring-2 ring-green-500/20' 
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  PARA PROBAR SIN RIESGO
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                  1 Portal
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">
                Pack 1 Sola Web
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Tus anuncios saliendo cada 20 minutos en Milanuncios o el portal que tú elijas.
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Prueba 7 Días:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 line-through text-[11px]">39€</span>
                    <strong className="text-base font-black text-slate-900 font-mono">15€</strong>
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1 rounded">-61%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Mes Completo 30 Días:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 line-through text-[11px]">99€</span>
                    <strong className="text-lg font-black text-green-700 font-mono">35€</strong>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1 rounded">-65%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center ${
                  selectedPack === '1web'
                    ? 'bg-green-600 text-white font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedPack === '1web' ? '✓ SELECCIONADO' : 'Seleccionar 1 Web'}
              </button>
            </div>

            {/* Tarjeta 2: Pack 5 Webs (El que queremos que compren) */}
            <div 
              onClick={() => setSelectedPack('5webs')}
              className={`p-6 rounded-3xl border-3 transition-all cursor-pointer bg-white relative ${
                selectedPack === '5webs' 
                  ? 'border-green-500 shadow-xl ring-2 ring-green-500/30' 
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                ⭐ EL MÁS VENDIDO · AHORRAS UN 70%
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-green-700">
                  MÁXIMA COBERTURA
                </span>
                <span className="text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
                  5 Portales
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">
                Pack Multi-Portal (5 Webs)
              </h3>
              <p className="text-xs text-slate-600 mb-2">
                Milanuncios + Milpasiones + Loquosex + NuevoLoquo + Agenda69 a la vez.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-900 rounded-lg text-[10px] sm:text-[11px] font-black mb-3">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>INCLUYE GENERADOR MULTI-ANUNCIOS CON IA</span>
              </div>

              <div className="p-3 bg-green-50/70 rounded-2xl border border-green-200 space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Prueba 7 Días:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 line-through text-[11px]">79€</span>
                    <strong className="text-base font-black text-slate-900 font-mono">29€</strong>
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1 rounded">-63%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-green-200">
                  <span className="font-black text-green-900">Mes Completo 30 Días:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 line-through text-[11px]">199€</span>
                    <strong className="text-xl font-black text-green-700 font-mono">59€</strong>
                    <span className="text-[10px] font-black text-red-700 bg-red-100 px-1.5 py-0.5 rounded">-70%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center ${
                  selectedPack === '5webs'
                    ? 'bg-green-600 text-white font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedPack === '5webs' ? '✓ SELECCIONADO (MÁXIMO AHORRO)' : 'Seleccionar Pack 5 Webs'}
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-white border-3 border-green-500 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
            {bizumStep === 'active' ? (
              /* Success screen */
              <div className="text-center py-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {paymentMethod === 'paysafecard' ? '¡PAYSAFECARD CONFIRMADO! CUENTA ACTIVADA' : '¡BIZUM CONFIRMADO! CUENTA ACTIVADA'}
                </h3>
                <p className="text-sm text-slate-700 max-w-md mx-auto mb-6">
                  Hemos detectado tu pago de <strong>{selectedPlanPrice}€</strong>. Tus anuncios ya están programados para publicarse <strong>cada 20 minutos en rotación continua sin parar</strong>.
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs font-mono space-y-1 mb-6">
                  <div>Teléfono registrado: <strong className="text-slate-900">{whatsappNumber}</strong></div>
                  <div>Método de pago: <strong className={paymentMethod === 'paysafecard' ? 'text-blue-600' : 'text-green-600'}>{paymentMethod === 'paysafecard' ? 'Paysafecard (Efectivo Estanco)' : 'Bizum Directo'}</strong></div>
                  {paymentMethod === 'paysafecard' && (
                    <div>PIN registrado: <strong className="text-slate-800">**** **** **** {paysafecardPin.replace(/\s+/g, '').slice(-4)}</strong></div>
                  )}
                  <div>Plan activo: <strong className="text-green-600">{selectedPlanName}</strong></div>
                  <div>Estado: <strong className="text-green-600">ONLINE 24/7 EN NUBE</strong></div>
                </div>

                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent(
                    paymentMethod === 'paysafecard'
                      ? `Hola, acabo de pagar ${selectedPlanPrice}€ con Paysafecard (PIN: ${paysafecardPin}) para el número ${whatsappNumber} (${selectedPlanName}). Quiero empezar ya.`
                      : `Hola, acabo de pagar ${selectedPlanPrice}€ por Bizum para el número ${whatsappNumber} (${selectedPlanName}). Quiero empezar ya.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base rounded-2xl shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Abrir WhatsApp para Soporte de Bienvenida</span>
                </a>
              </div>
            ) : bizumStep === 'verifying' ? (
              /* Verifying state */
              <div className="text-center py-10 animate-fadeIn">
                <RefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {paymentMethod === 'paysafecard' ? 'Validando PIN Paysafecard con el Servidor...' : 'Detectando Bizum con el Banco...'}
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto mb-2">
                  {paymentMethod === 'paysafecard'
                    ? `Comprobando saldo del ticket de 16 dígitos emitido en estanco para el número ${whatsappNumber}.`
                    : `Conectando con la pasarela bancaria para validar la transferencia del número ${whatsappNumber}.`}
                </p>
                <span className="text-xs font-bold text-green-700 font-mono">
                  Tiempo estimado: 3 segundos
                </span>
              </div>
            ) : (
              /* Input form */
              <form onSubmit={handleConfirmPayment} className="space-y-6">
                {/* Paso 1A: Selector de Cobertura (1 Web vs 5 Webs) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase text-slate-700">
                      1. Selecciona la Cobertura:
                    </label>
                    <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      OFERTA DE LANZAMIENTO
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPack('1web')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        selectedPack === '1web'
                          ? 'border-green-500 bg-green-50 text-green-950 font-black shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="text-xs sm:text-sm block">1 Sola Web</span>
                      <span className="text-[10px] text-slate-500 block font-normal">Milanuncios o Milpasiones</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPack('5webs')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer relative ${
                        selectedPack === '5webs'
                          ? 'border-green-500 bg-green-50 text-green-950 font-black shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="absolute -top-2.5 right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        ⭐ MÁS VENDIDO
                      </span>
                      <span className="text-xs sm:text-sm block">Pack 5 Webs</span>
                      <span className="text-[10px] text-slate-500 block font-normal">Multi-Portal Simultáneo</span>
                    </button>
                  </div>

                  {/* Paso 1B: Selector de Duración con Precios Ancla */}
                  <label className="text-xs font-black uppercase text-slate-700 block mb-2">
                    Elige el Tiempo de Duración:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Opción 7 Días */}
                    <button
                      type="button"
                      onClick={() => setSelectedDuration('7days')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        selectedDuration === '7days'
                          ? 'border-green-500 bg-green-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-500">PRUEBA 7 DÍAS</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {pricingMatrix[selectedPack]['7days'].discount}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through">
                          {pricingMatrix[selectedPack]['7days'].anchor}€
                        </span>
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {pricingMatrix[selectedPack]['7days'].price}€
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {pricingMatrix[selectedPack]['7days'].daily}
                      </span>
                    </button>

                    {/* Opción 30 Días (El que queremos que compren) */}
                    <button
                      type="button"
                      onClick={() => setSelectedDuration('30days')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                        selectedDuration === '30days'
                          ? 'border-green-500 bg-green-50/90 shadow-md ring-2 ring-green-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-green-700">MES COMPLETO</span>
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-black">
                          {pricingMatrix[selectedPack]['30days'].discount}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-slate-400 line-through">
                          {pricingMatrix[selectedPack]['30days'].anchor}€
                        </span>
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {pricingMatrix[selectedPack]['30days'].price}€
                        </span>
                      </div>
                      <span className="text-[11px] text-green-700 font-bold block mt-0.5">
                        {pricingMatrix[selectedPack]['30days'].daily}
                      </span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    💡 <strong className="text-slate-800">{currentPlan.name}:</strong> {currentPlan.desc}.
                  </p>
                </div>

                {/* Paso 2: Tu número de WhatsApp */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1.5">
                    2. Tu WhatsApp (Donde te enviamos el enlace):
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 font-mono text-base focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Paso 3: Selector de Método de Pago (100% Sin Tarjeta) */}
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-2">
                    3. Selecciona Cómo Quieres Pagar (100% Seguro y Sin Tarjeta):
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bizum')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentMethod === 'bizum'
                          ? 'border-green-500 bg-green-50 text-green-950 font-black shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        <span className="text-xs sm:text-sm font-bold">BIZUM</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">Desde la app de tu banco</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paysafecard')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer relative ${
                        paymentMethod === 'paysafecard'
                          ? 'border-blue-600 bg-blue-50 text-blue-950 font-black shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="absolute -top-2.5 right-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        EFECTIVO
                      </span>
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <span className="text-xs sm:text-sm font-bold">PAYSAFECARD</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">En cualquier estanco</span>
                    </button>
                  </div>

                  {paymentMethod === 'bizum' ? (
                    /* BLOQUE BIZUM */
                    <div className="p-4 bg-green-50 border-2 border-green-400 rounded-2xl space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-black text-green-900 uppercase">
                        <span>Envía el Bizum desde tu banco:</span>
                        <span className="font-mono text-sm bg-green-600 text-white px-2 py-0.5 rounded">
                          {selectedPlanPrice}€
                        </span>
                      </div>

                      {/* Número Bizum con botón de copiar */}
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-green-300">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">
                            Teléfono BIZUM oficial:
                          </span>
                          <span className="text-xl font-black text-slate-900 font-mono tracking-wider">
                            {bizumPhone}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bizumPhone.replace(/\s+/g, ''), 'phone')}
                          className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedField === 'phone' ? '¡COPIADO!' : 'COPIAR NÚMERO'}</span>
                        </button>
                      </div>

                      {/* Concepto con botón de copiar */}
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-green-300 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">
                            Concepto / Asunto:
                          </span>
                          <span className="font-bold font-mono text-slate-800">
                            {bizumConcept}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bizumConcept, 'concept')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedField === 'concept' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* BLOQUE PAYSAFECARD */
                    <div className="p-4.5 bg-blue-50/80 border-2 border-blue-400 rounded-2xl space-y-3.5 animate-fadeIn text-left">
                      <div className="flex items-center justify-between text-xs font-black text-blue-950 uppercase">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          PAGO CON EFECTIVO EN CUALQUIER ESTANCO
                        </span>
                        <span className="font-mono text-sm bg-blue-600 text-white px-2 py-0.5 rounded">
                          {selectedPlanPrice}€
                        </span>
                      </div>

                      {/* Explicación paso a paso de Paysafecard */}
                      <div className="bg-white p-3.5 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-2">
                        <p className="font-semibold text-blue-950 leading-relaxed">
                          <strong>¿Cómo funciona? Es facilísimo y 100% en metálico:</strong>
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                          <li>
                            Vas a cualquier <strong>estanco, quiosco de prensa, locutorio, gasolinera (Repsol/Cepsa) o Correos</strong>.
                          </li>
                          <li>
                            Pides un <strong>PIN Paysafecard</strong> por el importe de tu plan (<strong className="text-slate-900">{selectedPlanPrice}€</strong>) y lo <strong>pagas en efectivo (dinero en mano)</strong>. Cero tarjetas y cero bancos.
                          </li>
                          <li>
                            Te dan un ticket impreso con un código de 16 dígitos. <strong>Escríbelo abajo o mándanos una foto por WhatsApp</strong> y se activa al instante.
                          </li>
                        </ol>
                      </div>

                      {/* Input de PIN de 16 dígitos */}
                      <div>
                        <label className="text-[11px] font-black uppercase text-blue-950 block mb-1">
                          Código PIN de 16 dígitos del ticket:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required={paymentMethod === 'paysafecard'}
                            maxLength={19}
                            placeholder="0123 4567 8901 2345"
                            value={paysafecardPin}
                            onChange={(e) => setPaysafecardPin(formatPaysafecardPin(e.target.value))}
                            className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-slate-900 font-mono text-base font-bold tracking-widest focus:outline-none focus:border-blue-600"
                          />
                          <span className="absolute right-3 top-3.5 text-xs font-mono font-bold text-blue-700">
                            {paysafecardPin.replace(/\s+/g, '').length}/16
                          </span>
                        </div>
                      </div>

                      {/* Botón alternativo para enviar foto por WhatsApp */}
                      <div className="pt-1 text-center">
                        <a
                          href={`https://wa.me/34600000000?text=${encodeURIComponent(
                            `Hola, he comprado un ticket Paysafecard de ${selectedPlanPrice}€ en un estanco para el número ${whatsappNumber} (${selectedPlanName}). Te paso la foto del ticket por aquí para activar mi cuenta.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-950 underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>¿Prefieres enviar foto del ticket por WhatsApp? Toca aquí</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de Confirmación Inmediata */}
                <button
                  type="submit"
                  className={`w-full py-4.5 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                    paymentMethod === 'paysafecard'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                      : 'bg-green-600 hover:bg-green-500 shadow-green-600/30'
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current text-yellow-300" />
                  <span>
                    {paymentMethod === 'paysafecard'
                      ? `VALIDAR PIN Y ACTIVAR AHORA (${selectedPlanPrice}€)`
                      : `YA HE ENVIADO EL BIZUM (${selectedPlanPrice}€ · ACTIVAR AHORA)`}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Garantía 100% 14 Días
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-green-600" />
                    Cero Tarjeta Requerida
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Efectivo en Estancos
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3.5 EL SISTEMA MAESTRO: CERO DESCARGAS, VINCULACIÓN EN 30 SEG Y ROTACIÓN CONTINUA */}
      <section id="sistema-maestro" className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full mb-3 inline-block">
            EL SISTEMA PROFESIONAL SIN COMPLICACIONES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-3">
            Tus Anuncios Saliendo Sin Parar Todo el Día
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            <strong className="text-slate-900 font-bold">Sin promesas falsas:</strong> En estos portales existen anuncios de pago fijados arriba. Lo que nuestro robot hace es <strong className="text-slate-900 font-bold">renovar tu anuncio cada 20 minutos de forma continua</strong> para que esté siempre en los primeros resultados del día y recibas llamadas constantes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm mb-3">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Cero Apps ni Descargas</h3>
              <p className="text-xs text-slate-600">
                No tienes que instalar nada en tu móvil ni descomprimir archivos. Todo se gestiona en la nube.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm mb-3">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Vinculación Segura SSL</h3>
              <p className="text-xs text-slate-600">
                Tus credenciales viajan con cifrado bancario de 256 bits. Cero intervención humana: solo el robot pulsa «Renovar».
              </p>
            </div>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm mb-3">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Tu Móvil Puede Estar Apagado</h3>
              <p className="text-xs text-slate-600">
                El servidor utiliza una conexión móvil 4G española y renueva tu anuncio cada 20 minutos día y noche sin gastar tu batería.
              </p>
            </div>
          </div>

          {/* VINCULADOR SEGURO EN VIVO */}
          <div className="text-center mb-4">
            <span className="text-xs font-black uppercase text-green-800 bg-green-100 px-3 py-1 rounded-full">
              PASO 2: VINCULACIÓN OFICIAL EN 30 SEGUNDOS
            </span>
          </div>

          <SecureAccountLinker 
            onSuccess={(acc) => {
              onLeadCaptured({
                name: 'Cliente Vinculado ' + acc.portal,
                phone: acc.email,
                email: acc.email,
                interestedPlan: 'Plan 1 Mes Completo (Vinculado ' + acc.portal + ')',
              });
            }}
          />

          {/* Secondary Desktop Zip Option for technical users */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>¿Utilizas ordenador de sobremesa y prefieres extensión local de Chrome?</span>
            <button
              onClick={handleDownloadZipDirect}
              disabled={isDownloadingZip}
              className="text-slate-700 hover:text-green-700 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingZip ? 'Preparando...' : 'Descargar extensión opcional (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3.6 MONITOR EN DIRECTO DEL NAVEGADOR (PANELES ACTIVOS) */}
      <section id="demo-movil" className="py-10 sm:py-16 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-green-400 bg-green-950/80 border border-green-500/30 px-3 py-1 rounded-full mb-3 inline-block">
            PANEL DE CONTROL EN TIEMPO REAL
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
            Supervisa Tus Anuncios en Directo
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Comprueba en vivo el reloj de rotación continua, las subidas completadas en las últimas 24 horas y el estado del piloto automático.
          </p>

          <MobileWebRunner />
        </div>
      </section>

      {/* 3.7 GENERADOR Y MULTI-PUBLICADOR DE ANUNCIOS (NUEVA FUNCIÓN VIP) */}
      <section id="multi-anuncios" className="py-12 sm:py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <MultiAdGenerator 
            onSelectPlan={() => {
              setSelectedPack('5webs');
              setSelectedDuration('30days');
            }} 
          />
        </div>
      </section>

      {/* 4. MÓDULO: ¿POR QUÉ BIZUM O PAYSAFECARD Y NADA DE TARJETA? (CONFIANZA TOTAL) */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full mb-3 inline-block">
            MÁXIMA TRANQUILIDAD Y PRIVACIDAD
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-2">
            ¿Por Qué Pagas por Bizum o Paysafecard y Nada de Tarjeta?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-10">
            Sabemos que en este sector buscas máxima discreción y cero complicaciones. Puedes pagar desde tu banco por Bizum o con <strong>dinero en metálico en cualquier estanco con Paysafecard</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {/* Card Paysafecard Full Width */}
            <div className="p-6 bg-blue-50/70 border-2 border-blue-300 rounded-2xl sm:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  PS
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Paysafecard: Compra con Dinero en Metálico en Cualquier Estanco
                  </h3>
                  <span className="text-[11px] text-blue-700 font-bold">100% EFECTIVO · CERO RASTRO BANCARIO</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Si no quieres que figure ningún movimiento en tu cuenta bancaria ni asociar tu número a Bizum, vas a cualquier estanco, quiosco de prensa o gasolinera (Repsol, Cepsa), pides un ticket Paysafecard y pagas en efectivo. Nos facilitas el código de 16 dígitos o nos pasas una foto del ticket por WhatsApp y tu servicio queda activado de inmediato.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Tus Datos Bancarios Nunca Salen de Tu Banco
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No tienes que teclear tu número de tarjeta ni claves secretas en ninguna web. Haces el envío directo desde tu propia app del banco de confianza.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                100% Anónimo y Confidencial
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                En tu extracto bancario solo figura un traspaso normal entre particulares. Cero nombres raros ni menciones de páginas para adultos.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Activación Instantánea por Conexión Automática
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nada más haces el Bizum o introduces tu PIN Paysafecard, nuestro sistema valida el abono y enciende la rotación continua de tus anuncios en menos de 30 segundos.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Cero Cobros Sorpresa ni Renovaciones Ocultas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pagas exactamente lo que compraste. Si quieres renovar el mes que viene, haces otro Bizum o compras otro ticket cuando tú decidas. Nadie te descuenta nada sin tu permiso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MÓDULO: PORTALES Y FOROS SOPORTADOS */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase text-slate-600 bg-slate-200 px-3 py-1 rounded-full mb-3 inline-block">
            COMPATIBILIDAD TOTAL
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-2">
            Funciona en Todos los Portales Principales
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mb-8">
            El sistema se conecta a las plataformas más visitadas de España para mantenerte siempre arriba:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {portalsList.map((portal, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{portal.name}</h3>
                  <span className="text-xs text-green-700 font-semibold block">
                    ✓ {portal.interval}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 bg-green-100 px-2 py-0.5 rounded border border-green-300">
                    {portal.rank}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    {portal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MÓDULO: ROTACIÓN INTELIGENTE ANTI-BANEO */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-3">
            Tecnología Anti-Baneo con IPs Móviles 4G/5G
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-8">
            Para las páginas de contactos, parece que eres una persona real usando el móvil desde su casa.
          </p>

          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl max-w-2xl mx-auto text-left space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <span><strong>Cambio de IP constante:</strong> Cada publicación se hace desde una IP residencial española limpia diferente.</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <span><strong>Rotación de Títulos y Fotos:</strong> El sistema cambia pequeños detalles del texto para que nunca parezca repetido.</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <span><strong>Intervalo de 20 minutos con variación:</strong> Publica exactamente en los tiempos que premian los portales para subir a la cima.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MÓDULO: HORARIOS PROGRAMABLES */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase text-green-700 bg-green-100 px-3 py-1 rounded-full mb-3 inline-block">
            TÚ MANDAS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-2">
            Elige en Qué Horario Quieres Clientes
          </h2>
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            Puedes publicar las 24 horas del día o solo cuando tú quieras atender llamadas:
          </p>

          {/* Interactive Schedule Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setActiveSchedule('24h')}
              className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                activeSchedule === '24h'
                  ? 'border-green-500 bg-white shadow-md'
                  : 'border-slate-200 bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-xs font-bold text-green-700 block mb-1">RECOMENDADO</span>
              <h3 className="text-base font-black text-slate-900">24 Horas al Día</h3>
              <p className="text-[11px] text-slate-500">Publica sin parar día y noche cada 20 min.</p>
            </button>

            <button
              onClick={() => setActiveSchedule('night')}
              className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                activeSchedule === 'night'
                  ? 'border-green-500 bg-white shadow-md'
                  : 'border-slate-200 bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-xs font-bold text-slate-500 block mb-1">TARDE Y NOCHE</span>
              <h3 className="text-base font-black text-slate-900">16:00 a 04:00</h3>
              <p className="text-[11px] text-slate-500">Horas de máxima afluencia de clientes.</p>
            </button>

            <button
              onClick={() => setActiveSchedule('custom')}
              className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                activeSchedule === 'custom'
                  ? 'border-green-500 bg-white shadow-md'
                  : 'border-slate-200 bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-xs font-bold text-slate-500 block mb-1">A TU MEDIDA</span>
              <h3 className="text-base font-black text-slate-900">Horas a Elegir</h3>
              <p className="text-[11px] text-slate-500">Tú nos dices tus horas exactas por WhatsApp.</p>
            </button>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 max-w-lg mx-auto">
            ✓ Puedes cambiar el horario cuando quieras sin coste escribiendo a nuestro WhatsApp.
          </div>
        </div>
      </section>

      {/* 8. MÓDULO: GARANTÍA DE DEVOLUCIÓN POR BIZUM EN 10 MIN */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
            Garantía de Devolución por BIZUM en 10 Minutos
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-6">
            Pruébalo durante 14 días. Si ves que no tienes más llamadas o simplemente no te convence, nos escribes por WhatsApp y <strong className="text-slate-950 font-bold">te hacemos un Bizum de vuelta al mismo número</strong> sin hacerte preguntas ni poner pegas.
          </p>

          <a
            href="#terminal-bizum"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base rounded-2xl shadow-lg transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>ACTIVAR POR BIZUM SIN RIESGO</span>
          </a>
        </div>
      </section>

      {/* 9. MÓDULO: PREGUNTAS FRECUENTES DEL PAGO POR BIZUM */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-left">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase text-slate-500">DUDAS RESUELTAS</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              Preguntas Frecuentes sobre el Pago por Bizum
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                ¿Qué pasa si me equivoco en el concepto del Bizum?
              </h3>
              <p className="text-xs text-slate-600">
                No te preocupes. Con solo enviarnos la captura del Bizum por WhatsApp a nuestro teléfono de soporte, te activamos la cuenta a mano en menos de 2 minutos.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                ¿Funciona con bancos como Santander, BBVA, CaixaBank o Sabadell?
              </h3>
              <p className="text-xs text-slate-600">
                Sí, con el 100% de los bancos españoles que admitan Bizum (CaixaBank, BBVA, Santander, ING, Sabadell, Openbank, Unicaja, etc.).
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                ¿Cuánto tarda en empezar a publicarse mi anuncio?
              </h3>
              <p className="text-xs text-slate-600">
                En cuanto el sistema detecta el Bizum, tu primer ciclo de publicación sube a los 30 segundos y queda programado cada 20 minutos automáticamente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
