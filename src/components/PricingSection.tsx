import React from 'react';
import { Check, Zap, MessageCircle, ShieldCheck } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
  onOpenLeadModal: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, onOpenLeadModal }) => {
  const plans: PricingPlan[] = [
    {
      id: 'weekly',
      name: 'Plan 1 Semana',
      badge: 'Para Probar',
      originalPrice: 59,
      currentPrice: 39,
      period: 'por 7 días',
      description: 'Ideal para probar el sistema y llenarte de llamadas durante una semana.',
      features: [
        'Publicación cada 20 minutos exacta',
        'Puesto #1 en páginas de contactos y foros',
        'Funciona con el móvil apagado',
        'Soporte por WhatsApp incluido',
      ],
      ctaText: 'ACTIVAR 1 SEMANA (39€)',
    },
    {
      id: 'monthly',
      name: 'Plan 1 Mes Completo',
      badge: 'MÁS VENDIDO · 50% DTO',
      popular: true,
      originalPrice: 158,
      currentPrice: 79,
      period: 'por 30 días',
      savings: 'Ahorras 79€ hoy',
      description: 'El que usa el 90% de anunciantes para tener clientes todos los días del mes.',
      features: [
        'Publicación automática cada 20 minutos 24/7',
        'Hasta 5 anuncios activos a la vez',
        'Sistema anti-bloqueo 100% seguro',
        'Cambio de fotos y textos gratis cuando quieras',
        'Garantía total de devolución de 14 días',
        'Soporte prioritario directo por WhatsApp',
      ],
      ctaText: '👉 ACTIVAR 1 MES (79€ - 50% DTO)',
    },
  ];

  return (
    <section id="precios" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-3 py-1 rounded-full inline-block mb-3">
          OFERTA DE LANZAMIENTO
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
          Elige Tu Plan y Empieza a Publicar en 2 Minutos
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-lg mx-auto">
          Con 1 solo cliente que te entre ya has recuperado todo el dinero del mes.
        </p>

        {/* 2 Big Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8 text-left">
          {plans.map((p) => {
            const isPop = p.popular;
            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  isPop
                    ? 'border-4 border-green-500 bg-green-50/50 shadow-xl relative'
                    : 'border-2 border-slate-200 bg-white shadow-xs'
                }`}
              >
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-600 text-white font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow">
                    🔥 EL MÁS ELEGIDO · 50% DESCUENTO
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                    <span className="text-xs font-bold text-slate-500">{p.badge}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4">{p.description}</p>

                  {/* Price */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-slate-400 line-through font-mono">
                        {p.originalPrice}€
                      </span>
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono">
                        {p.currentPrice}€
                      </span>
                      <span className="text-xs font-bold text-slate-500">{p.period}</span>
                    </div>
                    {p.savings && (
                      <span className="text-xs font-bold text-green-700 block mt-1">
                        ✓ {p.savings}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-700 font-medium">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => onSelectPlan(p)}
                    className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
                      isPop
                        ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30 text-lg'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    <span>{p.ctaText}</span>
                  </button>
                  <span className="text-[11px] text-slate-500 text-center block mt-2">
                    Activación inmediata al momento
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bizum / WhatsApp Alternative Banner */}
        <div className="max-w-2xl mx-auto p-5 bg-green-100 border-2 border-green-500 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="text-base font-black text-green-950">¿Prefieres pagar por BIZUM o tienes dudas?</h4>
              <p className="text-xs text-green-800 font-medium">Te lo dejamos todo configurado nosotros mismos por WhatsApp.</p>
            </div>
          </div>

          <button
            onClick={onOpenLeadModal}
            className="w-full sm:w-auto px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-black text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            Hablar por WhatsApp
          </button>
        </div>

        {/* 14 Day Guarantee Box */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-700">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
          <span>Garantía de Devolución 100%: Si no tienes más llamadas, te devolvemos tu dinero.</span>
        </div>
      </div>
    </section>
  );
};
