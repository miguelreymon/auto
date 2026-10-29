import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PromoPage } from './versions/PromoPage';
import { AffiliatesPage } from './versions/AffiliatesPage';
import { CityLicensePage } from './versions/CityLicensePage';
import { DirectCheckoutModal } from './components/DirectCheckoutModal';
import { WhatsAppChatModal } from './components/WhatsAppChatModal';
import { ExtensionDownloadModal } from './components/ExtensionDownloadModal';
import { AdminControlBar } from './components/AdminControlBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LiveContentEditorModal } from './components/LiveContentEditorModal';
import { MarketingCopysModal } from './components/MarketingCopysModal';
import { FakeUsersAdminModal } from './components/FakeUsersAdminModal';
import { ContactDoubtModal } from './components/ContactDoubtModal';
import { SupabaseLeadsAdminModal } from './components/SupabaseLeadsAdminModal';
import { AnalyticsDashboardModal } from './components/AnalyticsDashboardModal';
import { AnalyticsTracker } from './lib/analyticsTracker';
import { initTwclidCapture, trackXPageView, trackXWhatsAppPurchase } from './lib/xPixel';
import { LiveSalesNotification } from './components/LiveSalesNotification';
import { PromoContentProvider } from './context/PromoContentContext';
import { PricingPlan, LeadData } from './types';

const defaultPopularPlan: PricingPlan = {
  id: 'monthly',
  name: 'Plan 1 Mes Completo',
  badge: 'MÁS VENDIDO · 50% DTO',
  popular: true,
  originalPrice: 50,
  currentPrice: 25,
  period: 'por 30 días',
  savings: 'Ahorras 25€ hoy',
  description: 'El que usa el 90% de anunciantes para tener clientes todos los días del mes.',
  features: [
    'Publicación automática cada 20 minutos 24/7',
    'Hasta 5 anuncios activos a la vez',
    'Sistema anti-bloqueo 100% seguro',
    'Cambio de fotos y textos gratis cuando quieras',
    'Garantía total de devolución de 14 días',
    'Soporte prioritario directo por WhatsApp',
  ],
  ctaText: '👉 ACTIVAR 1 MES (25€ - 50% DTO)',
};

export default function App() {
  // Estado de sesión de usuario local / administrador
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('autopubli_admin_session') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<any>('oferta');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(defaultPopularPlan);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isCopysModalOpen, setIsCopysModalOpen] = useState(false);
  const [isFakeUsersModalOpen, setIsFakeUsersModalOpen] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Inicializar tracking en vivo de visitantes y captura de parámetros de campaña (twclid de X)
  useEffect(() => {
    AnalyticsTracker.initTracking();
    initTwclidCapture();
  }, []);

  const handleOpenEditor = (tab?: any) => {
    if (tab) {
      setEditorInitialTab(tab);
    }
    setIsContentEditorOpen(true);
  };

  const [currentView, setCurrentView] = useState<'home' | 'afiliados' | 'franquicia'>(() => {
    try {
      const p = (window.location.pathname || '').toLowerCase();
      const h = (window.location.hash || '').toLowerCase();
      if (
        p === '/ciudades' || p === '/ciudades/' ||
        p === '/licencia' || p === '/licencia/' ||
        p === '/franquicia' || p === '/franquicia/' ||
        p === '/negocio' || p === '/negocio/' ||
        p === '/exclusividad' || p === '/exclusividad/' ||
        h === '#ciudades' || h === '#franquicia' || h === '#licencia' || h === '#negocio'
      ) {
        return 'franquicia';
      }
      if (p === '/afiliados' || p === '/afiliados/' || p === '/sellers' || p === '/sellers/' || h === '#afiliados') {
        return 'afiliados';
      }
    } catch (_) {}
    return 'home';
  });

  const navigateTo = (view: 'home' | 'afiliados' | 'franquicia') => {
    setCurrentView(view);
    const targetUrl = view === 'afiliados' ? '/afiliados' : view === 'franquicia' ? '/ciudades' : '/';
    try {
      window.history.pushState(null, '', targetUrl);
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detección de cambios de ruta (/ciudades, /afiliados y /)
  useEffect(() => {
    const handleLocationChange = () => {
      const p = (window.location.pathname || '').toLowerCase();
      const h = (window.location.hash || '').toLowerCase();
      if (
        p === '/ciudades' || p === '/ciudades/' ||
        p === '/licencia' || p === '/licencia/' ||
        p === '/franquicia' || p === '/franquicia/' ||
        p === '/negocio' || p === '/negocio/' ||
        p === '/exclusividad' || p === '/exclusividad/' ||
        h === '#ciudades' || h === '#franquicia' || h === '#licencia' || h === '#negocio'
      ) {
        setCurrentView('franquicia');
      } else if (p === '/afiliados' || p === '/afiliados/' || p === '/sellers' || p === '/sellers/' || h === '#afiliados') {
        setCurrentView('afiliados');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Enviar evento PageView a X en cada visita / cambio de página SPA
  useEffect(() => {
    trackXPageView(currentView);
  }, [currentView]);

  // Detección de ruta secreta /autoadmin para acceder al panel de administración
  useEffect(() => {
    const checkAutoAdminRoute = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();

      if (
        path === '/autoadmin' ||
        path === '/autoadmin/' ||
        path.endsWith('/autoadmin') ||
        search.includes('autoadmin') ||
        hash === '#autoadmin'
      ) {
        if (isAdminLoggedIn) {
          setIsContentEditorOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    checkAutoAdminRoute();
    window.addEventListener('popstate', checkAutoAdminRoute);
    window.addEventListener('hashchange', checkAutoAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAutoAdminRoute);
      window.removeEventListener('hashchange', checkAutoAdminRoute);
    };
  }, [isAdminLoggedIn]);

  // Atajo de teclado para abrir el acceso de administrador: Ctrl + Shift + A o Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsContentEditorOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('autopubli_admin_session', 'true');
    } catch (e) {
      console.error(e);
    }
    setToastNotice('¡Sesión iniciada! Ahora tienes activo el panel superior de administración.');
    setTimeout(() => setToastNotice(null), 4000);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('autopubli_admin_session');
    } catch (e) {
      console.error(e);
    }
    setToastNotice('Sesión cerrada.');
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleCheckoutSuccess = (credentials: { email: string; phone: string }) => {
    setToastNotice(
      `¡Activación confirmada para ${credentials.phone}! Tu anuncio ya está publicándose cada 20 minutos.`
    );
    setTimeout(() => setToastNotice(null), 8000);
  };

  const handleLeadCaptured = (_lead: LeadData) => {
    // No mostramos toast tras enviar Bizum para no dar información engañosa antes de comprobarlo
  };

  return (
    <PromoContentProvider>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-green-500 selection:text-white">
        
        {/* Barra de Administración Superior: SOLO VISIBLE SI EL USUARIO HA INICIADO SESIÓN */}
        {isAdminLoggedIn && (
          <AdminControlBar
            currentView={currentView}
            onNavigateView={navigateTo}
            onToggleView={() => navigateTo(currentView === 'home' ? 'afiliados' : 'home')}
            onOpenContentEditor={handleOpenEditor}
            onOpenCopysModal={() => setIsCopysModalOpen(true)}
            onOpenFakeUsersModal={() => setIsFakeUsersModalOpen(true)}
            onOpenLeadsModal={() => setIsLeadsModalOpen(true)}
            onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
            onLogout={handleAdminLogout}
          />
        )}

        {/* Notificación flotante de confirmación */}
        {toastNotice && (
          <div className="fixed top-20 right-4 z-50 max-w-sm p-4 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-fadeIn">
            <span>{toastNotice}</span>
            <button
              onClick={() => setToastNotice(null)}
              className="text-slate-400 hover:text-white cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Contenido Principal */}
        <main className="flex-1">
          {currentView === 'afiliados' ? (
            <AffiliatesPage
              onBackToHome={() => navigateTo('home')}
              onNavigateToCityLicense={() => navigateTo('franquicia')}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            />
          ) : currentView === 'franquicia' ? (
            <CityLicensePage
              onBackToHome={() => navigateTo('home')}
              onNavigateToAffiliates={() => navigateTo('afiliados')}
              onOpenWhatsApp={(msg) => {
                trackXWhatsAppPurchase({
                  planOrCity: 'Licencia Ciudad AutoPubli 24/7',
                  value: 490,
                });
                if (msg) {
                  const target = '34622431478';
                  window.open(`https://wa.me/${target}?text=${encodeURIComponent(msg)}`, '_blank');
                } else {
                  setIsWhatsAppOpen(true);
                }
              }}
            />
          ) : (
            <PromoPage
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onOpenDoubtModal={() => setIsDoubtModalOpen(true)}
              onLeadCaptured={handleLeadCaptured}
              onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
              onNavigateToAffiliates={() => navigateTo('afiliados')}
              onNavigateToCityLicense={() => navigateTo('franquicia')}
            />
          )}
        </main>

        {/* Modales */}
        <DirectCheckoutModal
          isOpen={isCheckoutOpen}
          selectedPlan={selectedPlan}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />

        {/* Modal para Resolver Dudas (envío a hola@autopubli24.com) */}
        <ContactDoubtModal
          isOpen={isDoubtModalOpen}
          onClose={() => setIsDoubtModalOpen(false)}
          onMessageSent={(contact, q) => {
            setToastNotice(`¡Consulta enviada a hola@autopubli24.com! Te responderemos muy pronto.`);
            setTimeout(() => setToastNotice(null), 5000);
          }}
        />

        <WhatsAppChatModal
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          onConfirmWhatsApp={(phone, query) => {
            handleLeadCaptured({
              name: '',
              phone,
              email: '',
              interestedPlan: selectedPlan.name,
              platform: query,
            });
          }}
        />

        <ExtensionDownloadModal
          isOpen={isExtensionModalOpen}
          onClose={() => setIsExtensionModalOpen(false)}
        />

        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />

        <LiveContentEditorModal
          isOpen={isContentEditorOpen}
          initialTab={editorInitialTab}
          onOpenFakeUsersModal={() => setIsFakeUsersModalOpen(true)}
          onClose={() => setIsContentEditorOpen(false)}
        />

        {/* Modal Biblioteca de Copys & Mensajes de Venta */}
        <MarketingCopysModal
          isOpen={isCopysModalOpen}
          onClose={() => setIsCopysModalOpen(false)}
        />

        {/* Modal Gestor y Simulador de Usuarios & Facturación */}
        <FakeUsersAdminModal
          isOpen={isFakeUsersModalOpen}
          onClose={() => setIsFakeUsersModalOpen(false)}
        />

        {/* Modal Buzón de Leads y Consultas Reales de Supabase */}
        <SupabaseLeadsAdminModal
          isOpen={isLeadsModalOpen}
          onClose={() => setIsLeadsModalOpen(false)}
        />

        {/* Modal Analítica de Visitantes (Países, Tiempo, Dispositivos) */}
        <AnalyticsDashboardModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
        />

        {/* Notificación Social Proof periódica en vivo (si el admin la activó) */}
        <LiveSalesNotification />

        {/* Vercel Web Analytics */}
        <Analytics />

      </div>
    </PromoContentProvider>
  );
}
