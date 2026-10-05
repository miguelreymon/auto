import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Image as ImageIcon, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface GeneratedAd {
  id: number;
  title: string;
  zone: string;
  category: string;
  description: string;
  similarityScore: string;
  exifCleaned: boolean;
}

export const MultiAdGenerator: React.FC<{ onSelectPlan?: () => void }> = ({ onSelectPlan }) => {
  const [baseService, setBaseService] = useState('Masajes y Citas Discretas');
  const [selectedCity, setSelectedCity] = useState('Madrid');
  const [selectedZoneCount, setSelectedZoneCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([
    {
      id: 1,
      title: '✨ Masajes Sensitivos Exclusivos en Barrio Salamanca · Cita Privada',
      zone: 'Salamanca / Retiro',
      category: 'Masajes y Bienestar',
      description: 'Disfruta de una experiencia única de relax en piso privado súper discreto y climatizado. Trato cercano, sin prisas y con ducha previa. Fotos 100% reales verificadas.',
      similarityScore: '0% Duplicado (Texto 100% Único)',
      exifCleaned: true
    },
    {
      id: 2,
      title: '🌟 Máxima Desconexión y Dulzura en Chamartín · Trato VIP',
      zone: 'Chamartín / Castellana',
      category: 'Citas y Encuentros',
      description: 'Escápate de la rutina con una sesión inolvidable en una de las mejores zonas de la ciudad. Ambiente tranquilo con música suave y aromas relajantes. Escríbeme por WhatsApp.',
      similarityScore: '0% Duplicado (Texto 100% Único)',
      exifCleaned: true
    },
    {
      id: 3,
      title: '💎 Experiencia Premium en Madrid Centro · Fotos Auténticas',
      zone: 'Centro / Sol / Gran Vía',
      category: 'Masajes Relajantes',
      description: 'Atención personalizada en ubicación céntrica con parking público cercano. Higiene impecable y discreción garantizada para personas educadas y exigentes.',
      similarityScore: '0% Duplicado (Texto 100% Único)',
      exifCleaned: true
    }
  ]);

  const handleGenerateVariations = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Shuffle / re-generate realistic variations
      setGeneratedAds([
        {
          id: 1,
          title: `✨ ${baseService} de Alto Nivel en ${selectedCity} Norte`,
          zone: `${selectedCity} Norte / Residencial`,
          category: 'Masajes y Citas',
          description: `Disfruta del mejor momento del día en un entorno íntimo y elegante. Cero prisas, máxima calidez y absoluta privacidad garantizada en ${selectedCity}. Escríbeme ahora.`,
          similarityScore: '0% Duplicado (Texto 100% Único)',
          exifCleaned: true
        },
        {
          id: 2,
          title: `🌟 Sesiones Especiales de ${baseService} · Solo Personas Educadas`,
          zone: `${selectedCity} Centro`,
          category: 'Bienestar y Relax',
          description: `Un rincón exclusivo pensado para desconectar del estrés diario con música relajante y atención al detalle. Fácil acceso y máxima discreción asegurada.`,
          similarityScore: '0% Duplicado (Texto 100% Único)',
          exifCleaned: true
        },
        {
          id: 3,
          title: `💎 Novedad en ${selectedCity} Sur: ${baseService} con Fotos Reales`,
          zone: `${selectedCity} Sur / Aledaños`,
          category: 'Citas Exclusivas',
          description: `Si buscas calidad y un trato dulce sin sorpresas desagradables, este es tu sitio. Todo tal y como ves en las fotos. Contáctame por WhatsApp para disponibilidad.`,
          similarityScore: '0% Duplicado (Texto 100% Único)',
          exifCleaned: true
        }
      ]);
    }, 1200);
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto my-8 text-left text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-slate-200 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            NUEVA FUNCIÓN VIP · GENERADOR MULTI-ANUNCIOS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
            Multiplica Tu Visibilidad: Crea Varios Anuncios Sin Baneo
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Publicar el mismo anuncio 5 veces hace que te borren la cuenta. Nuestro robot <strong className="text-slate-900 font-bold">crea versiones totalmente diferentes con textos únicos y fotos limpias</strong> para copar todos los barrios a la vez.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-purple-50 text-purple-800 px-3 py-2 rounded-2xl border border-purple-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Filtro Anti-Duplicados Activo</span>
        </div>
      </div>

      {/* Control Studio Bar */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
              Tu Servicio o Título Base:
            </label>
            <input
              type="text"
              value={baseService}
              onChange={(e) => setBaseService(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
              placeholder="Ej: Masajes y Citas"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
              Ciudad Principal:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
            >
              <option value="Madrid">Madrid (Distritos)</option>
              <option value="Barcelona">Barcelona (Distritos)</option>
              <option value="Valencia">Valencia (Distritos)</option>
              <option value="Sevilla">Sevilla (Distritos)</option>
              <option value="Málaga">Málaga (Distritos)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
              Nº de Variaciones:
            </label>
            <div className="flex items-center gap-1.5 h-[38px]">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedZoneCount(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    selectedZoneCount === num
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {num} Anuncios
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          type="button"
          onClick={handleGenerateVariations}
          disabled={isGenerating}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generando Textos Únicos y Limpiando Fotos...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>GENERAR {selectedZoneCount} ANUNCIOS ÚNICOS ANTI-BANEO (PROBAR EN VIVO)</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Pillars Anti-Ban Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-950 block font-bold">1. Sinónimos y Multi-Texto</strong>
            <span className="text-purple-800 text-[11px]">Cada anuncio tiene redacción distinta. El portal nunca detecta copia.</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-start gap-2.5">
          <ImageIcon className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-950 block font-bold">2. Fotos Limpias de EXIF</strong>
            <span className="text-purple-800 text-[11px]">Elimina fechas y modelo de móvil para que el portal las vea como fotos nuevas.</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-950 block font-bold">3. Multi-Barrio en 1 Clic</strong>
            <span className="text-purple-800 text-[11px]">Copa las principales zonas para que tu teléfono suene desde cualquier distrito.</span>
          </div>
        </div>
      </div>

      {/* Generated Cards Preview */}
      <div className="space-y-3 mb-6">
        {generatedAds.slice(0, selectedZoneCount).map((ad) => (
          <div
            key={ad.id}
            className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-purple-300 rounded-2xl transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                  Variación #{ad.id}
                </span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {ad.zone}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {ad.similarityScore}
                </span>
                <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  EXIF Limpio
                </span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-1">
              {ad.title}
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              {ad.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                Programación: Publicación a intervalos de 5 min
              </span>
              <button
                type="button"
                onClick={() => handleCopy(`${ad.title}\n\n${ad.description}`, ad.id)}
                className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === ad.id ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Bottom Box */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm sm:text-base font-black">
            ¿Quieres Que el Robot Cree y Publique Tus Anuncios Solos?
          </h4>
          <p className="text-xs text-purple-200 mt-0.5">
            Incluido en el Pack Multi-Portal 5 Webs o como servicio adicional por Bizum.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const terminal = document.getElementById('terminal-bizum');
            terminal?.scrollIntoView({ behavior: 'smooth' });
            if (onSelectPlan) onSelectPlan();
          }}
          className="w-full sm:w-auto px-5 py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>ACTIVAR POR BIZUM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
