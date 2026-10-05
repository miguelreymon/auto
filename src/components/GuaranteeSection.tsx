import React from 'react';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface GuaranteeSectionProps {
  onOpenCheckout: () => void;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-neutral-900/60 to-neutral-950 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative bg-neutral-950 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Guarantee Badge Stamp Icon */}
            <div className="shrink-0 flex flex-col items-center text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex flex-col items-center justify-center p-2 text-emerald-400 shadow-xl shadow-emerald-500/20">
                <ShieldCheck className="w-10 h-10 mb-1" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">GARANTÍA 100%</span>
                <span className="text-xs font-extrabold text-white">14 DÍAS</span>
              </div>
              <span className="text-[11px] text-neutral-400 mt-2 font-mono">SIN RIESGO</span>
            </div>

            {/* Guarantee Content */}
            <div className="text-center md:text-left">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Nuestra Garantía Blindada de Resultados
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Si no multiplicas tus contactos y llamadas, te devolvemos hasta el último céntimo.
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Estamos tan seguros de que la auto-publicación cada 20 minutos te traerá más clientes que cualquier otro método, que asumimos todo el riesgo. Pruébalo durante 14 días completos. Si por cualquier motivo no estás 100% satisfecho, solo escríbenos por WhatsApp o email y te devolveremos el 100% de tu dinero de inmediato. Sin preguntas ni letra pequeña.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-300 mb-6">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Devolución en 24h
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Cancelación en 1 clic
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Soporte continuo
                </span>
              </div>

              <div>
                <button
                  onClick={onOpenCheckout}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <span>PROBAR AHORA SIN RIESGO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
