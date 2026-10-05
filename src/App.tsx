import React, { useState, useEffect } from 'react';
import { LandingVersion } from './components/VersionSwitcher';
import { TopBanner } from './components/TopBanner';
import { Navbar } from './components/Navbar';
import { VersionOne } from './versions/VersionOne';
import { VersionTwo } from './versions/VersionTwo';
import { VersionThree } from './versions/VersionThree';
import { VersionFour } from './versions/VersionFour';
import { PromoPage } from './versions/PromoPage';
import { TextEditorView } from './versions/TextEditorView';
import { DirectCheckoutModal } from './components/DirectCheckoutModal';
import { WhatsAppChatModal } from './components/WhatsAppChatModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Footer } from './components/Footer';
import { ExtensionDownloadModal } from './components/ExtensionDownloadModal';
import { AdminControlBar } from './components/AdminControlBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LiveContentEditorModal } from './components/LiveContentEditorModal';
import { PromoContentProvider } from './context/PromoContentContext';
import { PricingPlan, LeadData } from './types';
import { MessageCircle } from 'lucide-react';

const defaultPopularPlan: PricingPlan = {
  id: 'monthly',
  name: 'Plan 1 Mes Completo',
  badge: 'MÁS VENDIDO · 50% DTO',
  popular: true,
  originalPrice: 158,
  currentPrice: 79,
  period: 'por 30 días',
  savings: 'Ahorras 79€ hoy',
  description: 'El que usa el 90% de anunciantes para tener clientes todos los días del mes.',
  features: [
    'Publicación automática cada 20 minutos 24/7',
    'Hasta 5 anuncios activos a la vez',
    'Sistema anti-bloqueo 100% seguro',
    'Cambio de fotos y textos gratis cuando quieras',
    'Garantía total de devolución de 14 días',
    'Soporte prioritario directo por WhatsApp',
  ],
  ctaText: '👉 ACTIVAR 1 MES (79€ - 50% DTO)',
};

export default function App() {
  // Versión activa de la landing (guardada en localStorage para persistencia)
  const [currentVersion, setCurrentVersion] = useState<LandingVersion>(() => {
    try {
      const saved = localStorage.getItem('autopubli_active_version') as LandingVersion;
      if (saved) return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'promo';
  });

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
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const handleOpenEditor = (tab?: any) => {
    if (tab) {
      setEditorInitialTab(tab);
    }
    setIsContentEditorOpen(true);
  };

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

  const handleSelectVersion = (version: LandingVersion) => {
    setCurrentVersion(version);
    try {
      localStorage.setItem('autopubli_active_version', version);
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setToastNotice(`Diseño cambiado a: ${version}`);
    setTimeout(() => setToastNotice(null), 3000);
  };

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
    setToastNotice('Sesión cerrada. Estás viendo la página como un cliente público.');
    setTimeout(() => setToastNotice(null), 4000);
  };

  const handleOpenCheckoutWithPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleDefaultOpenCheckout = () => {
    setSelectedPlan(defaultPopularPlan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (credentials: { email: string; phone: string }) => {
    setToastNotice(
      `¡Activación confirmada para ${credentials.phone}! Tu anuncio ya está publicándose cada 20 minutos.`
    );
    setTimeout(() => setToastNotice(null), 8000);
  };

  const handleLeadCaptured = (lead: LeadData) => {
    setToastNotice(
      `¡Recibido! Te estamos escribiendo al WhatsApp ${lead.phone} ahora mismo.`
    );
    setTimeout(() => setToastNotice(null), 6000);
  };

  return (
    <PromoContentProvider>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-green-500 selection:text-white">
        
        {/* Barra de Administración Superior: SOLO VISIBLE SI EL USUARIO HA INICIADO SESIÓN */}
        {isAdminLoggedIn && (
          <AdminControlBar
            currentVersion={currentVersion}
            onSelectVersion={handleSelectVersion}
            onOpenContentEditor={handleOpenEditor}
            onLogout={handleAdminLogout}
          />
        )}

        {/* Outer Top Banner & Navbar only for older versions */}
        {currentVersion !== 'promo' && (
          <>
            <TopBanner onClaimDiscount={handleDefaultOpenCheckout} />
            <Navbar
              onOpenCheckout={handleDefaultOpenCheckout}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onOpenExtension={() => setIsExtensionModalOpen(true)}
            />
          </>
        )}

        {/* Floating notification if purchase or lead submitted */}
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

        {/* Main Content Displayed according to selected version */}
        <main className="flex-1">
          {currentVersion === 'promo' && (
            <PromoPage
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onLeadCaptured={handleLeadCaptured}
              onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            />
          )}

          {currentVersion === 'texts_config' && (
            <TextEditorView onBackToPromo={() => handleSelectVersion('promo')} />
          )}

          {currentVersion === 'v4_bizum_direct' && (
            <VersionFour
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onLeadCaptured={handleLeadCaptured}
              onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
            />
          )}

          {currentVersion === 'v1_direct' && (
            <VersionOne
              onOpenCheckout={handleDefaultOpenCheckout}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onSelectPlan={handleOpenCheckoutWithPlan}
              onLeadCaptured={handleLeadCaptured}
            />
          )}

          {currentVersion === 'v2_wow_dynamic' && (
            <VersionTwo
              onOpenCheckout={handleDefaultOpenCheckout}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onSelectPlan={handleOpenCheckoutWithPlan}
              onLeadCaptured={handleLeadCaptured}
            />
          )}

          {currentVersion === 'v3_apple_minimal' && (
            <VersionThree
              onOpenCheckout={handleDefaultOpenCheckout}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onSelectPlan={handleOpenCheckoutWithPlan}
              onLeadCaptured={handleLeadCaptured}
            />
          )}
        </main>

        {/* Clean Quiet Footer only for older versions */}
        {currentVersion !== 'promo' && (
          <Footer
            onOpenCheckout={handleDefaultOpenCheckout}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />
        )}

        {/* Desktop Floating WhatsApp Button (only for older versions) */}
        {currentVersion !== 'promo' && (
          <aside aria-label="WhatsApp directo" className="hidden md:block fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="flex items-center gap-2 px-5 py-3.5 bg-green-500 hover:bg-green-400 text-white font-black text-sm rounded-full shadow-2xl shadow-green-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>¿Dudas? Habla por WhatsApp</span>
            </button>
          </aside>
        )}

        {/* Mobile Sticky Bar only for older versions */}
        {currentVersion !== 'promo' && (
          <MobileStickyBar
            onOpenCheckout={handleDefaultOpenCheckout}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {/* Direct Checkout Modal (Card, Bizum, Instant) */}
        <DirectCheckoutModal
          isOpen={isCheckoutOpen}
          selectedPlan={selectedPlan}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />

        {/* Instant WhatsApp Opener Modal */}
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

        {/* Extension Download Modal */}
        <ExtensionDownloadModal
          isOpen={isExtensionModalOpen}
          onClose={() => setIsExtensionModalOpen(false)}
        />

        {/* Modal de Acceso de Usuario Local / Administrador */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />

        {/* Modal de Edición de Textos en Vivo Vinculado */}
        <LiveContentEditorModal
          isOpen={isContentEditorOpen}
          initialTab={editorInitialTab}
          onClose={() => setIsContentEditorOpen(false)}
        />

      </div>
    </PromoContentProvider>
  );
}
