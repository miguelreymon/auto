import React from 'react';
import { ShieldCheck, MessageCircle, Lock } from 'lucide-react';

interface FooterProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCheckout, onOpenWhatsApp, onOpenAdminLogin }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-10 pb-24 md:pb-10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <a href="#" className="inline-block text-xl font-black text-slate-900 mb-2">
          AutoPubli<span className="text-green-600">24</span>
        </a>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Herramienta automática para publicar anuncios en páginas de contactos y foros de adultos cada 20 minutos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-bold mb-6">
          <button onClick={onOpenCheckout} className="hover:text-green-600 cursor-pointer">
            Activar Anuncio
          </button>
          <span>·</span>
          <button onClick={onOpenWhatsApp} className="hover:text-green-600 cursor-pointer flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-green-600" />
            WhatsApp de Ayuda
          </button>
          <span>·</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            Garantía 100%
          </span>
          {onOpenAdminLogin && (
            <>
              <span>·</span>
              <button
                onClick={onOpenAdminLogin}
                className="hover:text-slate-900 cursor-pointer flex items-center gap-1 text-[11px] text-slate-400"
                title="Acceso de Administrador"
              >
                <Lock className="w-3 h-3" />
                Acceso Admin
              </button>
            </>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} AutoPubli 24. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

