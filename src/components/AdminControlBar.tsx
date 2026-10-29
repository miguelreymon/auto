import React from 'react';
import { Sliders, LogOut, Shield, Users, Globe, BookOpen, Database, BarChart3 } from 'lucide-react';

interface AdminControlBarProps {
  currentView?: 'home' | 'afiliados' | 'franquicia';
  onNavigateView?: (view: 'home' | 'afiliados' | 'franquicia') => void;
  onToggleView?: () => void;
  onOpenContentEditor: (tab?: any) => void;
  onOpenCopysModal?: () => void;
  onOpenFakeUsersModal?: () => void;
  onOpenLeadsModal?: () => void;
  onOpenAnalyticsModal?: () => void;
  onLogout: () => void;
}

export const AdminControlBar: React.FC<AdminControlBarProps> = ({
  currentView = 'home',
  onNavigateView,
  onToggleView,
  onOpenContentEditor,
  onOpenCopysModal,
  onOpenFakeUsersModal,
  onOpenLeadsModal,
  onOpenAnalyticsModal,
  onLogout,
}) => {
  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/30">
          <Shield className="w-3.5 h-3.5 text-green-400" />
          <span>Panel Admin AutoPubli 24/7</span>
        </div>

        {onOpenLeadsModal && (
          <button
            onClick={onOpenLeadsModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 font-bold text-xs cursor-pointer transition-all shadow-xs"
            title="Ver leads de Bizum/Paysafecard y consultas del popup guardadas en Supabase"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buzón Leads & Consultas Supabase</span>
          </button>
        )}

        {onNavigateView ? (
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => onNavigateView('home')}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                currentView === 'home' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Principal (/)
            </button>
            <button
              onClick={() => onNavigateView('afiliados')}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                currentView === 'afiliados' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Afiliados (/afiliados)
            </button>
            <button
              onClick={() => onNavigateView('franquicia')}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                currentView === 'franquicia' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              💼 Ciudades (/ciudades)
            </button>
          </div>
        ) : onToggleView ? (
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer transition-colors"
          >
            {currentView === 'home' ? (
              <>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ver Página Afiliados (/afiliados)</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ver Landing Principal (/)</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {onOpenFakeUsersModal && (
          <button
            onClick={onOpenFakeUsersModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-lg shadow-sm transition-all cursor-pointer text-xs"
            title="Gestor y Generador de Usuarios Simulados, Facturación y Resultados"
          >
            <Users className="w-3.5 h-3.5 text-blue-200" />
            <span>Usuarios Simulados & Pagos</span>
          </button>
        )}

        {onOpenAnalyticsModal && (
          <button
            onClick={onOpenAnalyticsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-lg shadow-sm transition-all cursor-pointer text-xs"
            title="Analítica en tiempo real: visitantes activos, países, tiempo en la web y dispositivos"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-200" />
            <span>Analítica Visitantes (En vivo)</span>
          </button>
        )}

        {onOpenCopysModal && (
          <button
            onClick={onOpenCopysModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg shadow-sm transition-all cursor-pointer text-xs"
            title="Ver biblioteca de copys y mensajes para foros y WhatsApp"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca de Copys</span>
          </button>
        )}

        <button
          onClick={() => onOpenContentEditor()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer text-xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Editar Textos & Precios</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/80 hover:text-red-300 text-slate-300 font-medium rounded-lg border border-slate-700 transition-all cursor-pointer text-xs"
          title="Cerrar sesión de administrador"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  );
};
