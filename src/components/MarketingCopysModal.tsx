import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  BookOpen, 
  Search, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Share2, 
  Lightbulb,
  ExternalLink,
  Building2,
  Briefcase
} from 'lucide-react';
import { marketingCopys, MarketingCopyItem } from '../content/marketingCopys';

interface MarketingCopysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketingCopysModal: React.FC<MarketingCopysModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCopys = marketingCopys.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryLabels = [
    { id: 'all', label: 'Todos los Copys', icon: BookOpen },
    { id: 'licencia_ciudad', label: 'Licencia de Ciudad (Vender el Negocio)', icon: Briefcase },
    { id: 'clubs_locales', label: 'Clubs & Locales (Anunciar Sala / Web)', icon: Building2 },
    { id: 'anunciantes', label: 'Anunciantes (WhatsApp)', icon: Users },
    { id: 'foros_anunciantes', label: 'Foros de Anunciantes', icon: MessageSquare },
    { id: 'foros_clientes', label: 'Foros Clientes (Afiliados)', icon: DollarSign },
    { id: 'twitter_x', label: 'Redes Sociales (X / Twitter)', icon: Share2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Biblioteca de Copys & Mensajes de Venta</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {marketingCopys.length} Plantillas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Textos listos para copiar y pegar en WhatsApp, foros y redes sociales.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Categorías */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categoryLabels.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#00a651] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Buscador */}
          <div className="relative shrink-0 md:w-64">
            <input
              type="text"
              placeholder="Buscar por palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* List of Copies */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-100/50">
          {filteredCopys.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-400" />
              <p className="font-bold text-sm">No se encontraron copys para este criterio de búsqueda.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-3 text-xs text-[#00a651] hover:underline font-bold cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            filteredCopys.map((copy) => {
              const isItemCopied = copiedId === copy.id;

              return (
                <div 
                  key={copy.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {copy.channel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Público: <strong className="text-slate-800">{copy.targetAudience}</strong>
                        </span>
                      </div>
                      <h3 className="font-black text-sm sm:text-base text-slate-900">
                        {copy.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopy(copy.id, copy.text)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                        isItemCopied
                          ? 'bg-green-600 text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isItemCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Texto</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mb-3">
                    {copy.description}
                  </p>

                  {/* Text Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed select-all">
                    {copy.text}
                  </div>

                  {/* Tip */}
                  {copy.tip && (
                    <div className="mt-3 flex items-start gap-2 text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 rounded-lg p-2 sm:px-3">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Consejo:</strong> {copy.tip}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredCopys.length} de {marketingCopys.length} copys disponibles</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
