import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Globe,
  Clock,
  Users,
  Smartphone,
  Laptop,
  Tablet,
  MapPin,
  RefreshCw,
  Search,
  ArrowUpRight,
  Shield,
  Eye,
  Activity,
  Compass,
  Zap,
  BarChart3
} from 'lucide-react';
import { AnalyticsTracker, PageVisitRecord } from '../lib/analyticsTracker';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [visits, setVisits] = useState<PageVisitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const loadVisits = async () => {
    setLoading(true);
    try {
      const data = await AnalyticsTracker.fetchAllVisits();
      setVisits(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVisits();
      const interval = setInterval(loadVisits, 15000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Métricas agregadas
  const stats = useMemo(() => {
    const totalVisits = visits.length;
    const now = Date.now();
    // Considerar activo si tuvo ping en los últimos 45 segundos
    const activeNow = visits.filter((v) => {
      const last = new Date(v.last_ping).getTime();
      return now - last < 45000;
    }).length;

    const avgDurationSeconds = totalVisits > 0
      ? Math.round(visits.reduce((acc, v) => acc + (v.duration_seconds || 0), 0) / totalVisits)
      : 0;

    // Conteo por país, ciudad, dispositivo y origen de tráfico (SMS, WhatsApp, Directo, etc.)
    const countryMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    const sourceMap: Record<string, { count: number; label: string; icon: string }> = {
      whatsapp: { count: 0, label: 'WhatsApp', icon: '💬' },
      sms: { count: 0, label: 'Sms / Mensaje', icon: '📱' },
      direct: { count: 0, label: 'Directo / URL', icon: '⚡' },
      google: { count: 0, label: 'Google / Buscador', icon: '🔍' },
      instagram: { count: 0, label: 'Instagram', icon: '📸' },
      telegram: { count: 0, label: 'Telegram', icon: '✈️' },
      foro: { count: 0, label: 'Foros Adultos', icon: '🌐' },
      referral: { count: 0, label: 'Enlace Web', icon: '🔗' },
    };

    visits.forEach((v) => {
      countryMap[v.country] = (countryMap[v.country] || 0) + 1;
      cityMap[v.city] = (cityMap[v.city] || 0) + 1;
      if (v.device_type) {
        deviceMap[v.device_type] = (deviceMap[v.device_type] || 0) + 1;
      }
      const s = v.traffic_source || 'direct';
      if (sourceMap[s]) {
        sourceMap[s].count += 1;
      } else {
        sourceMap.direct.count += 1;
      }
    });

    const topCountries = Object.entries(countryMap)
      .map(([name, count]) => ({ name, count, percent: Math.round((count / totalVisits) * 100) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topCities = Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topSources = Object.entries(sourceMap)
      .map(([key, data]) => ({ key, ...data, percent: Math.round((data.count / totalVisits) * 100) || 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      totalVisits,
      activeNow,
      avgDurationSeconds,
      topCountries,
      topCities,
      topSources,
      deviceMap,
    };
  }, [visits]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds < 60) return `${seconds || 0}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const filteredVisits = visits.filter((v) => {
    if (sourceFilter !== 'all') {
      if (sourceFilter === 'other') {
        if (['sms', 'whatsapp', 'direct', 'google'].includes(v.traffic_source)) return false;
      } else if (v.traffic_source !== sourceFilter) {
        return false;
      }
    }

    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return (
      v.city.toLowerCase().includes(term) ||
      v.country.toLowerCase().includes(term) ||
      v.browser.toLowerCase().includes(term) ||
      v.os.toLowerCase().includes(term) ||
      v.page_path.toLowerCase().includes(term) ||
      (v.source_label && v.source_label.toLowerCase().includes(term)) ||
      (v.traffic_source && v.traffic_source.toLowerCase().includes(term)) ||
      (v.referrer && v.referrer.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 animate-scaleUp">
        
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit',sans-serif] font-black text-lg sm:text-xl text-white">
                  Analítica en Vivo de Visitantes
                </h3>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{stats.activeNow} activos ahora</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Métricas reales: tiempo de permanencia, países, ciudades, dispositivos y páginas visitadas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadVisits}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
              title="Recargar analítica"
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

        {/* Dashboard de Tarjetas Principales */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 sm:px-7 grid grid-cols-2 md:grid-cols-4 gap-3.5 shrink-0">
          
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>Total Visitas</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {stats.totalVisits}
            </div>
            <span className="text-[10px] text-slate-400">Registradas en la plataforma</span>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>En la web ahora</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono flex items-center gap-1.5">
              <span>{stats.activeNow}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400">Navegando en este instante</span>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>Tiempo Medio</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatDuration(stats.avgDurationSeconds)}
            </div>
            <span className="text-[10px] text-slate-400">Por cada visitante</span>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>Móvil vs Ordenador</span>
              <Smartphone className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xs font-bold text-slate-800 space-y-0.5 pt-1">
              <div className="flex justify-between">
                <span>📱 Móvil:</span>
                <span className="font-mono">{stats.deviceMap.mobile || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>💻 PC:</span>
                <span className="font-mono">{stats.deviceMap.desktop || 0}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Resumen de Origen de Tráfico y Geográfico */}
        <div className="p-5 sm:px-7 border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-3.5 shrink-0">
          
          {/* Canal de Origen (SMS, WhatsApp, Directo, etc.) */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 mb-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Canal de Origen de Tráfico:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {stats.topSources.length === 0 ? (
                <span className="text-xs text-slate-400">Sin datos</span>
              ) : (
                stats.topSources.map((s) => (
                  <span
                    key={s.key}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span>{s.icon} {s.label}</span>
                    <strong className="text-emerald-700 font-mono font-black">{s.count}</strong>
                    <span className="text-[10px] text-slate-400">({s.percent}%)</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Top Países */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Países con más visitantes:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {stats.topCountries.length === 0 ? (
                <span className="text-xs text-slate-400">Sin datos aún</span>
              ) : (
                stats.topCountries.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <span>🌍 {c.name}</span>
                    <strong className="text-blue-700 font-mono">{c.count}</strong>
                    <span className="text-[10px] text-slate-400">({c.percent}%)</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Top Ciudades */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Ciudades destacadas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {stats.topCities.length === 0 ? (
                <span className="text-xs text-slate-400">Sin datos aún</span>
              ) : (
                stats.topCities.map((ct) => (
                  <span
                    key={ct.name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <span>📍 {ct.name}</span>
                    <strong className="text-slate-900 font-mono">({ct.count})</strong>
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Buscador de Visitas y Filtros por Canal */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por ciudad, país, navegador o página..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Filtros de origen de tráfico */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                sourceFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos ({visits.length})
            </button>
            <button
              onClick={() => setSourceFilter('sms')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                sourceFilter === 'sms'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-purple-200 text-purple-800 hover:bg-purple-50'
              }`}
            >
              📱 SMS ({visits.filter((v) => v.traffic_source === 'sms').length})
            </button>
            <button
              onClick={() => setSourceFilter('whatsapp')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                sourceFilter === 'whatsapp'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              💬 WhatsApp ({visits.filter((v) => v.traffic_source === 'whatsapp').length})
            </button>
            <button
              onClick={() => setSourceFilter('direct')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                sourceFilter === 'direct'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ⚡ Directo ({visits.filter((v) => v.traffic_source === 'direct').length})
            </button>
            <button
              onClick={() => setSourceFilter('other')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                sourceFilter === 'other'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              🌐 Otros ({visits.filter((v) => !['sms', 'whatsapp', 'direct'].includes(v.traffic_source)).length})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Mostrando <strong>{filteredVisits.length}</strong> sesiones
          </span>
        </div>

        {/* Tabla / Listado de Visitas Individuales */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-2.5">
          {filteredVisits.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Globe className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-sm text-slate-600">No hay sesiones que coincidan</p>
              <p className="text-xs text-slate-400 mt-1">
                A medida que los usuarios entren en la web se registrará su país, tiempo, dispositivo y origen (SMS, WhatsApp, Directo).
              </p>
            </div>
          ) : (
            filteredVisits.map((v) => {
              const isRecent = Date.now() - new Date(v.last_ping).getTime() < 45000;
              return (
                <div
                  key={v.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isRecent
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        v.device_type === 'mobile'
                          ? 'bg-blue-100 text-blue-700'
                          : v.device_type === 'tablet'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {v.device_type === 'mobile' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : v.device_type === 'tablet' ? (
                        <Tablet className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-950">
                          {v.city}, {v.country}
                        </span>
                        {isRecent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                            En vivo
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-slate-400">
                          {v.browser} · {v.os}
                        </span>
                      </div>
                      
                      {/* Badge de Fuente de Tráfico y Datos de Navegación */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {v.traffic_source === 'sms' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-black">
                            📱 Campaña SMS
                          </span>
                        ) : v.traffic_source === 'whatsapp' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-black">
                            💬 Enlace WhatsApp
                          </span>
                        ) : v.traffic_source === 'telegram' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-300 text-[11px] font-black">
                            ✈️ Telegram
                          </span>
                        ) : v.traffic_source === 'google' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-black">
                            🔍 Búsqueda Google
                          </span>
                        ) : v.traffic_source === 'foro' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-black">
                            {v.source_label || '🌐 Foro'}
                          </span>
                        ) : v.traffic_source === 'referral' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-950 border border-indigo-300 text-[11px] font-black">
                            {v.source_label || '🔗 Enlace Web'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-black">
                            ⚡ Directo / URL navegador
                          </span>
                        )}

                        <span className="text-xs text-slate-600">Página: <strong>{v.page_path}</strong></span>
                        {v.referrer && v.referrer !== 'Directo' && (
                          <span className="text-xs text-slate-400">· Ref: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-600">{v.referrer}</code></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Tiempo en la web:</span>
                      <strong className="text-sm font-mono text-slate-900 font-black">
                        ⏱️ {formatDuration(v.duration_seconds)}
                      </strong>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 min-w-[70px]">
                      {new Date(v.last_ping).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 sm:px-7 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Sincronizado con <strong>Supabase (page_visits)</strong> y <strong>Vercel Analytics</strong></span>
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
