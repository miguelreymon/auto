import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ThreeStepProcess } from '../components/ThreeStepProcess';
import { InteractiveDashboardDemo } from '../components/InteractiveDashboardDemo';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { PricingSection } from '../components/PricingSection';
import { LeadCaptureFallback } from '../components/LeadCaptureFallback';
import { PricingPlan, LeadData } from '../types';

interface VersionOneProps {
  onOpenCheckout: () => void;
  onOpenWhatsApp: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
  onLeadCaptured: (lead: LeadData) => void;
}

export const VersionOne: React.FC<VersionOneProps> = ({
  onOpenCheckout,
  onOpenWhatsApp,
  onSelectPlan,
  onLeadCaptured,
}) => {
  const handleExploreDemo = () => {
    const demo = document.getElementById('demo');
    if (demo) demo.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <HeroSection
        onOpenCheckout={onOpenCheckout}
        onOpenWhatsApp={onOpenWhatsApp}
        onExploreDemo={handleExploreDemo}
      />
      <ThreeStepProcess onOpenCheckout={onOpenCheckout} />
      <InteractiveDashboardDemo onOpenCheckout={onOpenCheckout} />
      <TestimonialsSection />
      <PricingSection
        onSelectPlan={onSelectPlan}
        onOpenLeadModal={onOpenWhatsApp}
      />
      <LeadCaptureFallback onLeadCaptured={onLeadCaptured} />
    </div>
  );
};
