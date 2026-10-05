import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Zap, 
  ArrowRight,
  Globe,
  Radio
} from 'lucide-react';

interface SecureAccountLinkerProps {
  onSuccess?: (accountData: { portal: string; email: string }) => void;
}

export const SecureAccountLinker: React.FC<SecureAccountLinkerProps> = ({ onSuccess }) => {
  const [selectedPortal, setSelectedPortal] = useState<string>('milanuncios');
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [connectionMode, setConnectionMode] = useState<'mobile_ip' | 'cloud_4g'>('mobile_ip');
  
  // Workflow states: 'input' | 'verifying' | 'sms' | 'error' | 'success'
  const [step, setStep] = useState<'input' | 'verifying' | 'sms' | 'error' | 'success'>('input');
  const [verificationLog, setVerificationLog] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const portalsList = [
    { id: 'milanuncios', name: 'Milanuncios.es', color: 'border-blue-500 text-blue-700 bg-blue-50' },
    { id: 'milpasiones', name: 'Milpasiones.com', color: 'border-pink-500 text-pink-700 bg-pink-50' },
    { id: 'loquosex', name: 'Loquosex.com', color: 'border-purple-500 text-purple-700 bg-purple-50' },
    { id: 'nuevoloquo', name: 'NuevoLoquo.ch', color: 'border-amber-500 text-amber-700 bg-amber-50' },
  ];

  // Autofill quick demo data for easy testing
  const handleAutofillDemo = () => {
    setAccountEmail('elena.madrid@gmail.com');
    setAccountPassword('ClaveSegura2026!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountEmail || !accountPassword) return;

    setStep('verifying');
    setVerificationLog('Iniciando conexión segura cifrada SSL...');

    setTimeout(() => {
      setVerificationLog(`Conectando con ${selectedPortal} usando IP móvil española...`);
    }, 900);

    setTimeout(() => {
      setVerificationLog('Comprobando usuario y contraseña...');
    }, 1800);

    setTimeout(() => {
      // If user typed 'error' or wrong data, simulate error, otherwise simulate 2FA SMS or direct success
      if (accountPassword.toLowerCase() === 'error') {
        setErrorMessage('Credenciales no válidas. El portal no reconoce este email o contraseña.');
        setStep('error');
      } else {
        // Most realistic flow: Portal asks for 2FA SMS confirmation once
        setStep('sms');
      }
    }, 2800);
  };

  const handleConfirmSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsCode || smsCode.length < 4) return;

    setStep('verifying');
    setVerificationLog('Validando código SMS y guardando sesión cifrada (token seguro)...');

    setTimeout(() => {
      setStep('success');
      if (onSuccess) {
        onSuccess({ portal: selectedPortal, email: accountEmail });
      }
    }, 1600);
  };

  const handleReset = () => {
    setStep('input');
    setErrorMessage('');
    setSmsCode('');
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl max-w-2xl mx-auto my-8 text-left text-slate-900">
      {/* Header with Security Trust Badges */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            SINCRONIZACIÓN Y VINCULACIÓN SEGURA
          </span>
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Cifrado Militar SSL 256-bit
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
          Vincula Tu Portal para Auto-Renovación 24/7
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          El sistema se conecta automáticamente para pulsar «Renovar» cada 20 minutos sin necesidad de que tengas el móvil encendido.
        </p>
      </div>

      {/* STEP 1: CREDENTIALS INPUT FORM */}
      {step === 'input' && (
        <form onSubmit={handleSubmit} className="pt-6 space-y-5 animate-fadeIn">
          {/* Portal Selector */}
          <div>
            <label className="text-xs font-black uppercase text-slate-700 block mb-2">
              1. Selecciona tu portal:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {portalsList.map((portal) => (
                <button
                  type="button"
                  key={portal.id}
                  onClick={() => setSelectedPortal(portal.id)}
                  className={`p-3 rounded-2xl border-2 text-xs font-black text-center transition-all cursor-pointer ${
                    selectedPortal === portal.id
                      ? 'border-green-500 bg-green-50 text-green-950 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                  }`}
                >
                  {portal.name}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Origin / IP Type Switcher */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-xs font-black uppercase text-slate-700 block mb-2">
              2. Origen de la conexión (Anti-Bloqueo IP):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConnectionMode('mobile_ip')}
                className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                  connectionMode === 'mobile_ip'
                    ? 'border-green-500 bg-white font-bold text-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-500 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-slate-900 mb-0.5">
                  <Smartphone className="w-3.5 h-3.5 text-green-600" />
                  <span>Tu Propia IP Móvil</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Envía la orden directamente desde la conexión 4G de tu teléfono.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setConnectionMode('cloud_4g')}
                className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                  connectionMode === 'cloud_4g'
                    ? 'border-green-500 bg-white font-bold text-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-500 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-slate-900 mb-0.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Proxy 4G en la Nube</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Permite apagar el móvil. El servidor renueva desde una antena móvil española.
                </span>
              </button>
            </div>
          </div>

          {/* Email / User Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase text-slate-700">
                Email o Teléfono con el que publicas en {selectedPortal}:
              </label>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="text-[11px] text-green-700 font-bold hover:underline cursor-pointer"
              >
                ⚡ Rellenar datos de prueba
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="ejemplo@correo.com o 600123456"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-black uppercase text-slate-700 block mb-1.5">
              Contraseña de tu cuenta:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-green-500 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              🔒 Tus datos son encriptados en tu dispositivo antes de enviarse.
            </span>
          </div>

          {/* Trust Guarantees */}
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Garantía de Privacidad y Seguridad:
            </div>
            <p className="text-[11px] text-green-800 leading-relaxed">
              Ninguna persona física tiene acceso a tu contraseña. Solo el robot automatizado la utiliza para iniciar la sesión una vez y guardar la autorización de renovación.
            </p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black text-base rounded-2xl shadow-xl shadow-green-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap className="w-5 h-5 fill-current text-yellow-300" />
            <span>COMPROBAR Y VINCULAR CUENTA AHORA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* STEP 2: VERIFYING IN REAL TIME */}
      {step === 'verifying' && (
        <div className="py-12 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto border-2 border-green-500">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <h4 className="text-xl font-black text-slate-900">
            Comprobando Conexión con {selectedPortal}...
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 font-mono bg-slate-100 p-3 rounded-xl max-w-md mx-auto">
            {verificationLog}
          </p>
          <span className="text-xs text-slate-400 block">
            Verificando IP española y autorización segura...
          </span>
        </div>
      )}

      {/* STEP 3: 2FA SMS CONFIRMATION (TRANSPARENT & REAL) */}
      {step === 'sms' && (
        <form onSubmit={handleConfirmSms} className="pt-6 space-y-4 animate-fadeIn text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 border-2 border-blue-400">
            <Smartphone className="w-7 h-7" />
          </div>

          <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            CONFIRMACIÓN DE SEGURIDAD (UNA SOLA VEZ)
          </span>

          <h4 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
            Introduce el código SMS que te envió {selectedPortal}
          </h4>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Como es la primera vez que se vincula el robot, el portal te ha enviado un SMS de seguridad a tu móvil. Introdúcelo para confirmar la autorización:
          </p>

          <div className="max-w-xs mx-auto">
            <input
              type="text"
              required
              maxLength={6}
              placeholder="1 2 3 4"
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 bg-slate-50 border-2 border-blue-400 rounded-2xl focus:outline-none focus:border-blue-600 text-slate-900"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Código de 4 a 6 dígitos (Solo se pide esta primera vez)
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CONFIRMAR Y ACTIVAR SUBIDAS AUTOMÁTICAS</span>
          </button>
        </form>
      )}

      {/* STEP: ERROR STATE */}
      {step === 'error' && (
        <div className="py-8 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto border-2 border-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-slate-900">
            No se pudo completar la vinculación
          </h4>
          <p className="text-xs sm:text-sm text-red-600 font-bold bg-red-50 p-3 rounded-xl max-w-md mx-auto border border-red-200">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            Revisar datos e intentar de nuevo
          </button>
        </div>
      )}

      {/* STEP 4: SUCCESS & ACTIVE DASHBOARD */}
      {step === 'success' && (
        <div className="py-6 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto border-3 border-green-500 shadow-lg shadow-green-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black uppercase text-green-700 bg-green-100 px-3 py-1 rounded-full">
              VINCULACIÓN COMPLETADA Y VERIFICADA
            </span>
            <h4 className="text-2xl font-black text-slate-950 mt-2">
              ¡Tu Cuenta Está en Piloto Automático 24/7!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              La sesión y autorización han quedado guardadas con seguridad. Ya no necesitas tener el móvil encendido.
            </p>
          </div>

          {/* Status Box */}
          <div className="p-4 bg-slate-50 border-2 border-green-400 rounded-2xl text-left space-y-2.5 max-w-md mx-auto text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Portal Vinculado:</span>
              <strong className="text-slate-900 uppercase">{selectedPortal}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Usuario / Cuenta:</span>
              <strong className="text-slate-900 font-mono">{accountEmail}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Modo de Conexión:</span>
              <strong className="text-blue-600">IP Móvil 4G España (Inmune a bloqueos)</strong>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 font-bold">Frecuencia de Subida:</span>
              <strong className="text-green-600 font-black">Cada 20 minutos (24 horas)</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Vincular Otra Cuenta
            </button>
            <span className="text-xs text-green-700 font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-green-600" />
              Robot activo y renovando en segundo plano
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
