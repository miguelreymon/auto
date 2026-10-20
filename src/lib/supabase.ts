import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://rbrmymyyautruwatonkw.supabase.co';
export const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_1rh-0UDyeWSQyl40BX66sA_KH0ffHT5';

// Cliente Supabase oficial
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Servicio centralizado para sincronizar datos con Supabase:
 * 1. Contenidos de la web (textos, precios, ofertas)
 * 2. Usuarios simulados & analíticas de facturación
 * 3. Consultas recibidas en el popup (hola@autopubli24.com)
 * 4. Pagos registrados (Bizum y Paysafecard con PIN)
 */

export const SupabaseSync = {
  // --- CONTENIDO Y CONFIGURACIÓN ---
  async fetchPromoContent(): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('app_content')
        .select('data')
        .eq('id', 'main_promo_content')
        .single();

      if (error) {
        // Puede ser que la tabla aún no exista si no se ejecutó el SQL
        return null;
      }
      return data?.data || null;
    } catch {
      return null;
    }
  },

  async savePromoContent(content: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('app_content')
        .upsert(
          {
            id: 'main_promo_content',
            data: content,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.warn('[Supabase] No se pudo guardar en app_content:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] Error en savePromoContent:', err);
      return false;
    }
  },

  // --- USUARIOS SIMULADOS (SOCIAL PROOF) ---
  async fetchFakeUsers(): Promise<any[] | null> {
    try {
      const { data, error } = await supabase
        .from('fake_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return null;
      return data || null;
    } catch {
      return null;
    }
  },

  async saveFakeUsers(users: any[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fake_users')
        .upsert(
          users.map((u) => ({
            id: u.id,
            name: u.name,
            phone: u.phone,
            city: u.city,
            portal: u.portal,
            plan_name: u.planName,
            amount: u.amount,
            status: u.status,
            date: u.date,
            user_type: u.type,
            payment_method: u.paymentMethod,
            renewals_count: u.renewalsCount,
            calls_boost_percent: u.callsBoostPercent,
            auto_renew_enabled: u.autoRenewEnabled,
          })),
          { onConflict: 'id' }
        );

      if (error) {
        console.warn('[Supabase] No se pudo guardar fake_users:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // --- CONSULTAS RECIBIDAS (POPUP) ---
  async fetchInquiries(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Error fetchInquiries:', error.message);
        // Fallback a localStorage
        return JSON.parse(localStorage.getItem('autopubli_inquiries') || '[]');
      }
      return data || [];
    } catch {
      return JSON.parse(localStorage.getItem('autopubli_inquiries') || '[]');
    }
  },

  async saveInquiry(contactInfo: string, question: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          contact_info: contactInfo,
          question: question,
          recipient: 'hola@autopubli24.com',
          created_at: new Date().toISOString(),
        },
      ]);
      return !error;
    } catch {
      return false;
    }
  },

  // --- REGISTRO DE PAGOS / LEADS (BIZUM & PAYSAFECARD) ---
  async fetchPaymentLeads(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('payment_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Error fetchPaymentLeads:', error.message);
        return JSON.parse(localStorage.getItem('autopubli_leads_cache') || '[]');
      }
      return data || [];
    } catch {
      return JSON.parse(localStorage.getItem('autopubli_leads_cache') || '[]');
    }
  },

  async updatePaymentLeadStatus(id: string, status: 'pending' | 'verified' | 'rejected'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payment_leads')
        .update({ status })
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  async savePaymentLead(lead: {
    phone: string;
    method: 'bizum' | 'paysafecard';
    amount: number;
    plan: string;
    concept?: string;
    pin?: string;
  }): Promise<boolean> {
    // Guardar en cache local también
    try {
      const cache = JSON.parse(localStorage.getItem('autopubli_leads_cache') || '[]');
      cache.unshift({
        id: Date.now().toString(),
        phone: lead.phone,
        payment_method: lead.method,
        amount: lead.amount,
        plan: lead.plan,
        concept: lead.concept || null,
        pin_code: lead.pin || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('autopubli_leads_cache', JSON.stringify(cache.slice(0, 50)));
    } catch (_) {}

    try {
      const { error } = await supabase.from('payment_leads').insert([
        {
          phone: lead.phone,
          payment_method: lead.method,
          amount: lead.amount,
          plan: lead.plan,
          concept: lead.concept || null,
          pin_code: lead.pin || null,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);
      return !error;
    } catch {
      return false;
    }
  },
};
