import React from 'react';
import { Star, CheckCheck, MessageCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Elena R.',
      city: 'Madrid Centro',
      message: '«Antes me pasaba el día pegada al móvil renovando como una tonta. Ahora duermo tranquila y me despierto con 8 mensajes de WhatsApp de clientes nuevos.»',
      resultado: 'Triplicó sus llamadas en 3 días',
    },
    {
      name: 'Sara M.',
      city: 'Valencia',
      message: '«No tengo ni idea de informática y lo puse en marcha en 2 minutos. El primer fin de semana ya había recuperado el dinero de sobra.»',
      resultado: 'Teléfono sonando todo el día',
    },
    {
      name: 'David',
      city: 'Barcelona',
      message: '«Llevo la publicidad de varios anuncios. Antes perdía 4 horas al día publicando a mano. Con esto están siempre los primeros sin hacer nada.»',
      resultado: 'Ahorro de 4 horas al día',
    },
  ];

  return (
    <section id="opiniones" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
          Lo Que Dicen Quienes Ya Están en el Puesto #1
        </h2>
        <p className="text-base text-slate-600 mb-8">
          Mensajes reales de personas que ya no pierden el tiempo publicando a mano:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* WhatsApp simulated speech bubble */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3.5 mb-4 text-slate-800 text-sm font-medium leading-relaxed relative">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 mb-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-green-600 text-green-600" />
                    <span>WhatsApp Verificado</span>
                  </div>
                  <p>{t.message}</p>
                  <div className="flex justify-end mt-1 text-[11px] text-green-700 font-bold flex items-center gap-1">
                    <span>Leído</span>
                    <CheckCheck className="w-3.5 h-3.5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                  <span className="text-xs text-slate-500">{t.city}</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg">
                  ✓ {t.resultado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
