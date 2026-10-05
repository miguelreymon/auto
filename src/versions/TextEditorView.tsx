import React, { useState } from 'react';
import { usePromoContent } from '../context/PromoContentContext';
import { 
  FileText, 
  Copy, 
  CheckCircle2, 
  Code, 
  Sparkles, 
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Edit3
} from 'lucide-react';
import { LiveContentEditorModal } from '../components/LiveContentEditorModal';

interface TextEditorViewProps {
  onBackToPromo: () => void;
}

export const TextEditorView: React.FC<TextEditorViewProps> = ({ onBackToPromo }) => {
  const { content: promoContent, exportAsCodeString } = usePromoContent();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const copyEntireConfig = () => {
    const jsonStr = exportAsCodeString();
    navigator.clipboard?.writeText(jsonStr);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  const sections = [
    { id: 'all', label: 'Todos los Textos' },
    { id: 'hero', label: '1. Hero & Cabecera' },
    { id: 'urgency', label: '1B. Urgencia Plazas Ciudad' },
    { id: 'benefits', label: '2. Beneficios' },
    { id: 'portals', label: '3. Portales Principales' },
    { id: 'antiban', label: '4. Tecnología Anti-Baneo' },
    { id: 'guarantee', label: '5. Garantía Bizum' },
    { id: 'social', label: '5B. Prueba Social & WhatsApp' },
    { id: 'offer', label: '6. Oferta & Formulario' },
    { id: 'faq', label: '7. Preguntas Frecuentes' },
    { id: 'footer', label: '8. Footer & Sticky Bar' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera Informativa */}
        <div className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Code className="w-48 h-48 text-green-400" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-green-400 bg-green-950/80 border border-green-800 px-3 py-1 rounded-full mb-3 inline-block">
                CENTRO MAESTRO DE CONTENIDOS & TEXTOS
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Todos los Textos del Diseño a Medida
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Este panel organiza cada titular, párrafo y botón de la página. Todos están enlazados al archivo central:{' '}
                <code className="text-green-400 bg-slate-950 px-2 py-0.5 rounded font-mono text-xs border border-slate-700">
                  /src/content/promoContent.ts
                </code>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => setIsEditorModalOpen(true)}
                className="w-full sm:w-auto px-4 py-3 bg-[#00a651] hover:bg-green-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                <span>✏️ Editar Textos en Vivo</span>
              </button>

              <button
                onClick={copyEntireConfig}
                className="w-full sm:w-auto px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer active:scale-95"
              >
                {copiedAll ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedAll ? '¡Archivo Copiado!' : 'Copiar promoContent.ts'}</span>
              </button>

              <button
                onClick={onBackToPromo}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <span>Ver Landing Oficial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros de Secciones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                activeSection === s.id
                  ? 'bg-green-500 text-slate-950 border-green-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Listado de Textos por Secciones */}
        <div className="space-y-8">
          
          {/* 1. HERO & CABECERA */}
          {(activeSection === 'all' || activeSection === 'hero') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Hero & Cabecera</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.hero & promoContent.turboBanner</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextCard
                  label="Insignia Superior (Hero Badge)"
                  keyPath="promoContent.hero.badge"
                  value={promoContent.hero.badge}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.hero.badge'}
                />

                <TextCard
                  label="Titular Línea 1"
                  keyPath="promoContent.hero.titleLine1"
                  value={promoContent.hero.titleLine1}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.hero.titleLine1'}
                />

                <TextCard
                  label="Titular Resaltado Verde"
                  keyPath="promoContent.hero.titleHighlight"
                  value={promoContent.hero.titleHighlight}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.hero.titleHighlight'}
                />

                <TextCard
                  label="Botón Principal CTA"
                  keyPath="promoContent.hero.ctaButton"
                  value={promoContent.hero.ctaButton}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.hero.ctaButton'}
                />

                <div className="md:col-span-2">
                  <TextCard
                    label="Párrafo Explicativo del Hero"
                    keyPath="promoContent.hero.description"
                    value={promoContent.hero.description}
                    onCopy={copyToClipboard}
                    copied={copiedKey === 'promoContent.hero.description'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 1B. URGENCIA TÉCNICA REAL */}
          {(activeSection === 'all' || activeSection === 'urgency') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    1B
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Banner de Control de Plazas</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.urgencyBanner</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextCard
                  label="Etiqueta"
                  keyPath="promoContent.urgencyBanner.label"
                  value={promoContent.urgencyBanner.label}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.urgencyBanner.label'}
                />

                <TextCard
                  label="Resaltado Plazas"
                  keyPath="promoContent.urgencyBanner.highlight"
                  value={promoContent.urgencyBanner.highlight}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.urgencyBanner.highlight'}
                />

                <TextCard
                  label="Texto del Banner"
                  keyPath="promoContent.urgencyBanner.text"
                  value={promoContent.urgencyBanner.text}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.urgencyBanner.text'}
                />

                <TextCard
                  label="Botón / Enlace"
                  keyPath="promoContent.urgencyBanner.cta"
                  value={promoContent.urgencyBanner.cta}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.urgencyBanner.cta'}
                />
              </div>
            </div>
          )}

          {/* 2. BENEFICIOS CLAVE */}
          {(activeSection === 'all' || activeSection === 'benefits') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Beneficios con Demostración Visual</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.benefits.items</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {promoContent.benefits.items.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-green-400">{item.badge}</span>
                      <span className="text-[11px] font-mono text-slate-500">items[{idx}]</span>
                    </div>
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PORTALES PRINCIPALES (SLIDER DE LOGOS) */}
          {(activeSection === 'all' || activeSection === 'portals') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Portales Principales (Slider de Logos)</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.portals.logos</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {promoContent.portals.logos.map((p, idx) => (
                  <div key={p.id} className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2 text-center flex flex-col items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono text-slate-500">[{idx + 1}]</span>
                      <span className="text-xs font-bold text-white">{p.name}</span>
                    </div>
                    <div className="h-12 w-full flex items-center justify-center bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                      <img src={p.logo} alt={p.name} className="max-h-8 max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono truncate w-full">{p.logo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TECNOLOGÍA ANTI-BANEO (IPs MÓVILES 4G/5G) */}
          {(activeSection === 'all' || activeSection === 'antiban') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Tecnología Anti-Baneo con IPs Móviles</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.antiBan</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TextCard
                  label="Título de la Sección"
                  keyPath="promoContent.antiBan.title"
                  value={promoContent.antiBan.title}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.antiBan.title'}
                />

                <TextCard
                  label="Subtítulo Explicativo"
                  keyPath="promoContent.antiBan.subtitle"
                  value={promoContent.antiBan.subtitle}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.antiBan.subtitle'}
                />

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    promoContent.antiBan.items (Pasos numerados 1, 2, 3)
                  </span>
                  {promoContent.antiBan.items.map((item) => (
                    <div key={item.number} className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {item.number}
                      </div>
                      <div className="text-xs text-slate-200">
                        <strong className="text-white font-bold">{item.boldTitle}</strong> {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. GARANTÍA BIZUM 10 MINUTOS */}
          {(activeSection === 'all' || activeSection === 'guarantee') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Garantía de Devolución</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.guarantee</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TextCard
                  label="Título de la Garantía"
                  keyPath="promoContent.guarantee.title"
                  value={promoContent.guarantee.title}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.guarantee.title'}
                />

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    promoContent.guarantee.descriptionBeforeBold + boldText + descriptionAfterBold
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {promoContent.guarantee.descriptionBeforeBold}
                    <strong className="text-green-400 font-bold">{promoContent.guarantee.boldText}</strong>
                    {promoContent.guarantee.descriptionAfterBold}
                  </p>
                </div>

                <TextCard
                  label="Botón de la Garantía"
                  keyPath="promoContent.guarantee.buttonText"
                  value={promoContent.guarantee.buttonText}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.guarantee.buttonText'}
                />
              </div>
            </div>
          )}

          {/* 5B. PRUEBA SOCIAL (WHATSAPP CAPTURAS Y TESTIMONIOS) */}
          {(activeSection === 'all' || activeSection === 'social') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    5B
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Prueba Social (Testimonios y WhatsApp)</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.socialProof</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TextCard
                  label="Título Prueba Social"
                  keyPath="promoContent.socialProof.title"
                  value={promoContent.socialProof.title}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.socialProof.title'}
                />

                <TextCard
                  label="Subtítulo"
                  keyPath="promoContent.socialProof.subtitle"
                  value={promoContent.socialProof.subtitle}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.socialProof.subtitle'}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {promoContent.socialProof.items.map((item, idx) => (
                    <div key={item.id} className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.author} ({item.city})</span>
                        <span className="text-[10px] text-green-400 font-mono">items[{idx}]</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2 rounded border border-slate-800">
                        {item.message}
                      </p>
                      <div className="text-[10px] text-green-300 font-bold">
                        {item.resultBadge} · {item.portal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. PREGUNTAS FRECUENTES (FAQ) */}
          {(activeSection === 'all' || activeSection === 'faq') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Preguntas Frecuentes sobre el Pago</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.faq.items</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {promoContent.faq.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500">faq.items[{idx}]</span>
                    <h3 className="font-bold text-white text-sm">❓ {item.question}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">💡 {item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. OFERTA Y FORMULARIO */}
          {(activeSection === 'all' || activeSection === 'offer') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Oferta (3 Páginas Incluidas) & Formulario</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.offer</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextCard
                  label="Píldora Oferta"
                  keyPath="promoContent.offer.badge"
                  value={promoContent.offer.badge}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.offer.badge'}
                />

                <TextCard
                  label="Título de la Oferta"
                  keyPath="promoContent.offer.title"
                  value={promoContent.offer.title}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.offer.title'}
                />

                <div className="md:col-span-2">
                  <TextCard
                    label="Subtítulo Oferta"
                    keyPath="promoContent.offer.subtitle"
                    value={promoContent.offer.subtitle}
                    onCopy={copyToClipboard}
                    copied={copiedKey === 'promoContent.offer.subtitle'}
                  />
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">promoContent.offer.durations.sevenDays</span>
                  <div className="text-sm font-bold text-white">
                    {promoContent.offer.durations.sevenDays.label}: {promoContent.offer.durations.sevenDays.price}€
                  </div>
                  <div className="text-xs text-slate-400">
                    Antes: {promoContent.offer.durations.sevenDays.originalPrice}€ · {promoContent.offer.durations.sevenDays.note}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">promoContent.offer.durations.thirtyDays</span>
                  <div className="text-sm font-bold text-green-400">
                    {promoContent.offer.durations.thirtyDays.badge} · {promoContent.offer.durations.thirtyDays.label}: {promoContent.offer.durations.thirtyDays.price}€
                  </div>
                  <div className="text-xs text-slate-400">
                    Antes: {promoContent.offer.durations.thirtyDays.originalPrice}€ · {promoContent.offer.durations.thirtyDays.note}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">promoContent.offer.bizum</span>
                  <div className="text-sm font-bold text-white">Teléfono: {promoContent.offer.bizum.phone}</div>
                  <div className="text-xs text-slate-300">Concepto: {promoContent.offer.bizum.concept}</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">promoContent.offer.paysafecard</span>
                  <div className="text-sm font-bold text-white">{promoContent.offer.paysafecard.title}</div>
                  <div className="text-xs text-slate-300">{promoContent.offer.paysafecard.instruction}</div>
                </div>
              </div>
            </div>
          )}

          {/* 7. PREGUNTAS FRECUENTES (FAQ) */}
          {(activeSection === 'all' || activeSection === 'faq') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Preguntas Frecuentes (FAQ)</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.faq</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditorModalOpen(true)}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar / Añadir FAQs</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextCard
                    label="Título Línea 1"
                    keyPath="promoContent.faq.titleLine1"
                    value={promoContent.faq.titleLine1}
                    onCopy={copyToClipboard}
                    copied={copiedKey === 'promoContent.faq.titleLine1'}
                  />
                  <TextCard
                    label="Título Línea 2 (Destacada)"
                    keyPath="promoContent.faq.titleLine2"
                    value={promoContent.faq.titleLine2}
                    onCopy={copyToClipboard}
                    copied={copiedKey === 'promoContent.faq.titleLine2'}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Listado de Preguntas ({promoContent.faq.items.length})
                  </span>
                  {promoContent.faq.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-green-400">Pregunta #{idx + 1}</span>
                        <button
                          onClick={() => copyToClipboard(`${item.question}\n${item.answer}`, `faq_${idx}`)}
                          className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                        >
                          {copiedKey === `faq_${idx}` ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <div className="text-sm font-bold text-white">{item.question}</div>
                      <div className="text-xs text-slate-300 leading-relaxed">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. FOOTER & STICKY BAR */}
          {(activeSection === 'all' || activeSection === 'footer') && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-bold text-xs">
                    08
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">Footer & Sticky Bar</h2>
                    <p className="text-xs text-slate-400 font-mono">promoContent.footer & promoContent.stickyBar</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextCard
                  label="Sticky Bar Titular"
                  keyPath="promoContent.stickyBar.title"
                  value={promoContent.stickyBar.title}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.stickyBar.title'}
                />

                <TextCard
                  label="Sticky Bar Subtítulo"
                  keyPath="promoContent.stickyBar.subtitle"
                  value={promoContent.stickyBar.subtitle}
                  onCopy={copyToClipboard}
                  copied={copiedKey === 'promoContent.stickyBar.subtitle'}
                />

                <div className="md:col-span-2">
                  <TextCard
                    label="Footer Descripción"
                    keyPath="promoContent.footer.description"
                    value={promoContent.footer.description}
                    onCopy={copyToClipboard}
                    copied={copiedKey === 'promoContent.footer.description'}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        <LiveContentEditorModal
          isOpen={isEditorModalOpen}
          onClose={() => setIsEditorModalOpen(false)}
        />
      </div>
    </div>
  );
};

interface TextCardProps {
  label: string;
  keyPath: string;
  value: string;
  onCopy: (text: string, key: string) => void;
  copied: boolean;
}

const TextCard: React.FC<TextCardProps> = ({ label, keyPath, value, onCopy, copied }) => {
  return (
    <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-300">{label}</span>
        <button
          onClick={() => onCopy(value, keyPath)}
          className="text-[10px] text-green-400 hover:text-green-300 font-mono flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
        >
          {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      <span className="text-[10px] font-mono text-slate-500 block truncate">{keyPath}</span>
      <p className="text-xs text-white font-medium bg-slate-950/70 p-2 rounded border border-slate-800 break-words">
        {value}
      </p>
    </div>
  );
};
