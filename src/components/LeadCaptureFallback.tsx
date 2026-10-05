import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { LeadData } from '../types';

interface LeadCaptureFallbackProps {
  onLeadCaptured?: (lead: LeadData) => void;
}

export const LeadCaptureFallback: React.FC<LeadCaptureFallbackProps> = ({ onLeadCaptured }) => {
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSuccess(true);
    if (onLeadCaptured) {
      onLeadCaptured({
        name: '',
        phone,
        email: '',
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            ¿Tienes Preguntas? Te Escribimos por WhatsApp
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Pon tu número y un especialista te ayuda a activar tu anuncio en 2 minutos:
          </p>

          {isSuccess ? (
            <div className="p-4 bg-green-50 border-2 border-green-500 rounded-2xl text-green-900 font-bold text-sm">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span>¡Recibido! Te estamos escribiendo al WhatsApp {phone} ahora mismo.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="tel"
                required
                placeholder="Escribe tu número de WhatsApp aquí"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 font-mono text-base placeholder-slate-400 focus:outline-none focus:border-green-500 transition-colors text-center"
              />

              <button
                type="submit"
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>ENVIAR Y QUE ME ESCRIBAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[11px] text-slate-400 block">
                🔒 100% privado y confidencial. Cero spam.
              </span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
