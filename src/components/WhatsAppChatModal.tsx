import React, { useState } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmWhatsApp: (phone: string, query: string) => void;
}

export const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({
  isOpen,
  onClose,
  onConfirmWhatsApp,
}) => {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmWhatsApp(phone, 'Quiero información');
    const url = `https://wa.me/34600000000?text=${encodeURIComponent(
      `Hola, quiero activar la oferta de AutoPubli 24/7 para publicar mis anuncios cada 20 minutos. Mi WhatsApp es: ${phone || 'este'}`
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl animate-scaleUp text-slate-900 text-center"
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

        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-7 h-7 fill-current" />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">
          Chat Directo de WhatsApp
        </h3>
        <p className="text-xs text-slate-600 mb-5">
          Escríbenos y un asesor te deja todo listo en 2 minutos:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="tel"
            placeholder="Tu número de teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-center font-mono text-sm focus:outline-none focus:border-green-500"
          />

          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-green-600/20 active:scale-95"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>ABRIR WHATSAPP AHORA</span>
          </button>
        </form>
      </div>
    </div>
  );
};
