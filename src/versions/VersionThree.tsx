import React, { useState } from 'react';
import { 
  Zap, 
  MessageCircle, 
  Check, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Award,
  Clock,
  Smartphone
} from 'lucide-react';
import { PricingPlan, LeadData } from '../types';

interface VersionThreeProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
  onLeadCaptured: (lead: LeadData) => void;
}

export const VersionThree: React.FC<VersionThreeProps> = ({
  onOpenCheckout,
  onOpenWhatsApp,
  onSelectPlan,
  onLeadCaptured,
}) => {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickSuccess, setQuickSuccess] = useState(false);

  const handleQuickLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone.trim()) return;
    setQuickSuccess(true);
    onLeadCaptured({
      name: 'Usuario Minimal',
      phone: quickPhone,
      email: '',
      interestedPlan: 'Plan Mes Completo',
    });
  };

  return (
    <div className="bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Hero Section V3 (Apple-Grade Minimalist Statement) */}
      <section className="pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Subtle minimal badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
            <span>Simplicidad Absoluta · Resultados Inmediatos</span>
          </div>

          {/* Imposing typographic headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] mb-6">
            Tu anuncio. Arriba.<br />
            <span className="text-green-600">Cada 20 minutos.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Sin configuraciones difíciles. Sin tocar nada. Conecta tu teléfono y deja que el software mantenga tu anuncio en el puesto número uno las 24 horas.
          </p>

          {/* Primary Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto px-8 py-4.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-current text-green-400" />
              <span>Activar Ahora (50% Descuento)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-4.5 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-base rounded-full border border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-green-600 fill-green-600" />
              <span>Consultar por WhatsApp</span>
            </button>
          </div>

          {/* Minimal Luxury Image Showcase */}
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
            <img
              src="/src/assets/images/apple_minimal_luxury_phone_1790956540848.jpg"
              alt="Móvil elegante con el puesto #1 activo 24/7"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Auto-publicador: Puesto #1 Activo
              </span>
              <span className="text-slate-400 font-mono">Frecuencia: Cada 20 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Before vs After Slider (WOW Element) */}
      <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            COMPARATIVA DIRECTA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">
            Elige Cómo Quieres Trabajar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Toca los botones para ver la diferencia radical entre publicar a mano o con AutoPubli:
          </p>

          {/* Interactive Switch Buttons */}
          <div className="inline-flex p-1 bg-slate-200 rounded-full mb-8">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'before'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ❌ Publicar a Mano (Agotador)
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'after'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✅ Con AutoPubli 24/7 (Piloto Automático)
            </button>
          </div>

          {/* Interactive Comparison Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg text-left transition-all">
            {activeTab === 'before' ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                  <X className="w-5 h-5 shrink-0" />
                  <span>Publicando a Mano (La Forma Frustrante):</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Tu anuncio se cae a la página 5 o 10 a los 15 minutos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Pierdes más de 3 horas al día pendiente del móvil para renovar.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Cuando duermes o sales a comer, no entra ni una sola llamada.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Riesgo de que te bloqueen por republicar con la misma IP.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-100 text-xs font-bold text-red-600">
                  Resultado: Poco trabajo y muchísimo estrés.
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                  <Check className="w-5 h-5 shrink-0" />
                  <span>Con AutoPubli 24/7 (La Forma Inteligente):</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-800 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Tus anuncios siempre en la primera posición (#1) cada 20 minutos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Cero horas perdidas: el software lo hace todo solo en la nube.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Tu teléfono suena las 24 horas del día sin parar, incluso de noche.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>100% protegido con tecnología anti-bloqueo.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-green-700">
                    Resultado: Agenda llena y tiempo libre para ti.
                  </span>
                  <button
                    onClick={onOpenCheckout}
                    className="text-xs font-bold text-slate-900 underline hover:text-green-600 cursor-pointer"
                  >
                    Activar Ahora →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1-Tap Quick Activation & Pricing */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-green-700 block mb-2">
            PRECIO CLARO Y DIRECTO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-3">
            79€ por un mes completo
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8">
            50% de descuento incluido. Sin permanencia ni cuotas ocultas.
          </p>

          {/* Clean 1-Tap Form */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-left mb-6">
            {quickSuccess ? (
              <div className="text-center py-4">
                <span className="text-3xl block mb-2">🎉</span>
                <h4 className="text-lg font-bold text-slate-900 mb-1">¡Solicitud Enviada!</h4>
                <p className="text-xs text-slate-600">
                  Te escribimos a tu WhatsApp {quickPhone} en menos de 2 minutos para dejarte la cuenta activa.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickLead} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pon tu WhatsApp para empezar:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-base focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer shadow active:scale-95"
                  >
                    Activar por 79€ (1 Mes)
                  </button>

                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="px-5 py-4 bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Bizum / WhatsApp</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Garantía 14 Días
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-600" />
                    Listo en 2 minutos
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
