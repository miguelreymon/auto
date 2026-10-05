import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MessageCircle, 
  Flame, 
  PhoneCall, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { PricingPlan, LeadData } from '../types';

interface VersionTwoProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
  onLeadCaptured: (lead: LeadData) => void;
}

export const VersionTwo: React.FC<VersionTwoProps> = ({
  onOpenCheckout,
  onOpenWhatsApp,
  onSelectPlan,
  onLeadCaptured,
}) => {
  // Interactive Calculator State
  const [dailyClients, setDailyClients] = useState(3);
  const averagePricePerService = 70; // average in contact ads
  const monthlyExtra = dailyClients * averagePricePerService * 25; // estimated monthly gain

  // Sound simulation toggle
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeCallNotice, setActiveCallNotice] = useState('💬 Nuevo WhatsApp: «Hola guapa, ¿tienes cita hoy a las 18h?»');

  const incomingAlerts = [
    '💬 Nuevo WhatsApp: «Hola, te he visto en el anuncio de primera página»',
    '📞 Llamada entrante (Madrid Centro) para tu anuncio',
    '🔥 ¡Anuncio republicado en Pasión! Posición: PUESTO #1',
    '💬 Nuevo WhatsApp: «¿Dónde estás ubicada? Me interesa»',
    '📞 Llamada entrante (Valencia) hace 10 segundos',
    '🔥 ¡Anuncio republicado en Foros Adultos! Posición: TOP 1',
  ];

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % incomingAlerts.length;
      setActiveCallNotice(incomingAlerts[idx]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      {/* Dynamic Alert Ticker */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-2 px-4 text-xs font-black text-center flex items-center justify-center gap-2 shadow-xs">
        <Flame className="w-4 h-4 fill-current animate-bounce" />
        <span className="uppercase tracking-wider">MODO TURBO ACTIVADO:</span>
        <span className="truncate">{activeCallNotice}</span>
      </div>

      {/* Hero Section V2 (WOW Factor) */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-20 relative">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs sm:text-sm mb-4 animate-pulse">
            <span>🔥 EL TRUCO QUE USAN LOS QUE MÁS FACTURAN</span>
          </div>

          {/* Explosive Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] mb-5">
            Llena Tu Móvil de Clientes Publicando en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600">
              PUESTO #1 Cada 20 Minutos
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-700 font-bold max-w-2xl mx-auto mb-8 leading-snug">
            Mientras tu competencia se cansa renovando a mano, nuestro robot sube tu anuncio a la cima las 24 horas. <span className="text-green-600 underline">Tú solo cobras</span>.
          </p>

          {/* Big High-Energy CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-green-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              <span>QUIERO QUE SUBA SOLO CADA 20 MIN</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-5 bg-white hover:bg-slate-50 text-green-700 font-black text-base border-3 border-green-500 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Preguntar por WhatsApp</span>
            </button>
          </div>

          {/* Feature Image with WOW effect */}
          <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden border-4 border-green-500 shadow-2xl bg-white mb-12">
            <img
              src="/src/assets/images/wow_viral_leads_phone_1790956525577.jpg"
              alt="Móvil con cientos de mensajes de WhatsApp y llamadas"
              className="w-full aspect-[4/3] object-cover"
            />

            {/* Floating Live Card Over Image */}
            <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md border-2 border-green-500 rounded-2xl p-3.5 shadow-xl text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  EN DIRECTO
                </span>
                <span className="text-[10px] font-bold text-slate-500 font-mono">Top #1 Pasión</span>
              </div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {activeCallNotice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Income Calculator (WOW Feature) */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-green-50/70 to-white border-y-2 border-green-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-black text-green-700 bg-green-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            CALCULADORA DE INGRESOS EXTRA
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
            ¿Cuánto Dinero Estás Perdiendo por No Estar Arriba?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-lg mx-auto">
            Mueve la barra para ver cuánto dinero extra ganas si tus anuncios están siempre en la primera posición:
          </p>

          <div className="bg-white border-3 border-green-500 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-black text-slate-800">
                  Llamadas o citas extra que quieres al día:
                </label>
                <span className="text-2xl font-black text-green-600 font-mono">
                  {dailyClients} al día
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={dailyClients}
                onChange={(e) => setDailyClients(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-bold mt-1">
                <span>1 al día</span>
                <span>4 al día</span>
                <span>8 al día</span>
              </div>
            </div>

            {/* Calculated Box */}
            <div className="p-5 bg-green-500 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-green-100 font-bold block">
                  Beneficio Extra Estimado para Ti:
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono">
                  +{monthlyExtra.toLocaleString()}€{' '}
                  <span className="text-lg font-bold text-green-100 font-sans">/mes</span>
                </div>
                <span className="text-xs text-green-100">
                  Calculado con un promedio mínimo de {averagePricePerService}€ por cita.
                </span>
              </div>

              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-green-950 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                ¡QUIERO GANAR ESTO AHORA!
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center font-medium">
              💡 La herramienta cuesta solo <strong>79€ al mes</strong> (2,60€ al día). Con la primera llamada ya ganas dinero.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Steps in Comic / High Visual Style */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-8">
            Lo Que Tienes Que Hacer (Solo 3 Pasos)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl hover:border-green-500 transition-colors">
              <span className="text-3xl font-black text-green-600 block mb-2 font-mono">01.</span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Nos dices tu teléfono</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pones tu texto, tus fotos y el número donde quieres que te llamen los clientes.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl hover:border-green-500 transition-colors">
              <span className="text-3xl font-black text-green-600 block mb-2 font-mono">02.</span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Le das al botón verde</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Un solo clic y queda encendido en la nube. Puedes apagar el móvil si quieres.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl hover:border-green-500 transition-colors">
              <span className="text-3xl font-black text-green-600 block mb-2 font-mono">03.</span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Atiendes llamadas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada 20 minutos tu anuncio vuelve al puesto #1 y no paras de recibir contactos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Super Simple Pricing Cards */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Actívalo Ahora con 50% de Descuento
          </h2>
          <p className="text-slate-600 mb-8 font-medium">
            Garantía de 14 días. Si no te gusta, te devolvemos el dinero en 1 minuto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-8">
            {/* Weekly */}
            <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Plan 1 Semana</h3>
                <p className="text-xs text-slate-500 mb-4">Para probar sin compromiso</p>
                <div className="text-3xl font-black text-slate-900 font-mono mb-4">
                  39€ <span className="text-xs text-slate-400 font-normal">/semana</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium mb-6">
                  <li>✓ Publicación cada 20 min</li>
                  <li>✓ Puesto #1 en portales adultos</li>
                  <li>✓ Soporte por WhatsApp</li>
                </ul>
              </div>
              <button
                onClick={onOpenCheckout}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                PROBAR 1 SEMANA
              </button>
            </div>

            {/* Monthly VIP */}
            <div className="bg-white border-4 border-green-500 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3.5 right-6 bg-red-600 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                50% DESCUENTO HOY
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Plan Mes Completo</h3>
                <p className="text-xs text-slate-500 mb-4">El que todos eligen</p>
                <div className="text-4xl font-black text-slate-900 font-mono mb-4">
                  79€ <span className="text-xs text-slate-400 font-normal">/mes (antes 158€)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-bold mb-6">
                  <li className="text-green-700">✓ Publicación cada 20 min 24/7</li>
                  <li className="text-green-700">✓ Hasta 5 anuncios a la vez</li>
                  <li className="text-green-700">✓ Protección anti-bloqueo 100%</li>
                  <li className="text-green-700">✓ Soporte VIP en WhatsApp</li>
                </ul>
              </div>
              <button
                onClick={onOpenCheckout}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl text-base shadow-lg shadow-green-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>ACTIVAR 1 MES (79€)</span>
              </button>
            </div>
          </div>

          {/* Quick Bizum notice */}
          <button
            onClick={onOpenWhatsApp}
            className="w-full sm:w-auto px-6 py-3.5 bg-green-100 hover:bg-green-200 text-green-900 font-black text-xs sm:text-sm rounded-2xl border-2 border-green-400 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-green-700" />
            <span>¿Quieres pagar por BIZUM directo? Toca aquí para abrir WhatsApp</span>
          </button>
        </div>
      </section>
    </div>
  );
};
