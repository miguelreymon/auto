import React, { useState } from 'react';
import { X, CheckCircle2, Zap, Smartphone, CreditCard, MessageCircle, ArrowRight } from 'lucide-react';
import { PricingPlan } from '../types';

interface DirectCheckoutModalProps {
  isOpen: boolean;
  selectedPlan: PricingPlan;
  onClose: () => void;
  onSuccess: (credentials: { email: string; phone: string }) => void;
}

export const DirectCheckoutModal: React.FC<DirectCheckoutModalProps> = ({
  isOpen,
  selectedPlan,
  onClose,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'bizum' | 'card'>('bizum');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      onSuccess({ email: `${phone}@autopubli.com`, phone });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl animate-scaleUp text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              ¡Activación Confirmada!
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Hemos activado tu cuenta para el <strong>{selectedPlan.name}</strong>. Te acabamos de enviar el enlace y el acceso a tu WhatsApp <strong>{phone}</strong>.
            </p>

            <a
              href={`https://wa.me/34600000000?text=${encodeURIComponent(
                `Hola, acabo de activar AutoPubli 24/7 (${selectedPlan.name}) para el teléfono ${phone}. Quiero mi configuración guiada ya.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Abrir WhatsApp y Empezar</span>
            </a>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold text-green-700 uppercase block mb-1">
              PASO FINAL
            </span>
            <h3 className="text-2xl font-black text-slate-900 mb-4">
              Activar {selectedPlan.name}
            </h3>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total a pagar:</span>
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {selectedPlan.currentPrice}€
                </span>
                <span className="text-xs text-slate-500 block">{selectedPlan.period}</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                50% Descuento Aplicado
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  ¿Cómo prefieres pagar?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bizum')}
                    className={`py-3 px-2 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'bizum'
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-green-600" />
                    <span>BIZUM (Rápido)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span>Tarjeta Bancaria</span>
                  </button>
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tu Teléfono o WhatsApp (Para enviarte el acceso) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+34 600 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 font-mono text-base focus:outline-none focus:border-green-500"
                />
              </div>

              {paymentMethod === 'card' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8921"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              )}

              {paymentMethod === 'bizum' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 font-medium">
                  ✓ Recibirás la solicitud de Bizum en tu banco para confirmar con 1 toque.
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base rounded-2xl shadow-lg shadow-green-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>{isProcessing ? 'Activando...' : `PAGAR ${selectedPlan.currentPrice}€ Y ACTIVAR`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[11px] text-slate-400 text-center block">
                Garantía total de devolución de 14 días. Cero riesgo.
              </span>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
