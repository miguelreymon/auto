import React from 'react';
import { 
  Shield, 
  Sliders, 
  LogOut, 
  Star, 
  Zap, 
  Flame, 
  Sparkles, 
  Smartphone, 
  Check, 
  Edit3,
  HelpCircle
} from 'lucide-react';
import { LandingVersion } from './VersionSwitcher';

interface AdminControlBarProps {
  currentVersion: LandingVersion;
  onSelectVersion: (version: LandingVersion) => void;
  onOpenContentEditor: (initialTab?: any) => void;
  onLogout: () => void;
}

export const AdminControlBar: React.FC<AdminControlBarProps> = ({
  currentVersion,
  onSelectVersion,
  onOpenContentEditor,
  onLogout,
}) => {
  const versions: Array<{ id: LandingVersion; label: string; icon: any; recommended?: boolean }> = [
    { id: 'promo', label: '⭐ PROMO (Oficial)', icon: Star, recommended: true },
    { id: 'v4_bizum_direct', label: '4. Bizum Direct', icon: Smartphone },
    { id: 'v1_direct', label: '1. Directa', icon: Zap },
    { id: 'v2_wow_dynamic', label: '2. WOW Dinámico', icon: Flame },
    { id: 'v3_apple_minimal', label: '3. Apple Minimal', icon: Sparkles },
  ];

  return (
    <div className="sticky top-0 z-50 bg-slate-950 text-white border-b-2 border-emerald-500 shadow-xl px-3 py-2 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        
        {/* Identificador Admin */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">PANEL ADMIN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 hidden xs:block">Solo visible para ti</p>
          </div>
        </div>

        {/* Selector de Diseño Activo */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline shrink-0 mr-1">
            Diseño Activo:
          </span>
          {versions.map((v) => {
            const isSelected = currentVersion === v.id;
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{v.label}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Acciones Admin: Editar Textos & Cerrar Sesión */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onOpenContentEditor('faq')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Abrir editor directamente en Preguntas Frecuentes"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs</span>
          </button>

          <button
            onClick={() => onOpenContentEditor()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00a651] hover:bg-green-600 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95"
            title="Abrir editor de todos los textos de la landing"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Textos</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-red-950/60 hover:text-red-300 text-slate-400 border border-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            title="Cerrar sesión de administrador y ver web como cliente"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  );
};
