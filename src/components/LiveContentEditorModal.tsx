import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  HelpCircle,
  Eye,
  Sliders,
  Plus,
  Trash2
} from 'lucide-react';
import { usePromoContent } from '../context/PromoContentContext';

interface LiveContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewClick?: () => void;
  initialTab?: 'oferta' | 'hero' | 'faq' | 'portales' | 'beneficios' | 'antiban' | 'guarantee' | 'socialProof' | 'general';
}

export const LiveContentEditorModal: React.FC<LiveContentEditorModalProps> = ({
  isOpen,
  onClose,
  onPreviewClick,
  initialTab,
}) => {
  const { content, updateContent, resetToDefaults, exportAsCodeString } = usePromoContent();
  const [formData, setFormDataState] = useState(content);
  const formDataRef = React.useRef(formData);
  formDataRef.current = formData;

  const [activeTab, setActiveTab] = useState<
    'oferta' | 'hero' | 'portales' | 'beneficios' | 'antiban' | 'guarantee' | 'faq' | 'socialProof' | 'general'
  >(initialTab || 'oferta');
  const [isCopied, setIsCopied] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Sync state when modal opens or content updates
  React.useEffect(() => {
    if (isOpen) {
      setFormDataState(content);
      formDataRef.current = content;
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, content, initialTab]);

  // Wrapper so every input change updates content cleanly without updating during reducer render
  const setFormData = React.useCallback(
    (updater: any) => {
      const next = typeof updater === 'function' ? updater(formDataRef.current) : updater;
      formDataRef.current = next;
      setFormDataState(next);
      updateContent(next);
    },
    [updateContent]
  );

  if (!isOpen) return null;

  const handleSave = () => {
    updateContent(formData);
    setSaveNotice('¡Cambios guardados con éxito! La página ya refleja los nuevos textos.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas restaurar todos los textos a los valores originales de promoContent.ts?')) {
      resetToDefaults();
      setSaveNotice('Textos restablecidos a los valores por defecto.');
      setTimeout(() => setSaveNotice(null), 3000);
    }
  };

  const handleCopyCode = () => {
    const code = exportAsCodeString();
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Cabecera del Editor */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center font-black">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Editor de Textos & Configuración</h2>
                <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  LIVE VINCULADO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modifica cualquier texto y se reflejará al instante en la landing de Promo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#00a651] hover:bg-green-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Guardar Cambios</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notificación de guardado */}
        {saveNotice && (
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-black text-center flex items-center justify-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Navegación por Pestañas Adaptable con Wrap para que NINGUNA quede oculta */}
        <div className="border-b border-slate-800 bg-slate-950/80 p-3 flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            { id: 'oferta', label: '1. Oferta & Formulario', icon: DollarSign },
            { id: 'hero', label: '2. Hero & Cabecera', icon: Sparkles },
            { id: 'faq', label: '3. Preguntas Frecuentes (FAQ)', icon: HelpCircle, isFaq: true },
            { id: 'portales', label: '4. Portales & Logos', icon: Layers },
            { id: 'beneficios', label: '5. Beneficios', icon: FileText },
            { id: 'antiban', label: '6. Anti-Baneo', icon: ShieldCheck },
            { id: 'guarantee', label: '7. Garantía Bizum', icon: ShieldCheck },
            { id: 'socialProof', label: '8. Opiniones / Chats', icon: FileText },
            { id: 'general', label: '9. Barra & Footer', icon: Sliders },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-green-500 text-slate-950 font-black shadow-sm ring-2 ring-green-400/50'
                  : tab.isFaq
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.isFaq && activeTab !== tab.id && (
                <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase tracking-wide">
                  FAQ
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cuerpo de Edición con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: OFERTA, PRECIOS, BIZUM */}
          {activeTab === 'oferta' && (
            <div className="space-y-5 max-w-4xl">
              {/* CONTROL MODO FORMULARIO SIMPLIFICADO */}
              <div className="p-4 bg-emerald-950/30 border-2 border-emerald-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
                        Modo Formulario Simplificado (Captación de WhatsApp)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Si lo activas, el formulario se vuelve súper directo: <strong>oculta los datos bancarios de Bizum (teléfono y concepto) y la casilla de PIN de Paysafecard</strong>. El usuario solo elige duración, forma de pago y pone su teléfono; al pulsar activar se le abre WhatsApp directamente con un mensaje con sus datos a tu número para empezar la conversación sin cobrarle de momento.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!!formData.offer.simpleMode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offer: { ...formData.offer, simpleMode: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {formData.offer.simpleMode && (
                  <div className="pt-3 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-emerald-300 block mb-1 font-bold">
                        Tu número de WhatsApp para recibir los leads directos:
                      </label>
                      <input
                        type="text"
                        value={formData.offer.adminWhatsAppNumber || formData.offer.bizum.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: { ...formData.offer, adminWhatsAppNumber: e.target.value },
                          })
                        }
                        placeholder="Ej: 34600000000 o 600 000 000"
                        className="w-full bg-slate-950 border border-emerald-600/70 rounded-lg p-2 text-xs text-white font-mono font-bold"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        A este teléfono llegarán los mensajes automáticos de los clientes con el plan y método elegido.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl">
                <h3 className="text-sm font-bold text-green-400 mb-3 uppercase tracking-wider">
                  Configuración de Precios & Planes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plan 7 Días */}
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
                    <span className="text-[11px] font-mono text-green-400 font-bold block">
                      Plan 1 Semana (7 Días)
                    </span>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Nombre del Plan:</label>
                      <input
                        type="text"
                        value={formData.offer.durations.sevenDays.label}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: {
                              ...formData.offer,
                              durations: {
                                ...formData.offer.durations,
                                sevenDays: {
                                  ...formData.offer.durations.sevenDays,
                                  label: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Precio Oferta (€):</label>
                        <input
                          type="number"
                          value={formData.offer.durations.sevenDays.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: {
                                ...formData.offer,
                                durations: {
                                  ...formData.offer.durations,
                                  sevenDays: {
                                    ...formData.offer.durations.sevenDays,
                                    price: Number(e.target.value),
                                  },
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Precio Anterior (€):</label>
                        <input
                          type="number"
                          value={formData.offer.durations.sevenDays.originalPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: {
                                ...formData.offer,
                                durations: {
                                  ...formData.offer.durations,
                                  sevenDays: {
                                    ...formData.offer.durations.sevenDays,
                                    originalPrice: Number(e.target.value),
                                  },
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Nota del Plan:</label>
                      <input
                        type="text"
                        value={formData.offer.durations.sevenDays.note}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: {
                              ...formData.offer,
                              durations: {
                                ...formData.offer.durations,
                                sevenDays: {
                                  ...formData.offer.durations.sevenDays,
                                  note: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Plan 30 Días */}
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
                    <span className="text-[11px] font-mono text-green-400 font-bold block">
                      Plan Mes Completo (30 Días)
                    </span>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Nombre del Plan:</label>
                      <input
                        type="text"
                        value={formData.offer.durations.thirtyDays.label}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: {
                              ...formData.offer,
                              durations: {
                                ...formData.offer.durations,
                                thirtyDays: {
                                  ...formData.offer.durations.thirtyDays,
                                  label: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Precio Oferta (€):</label>
                        <input
                          type="number"
                          value={formData.offer.durations.thirtyDays.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: {
                                ...formData.offer,
                                durations: {
                                  ...formData.offer.durations,
                                  thirtyDays: {
                                    ...formData.offer.durations.thirtyDays,
                                    price: Number(e.target.value),
                                  },
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Precio Anterior (€):</label>
                        <input
                          type="number"
                          value={formData.offer.durations.thirtyDays.originalPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: {
                                ...formData.offer,
                                durations: {
                                  ...formData.offer.durations,
                                  thirtyDays: {
                                    ...formData.offer.durations.thirtyDays,
                                    originalPrice: Number(e.target.value),
                                  },
                                },
                              },
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Insignia / Badge:</label>
                      <input
                        type="text"
                        value={formData.offer.durations.thirtyDays.badge}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: {
                              ...formData.offer,
                              durations: {
                                ...formData.offer.durations,
                                thirtyDays: {
                                  ...formData.offer.durations.thirtyDays,
                                  badge: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Nota del Plan:</label>
                      <input
                        type="text"
                        value={formData.offer.durations.thirtyDays.note}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offer: {
                              ...formData.offer,
                              durations: {
                                ...formData.offer.durations,
                                thirtyDays: {
                                  ...formData.offer.durations.thirtyDays,
                                  note: e.target.value,
                                },
                              },
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos de Bizum */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Datos de Pago Bizum
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Teléfono receptor Bizum:</label>
                    <input
                      type="text"
                      value={formData.offer.bizum.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offer: {
                            ...formData.offer,
                            bizum: {
                              ...formData.offer.bizum,
                              phone: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Concepto que debe poner:</label>
                    <input
                      type="text"
                      value={formData.offer.bizum.concept}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offer: {
                            ...formData.offer,
                            bizum: {
                              ...formData.offer.bizum,
                              concept: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Textos del Formulario */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Títulos y Garantía de la Sección de Oferta
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título de la Oferta:</label>
                  <input
                    type="text"
                    value={formData.offer.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offer: { ...formData.offer, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo de la Oferta:</label>
                  <textarea
                    rows={2}
                    value={formData.offer.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offer: { ...formData.offer, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto de Garantía Footer del Formulario:</label>
                  <input
                    type="text"
                    value={formData.offer.trustFooter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offer: { ...formData.offer, trustFooter: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & CABECERA */}
          {activeTab === 'hero' && (
            <div className="space-y-4 max-w-4xl">
              {/* BANNER MODO TURBO PERMANENTE */}
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Banner Superior Fijo y Permanente (Urgencia & Plazas)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Título / Etiqueta:</label>
                    <input
                      type="text"
                      value={formData.turboBanner.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          turboBanner: { ...formData.turboBanner, title: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Texto Fijo del Banner:</label>
                    <input
                      type="text"
                      value={formData.turboBanner.text || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          turboBanner: { ...formData.turboBanner, text: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Texto Botón / Enlace CTA:</label>
                    <input
                      type="text"
                      value={formData.turboBanner.cta || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          turboBanner: { ...formData.turboBanner, cta: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Hero Principal</h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Insignia Superior (Badge):</label>
                  <input
                    type="text"
                    value={formData.hero.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, badge: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Titular Línea 1:</label>
                  <input
                    type="text"
                    value={formData.hero.titleLine1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, titleLine1: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Titular Destacado (Verde):</label>
                  <input
                    type="text"
                    value={formData.hero.titleHighlight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, titleHighlight: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Párrafo Descriptivo:</label>
                  <textarea
                    rows={3}
                    value={formData.hero.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, description: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto Botón CTA Principal:</label>
                  <input
                    type="text"
                    value={formData.hero.ctaButton}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaButton: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PORTALES Y LOGOS */}
          {activeTab === 'portales' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Sección Slider de Portales
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Insignia / Badge:</label>
                  <input
                    type="text"
                    value={formData.portals.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portals: { ...formData.portals, badge: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título de la Sección:</label>
                  <input
                    type="text"
                    value={formData.portals.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portals: { ...formData.portals, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo:</label>
                  <textarea
                    rows={2}
                    value={formData.portals.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portals: { ...formData.portals, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="pt-2">
                  <label className="text-[11px] text-slate-400 block mb-2 font-bold">
                    Logos incluidos en el Slider Horizontal ({formData.portals.logos.length}):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {formData.portals.logos.map((logo, idx) => (
                      <div key={logo.id} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
                        <img src={logo.logo} alt={logo.name} className="h-7 mx-auto object-contain mb-1" />
                        <span className="text-[11px] font-bold text-white block truncate">{logo.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono block truncate">{logo.logo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BENEFICIOS */}
          {activeTab === 'beneficios' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Cabecera de Beneficios
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título:</label>
                  <input
                    type="text"
                    value={formData.benefits.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        benefits: { ...formData.benefits, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo:</label>
                  <input
                    type="text"
                    value={formData.benefits.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        benefits: { ...formData.benefits, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              {formData.benefits.items.map((b, idx) => (
                <div key={b.id} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-2">
                  <span className="text-[11px] font-mono text-green-400 font-bold">Tarjeta {idx + 1}: {b.badge}</span>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Título:</label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const newItems = [...formData.benefits.items];
                        newItems[idx] = { ...newItems[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          benefits: { ...formData.benefits, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Descripción:</label>
                    <textarea
                      rows={2}
                      value={b.description}
                      onChange={(e) => {
                        const newItems = [...formData.benefits.items];
                        newItems[idx] = { ...newItems[idx], description: e.target.value };
                        setFormData({
                          ...formData,
                          benefits: { ...formData.benefits, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: ANTI-BANEO */}
          {activeTab === 'antiban' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Tecnología Anti-Baneo
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título:</label>
                  <input
                    type="text"
                    value={formData.antiBan.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        antiBan: { ...formData.antiBan, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo:</label>
                  <input
                    type="text"
                    value={formData.antiBan.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        antiBan: { ...formData.antiBan, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              {formData.antiBan.items.map((item, idx) => (
                <div key={item.number} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-2">
                  <span className="text-[11px] font-mono text-green-400 font-bold">Punto {item.number}</span>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Título en Negrita:</label>
                    <input
                      type="text"
                      value={item.boldTitle}
                      onChange={(e) => {
                        const newItems = [...formData.antiBan.items];
                        newItems[idx] = { ...newItems[idx], boldTitle: e.target.value };
                        setFormData({
                          ...formData,
                          antiBan: { ...formData.antiBan, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Texto Explicativo:</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...formData.antiBan.items];
                        newItems[idx] = { ...newItems[idx], description: e.target.value };
                        setFormData({
                          ...formData,
                          antiBan: { ...formData.antiBan, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: GARANTÍA */}
          {activeTab === 'guarantee' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Garantía de Devolución por Bizum
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título:</label>
                  <input
                    type="text"
                    value={formData.guarantee.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guarantee: { ...formData.guarantee, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto Antes de Negrita:</label>
                  <input
                    type="text"
                    value={formData.guarantee.descriptionBeforeBold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guarantee: { ...formData.guarantee, descriptionBeforeBold: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto Resaltado en Negrita:</label>
                  <input
                    type="text"
                    value={formData.guarantee.boldText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guarantee: { ...formData.guarantee, boldText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-green-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto Después de Negrita:</label>
                  <input
                    type="text"
                    value={formData.guarantee.descriptionAfterBold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guarantee: { ...formData.guarantee, descriptionAfterBold: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto Botón de Garantía:</label>
                  <input
                    type="text"
                    value={formData.guarantee.buttonText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guarantee: { ...formData.guarantee, buttonText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Cabecera Preguntas Frecuentes
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Título Línea 1:</label>
                    <input
                      type="text"
                      value={formData.faq.titleLine1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          faq: { ...formData.faq, titleLine1: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Título Línea 2 (Destacado):</label>
                    <input
                      type="text"
                      value={formData.faq.titleLine2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          faq: { ...formData.faq, titleLine2: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-xs text-slate-400">Total preguntas: {formData.faq.items.length}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [
                      ...formData.faq.items,
                      {
                        question: '¿Nueva pregunta frecuente?',
                        answer: 'Escribe aquí la respuesta clara para tus clientes...',
                      },
                    ];
                    setFormData({
                      ...formData,
                      faq: { ...formData.faq, items: newItems },
                    });
                  }}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Pregunta (+ FAQ)</span>
                </button>
              </div>

              {formData.faq.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-green-400 font-bold">
                      Pregunta #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar la pregunta "${item.question.slice(0, 30)}..."?`)) {
                          const newItems = formData.faq.items.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            faq: { ...formData.faq, items: newItems },
                          });
                        }
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 hover:bg-red-900/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Título de la Pregunta:</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const newItems = [...formData.faq.items];
                        newItems[idx] = { ...newItems[idx], question: e.target.value };
                        setFormData({
                          ...formData,
                          faq: { ...formData.faq, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Respuesta detallada:</label>
                    <textarea
                      rows={3}
                      value={item.answer}
                      onChange={(e) => {
                        const newItems = [...formData.faq.items];
                        newItems[idx] = { ...newItems[idx], answer: e.target.value };
                        setFormData({
                          ...formData,
                          faq: { ...formData.faq, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItems = [
                    ...formData.faq.items,
                    {
                      question: '¿Nueva pregunta frecuente?',
                      answer: 'Escribe aquí la respuesta clara para tus clientes...',
                    },
                  ];
                  setFormData({
                    ...formData,
                    faq: { ...formData.faq, items: newItems },
                  });
                }}
                className="w-full py-3.5 border-2 border-dashed border-green-500/50 hover:border-green-400 bg-green-950/20 hover:bg-green-900/30 text-green-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Añadir Otra Pregunta al FAQ</span>
              </button>
            </div>
          )}

          {/* TAB 8: PRUEBA SOCIAL */}
          {activeTab === 'socialProof' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Cabecera de Opiniones
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título:</label>
                  <input
                    type="text"
                    value={formData.socialProof.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialProof: { ...formData.socialProof, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo:</label>
                  <input
                    type="text"
                    value={formData.socialProof.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialProof: { ...formData.socialProof, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              {formData.socialProof.items.map((item, idx) => (
                <div key={item.id} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-green-400 font-bold">Mensaje WhatsApp {idx + 1}</span>
                    <span className="text-[10px] text-slate-400">{item.timeAgo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Autor:</label>
                      <input
                        type="text"
                        value={item.author}
                        onChange={(e) => {
                          const newItems = [...formData.socialProof.items];
                          newItems[idx] = { ...newItems[idx], author: e.target.value };
                          setFormData({
                            ...formData,
                            socialProof: { ...formData.socialProof, items: newItems },
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Ciudad:</label>
                      <input
                        type="text"
                        value={item.city}
                        onChange={(e) => {
                          const newItems = [...formData.socialProof.items];
                          newItems[idx] = { ...newItems[idx], city: e.target.value };
                          setFormData({
                            ...formData,
                            socialProof: { ...formData.socialProof, items: newItems },
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Mensaje de Chat:</label>
                    <textarea
                      rows={2}
                      value={item.message}
                      onChange={(e) => {
                        const newItems = [...formData.socialProof.items];
                        newItems[idx] = { ...newItems[idx], message: e.target.value };
                        setFormData({
                          ...formData,
                          socialProof: { ...formData.socialProof, items: newItems },
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 9: BARRA Y FOOTER */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-4xl">
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                  Barra Flotante Móvil
                </h3>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Título:</label>
                  <input
                    type="text"
                    value={formData.stickyBar.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stickyBar: { ...formData.stickyBar, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Subtítulo:</label>
                  <input
                    type="text"
                    value={formData.stickyBar.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stickyBar: { ...formData.stickyBar, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Texto Botón:</label>
                  <input
                    type="text"
                    value={formData.stickyBar.buttonText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stickyBar: { ...formData.stickyBar, buttonText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Barra Inferior de Acciones */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Valores por Defecto</span>
            </button>
            <button
              onClick={handleCopyCode}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? '¡Código Copiado!' : 'Copiar archivo promoContent.ts'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#00a651] hover:bg-green-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar y Aplicar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
