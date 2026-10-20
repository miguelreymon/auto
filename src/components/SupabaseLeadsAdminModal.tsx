import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Mail,
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  Trash2
} from 'lucide-react';
import { SupabaseSync } from '../lib/supabase';

interface SupabaseLeadsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseLeadsAdminModal: React.FC<SupabaseLeadsAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'inquiries'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsData, inquiriesData] = await Promise.all([
        SupabaseSync.fetchPaymentLeads(),
        SupabaseSync.fetchInquiries(),
      ]);
      setLeads(leadsData);
      setInquiries(inquiriesData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleStatusChange = async (leadId: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    await SupabaseSync.updatePaymentLeadStatus(leadId, newStatus);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.plan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.concept || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.pin_code || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInquiries = inquiries.filter((inq) => {
    return (
      (inq.contact_info || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.question || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 animate-scaleUp">
        
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit',sans-serif] font-black text-lg sm:text-xl text-white">
                  Buzón de Leads & Consultas Reales
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black tracking-wider uppercase">
                  Supabase Live DB
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Registros reales recibidos desde el formulario de Bizum/Paysafecard y el popup de ayuda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
              title="Recargar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Pestañas y Búsqueda */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-[#00a651] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Solicitudes de Pago ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Dudas & Consultas ({inquiries.length})</span>
            </button>
          </div>

          {/* Buscador */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por teléfono o texto..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#00a651]"
              />
            </div>
            {activeTab === 'leads' && (
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="verified">Validados</option>
                <option value="rejected">Rechazados</option>
              </select>
            )}
          </div>
        </div>

        {/* Contenido / Listado */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          {activeTab === 'leads' ? (
            filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CreditCard className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-sm text-slate-600">No hay solicitudes de pago aún</p>
                <p className="text-xs text-slate-400 mt-1">
                  Cuando un cliente rellene el formulario de Bizum o Paysafecard aparecerá aquí en tiempo real.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead, idx) => (
                  <div
                    key={lead.id || idx}
                    className="p-4 bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl shadow-2xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-base text-slate-950">
                          {lead.phone}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            lead.payment_method === 'bizum'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {lead.payment_method}
                        </span>
                        <span className="font-black text-sm text-emerald-700 font-mono">
                          {lead.amount}€
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            lead.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {lead.status === 'verified' ? '✓ Validado' : lead.status === 'rejected' ? '✗ Rechazado' : '⏳ Pendiente'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        <strong>Plan:</strong> {lead.plan || 'No especificado'}
                      </p>

                      {lead.concept && (
                        <p className="text-xs text-slate-500">
                          <strong>Concepto Bizum:</strong> <span className="font-mono font-bold text-slate-800">{lead.concept}</span>
                        </p>
                      )}

                      {lead.pin_code && (
                        <p className="text-xs text-slate-500">
                          <strong>PIN Paysafecard:</strong> <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">{lead.pin_code}</span>
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400">
                        {lead.created_at ? new Date(lead.created_at).toLocaleString('es-ES') : 'Fecha reciente'}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                      <a
                        href={`https://wa.me/${(lead.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hola, hemos comprobado tu solicitud de AutoPubli 24/7 para el teléfono ${lead.phone}. ¡Tu anuncio ya está listo para programarse cada 20 min!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 border border-green-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-green-600 fill-current" />
                        <span>Abrir WhatsApp</span>
                      </a>

                      {lead.status !== 'verified' && (
                        <button
                          onClick={() => handleStatusChange(lead.id, 'verified')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Marcar Validado
                        </button>
                      )}

                      {lead.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(lead.id, 'rejected')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Rechazar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredInquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Mail className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-sm text-slate-600">No hay consultas de usuarios todavía</p>
                <p className="text-xs text-slate-400 mt-1">
                  Cuando un visitante pregunte por el botón "¿Necesitas ayuda?", su mensaje aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq, idx) => (
                  <div
                    key={inq.id || idx}
                    className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {inq.contact_info}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {inq.created_at ? new Date(inq.created_at).toLocaleString('es-ES') : 'Fecha reciente'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {inq.contact_info?.includes('@') ? (
                          <a
                            href={`mailto:${inq.contact_info}?subject=Respuesta de AutoPubli 24/7`}
                            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Responder por Email</span>
                          </a>
                        ) : (
                          <a
                            href={`https://wa.me/${(inq.contact_info || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hola, te escribimos de AutoPubli 24/7 en relación a tu consulta: "${inq.question}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>Responder WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                      "{inq.question}"
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 sm:px-7 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Destino configurado: <strong>hola@autopubli24.com</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
