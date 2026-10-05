import React from 'react';
import { Sparkles, Zap, Flame, Smartphone, Star, FileText } from 'lucide-react';

export type LandingVersion = 'promo' | 'texts_config' | 'v4_bizum_direct' | 'v1_direct' | 'v2_wow_dynamic' | 'v3_apple_minimal';

interface VersionSwitcherProps {
  currentVersion: LandingVersion;
  onSelectVersion: (version: LandingVersion) => void;
}

export const VersionSwitcher: React.FC<VersionSwitcherProps> = ({
  currentVersion,
  onSelectVersion,
}) => {
  const versions = [
    {
      id: 'promo' as LandingVersion,
      label: '⭐ PROMO (Nueva a Medida)',
      badge: 'Tu Página Oficial',
      icon: Star,
      highlight: true,
    },
    {
      id: 'texts_config' as LandingVersion,
      label: '📝 Todos los Textos (Config)',
      badge: 'Editable en Código',
      icon: FileText,
      highlight: false,
    },
    {
      id: 'v4_bizum_direct' as LandingVersion,
      label: '4. Bizum & Paysafecard',
      badge: 'Versión Anterior',
      icon: Smartphone,
    },
    {
      id: 'v1_direct' as LandingVersion,
      label: '1. Directa & Simple',
      badge: 'Básica',
      icon: Zap,
    },
    {
      id: 'v2_wow_dynamic' as LandingVersion,
      label: '2. Efecto WOW Dinámico',
      badge: 'Calculadora Leads',
      icon: Flame,
    },
    {
      id: 'v3_apple_minimal' as LandingVersion,
      label: '3. Estilo Apple Limpio',
      badge: 'Antes vs Después',
      icon: Sparkles,
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-300 shadow-md py-2 px-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
            Elegir Diseño:
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
          {versions.map((v) => {
            const isSelected = currentVersion === v.id;
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-102'
                    : v.highlight
                    ? 'bg-green-50 hover:bg-green-100 text-green-900 border-green-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-green-400' : 'text-slate-500'}`} />
                <span>{v.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold hidden xs:inline ${
                    isSelected
                      ? 'bg-green-500 text-slate-950'
                      : v.highlight
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {v.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
