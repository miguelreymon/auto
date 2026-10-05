import React from 'react';
import { Zap, MessageCircle, CheckCircle2, ShieldCheck, Star } from 'lucide-react';

interface HeroSectionProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCheckout,
  onOpenWhatsApp,
  onExploreDemo,
}) => {
  return (
    <section className="pt-6 pb-12 sm:pt-10 sm:pb-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Simple red / green attention tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-xs sm:text-sm font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
          <span>¡TUS ANUNCIOS SIEMPRE EN EL PUESTO #1!</span>
        </div>

        {/* Big direct title, very easy to understand */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Tus Anuncios se Publican Solos{' '}
          <span className="text-green-600 underline decoration-green-400 decoration-wavy decoration-2">
            Cada 20 Minutos
          </span>
        </h1>

        {/* Short, ultra-simple subheadline */}
        <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto mb-6 font-medium">
          Tú no tienes que hacer nada. El programa sube tu anuncio a primera posición las 24 horas y tu teléfono <strong className="text-slate-900 font-bold">no para de recibir llamadas y WhatsApps</strong>.
        </p>

        {/* Primary CTA - Big, bold, irresistible */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={onOpenCheckout}
            className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl shadow-green-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-6 h-6 fill-current text-yellow-300" />
            <span>ACTIVAR MI ANUNCIO AHORA (50% DTO)</span>
          </button>

          <button
            onClick={onOpenWhatsApp}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-green-700 font-bold text-base border-2 border-green-500 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-green-600 text-green-600" />
            <span>Pedir por WhatsApp</span>
          </button>
        </div>

        {/* 3 bullet benefits - very clear and short */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 mb-8">
          <div className="flex items-center gap-1.5 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Listo en 2 minutos</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5 text-slate-800">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Funciona con el móvil apagado</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 text-slate-800">
            <span className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </span>
            <span>+1,400 personas lo usan</span>
          </div>
        </div>

        {/* Big Bright Visual Image of Phone with Calls & Leads */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-xl max-w-3xl mx-auto">
          <img
            src="/src/assets/images/light_mobile_phone_leads_1790956054092.jpg"
            alt="Teléfono móvil con la app activada publicando anuncios cada 20 minutos y recibiendo llamadas de clientes"
            className="w-full aspect-[4/3] object-cover"
          />

          {/* Quick Floating Banner on bottom of image */}
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-sm sm:text-base font-bold text-green-400 flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span>PILOTO AUTOMÁTICO: ACTIVO</span>
              </div>
              <p className="text-xs text-slate-300">
                Tu anuncio se renueva cada 20 min en Pasión y foros adultos.
              </p>
            </div>

            <button
              onClick={onExploreDemo}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Probar el Botón en la Demo 👇
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
