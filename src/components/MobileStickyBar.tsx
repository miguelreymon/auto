import React from 'react';
import { Zap, MessageCircle } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  onOpenCheckout,
  onOpenWhatsApp,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 h-[62px] flex items-center justify-between gap-2 shadow-2xl">
      <div className="flex flex-col">
        <span className="text-[10px] text-red-600 font-extrabold uppercase leading-none">
          OFERTA -50%
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-lg font-black text-slate-900 font-mono leading-none">
            79€
          </span>
          <span className="text-[10px] text-slate-400 font-mono line-through leading-none">
            158€
          </span>
          <span className="text-[10px] text-slate-500 font-bold">/mes</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenWhatsApp}
          aria-label="Hablar por WhatsApp"
          className="w-10 h-10 rounded-xl bg-green-50 border border-green-300 text-green-700 flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
        >
          <MessageCircle className="w-5 h-5 fill-green-600 text-green-600" />
        </button>

        <button
          onClick={onOpenCheckout}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-green-600/30 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Activar Ahora</span>
        </button>
      </div>
    </div>
  );
};
