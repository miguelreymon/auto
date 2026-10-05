import React from 'react';
import { MessageCircle, Zap, Download } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
  onOpenExtension?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckout, onOpenWhatsApp, onOpenExtension }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-1.5 group">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-green-600 transition-colors">
            AutoPubli<span className="text-green-600">24</span>
          </span>
        </a>

        {/* Zone 2: Simple clear nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#como-funciona" className="hover:text-green-600 transition-colors">
            Cómo Funciona
          </a>
          <a href="#demo" className="hover:text-green-600 transition-colors">
            Probar Demo
          </a>
          <a href="#opiniones" className="hover:text-green-600 transition-colors">
            Opiniones
          </a>
          <a href="#precios" className="hover:text-green-600 transition-colors">
            Precios
          </a>
        </nav>

        {/* Zone 3: Direct Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenExtension && (
            <button
              onClick={onOpenExtension}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-green-600" />
              <span>Extensión</span>
            </button>
          )}

          <button
            onClick={onOpenWhatsApp}
            aria-label="WhatsApp directo"
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-green-600 text-green-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={onOpenCheckout}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-500 rounded-xl shadow-md hover:shadow-green-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Activar Ahora</span>
          </button>
        </div>
      </div>
    </header>
  );
};
