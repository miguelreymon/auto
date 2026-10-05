import React, { useState, useEffect } from 'react';
import { Power, Check, PhoneCall, RefreshCw, Zap } from 'lucide-react';

interface InteractiveDashboardDemoProps {
  onOpenCheckout: () => void;
}

export const InteractiveDashboardDemo: React.FC<InteractiveDashboardDemoProps> = ({ onOpenCheckout }) => {
  const [isOn, setIsOn] = useState(true);
  const [seconds, setSeconds] = useState(19 * 60 + 40); // 19:40
  const [justPublished, setJustPublished] = useState(false);
  const [callsToday, setCallsToday] = useState(28);

  useEffect(() => {
    if (!isOn) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          triggerSimulatedPost();
          return 20 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOn]);

  const triggerSimulatedPost = () => {
    setJustPublished(true);
    setCallsToday((prev) => prev + 2);
    setTimeout(() => {
      setJustPublished(false);
    }, 4000);
  };

  const formatCountdown = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <section id="demo" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Simple pill-less header */}
        <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block mb-3">
          PANEL SUPER MEGA FÁCIL
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
          Mira Qué Fácil es el Panel de Control
        </h2>
        <p className="text-base text-slate-600 mb-8 max-w-lg mx-auto">
          Solo tiene un botón grande para encender. Púlsalo para ver cómo funciona en directo:
        </p>

        {/* The Simple Simulator Card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 sm:p-8 max-w-2xl mx-auto shadow-md mb-8 text-left">
          {/* Top Status */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block">Estado de tu Anuncio:</span>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full ${isOn ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-lg font-black text-slate-900">
                  {isOn ? 'PUBLICANDO CADA 20 MINUTOS' : 'PAUSADO'}
                </span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full">
              PUESTO #1 GARANTIZADO
            </span>
          </div>

          {/* Big Green Switch Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                setIsOn(!isOn);
                if (!isOn) triggerSimulatedPost();
              }}
              className={`w-full py-5 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md ${
                isOn
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
              }`}
            >
              <Power className="w-6 h-6" />
              <span>{isOn ? '🟢 PILOTO AUTOMÁTICO ENCENDIDO (Toca para apagar)' : '⚪ TOCAR PARA ENCENDER AHORA'}</span>
            </button>
          </div>

          {/* Published Alert */}
          {justPublished && (
            <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-2xl text-green-900 font-bold text-sm flex items-center gap-3 animate-bounce">
              <Check className="w-6 h-6 text-green-600 shrink-0" />
              <span>¡ANUNCIO REPUBLICADO AHORA MISMO! Subido a primera página en Pasión y foros.</span>
            </div>
          )}

          {/* Big Clear Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">Próxima Republicación:</span>
              <div className="flex items-center gap-1.5 text-xl font-black font-mono text-green-600">
                <RefreshCw className={`w-4 h-4 ${isOn ? 'animate-spin' : ''}`} />
                <span>{isOn ? formatCountdown(seconds) : '--:--'}</span>
              </div>
              <span className="text-[11px] text-slate-400">Cada 20 min exactos</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">Posición de tu Anuncio:</span>
              <div className="text-xl font-black font-mono text-slate-900">
                #1 (Arriba del todo)
              </div>
              <span className="text-[11px] text-green-600 font-bold">100% visible</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-slate-500 block mb-1">Contactos y Llamadas:</span>
              <div className="flex items-center gap-1 text-xl font-black font-mono text-green-600">
                <PhoneCall className="w-4 h-4" />
                <span>{callsToday} personas</span>
              </div>
              <span className="text-[11px] text-slate-400">Solo en el día de hoy</span>
            </div>
          </div>

          {/* Test Post Button */}
          <button
            onClick={triggerSimulatedPost}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border-2 border-dashed border-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⚡ Pulsa aquí para hacer una prueba de publicación instantánea</span>
          </button>
        </div>

        {/* Bright Photo: Phone ringing with clients */}
        <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md mb-8">
          <img
            src="/src/assets/images/light_phone_ringing_sales_1790956065713.jpg"
            alt="Teléfono recibiendo llamadas de clientes constantes"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="p-4 bg-white text-center">
            <p className="text-sm sm:text-base font-bold text-slate-900">
              Esto es lo que pasa cuando estás arriba todo el día: <span className="text-green-600">tu teléfono no para de sonar</span>.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onOpenCheckout}
          className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-600/30 transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>QUIERO ESTE PANEL PARA MI ANUNCIO</span>
        </button>
      </div>
    </section>
  );
};
