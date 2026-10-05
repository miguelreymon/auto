import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Zap, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Play, 
  Pause, 
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';

interface MobileWebRunnerProps {
  onClose?: () => void;
}

export const MobileWebRunner: React.FC<MobileWebRunnerProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedPortal, setSelectedPortal] = useState<string>('milpasiones');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [keepAliveAudio, setKeepAliveAudio] = useState<boolean>(true);
  const [renewCount, setRenewCount] = useState<number>(12);
  const [logHistory, setLogHistory] = useState<Array<{ time: string; text: string; success: boolean }>>([
    { time: '17:20:04', text: 'Anuncio en rotación continua activa', success: true },
    { time: '17:40:02', text: 'Botón «Renovar» pulsado automáticamente', success: true },
    { time: '18:00:01', text: 'Anuncio renovado y visible en primeras páginas', success: true },
  ]);

  // Audio silent player simulation
  const [audioActive, setAudioActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Trigger auto-renew cycle
            const now = new Date().toLocaleTimeString();
            setRenewCount((c) => c + 1);
            setLogHistory((old) => [
              { time: now, text: '¡Auto-clic en «Subir Anuncio» completado!', success: true },
              ...old.slice(0, 4),
            ]);
            return 20 * 60; // Reset to 20 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning && keepAliveAudio) {
      setAudioActive(true);
    } else {
      setAudioActive(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const portalNames: Record<string, string> = {
    milpasiones: 'Milpasiones.com',
    loquosex: 'Loquosex.com',
    nuevoloquo: 'NuevoLoquo.ch',
    agenda69: 'Agenda69.com',
    milanuncios: 'Milanuncios.es',
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl max-w-4xl mx-auto my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              SOLUCIÓN 2: NAVEGADOR WEB MÓVIL
            </span>
            <span className="text-xs text-slate-400">· Cero descargas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Panel de Auto-Renovación en Vivo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Funciona en la pantalla de tu móvil. No das contraseñas y puedes usar WhatsApp mientras renueva.
          </p>
        </div>

        {/* Global Action Button */}
        <button
          onClick={toggleRun}
          className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-green-500 hover:bg-green-400 text-slate-950 shadow-green-500/30 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSAR SUBIDAS</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>🟢 ENCENDER PILOTO AUTOMÁTICO</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Settings & Phone Viewport Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Side: Controls & Keep-Alive settings */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Selector de Portal */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <label className="text-xs font-black uppercase text-slate-400 block mb-2">
              1. Selecciona Tu Portal Habitual:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(portalNames).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPortal(key)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedPortal === key
                      ? 'bg-green-500 text-slate-950 font-black'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <span>{name}</span>
                  {selectedPortal === key && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Switch de Audio Silencioso para WhatsApp */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
                {keepAliveAudio ? (
                  <Volume2 className="w-4 h-4 text-green-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                Modo Segundo Plano (Audio Silencioso)
              </span>
              <button
                onClick={() => setKeepAliveAudio(!keepAliveAudio)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  keepAliveAudio ? 'bg-green-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    keepAliveAudio ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mantiene la pestaña despierta como Spotify. Puedes minimizar el navegador, chatear por WhatsApp o atender llamadas sin que el móvil congele el temporizador de 20 minutos.
            </p>
          </div>

          {/* 3. Indicador de Seguridad: Cero Contraseñas */}
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 text-emerald-200">
            <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacidad Total Garantizada</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              La sesión pertenece a tu móvil. El navegador interno pulsa «Renovar» utilizando las cookies que ya tienes abiertas, sin que nadie conozca tus contraseñas.
            </p>
          </div>
        </div>

        {/* Right Side: Simulated Phone Screen Preview */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            {/* Phone Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400">https://{portalNames[selectedPortal].toLowerCase()}/panel</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-green-400 font-bold">
                  SESIÓN ACTIVA
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <span>IP: Móvil 4G</span>
              </div>
            </div>

            {/* Live Status Hero Inside Phone */}
            <div className={`p-4 rounded-2xl border-2 transition-all mb-4 ${
              isRunning 
                ? 'bg-green-950/30 border-green-500/60 shadow-lg shadow-green-500/10' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  ESTADO EN TIEMPO REAL:
                </span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isRunning 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-ping' : 'bg-slate-500'}`} />
                  {isRunning ? 'PILOTO AUTOMÁTICO ACTIVO' : 'PAUSADO'}
                </span>
              </div>

              {/* Big Countdown Timer */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    {formatTimer(secondsRemaining)}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    para la próxima renovación automática
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-green-400">
                    {renewCount}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    subidas completadas hoy
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Live Portal Viewport */}
            <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 mb-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-slate-300">Tu Anuncio en {portalNames[selectedPortal]}</span>
                <span className="text-xs font-mono font-bold text-green-400 bg-green-950/80 px-2 py-0.5 rounded border border-green-500/30">ROTACIÓN ACTIVA</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="text-slate-200 font-semibold block">Título: Masajes y Citas Madrid Centro</span>
                  <span>Última renovación detectada: Hace 4 minutos</span>
                </div>
                <div className="px-3 py-1.5 bg-green-500 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Subido</span>
                </div>
              </div>
            </div>

            {/* Live Event Log */}
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 block mb-2">
                Registro de Acciones Automáticas:
              </span>
              <div className="space-y-1.5 font-mono text-xs text-slate-400 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                {logHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">[{item.time}]</span>
                    <span className="text-slate-200 text-left flex-1 px-2 truncate">{item.text}</span>
                    <span className="text-green-400 font-bold">✓ Éxito</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Puedes bloquear la pantalla o chatear por WhatsApp</span>
            <span className="text-green-400 font-bold">Frecuencia: Cada 20 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
