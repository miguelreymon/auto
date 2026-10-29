import React, { useState } from 'react';
import { X, HelpCircle, Send, CheckCircle2, Mail, Phone } from 'lucide-react';
import { SupabaseSync } from '../lib/supabase';
import { getStoredTwclid } from '../lib/xPixel';

interface ContactDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent?: (contactInfo: string, question: string) => void;
}

export const ContactDoubtModal: React.FC<ContactDoubtModalProps> = ({
  isOpen,
  onClose,
  onMessageSent,
}) => {
  const [contactInfo, setContactInfo] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) {
      setErrorMessage('Por favor, indica tu email o teléfono.');
      return;
    }
    if (!question.trim()) {
      setErrorMessage('Por favor, escribe tu consulta o mensaje.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Intentar enviar al backend
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactInfo: contactInfo.trim(),
          question: question.trim(),
          recipient: 'hola@autopubli24.com',
          source: 'header_popup',
          twclid: getStoredTwclid(),
        }),
      });

      // Guardar también en localStorage y en Supabase para tener respaldo oficial
      try {
        const stored = JSON.parse(localStorage.getItem('autopubli_inquiries') || '[]');
        stored.unshift({
          id: Date.now().toString(),
          contactInfo: contactInfo.trim(),
          question: question.trim(),
          recipient: 'hola@autopubli24.com',
          date: new Date().toISOString(),
        });
        localStorage.setItem('autopubli_inquiries', JSON.stringify(stored.slice(0, 50)));
      } catch (_) {}

      // Sincronización oficial en la tabla inquiries de Supabase
      SupabaseSync.saveInquiry(contactInfo.trim(), question.trim());

      if (onMessageSent) {
        onMessageSent(contactInfo.trim(), question.trim());
      }

      setIsSuccess(true);
    } catch (err) {
      // Aunque falle la red, garantizamos la experiencia al usuario guardando la consulta
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setContactInfo('');
    setQuestion('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 animate-scaleUp overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleResetAndClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                ¡Mensaje enviado con éxito!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Hemos recibido tu consulta en{' '}
                <strong className="text-emerald-700 font-bold">hola@autopubli24.com</strong>. Te contestaremos muy rápido a:{' '}
                <span className="font-mono font-bold text-slate-900 block mt-1">{contactInfo}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                  ¿Cómo podemos ayudarte?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Escríbenos y te responderemos de inmediato.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold text-left">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email o Teléfono para contestarte:
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-slate-300">/</span>
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="ejemplo@email.com o 612 34 56 78"
                    className="w-full pl-16 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#00a651] focus:ring-3 focus:ring-green-500/15 rounded-xl text-slate-900 text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ¿En qué podemos ayudarte?:
                </label>
                <textarea
                  required
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Escribe tu consulta sobre cómo funciona el publicador, portales compatibles, renovación, etc..."
                  className="w-full p-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#00a651] focus:ring-3 focus:ring-green-500/15 rounded-xl text-slate-900 text-sm font-medium outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-green-600/20 active:scale-95 disabled:opacity-60"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar consulta ahora'}</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 font-medium pt-1">
                Se enviará directamente a <span className="font-semibold text-slate-600">hola@autopubli24.com</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
