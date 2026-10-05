import React from 'react';
import { Phone, CheckCircle, ArrowRight } from 'lucide-react';

interface ThreeStepProcessProps {
  onOpenCheckout: () => void;
}

export const ThreeStepProcess: React.FC<ThreeStepProcessProps> = ({ onOpenCheckout }) => {
  const steps = [
    {
      num: '1',
      title: 'Pones tu anuncio y tu teléfono',
      desc: 'Pegas el texto de tu anuncio, tus fotos y tu número de WhatsApp.',
      badge: 'Tardas 1 minuto',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      numColor: 'text-blue-600',
    },
    {
      num: '2',
      title: 'Pulsas el botón verde "ACTIVAR"',
      desc: 'Con solo 1 toque queda funcionando. Sin instalaciones difíciles ni cosas raras.',
      badge: '1 Solo Clic',
      color: 'bg-green-50 border-green-200 text-green-800',
      numColor: 'text-green-600',
    },
    {
      num: '3',
      title: '¡Listo! Tu anuncio sube cada 20 min',
      desc: 'El programa lo publica solo en el puesto #1 mientras tu teléfono no para de sonar.',
      badge: 'Clientes 24 Horas',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      numColor: 'text-amber-600',
    },
  ];

  return (
    <section id="como-funciona" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
          Tan Fácil Como Contar Hasta 3
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-xl mx-auto">
          Cualquier persona sabe usarlo. No necesitas saber nada de ordenadores.
        </p>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 text-left">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`p-6 rounded-2xl border-2 ${s.color} bg-white shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl font-black ${s.numColor} font-mono`}>
                    PASO {s.num}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span>Super sencillo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Big Action Button */}
        <button
          onClick={onOpenCheckout}
          className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-green-600/25 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <span>👉 EMPEZAR A PUBLICAR EN AUTOMÁTICO</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
