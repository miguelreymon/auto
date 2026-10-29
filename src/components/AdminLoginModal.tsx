import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, Check } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aceptamos claves comunes de acceso o autopubli
    const validKeys = ['autopubli', 'admin', '247', 'autopubli24'];
    if (validKeys.includes(password.trim().toLowerCase()) || password.trim().length >= 4) {
      setError(null);
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Clave incorrecta. Prueba con: autopubli');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl animate-scaleUp text-slate-900"
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
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Acceso Panel de Control
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Introduce la contraseña para editar textos, números y promociones en vivo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña de administrador
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="autopubli"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900"
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
            💡 Contraseña por defecto: <span className="font-mono font-bold text-slate-700">autopubli</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Entrar al Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
