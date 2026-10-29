import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Building,
  User,
  Layers,
  BarChart3,
  Globe2,
  Bell,
  Eye,
  Sliders,
  Calendar,
  Shuffle,
  ChevronDown
} from 'lucide-react';
import { SupabaseSync } from '../lib/supabase';

export interface FakeUserRecord {
  id: string;
  name: string;
  phone: string;
  type: 'individual' | 'piso' | 'agencia';
  city: string;
  portal: 'milpasiones' | 'pasionvalencia' | 'ambos';
  planName: string;
  planAmount: number;
  paymentMethod: 'Bizum' | 'Tarjeta' | 'Transferencia';
  paymentStatus: 'pagado' | 'recurrente' | 'prueba';
  initialRank: number;
  currentRank: number;
  callsIncreasePercent: number;
  totalRenewals: number;
  subscribedDaysAgo: number;
  lastRenewalMinutesAgo: number;
  active: boolean;
}

interface FakeUsersAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'autopubli_fake_users_db';
const LIVE_POPUP_SETTING_KEY = 'autopubli_live_popup_enabled';

// Generadores de nombres y ubicaciones realistas en España
const SPANISH_NAMES_INDIVIDUAL = [
  'Valeria', 'Camila', 'Sofía', 'Natalia', 'Lucía', 'Carla', 'Yuliet', 'Giselle', 
  'Antonella', 'Melanie', 'Daniela', 'Fernanda', 'Paola', 'Carolina', 'Dayana', 
  'Tatiana', 'Lorena', 'Verónica', 'Andrea', 'Brenda', 'Fiorella', 'Gabriela'
];

const SPANISH_NAMES_PISO = [
  'Piso Gran Vía Suites', 'Alojamiento Ruzafa Centro', 'Piso Privado Castellana', 
  'Habitaciones Sagunto', 'Piso Exclusivo Salamanca', 'Alojamiento Eixample', 
  'Habitaciones Nervión', 'Piso Colón Valencia', 'Residencial Triana', 'Piso Malvarrosa'
];

const SPANISH_NAMES_AGENCIA = [
  'Agencia TopEscorts España', 'Publicidad & Medios Levante', 'Gestión Anuncios VIP', 
  'Agencia Pasión Promociones', 'Elite Marketing Adultos', 'PasionDigital Studio'
];

const SPANISH_CITIES = [
  { city: 'Valencia', province: 'Valencia', weightPV: true },
  { city: 'Madrid', province: 'Madrid', weightPV: false },
  { city: 'Barcelona', province: 'Barcelona', weightPV: false },
  { city: 'Alicante', province: 'Alicante', weightPV: false },
  { city: 'Gandía', province: 'Valencia', weightPV: true },
  { city: 'Sagunto', province: 'Valencia', weightPV: true },
  { city: 'Málaga', province: 'Málaga', weightPV: false },
  { city: 'Sevilla', province: 'Sevilla', weightPV: false },
  { city: 'Murcia', province: 'Murcia', weightPV: false },
  { city: 'Zaragoza', province: 'Zaragoza', weightPV: false },
  { city: 'Bilbao', province: 'Vizcaya', weightPV: false },
  { city: 'Alzira', province: 'Valencia', weightPV: true },
  { city: 'Castellón', province: 'Castellón', weightPV: false }
];

export const generateSingleFakeUser = (customType?: 'individual' | 'piso' | 'agencia'): FakeUserRecord => {
  const type = customType || (Math.random() < 0.65 ? 'individual' : Math.random() < 0.85 ? 'piso' : 'agencia');
  
  let name = '';
  let planName = 'Plan 1 Mes Completo';
  let planAmount = 25;

  if (type === 'individual') {
    name = SPANISH_NAMES_INDIVIDUAL[Math.floor(Math.random() * SPANISH_NAMES_INDIVIDUAL.length)];
    const planRoll = Math.random();
    if (planRoll < 0.7) {
      planName = 'Plan 1 Mes (Subida 20 min)';
      planAmount = 25;
    } else if (planRoll < 0.9) {
      planName = 'Plan Trimestral VIP';
      planAmount = 60;
    } else {
      planName = 'Plan 1 Semana';
      planAmount = 10;
    }
  } else if (type === 'piso') {
    name = SPANISH_NAMES_PISO[Math.floor(Math.random() * SPANISH_NAMES_PISO.length)];
    const planRoll = Math.random();
    if (planRoll < 0.6) {
      planName = 'Bono Piso (Hasta 5 Anuncios)';
      planAmount = 75;
    } else {
      planName = 'Bono Piso Completo 10 Anuncios';
      planAmount = 120;
    }
  } else {
    name = SPANISH_NAMES_AGENCIA[Math.floor(Math.random() * SPANISH_NAMES_AGENCIA.length)];
    const planRoll = Math.random();
    if (planRoll < 0.5) {
      planName = 'Tarifa Plana Agencia (20 Anuncios)';
      planAmount = 180;
    } else {
      planName = 'Licencia Agencia Ilimitada';
      planAmount = 290;
    }
  }

  // Teléfono móvil español
  const randomPrefix = ['60', '61', '62', '63', '64', '65', '67', '68', '69'][Math.floor(Math.random() * 9)];
  const randomMiddle = Math.floor(1000000 + Math.random() * 8999999).toString();
  const phone = `+34 ${randomPrefix}${randomMiddle.slice(0, 1)} ${randomMiddle.slice(1, 3)} ${randomMiddle.slice(3, 5)} ${randomMiddle.slice(5, 7)}`;

  // Ubicación
  const cityObj = SPANISH_CITIES[Math.floor(Math.random() * SPANISH_CITIES.length)];
  const city = cityObj.city;

  // Portal
  let portal: 'milpasiones' | 'pasionvalencia' | 'ambos' = 'milpasiones';
  if (cityObj.weightPV) {
    const portalRoll = Math.random();
    if (portalRoll < 0.45) portal = 'ambos';
    else if (portalRoll < 0.75) portal = 'pasionvalencia';
    else portal = 'milpasiones';
  } else {
    portal = Math.random() < 0.15 ? 'ambos' : 'milpasiones';
  }

  // Puestos
  const initialRank = Math.floor(18 + Math.random() * 65); // Estaba en puesto 18 a 80
  const currentRank = Math.random() < 0.88 ? 1 : Math.floor(2 + Math.random() * 2); // 88% en puesto #1

  // Facturación y método de pago
  const paymentMethods: Array<'Bizum' | 'Tarjeta' | 'Transferencia'> = ['Bizum', 'Bizum', 'Tarjeta', 'Tarjeta', 'Transferencia'];
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  const paymentStatus = Math.random() < 0.92 ? 'pagado' : 'recurrente';

  // Antigüedad y métricas
  const subscribedDaysAgo = Math.floor(1 + Math.random() * 45);
  const totalRenewals = Math.floor(subscribedDaysAgo * 72 * (0.8 + Math.random() * 0.4)); // ~72 subidas al día cada 20 min
  const callsIncreasePercent = Math.floor(140 + Math.random() * 230); // +140% a +370% llamadas
  const lastRenewalMinutesAgo = Math.floor(1 + Math.random() * 18); // Subido hace 1 a 18 min

  return {
    id: 'usr_' + Math.random().toString(36).slice(2, 9),
    name,
    phone,
    type,
    city,
    portal,
    planName,
    planAmount,
    paymentMethod,
    paymentStatus,
    initialRank,
    currentRank,
    callsIncreasePercent,
    totalRenewals,
    subscribedDaysAgo,
    lastRenewalMinutesAgo,
    active: true,
  };
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateInitialFakeUsers = (count = 28): FakeUserRecord[] => {
  const users: FakeUserRecord[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateSingleFakeUser());
  }
  return shuffleArray(users);
};

export const FakeUsersAdminModal: React.FC<FakeUsersAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [users, setUsers] = useState<FakeUserRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return shuffleArray(parsed);
      }
    } catch (_) {}
    return generateInitialFakeUsers(28);
  });

  const [livePopupEnabled, setLivePopupEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LIVE_POPUP_SETTING_KEY) === 'true';
    } catch (_) {
      return false;
    }
  });

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPortal, setFilterPortal] = useState<'all' | 'milpasiones' | 'pasionvalencia' | 'ambos'>('all');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'piso' | 'agencia'>('all');
  const [batchCount, setBatchCount] = useState<number>(15);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Formulario manual
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('+34 6');
  const [manualCity, setManualCity] = useState('Valencia');
  const [manualType, setManualType] = useState<'individual' | 'piso' | 'agencia'>('individual');
  const [manualPortal, setManualPortal] = useState<'milpasiones' | 'pasionvalencia' | 'ambos'>('ambos');
  const [manualPlan, setManualPlan] = useState('Plan 1 Mes Completo');
  const [manualAmount, setManualAmount] = useState(25);
  const [manualMethod, setManualMethod] = useState<'Bizum' | 'Tarjeta' | 'Transferencia'>('Bizum');

  // Guardar en localStorage y Supabase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
    // Sincronizar en base de datos Supabase
    SupabaseSync.saveFakeUsers(users);
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(LIVE_POPUP_SETTING_KEY, livePopupEnabled ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [livePopupEnabled]);

  // Cálculos de métricas globales
  const stats = useMemo(() => {
    const totalRevenue = users.reduce((acc, u) => acc + (u.planAmount || 0), 0);
    const activeUsers = users.filter(u => u.active).length;
    const totalRenewals = users.reduce((acc, u) => acc + (u.totalRenewals || 0), 0);
    const mrr = users.reduce((acc, u) => {
      if (u.planName.includes('Trimestral')) return acc + Math.round(u.planAmount / 3);
      if (u.planName.includes('Semana')) return acc + u.planAmount * 4;
      return acc + u.planAmount;
    }, 0);

    const dualPortalCount = users.filter(u => u.portal === 'ambos').length;
    const avgCallsBoost = users.length > 0
      ? Math.round(users.reduce((acc, u) => acc + u.callsIncreasePercent, 0) / users.length)
      : 0;

    return {
      totalRevenue,
      mrr,
      totalUsers: users.length,
      activeUsers,
      totalRenewals,
      dualPortalCount,
      avgCallsBoost,
    };
  }, [users]);

  const [sortBy, setSortBy] = useState<'random' | 'amount_desc' | 'rank' | 'recent'>('random');

  // Filtrado de usuarios en la tabla
  const filteredUsers = useMemo(() => {
    const list = users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm) ||
        u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.planName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPortal = filterPortal === 'all' || u.portal === filterPortal;
      const matchesType = filterType === 'all' || u.type === filterType;

      return matchesSearch && matchesPortal && matchesType;
    });

    if (sortBy === 'amount_desc') {
      return [...list].sort((a, b) => b.planAmount - a.planAmount);
    }
    if (sortBy === 'rank') {
      return [...list].sort((a, b) => a.currentRank - b.currentRank);
    }
    if (sortBy === 'recent') {
      return [...list].sort((a, b) => a.subscribedDaysAgo - b.subscribedDaysAgo);
    }
    return list;
  }, [users, searchTerm, filterPortal, filterType, sortBy]);

  const handleGenerateBatch = (countToAdd: number) => {
    const newBatch: FakeUserRecord[] = [];
    for (let i = 0; i < countToAdd; i++) {
      newBatch.push(generateSingleFakeUser());
    }
    setUsers(prev => shuffleArray([...newBatch, ...prev]));
    showToastNotice(`¡Añadidos ${countToAdd} usuarios aleatorios intercalados!`);
  };

  const handleShuffleList = () => {
    setUsers(prev => shuffleArray(prev));
    showToastNotice('🎲 ¡Lista mezclada y reordenada 100% al azar!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Seguro que deseas regenerar la lista completa con 28 clientes nuevos?')) {
      const fresh = generateInitialFakeUsers(28);
      setUsers(fresh);
      showToastNotice('Base de usuarios restablecida con 28 nuevos perfiles.');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Deseas vaciar toda la lista de usuarios simulados?')) {
      setUsers([]);
      showToastNotice('Lista vaciada.');
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleToggleUserActive = (id: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const handleAddManualUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newUser: FakeUserRecord = {
      id: 'usr_man_' + Math.random().toString(36).slice(2, 9),
      name: manualName.trim(),
      phone: manualPhone.trim() || '+34 600 00 00 00',
      type: manualType,
      city: manualCity.trim() || 'Valencia',
      portal: manualPortal,
      planName: manualPlan,
      planAmount: Number(manualAmount) || 25,
      paymentMethod: manualMethod,
      paymentStatus: 'pagado',
      initialRank: 32,
      currentRank: 1,
      callsIncreasePercent: 210,
      totalRenewals: 720,
      subscribedDaysAgo: 10,
      lastRenewalMinutesAgo: 4,
      active: true,
    };

    setUsers(prev => [newUser, ...prev]);
    setIsManualFormOpen(false);
    setManualName('');
    showToastNotice(`¡Usuario manual "${newUser.name}" añadido a la base de datos!`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'Tipo', 'Teléfono', 'Ciudad', 'Portal', 'Plan', 'Importe_EUR', 'Metodo_Pago', 'Puesto_Inicial', 'Puesto_Actual', 'Renovaciones_Totales', 'Aumento_Llamadas_%'];
    const rows = users.map(u => [
      u.id,
      `"${u.name}"`,
      u.type,
      `"${u.phone}"`,
      `"${u.city}"`,
      u.portal,
      `"${u.planName}"`,
      u.planAmount,
      u.paymentMethod,
      u.initialRank,
      u.currentRank,
      u.totalRenewals,
      u.callsIncreasePercent
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autopubli24_clientes_simulados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastNotice('Archivo CSV exportado correctamente.');
  };

  const handleCopyFinancialSummary = () => {
    const summaryText = `📊 RESUMEN EJECUTIVO - AUTOPUBLI 24/7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Facturación Total Acumulada: ${stats.totalRevenue.toLocaleString('es-ES')} €
📈 MRR (Ingreso Mensual Recurrente): ${stats.mrr.toLocaleString('es-ES')} €/mes
👥 Clientes Registrados: ${stats.totalUsers} (${stats.activeUsers} activos / 100% al día)
⚡ Renovaciones al #1 Ejecutadas: ${stats.totalRenewals.toLocaleString('es-ES')} subidas
🌐 Clientes Multicanal (MilPasiones + PasionValencia): ${stats.dualPortalCount}
📞 Aumento Medio de Llamadas Reportado: +${stats.avgCallsBoost}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generado automáticamente desde el Panel de Administración AutoPubli 24.`;

    navigator.clipboard.writeText(summaryText);
    showToastNotice('¡Resumen financiero copiado al portapapeles!');
  };

  const showToastNotice = (msg: string) => {
    setCopiedNotice(msg);
    setTimeout(() => setCopiedNotice(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white border-2 border-slate-800 rounded-3xl w-full max-w-6xl max-h-[94vh] shadow-2xl flex flex-col overflow-hidden text-slate-900 my-auto">
        
        {/* Cabecera del Modal */}
        <div className="bg-slate-950 text-white px-6 py-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit',sans-serif] font-black text-lg sm:text-xl text-white">
                  Gestor de Usuarios Simulados & Facturación
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
                  ADMIN SOCIAL PROOF
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Simula clientes reales, métricas de subida al #1, historial de pagos y facturación total acumulada.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación flotante de confirmación */}
        {copiedNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4" />
            <span>{copiedNotice}</span>
          </div>
        )}

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Tarjetas de Métricas Financieras (KPI Dashboard) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Facturación Total */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Total Facturado
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-emerald-950">
                {stats.totalRevenue.toLocaleString('es-ES')} €
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Cobros confirmados</span>
              </span>
            </div>

            {/* MRR Mensual */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  MRR Recurrente
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-blue-950">
                {stats.mrr.toLocaleString('es-ES')} €<span className="text-sm font-bold text-slate-500">/mes</span>
              </div>
              <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-1 mt-1">
                <span>Ingreso mensual estimado</span>
              </span>
            </div>

            {/* Total Clientes */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-300 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                  Usuarios Activos
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-purple-950">
                {stats.activeUsers} <span className="text-base text-slate-400 font-medium">/ {stats.totalUsers}</span>
              </div>
              <span className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-1">
                <span>{stats.dualPortalCount} cuentas multicanal (ambos)</span>
              </span>
            </div>

            {/* Renovaciones al #1 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Subidas al #1
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-amber-950">
                {stats.totalRenewals.toLocaleString('es-ES')}
              </div>
              <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 mt-1">
                <span>Media: +{stats.avgCallsBoost}% en llamadas</span>
              </span>
            </div>
          </div>

          {/* Barra de Acciones y Generador Rápido */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Generación rápida */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Generar usuarios:</span>
              </span>

              <button
                onClick={() => handleGenerateBatch(5)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                +5
              </button>
              <button
                onClick={() => handleGenerateBatch(15)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                +15
              </button>
              <button
                onClick={() => handleGenerateBatch(30)}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                +30
              </button>
              <button
                onClick={() => handleGenerateBatch(50)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                +50
              </button>

              <div className="flex items-center gap-1 ml-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400 font-bold">Cant:</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={batchCount}
                  onChange={e => setBatchCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-slate-900 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded text-center outline-none border border-slate-700"
                />
                <button
                  onClick={() => handleGenerateBatch(batchCount)}
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] rounded transition-all cursor-pointer"
                >
                  Generar
                </button>
              </div>
            </div>

            {/* Acciones de Base de Datos - Menú Desplegable */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
              <button
                onClick={() => setIsManualFormOpen(!isManualFormOpen)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isManualFormOpen ? 'Cerrar Formulario' : 'Crear Usuario'}</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Acciones</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isActionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isActionsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsActionsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl py-2 z-30 divide-y divide-slate-800 text-xs animate-fadeIn">
                      <div className="p-1 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsActionsOpen(false);
                            handleShuffleList();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                          <Shuffle className="w-4 h-4 text-indigo-400" />
                          <div>
                            <p className="font-bold">Mezclar Aleatorio</p>
                            <p className="text-[10px] text-slate-400">Orden natural 100% realista</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsActionsOpen(false);
                            handleCopyFinancialSummary();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="font-bold">Copiar Resumen</p>
                            <p className="text-[10px] text-slate-400">Para WhatsApp o inversores</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsActionsOpen(false);
                            handleExportCSV();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="font-bold">Exportar CSV</p>
                            <p className="text-[10px] text-slate-400">Descarga para Excel</p>
                          </div>
                        </button>
                      </div>

                      <div className="p-1 space-y-0.5 pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsActionsOpen(false);
                            handleResetDefaults();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-amber-300 hover:bg-amber-950/40 rounded-xl transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="font-bold">Restablecer 28 Clientes</p>
                            <p className="text-[10px] text-amber-400/80">Vuelve al set base</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsActionsOpen(false);
                            handleClearAll();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                          <div>
                            <p className="font-bold">Borrar Todos</p>
                            <p className="text-[10px] text-rose-400/80">Vacía la base de datos</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de Creación Manual Desplegable */}
          {isManualFormOpen && (
            <form onSubmit={handleAddManualUser} className="bg-slate-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-['Outfit',sans-serif] font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Añadir Nuevo Cliente Personalizado</span>
                </h4>
                <span className="text-xs text-slate-500">Útil para preparar capturas o demos con nombres concretos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre / Negocio:</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="Ej. Valeria - Ruzafa"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono:</label>
                  <input
                    type="text"
                    required
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                    placeholder="+34 6xx xx xx xx"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Cliente:</label>
                  <select
                    value={manualType}
                    onChange={e => setManualType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                  >
                    <option value="individual">Particular (Chica individual)</option>
                    <option value="piso">Piso / Alojamiento de Habitaciones</option>
                    <option value="agencia">Agencia Publicitaria / Multicuenta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ciudad:</label>
                  <input
                    type="text"
                    required
                    value={manualCity}
                    onChange={e => setManualCity(e.target.value)}
                    placeholder="Valencia, Madrid, etc."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portal Asignado:</label>
                  <select
                    value={manualPortal}
                    onChange={e => setManualPortal(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                  >
                    <option value="ambos">Ambos Portales (MilPasiones + PasionValencia)</option>
                    <option value="milpasiones">MilPasiones.com</option>
                    <option value="pasionvalencia">PasionValencia.es</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Contratado:</label>
                  <input
                    type="text"
                    required
                    value={manualPlan}
                    onChange={e => setManualPlan(e.target.value)}
                    placeholder="Plan 1 Mes Completo"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Importe Cobrado (€):</label>
                  <input
                    type="number"
                    min={1}
                    value={manualAmount}
                    onChange={e => setManualAmount(Number(e.target.value) || 25)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Método de Pago:</label>
                  <select
                    value={manualMethod}
                    onChange={e => setManualMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                  >
                    <option value="Bizum">Bizum</option>
                    <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualFormOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Cliente</span>
                </button>
              </div>
            </form>
          )}

          {/* Filtros de la Tabla */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, teléfono, ciudad o plan..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 font-medium outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterPortal}
                onChange={e => setFilterPortal(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="all">Todos los Portales</option>
                <option value="milpasiones">MilPasiones.com</option>
                <option value="pasionvalencia">PasionValencia.es</option>
                <option value="ambos">Ambos (Multicanal)</option>
              </select>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="all">Todos los Tipos</option>
                <option value="individual">Particulares</option>
                <option value="piso">Pisos / Habitaciones</option>
                <option value="agencia">Agencias</option>
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                title="Criterio de ordenación"
              >
                <option value="random">🎲 Orden: Aleatorio (Natural)</option>
                <option value="amount_desc">💰 Mayor Importe (€)</option>
                <option value="rank">🏆 Mejor Puesto (#1)</option>
                <option value="recent">⏱️ Más Recientes</option>
              </select>

              <span className="text-xs text-slate-500 font-mono whitespace-nowrap pl-1">
                {filteredUsers.length} registros
              </span>
            </div>
          </div>

          {/* Tabla de Usuarios Simulados */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Cliente / Negocio</th>
                    <th className="py-3 px-3">Teléfono</th>
                    <th className="py-3 px-3">Ubicación & Portal</th>
                    <th className="py-3 px-3">Posicionamiento #1</th>
                    <th className="py-3 px-3">Plan & Factura</th>
                    <th className="py-3 px-3 text-center">Subidas Auto</th>
                    <th className="py-3 px-3 text-center">Estado</th>
                    <th className="py-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No se encontraron usuarios con esos filtros. Haz clic en <strong>+15</strong> o <strong>+30</strong> para generar nuevos.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Nombre y Tipo */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              user.type === 'agencia'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : user.type === 'piso'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {user.type === 'agencia' ? (
                                <Building className="w-4 h-4" />
                              ) : user.type === 'piso' ? (
                                <Building className="w-4 h-4" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">
                                {user.name}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {user.type === 'agencia' ? 'Agencia Publicidad' : user.type === 'piso' ? 'Piso Habitaciones' : 'Particular'} · {user.subscribedDaysAgo}d activo
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Teléfono */}
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700 whitespace-nowrap">
                          {user.phone}
                        </td>

                        {/* Ciudad & Portal */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{user.city}</span>
                            </span>
                            <div>
                              {user.portal === 'ambos' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                                  <Globe2 className="w-3 h-3" />
                                  <span>2 Portales (MP + PV)</span>
                                </span>
                              ) : user.portal === 'pasionvalencia' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold">
                                  PasionValencia
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                                  MilPasiones
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Posicionamiento */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 line-through text-[11px]">#{user.initialRank}</span>
                              <span className="text-slate-400 font-bold">➔</span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[11px] shadow-2xs">
                                ★ Puesto #{user.currentRank}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              +{user.callsIncreasePercent}% llamadas
                            </span>
                          </div>
                        </td>

                        {/* Plan & Pago */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-900 leading-tight">{user.planName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-['Outfit',sans-serif] font-black text-emerald-700 text-sm">
                                {user.planAmount} €
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                                {user.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Renovaciones */}
                        <td className="py-3 px-3 text-center">
                          <div className="font-mono font-bold text-slate-900">
                            {user.totalRenewals.toLocaleString('es-ES')}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Hace {user.lastRenewalMinutesAgo}m
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleUserActive(user.id)}
                            className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              user.active
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {user.active ? '● Activo 24/7' : '○ Pausado'}
                          </button>
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Opciones avanzadas y Notificación en vivo */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  Social Proof en Vivo (Pop-up de Ventas en la Web)
                </p>
                <p className="text-slate-500 text-[11px]">
                  Muestra avisos discretos en la landing tipo <em>«Cristina (Valencia) acaba de renovar con Bizum»</em> basados en estos datos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={livePopupEnabled}
                  onChange={e => {
                    setLivePopupEnabled(e.target.checked);
                    showToastNotice(e.target.checked ? 'Pop-up social proof activado en la web' : 'Pop-up desactivado');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a651]"></div>
              </label>
              <span className="font-bold text-slate-800 text-xs">
                {livePopupEnabled ? 'Activado' : 'Desactivado'}
              </span>
            </div>
          </div>

        </div>

        {/* Pie del modal */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="text-slate-500">
            Base guardada automáticamente en tu navegador. Puedes generar tantos clientes y ventas como necesites.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Cerrar Gestor
          </button>
        </div>

      </div>
    </div>
  );
};
