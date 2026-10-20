export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  originalPrice: number;
  currentPrice: number;
  period: string;
  savings?: string;
  description: string;
  features: string[];
  ctaText: string;
}

export interface LeadData {
  name?: string;
  phone: string;
  email?: string;
  interestedPlan?: string;
  platform?: string;
}
