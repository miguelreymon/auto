import React, { useState } from 'react';
import { X, Download, Chrome, CheckCircle2, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

interface ExtensionDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionDownloadModal: React.FC<ExtensionDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();

      // Manifest v3 for AutoPubli 24/7 Extension
      const manifest = {
        manifest_version: 3,
        name: 'AutoPubli 24/7 - Auto Publicador Adultos',
        version: '2.4.0',
        description: 'Auto-publicador de anuncios cada 20 minutos en portales y foros para anunciantes.',
        permissions: ['storage', 'alarms', 'tabs'],
        host_permissions: [
          '*://*.pasion.com/*',
          '*://*.mileroticos.com/*',
          '*://*.mundosexanuncio.com/*',
          '*://*.follamigas.com/*',
          '*://*.nuevapasion.com/*',
          '*://*.loquosex.com/*',
          '*://*.milpasiones.com/*',
        ],
        action: {
          default_title: 'AutoPubli 24/7',
        },
      };

      zip.file('manifest.json', JSON.stringify(manifest, null, 2));
      zip.file(
        'LEEME_INSTALACION.txt',
        `INSTRUCCIONES DE INSTALACIÓN - AUTOPUBLI 24/7 EXTENSION:
1. Descomprime esta carpeta .zip en tu ordenador.
2. Abre Google Chrome o Brave y ve a: chrome://extensions/
3. Activa la casilla "Modo de desarrollador" en la esquina superior derecha.
4. Haz clic en "Cargar descomprimida" y selecciona la carpeta descomprimida.
5. ¡Listo! Ya tienes AutoPubli 24/7 activo en tu navegador.`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AutoPubli247_Extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
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

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
            <Chrome className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Extensión AutoPubli 24/7
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Para Chrome, Brave y navegadores basados en Chromium.
          </p>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 mb-6">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>Publicación automática cada 20 minutos en segundo plano.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>Compatible con los 7 principales portales de anuncios.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>Rotación de textos e imágenes anti-bloqueo.</span>
          </div>
        </div>

        {downloaded && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>¡Descarga iniciada con éxito! Revisa las instrucciones adjuntas.</span>
          </div>
        )}

        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-black text-sm rounded-xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-75"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generando archivo .ZIP...' : 'Descargar Extensión (.ZIP)'}</span>
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-3">
          Requiere suscripción activa para sincronizar tus anuncios.
        </p>
      </div>
    </div>
  );
};
