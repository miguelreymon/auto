import React from 'react';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface PainVsSolutionProps {
  onOpenCheckout: () => void;
}

export const PainVsSolution: React.FC<PainVsSolutionProps> = ({ onOpenCheckout }) => {
  const painPoints = [
    'Esclavo del móvil: tienes que estar entrando manualmente cada 20-30 minutos para renovar.',
    'Caída instantánea: a los 15 minutos de publicar ya estás en la página 3 y nadie ve tu anuncio.',
    'Cero clientes de madrugada: pierdes llamadas cuando estás durmiendo o descansando.',
    'Riesgo de baneo: si copias y pegas manualmente con la misma IP o texto te bloquean la cuenta.',
    'Estrés y agotamiento: pasas horas perdiendo el tiempo en vez de atender clientes.'
  ];

  const solutionPoints = [
    '100% Manos Libres: configuras tu anuncio en 2 minutos y el software lo renueva cada 20 minutos sin parar.',
    'Permanencia en Posición #1: tus anuncios aparecen siempre arriba del todo donde los clientes hacen clic.',
    'Clientes 24 Horas al Día: capta contactos mientras duermes, entrenas o atiendes a otros clientes.',
    'Tecnología Anti-Baneo Avanzada: rotación inteligente de títulos, fotos y proxies para máxima seguridad.',
    'Multiplica tus ingresos x3 a x5: más llamadas, más clientes y todo el tiempo libre para ti.'
  ];

  return (
    <section id="comparativa" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <span>Diferencia Radical</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 normal-case font-normal">Deja de perder tiempo y clientes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            ¿Por Qué los Anunciantes Que Usan AutoPubli Ganchan Más?
          </h2>
          <p className="text-base sm:text-lg text-neutral-300">
            En las páginas de contactos, el 90% de los contactos se van a los anuncios de la primera página. Quien está arriba, se lleva el cliente.
          </p>
        </div>

        {/* Side-by-side comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: The painful manual way */}
          <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-2">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>La Forma Agotadora (Publicar a Mano)</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                Lo que hace el 80% de la gente y por qué terminan frustrados y sin llamadas:
              </p>

              <ul className="space-y-4">
                {painPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                    <XCircle className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-red-950/80 text-xs text-red-300 font-mono">
              Resultado: Horas de trabajo perdido y pocos contactos
            </div>
          </div>

          {/* Right: The automated winning way */}
          <div className="bg-emerald-950/25 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-emerald-950/30 relative">
            <div className="absolute -top-3 right-6 bg-emerald-400 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              La Forma Inteligente
            </div>

            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Con AutoPubli 24/7 (Piloto Automático)</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 mb-6">
                La ventaja injusta para multiplicar tus contactos sin esfuerzo:
              </p>

              <ul className="space-y-4">
                {solutionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-emerald-900/60 flex items-center justify-between">
              <span className="text-xs text-emerald-300 font-mono font-semibold">
                Resultado: Posición #1 garantizada 24/7
              </span>

              <button
                onClick={onOpenCheckout}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Cambiarme al Automático</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
