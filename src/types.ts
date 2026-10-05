export type PlanId = 'weekly' | 'monthly' | 'quarterly';

export interface PricingPlan {
  id: PlanId;
  name: string;
  badge?: string;
  originalPrice: number;
  currentPrice: number;
  period: string;
  savings?: string;
  popular?: boolean;
  description: string;
  features: string[];
  ctaText: string;
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  platform?: string;
  interestedPlan?: string;
  paymentMethod?: 'card' | 'bizum' | 'crypto' | 'paypal';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarText: string;
  stars: number;
  headline: string;
  story: string;
  outcome: string;
  verified: boolean;
}

export interface SimulatedPortalStatus {
  id: string;
  name: string;
  category: string;
  lastPosted: string;
  nextPost: string;
  status: 'active' | 'syncing' | 'published';
  position: string;
  views: number;
  leadsToday: number;
}
