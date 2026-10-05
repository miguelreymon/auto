import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

interface TopBannerProps {
  onClaimDiscount: () => void;
}

export const TopBanner: React.FC<TopBannerProps> = ({ onClaimDiscount }) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 15, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <aside aria-label="Aviso de oferta especial" className="bg-amber-50 border-b border-amber-200 text-xs sm:text-sm py-2 px-3 text-amber-950 font-medium">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs">
            <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
            OFERTA 50%
          </span>
          <span className="text-slate-700">
            ¡Solo quedan <strong>3 plazas con descuento</strong> hoy!
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-amber-300">
            <Clock className="w-3 h-3 text-red-500" />
            <span>{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
          </div>

          <button
            onClick={onClaimDiscount}
            className="text-xs font-bold text-red-600 hover:text-red-700 underline underline-offset-2 cursor-pointer whitespace-nowrap"
          >
            Quiero el Descuento →
          </button>
        </div>
      </div>
    </aside>
  );
};
