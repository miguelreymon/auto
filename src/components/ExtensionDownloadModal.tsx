import React, { useState } from 'react';
import { X, Download, Smartphone, Monitor, CheckCircle2, ShieldCheck, Zap, Copy, Check } from 'lucide-react';
import { downloadExtensionZip, extensionContentScript } from '../utils/extensionFiles';

interface ExtensionDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionDownloadModal: React.FC<ExtensionDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deviceTab, setDeviceTab] = useState<'pc' | 'mobile'>('pc');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadExtensionZip();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 6000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyScriptText = () => {
    navigator.clipboard?.writeText(extensionContentScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xl animate-scaleUp text-slate-900 my-8"
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

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xs font-black uppercase text-green-700 bg-green-100 px-3 py-1 rounded-full">
            MODELO B: EXTENSIÓN PRIVADA
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            Descargar Extensión AutoPubli 24
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Corre en tu propio navegador con tu propia IP y tus cuentas ya abiertas. Cero contraseñas compartidas.
          </p>
        </div>

        {/* Big Download Button */}
        <div className="mb-6">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4.5 bg-green-600 hover:bg-green-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-green-600/30 transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-95"
          >
            <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span>
              {isDownloading
                ? 'Generando Archivo .ZIP...'
                : '📥 DESCARGAR EXTENSIÓN COMPLETA (.ZIP)'}
            </span>
          </button>

          {downloadSuccess && (
            <div className="mt-3 p-3 bg-green-100 border border-green-400 rounded-xl text-xs text-green-900 font-bold text-center animate-fadeIn">
              ✓ ¡Descarga completada! Sigue los pasos de abajo para activarla en 1 minuto.
            </div>
          )}
        </div>

        {/* Device Switcher */}
        <div className="flex border-b border-slate-200 mb-5">
          <button
            onClick={() => setDeviceTab('pc')}
            className={`flex-1 py-2.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              deviceTab === 'pc'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Instalar en Ordenador (Chrome / Edge / Brave)</span>
          </button>

          <button
            onClick={() => setDeviceTab('mobile')}
            className={`flex-1 py-2.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              deviceTab === 'mobile'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instalar en Móvil Android (Kiwi Browser)</span>
          </button>
        </div>

        {/* Installation Steps */}
        {deviceTab === 'pc' ? (
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 mb-6 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span><strong>Descomprime el archivo .zip</strong> que acabas de descargar en una carpeta de tu ordenador.</span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>Abre Chrome y entra en <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-900 font-bold">chrome://extensions</code></span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>Activa arriba a la derecha el <strong>«Modo de desarrollador»</strong> y pulsa el botón <strong>«Cargar descomprimida»</strong> seleccionando la carpeta.</span>
            </div>

            <div className="flex items-start gap-2.5 text-green-700 font-bold pt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>¡Listo! Entra a tu cuenta en Milpasiones o Loquosex y verás el widget verde contando 20 min y renovando solo.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 mb-6 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>Descarga gratis la app <strong>Kiwi Browser</strong> desde Google Play (permite extensiones de Chrome en el móvil).</span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>Abre Kiwi Browser, toca en los 3 puntos de arriba &gt; <strong>«Extensiones»</strong> &gt; activa <strong>«Developer Mode»</strong>.</span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>Toca en <strong>«+(from .zip / .crx)»</strong> y selecciona el archivo que descargaste. ¡Queda activa de inmediato!</span>
            </div>
          </div>
        )}

        {/* Benefits badge */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-900 font-semibold mb-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            100% Inmune a bloqueos: Usa tu IP española y tus cookies.
          </span>
          <button
            onClick={copyScriptText}
            className="text-green-700 hover:text-green-900 underline font-bold cursor-pointer flex items-center gap-1"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Copiado' : 'Copiar Script'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
