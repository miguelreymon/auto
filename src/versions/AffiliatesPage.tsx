import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  HelpCircle,
  Download,
  Globe
} from 'lucide-react';
import { usePromoContent } from '../context/PromoContentContext';
import promoWhatsAppImg from '../assets/images/promowhatsapp.jpg';

interface AffiliatesPageProps {
  onBackToHome?: () => void;
  onOpenWhatsApp?: () => void;
}

export const AffiliatesPage: React.FC<AffiliatesPageProps> = ({ 
  onBackToHome,
  onOpenWhatsApp 
}) => {
  const { content } = usePromoContent();
  const [copiedScript, setCopiedScript] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 260);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SEO dinámico para la página de afiliados
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Programa de Afiliados AutoPubli 24/7 – Gana 10€ por Bizum Recomendando";

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Gana 10€ de comisión inmediata por Bizum recomendando el auto-publicador de anuncios a compañeras y foros de otras ciudades. Soporte técnico incluido y cobro en el mismo día.'
      );
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute('content', prevDesc);
    };
  }, []);

  const getAdminWhatsAppTarget = () => {
    const raw = (content.offer?.adminWhatsAppNumber || '66917515345').replace(/\D/g, '');
    if (raw.length > 9) return raw;
    if (raw.length === 9) return `34${raw}`;
    return raw || '66917515345';
  };

  const handleStartAffiliateWhatsApp = () => {
    const target = getAdminWhatsAppTarget();
    const msg = `¡Hola! He visto la página de afiliados de AutoPubli 24/7 y quiero empezar a recomendar la herramienta para ganar comisiones por Bizum. ¿Cómo empezamos?`;
    const waUrl = `https://wa.me/${target}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const copyRecommendationScript = () => {
    const scriptText = `¡Hola! Si te anuncias en portales de contactos y estás cansada de renovar a mano cada 20 minutos, echa un vistazo a www.autopubli24.com. Es un sistema que te sube el anuncio a primera posición en automático todo el día por 25€ al mes. Te ahorras estar pegada al móvil.`;
    navigator.clipboard?.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans selection:bg-green-500 selection:text-white">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              if (onBackToHome) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="text-lg sm:text-xl font-black tracking-tight text-slate-950 flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
            title="Volver a la página de inicio"
          >
            <span>AutoPubli</span>
            <span className="text-[#00a651]">24</span>
            <span className="ml-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Afiliados
            </span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-14 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-black uppercase mb-4">
            <span>PROGRAMA OFICIAL DE COLABORADORES Y AFILIADOS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4">
            Gana <span className="text-[#00a651]">10€ por Cada Activación</span> Pagados al Instante por Bizum
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6">
            Recomienda AutoPubli 24/7 a compañeras, contactos o en foros de otras ciudades. Ellas ahorran horas de renovar a mano y tú te llevas dinero limpio a tu cuenta.
          </p>

          <button
            onClick={handleStartAffiliateWhatsApp}
            className="w-full sm:w-auto px-8 py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-base rounded-2xl shadow-xl shadow-green-600/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto active:scale-95"
          >
            <Zap className="w-5 h-5 fill-current text-yellow-300" />
            <span>QUIERO SER AFILIADA Y COBRAR POR BIZUM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Pasos Clave */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 font-black flex items-center justify-center text-sm mb-3">
              1
            </div>
            <h3 className="font-black text-sm text-slate-900 mb-1.5">
              Recomiendas en otras ciudades
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pásale la web a compañeras de otras provincias o foros. Así no te hacen competencia en tu ciudad y te ganas su agradecimiento.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 font-black flex items-center justify-center text-sm mb-3">
              2
            </div>
            <h3 className="font-black text-sm text-slate-900 mb-1.5">
              Nosotros hacemos todo el soporte
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tú no tienes que configurar nada ni atender dudas. Les damos soporte técnico directo por WhatsApp para dejar su anuncio activo.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 font-black flex items-center justify-center text-sm mb-3">
              3
            </div>
            <h3 className="font-black text-sm text-slate-900 mb-1.5">
              Bizum de 10€ inmediato
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              En cuanto tu contacto activa su <strong>Pack Mes Completo (25€)</strong>, te transferimos tus 10€ de comisión directos a tu Bizum en el mismo día.
            </p>
          </div>
        </div>

        {/* Ventajas para el vendedor */}
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-7 border border-slate-200 mb-12">
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4">
            ¿Por qué es tan fácil de vender?
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0 mt-0.5" />
              <span>
                <strong>El producto se vende solo:</strong> Todo el mundo en las páginas de anuncios está harto de renovar manualmente a mano cada 20 minutos.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0 mt-0.5" />
              <span>
                <strong>Precio irresistible de 25€:</strong> Es un precio ridículo que recuperan con una sola cita que les entre gracias al anuncio.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0 mt-0.5" />
              <span>
                <strong>100% Discreto y seguro:</strong> No necesitas dar datos personales, solo tu número de Bizum para recibir tus pagos.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0 mt-0.5" />
              <span>
                <strong>Sin cuotas ni permanencias:</strong> Tu contacto prueba un mes y si renueva el mes siguiente, sigues sumando.
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje Listo para Copiar y Pegar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Texto listo para copiar y enviar en WhatsApp o foros:</span>
            </h3>
            <button
              onClick={copyRecommendationScript}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono leading-relaxed select-all">
            «¡Hola! Si te anuncias en portales de contactos y estás cansada de renovar a mano cada 20 minutos, echa un vistazo a www.autopubli24.com. Es un sistema que te sube el anuncio a primera posición en automático todo el día por 25€ al mes. Te ahorras estar pegada al móvil.»
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            💡 Consejo: Pásalo a compañeras de otras ciudades para no competir con tus propios anuncios.
          </p>
        </div>

        {/* Imagen Promocional para WhatsApp / Foros */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                Imagen promocional para adjuntar en WhatsApp o foros:
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Puedes descargarla en alta calidad para enviarla junto al texto en tus mensajes o foros.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={promoWhatsAppImg}
                download="promowhatsapp.jpg"
                className="px-4 py-2 bg-[#00a651] hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Imagen</span>
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex justify-center p-2 sm:p-4">
            <img
              src={promoWhatsAppImg}
              alt="Cartel promocional AutoPubli 24/7"
              className="max-h-[480px] w-auto object-contain rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Preguntas Frecuentes de Afiliados (Optimizado para SEO) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-12">
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>PREGUNTAS FRECUENTES DEL PROGRAMA DE AFILIADOS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-6">
            Dudas Habituales sobre Comisiones y Pagos por Bizum
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                ¿La comisión de 10€ aplica a todos los paquetes o solo al mes completo?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                La comisión de 10€ se abona <strong>exclusivamente con las activaciones del Plan Mes Completo de 25€ (30 días)</strong>, que es el plan que eligen más del 90% de anunciantes para tener llamadas y primeras posiciones todo el mes. El plan de 1 semana es una prueba reducida a precio de coste que no genera comisión de afiliado.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                ¿Cómo y cuándo cobro mis 10€ de comisión?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cobras al instante mediante transferencia por Bizum. En cuanto tu recomendada tramita su pago de 25€ para el mes de servicio, recibes tus 10€ en tu número de Bizum en el mismo día laborable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                ¿Por qué se recomienda en otras ciudades o provincias?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Para que no te hagas competencia a ti misma. Si tú te anuncias en Madrid o Valencia, puedes recomendar la herramienta a compañeras de Barcelona, Sevilla, Bilbao o foros de otras zonas. Así tú sigues dominando tu ciudad y ganas dinero extra con las demás.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                ¿Tengo que saber de informática o dar soporte a las clientas?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cero. Tú solo les pasas el texto y la imagen o tu código. Todo el soporte técnico, dudas de configuración de los anuncios en portales y gestión del servicio lo hacemos nosotros directamente por WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                ¿Es confidencial y discreto?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Totalmente. No necesitamos tus datos personales, DNI ni contratos. Solo tu número de teléfono para enviarte los Bizums de tus comisiones ganadas.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 text-center shadow-xl mb-6">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            ¿Quieres empezar a ganar dinero hoy mismo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
            Escríbenos a WhatsApp. Te damos tu código de afiliada para que cada persona que nos contacte de tu parte quede registrada contigo y cobres tus 10€ de inmediato.
          </p>

          <button
            onClick={handleStartAffiliateWhatsApp}
            className="w-full sm:w-auto px-8 py-4 bg-[#00a651] hover:bg-green-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Hablar con Soporte de Afiliados por WhatsApp</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 pb-20 sm:pb-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} AutoPubli 24/7 · Programa de Afiliados
          </div>
          <div className="flex items-center gap-4">
            {onBackToHome ? (
              <button
                onClick={onBackToHome}
                className="hover:text-slate-800 transition-colors cursor-pointer"
              >
                Volver a la web principal
              </button>
            ) : (
              <a href="/" className="hover:text-slate-800 transition-colors">
                Volver a la web principal
              </a>
            )}
            <span>·</span>
            <button
              onClick={handleStartAffiliateWhatsApp}
              className="text-[#00a651] hover:underline cursor-pointer font-bold"
            >
              Contacto WhatsApp
            </button>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar Sutil (Aparece al hacer scroll desde el inicio) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl transition-all duration-300 ease-in-out ${
          showStickyBar ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 self-center" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-none">
              ¿Quieres ver cómo funciona?
            </span>
          </div>

          <a
            href="/"
            onClick={(e) => {
              if (onBackToHome) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <span>Ver la Herramienta</span>
            <ArrowRight className="w-3.5 h-3.5 text-green-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
