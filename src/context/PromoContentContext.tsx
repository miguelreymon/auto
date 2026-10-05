import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromoContent, promoContent as defaultPromoContent } from '../content/promoContent';

interface PromoContentContextType {
  content: PromoContent;
  updateContent: (newContent: PromoContent) => void;
  updateSectionField: <K extends keyof PromoContent>(section: K, field: keyof PromoContent[K], value: any) => void;
  resetToDefaults: () => void;
  exportAsCodeString: () => string;
}

const STORAGE_KEY = 'autopubli_promo_content_v4';

const PromoContentContext = createContext<PromoContentContextType | undefined>(undefined);

export const PromoContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PromoContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults so newly added schema keys aren't missing
        return {
          ...defaultPromoContent,
          ...parsed,
          navbar: { ...defaultPromoContent.navbar, ...(parsed.navbar || {}) },
          turboBanner: { ...defaultPromoContent.turboBanner, ...(parsed.turboBanner || {}) },
          hero: { ...defaultPromoContent.hero, ...(parsed.hero || {}) },
          urgencyBanner: { ...defaultPromoContent.urgencyBanner, ...(parsed.urgencyBanner || {}) },
          benefits: { ...defaultPromoContent.benefits, ...(parsed.benefits || {}) },
          portals: { ...defaultPromoContent.portals, ...(parsed.portals || {}) },
          antiBan: { ...defaultPromoContent.antiBan, ...(parsed.antiBan || {}) },
          guarantee: { ...defaultPromoContent.guarantee, ...(parsed.guarantee || {}) },
          socialProof: { ...defaultPromoContent.socialProof, ...(parsed.socialProof || {}) },
          faq: { ...defaultPromoContent.faq, ...(parsed.faq || {}) },
          offer: {
            ...defaultPromoContent.offer,
            ...(parsed.offer || {}),
            durations: {
              ...defaultPromoContent.offer.durations,
              ...(parsed.offer?.durations || {}),
              sevenDays: { ...defaultPromoContent.offer.durations.sevenDays, ...(parsed.offer?.durations?.sevenDays || {}) },
              thirtyDays: { ...defaultPromoContent.offer.durations.thirtyDays, ...(parsed.offer?.durations?.thirtyDays || {}) },
            },
            bizum: { ...defaultPromoContent.offer.bizum, ...(parsed.offer?.bizum || {}) },
            paysafecard: { ...defaultPromoContent.offer.paysafecard, ...(parsed.offer?.paysafecard || {}) },
          },
          stickyBar: { ...defaultPromoContent.stickyBar, ...(parsed.stickyBar || {}) },
          footer: { ...defaultPromoContent.footer, ...(parsed.footer || {}) },
        };
      }
    } catch (e) {
      console.warn('Error reading promo content from localStorage:', e);
    }
    return defaultPromoContent;
  });

  const updateContent = (newContent: PromoContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving promo content to localStorage:', e);
    }
  };

  const updateSectionField = <K extends keyof PromoContent>(
    section: K,
    field: keyof PromoContent[K],
    value: any
  ) => {
    setContent((prev) => {
      const updatedSection = {
        ...prev[section],
        [field]: value,
      };
      const updated = {
        ...prev,
        [section]: updatedSection,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving updated field to localStorage:', e);
      }
      return updated;
    });
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setContent(defaultPromoContent);
  };

  const exportAsCodeString = () => {
    return `// Archivo: src/content/promoContent.ts
// Textos y configuración de AutoPubli24 actualizados desde el panel admin

import { PromoContent } from './promoContent';

export const promoContent: PromoContent = ${JSON.stringify(content, null, 2)};
`;
  };

  return (
    <PromoContentContext.Provider
      value={{
        content,
        updateContent,
        updateSectionField,
        resetToDefaults,
        exportAsCodeString,
      }}
    >
      {children}
    </PromoContentContext.Provider>
  );
};

export const usePromoContent = () => {
  const context = useContext(PromoContentContext);
  if (!context) {
    throw new Error('usePromoContent must be used within a PromoContentProvider');
  }
  return context;
};
