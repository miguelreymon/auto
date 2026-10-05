import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cómo funciona exactamente la auto-publicación cada 20 minutos?',
      a: 'Nuestros servidores en la nube ejecutan un protocolo automático que republica y renueva tus anuncios con la frecuencia elegida (20 minutos recomendada). De esta forma, cada vez que un usuario entra o refresca la categoría en su ciudad, tu anuncio aparece en los primeros puestos (#1 a #3) sin que tú tengas que hacer nada.',
    },
    {
      q: '¿Tengo que dejar mi móvil u ordenador encendido todo el día?',
      a: 'No. El sistema corre al 100% en servidores dedicados en la nube. Puedes apagar tu teléfono, salir de viaje o dormir; el sistema seguirá renovando tus anuncios religiosamente cada 20 minutos las 24 horas del día.',
    },
    {
      q: '¿Existe riesgo de que me bloqueen la cuenta o el anuncio?',
      a: 'Hemos desarrollado un sistema con proxies residenciales de alta reputación y rotación inteligente de títulos, fotos y textos. A ojos de las páginas de contactos, parece navegación humana legítima, protegiendo tu cuenta contra baneos.',
    },
    {
      q: 'No tengo experiencia técnica con tecnología, ¿podré usarlo?',
      a: 'Absolutamente. Hemos diseñado el panel para que sea super mega ultra sencillo: solo tiene 1 botón principal para activar y campos donde pegar tu texto y fotos. Además, dispones de soporte VIP directo por WhatsApp para ayudarte en la primera configuración en 3 minutos.',
    },
    {
      q: '¿Cuáles son los métodos de pago aceptados?',
      a: 'Aceptamos Tarjeta de Crédito/Débito (Visa, Mastercard), Bizum (pago instantáneo nacional), Criptomonedas (USDT, BTC) para máxima privacidad y PayPal o Transferencia rápida.',
    },
    {
      q: '¿Cómo funciona la Garantía de Devolución de 14 Días?',
      a: 'Si durante los primeros 14 días no estás completamente satisfecho con la cantidad de llamadas o contactos que estás recibiendo, nos envías un WhatsApp o correo y te devolvemos el 100% de tu dinero en menos de 24 horas. Sin preguntas ni complicaciones.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-neutral-900/30 border-t border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Dudas Frecuentes Resueltas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-base text-neutral-300">
            Todo lo que necesitas saber antes de poner tu publicidad en piloto automático.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900/40 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
