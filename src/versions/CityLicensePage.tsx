import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Zap, 
  Users, 
  Lock, 
  ArrowRight, 
  MessageCircle, 
  Check, 
  Calculator, 
  Sliders, 
  HelpCircle, 
  Award, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Globe2,
  Cpu,
  Layers,
  Sparkles,
  Search,
  X,
  Bell,
  Clock
} from 'lucide-react';
import { usePromoContent } from '../context/PromoContentContext';
import { trackXWhatsAppPurchase } from '../lib/xPixel';

interface CityLicensePageProps {
  onBackToHome?: () => void;
  onNavigateToAffiliates?: () => void;
  onOpenWhatsApp?: (customMsg?: string) => void;
}

interface CityOption {
  name: string;
  province: string;
  estimatedAds: number;
  status: 'libre' | 'reservada';
  potentialMonthly: number;
  isCapital?: boolean;
}

// Todas las 50 capitales de provincia de España + Ceuta, Melilla y ciudades metropolitanas clave
const ALL_SPANISH_CITIES: CityOption[] = [
  // 8 Ciudades destacadas por volumen inicial
  { name: 'Valencia', province: 'Valencia', estimatedAds: 480, status: 'libre', potentialMonthly: 1200, isCapital: true },
  { name: 'Alicante', province: 'Alicante', estimatedAds: 340, status: 'libre', potentialMonthly: 850, isCapital: true },
  { name: 'Málaga', province: 'Málaga', estimatedAds: 420, status: 'libre', potentialMonthly: 1050, isCapital: true },
  { name: 'Sevilla', province: 'Sevilla', estimatedAds: 390, status: 'libre', potentialMonthly: 975, isCapital: true },
  { name: 'Murcia', province: 'Murcia', estimatedAds: 260, status: 'libre', potentialMonthly: 650, isCapital: true },
  { name: 'Zaragoza', province: 'Zaragoza', estimatedAds: 240, status: 'libre', potentialMonthly: 600, isCapital: true },
  { name: 'Palma de Mallorca', province: 'Baleares', estimatedAds: 360, status: 'libre', potentialMonthly: 900, isCapital: true },
  { name: 'Bilbao', province: 'Vizcaya', estimatedAds: 290, status: 'libre', potentialMonthly: 725, isCapital: true },

  // Resto de capitales de provincia de España (Total 50 capitales + Ceuta y Melilla)
  { name: 'A Coruña', province: 'A Coruña', estimatedAds: 250, status: 'libre', potentialMonthly: 625, isCapital: true },
  { name: 'Albacete', province: 'Albacete', estimatedAds: 130, status: 'libre', potentialMonthly: 325, isCapital: true },
  { name: 'Almería', province: 'Almería', estimatedAds: 170, status: 'libre', potentialMonthly: 425, isCapital: true },
  { name: 'Ávila', province: 'Ávila', estimatedAds: 60, status: 'libre', potentialMonthly: 180, isCapital: true },
  { name: 'Badajoz', province: 'Badajoz', estimatedAds: 120, status: 'libre', potentialMonthly: 300, isCapital: true },
  { name: 'Barcelona', province: 'Barcelona', estimatedAds: 1100, status: 'reservada', potentialMonthly: 2750, isCapital: true },
  { name: 'Burgos', province: 'Burgos', estimatedAds: 110, status: 'libre', potentialMonthly: 275, isCapital: true },
  { name: 'Cáceres', province: 'Cáceres', estimatedAds: 90, status: 'libre', potentialMonthly: 225, isCapital: true },
  { name: 'Cádiz', province: 'Cádiz', estimatedAds: 150, status: 'libre', potentialMonthly: 375, isCapital: true },
  { name: 'Castellón de la Plana', province: 'Castellón', estimatedAds: 180, status: 'libre', potentialMonthly: 450, isCapital: true },
  { name: 'Ciudad Real', province: 'Ciudad Real', estimatedAds: 85, status: 'libre', potentialMonthly: 210, isCapital: true },
  { name: 'Córdoba', province: 'Córdoba', estimatedAds: 190, status: 'libre', potentialMonthly: 475, isCapital: true },
  { name: 'Cuenca', province: 'Cuenca', estimatedAds: 55, status: 'libre', potentialMonthly: 160, isCapital: true },
  { name: 'Girona', province: 'Girona', estimatedAds: 170, status: 'libre', potentialMonthly: 425, isCapital: true },
  { name: 'Granada', province: 'Granada', estimatedAds: 220, status: 'libre', potentialMonthly: 550, isCapital: true },
  { name: 'Guadalajara', province: 'Guadalajara', estimatedAds: 95, status: 'libre', potentialMonthly: 240, isCapital: true },
  { name: 'Huelva', province: 'Huelva', estimatedAds: 130, status: 'libre', potentialMonthly: 325, isCapital: true },
  { name: 'Huesca', province: 'Huesca', estimatedAds: 50, status: 'libre', potentialMonthly: 150, isCapital: true },
  { name: 'Jaén', province: 'Jaén', estimatedAds: 90, status: 'libre', potentialMonthly: 225, isCapital: true },
  { name: 'Las Palmas de Gran Canaria', province: 'Las Palmas', estimatedAds: 310, status: 'libre', potentialMonthly: 775, isCapital: true },
  { name: 'León', province: 'León', estimatedAds: 130, status: 'libre', potentialMonthly: 325, isCapital: true },
  { name: 'Lleida', province: 'Lleida', estimatedAds: 120, status: 'libre', potentialMonthly: 300, isCapital: true },
  { name: 'Logroño', province: 'La Rioja', estimatedAds: 140, status: 'libre', potentialMonthly: 350, isCapital: true },
  { name: 'Lugo', province: 'Lugo', estimatedAds: 80, status: 'libre', potentialMonthly: 200, isCapital: true },
  { name: 'Madrid', province: 'Madrid', estimatedAds: 1250, status: 'reservada', potentialMonthly: 3100, isCapital: true },
  { name: 'Ourense', province: 'Ourense', estimatedAds: 85, status: 'libre', potentialMonthly: 210, isCapital: true },
  { name: 'Oviedo', province: 'Asturias', estimatedAds: 190, status: 'libre', potentialMonthly: 475, isCapital: true },
  { name: 'Palencia', province: 'Palencia', estimatedAds: 65, status: 'libre', potentialMonthly: 175, isCapital: true },
  { name: 'Pamplona', province: 'Navarra', estimatedAds: 170, status: 'libre', potentialMonthly: 425, isCapital: true },
  { name: 'Pontevedra', province: 'Pontevedra', estimatedAds: 120, status: 'libre', potentialMonthly: 300, isCapital: true },
  { name: 'Salamanca', province: 'Salamanca', estimatedAds: 150, status: 'libre', potentialMonthly: 375, isCapital: true },
  { name: 'San Sebastián', province: 'Guipúzcoa', estimatedAds: 210, status: 'libre', potentialMonthly: 525, isCapital: true },
  { name: 'Santa Cruz de Tenerife', province: 'Santa Cruz de Tenerife', estimatedAds: 300, status: 'libre', potentialMonthly: 750, isCapital: true },
  { name: 'Santander', province: 'Cantabria', estimatedAds: 180, status: 'libre', potentialMonthly: 450, isCapital: true },
  { name: 'Segovia', province: 'Segovia', estimatedAds: 70, status: 'libre', potentialMonthly: 190, isCapital: true },
  { name: 'Soria', province: 'Soria', estimatedAds: 45, status: 'libre', potentialMonthly: 150, isCapital: true },
  { name: 'Tarragona', province: 'Tarragona', estimatedAds: 190, status: 'libre', potentialMonthly: 475, isCapital: true },
  { name: 'Teruel', province: 'Teruel', estimatedAds: 40, status: 'libre', potentialMonthly: 140, isCapital: true },
  { name: 'Toledo', province: 'Toledo', estimatedAds: 130, status: 'libre', potentialMonthly: 325, isCapital: true },
  { name: 'Valladolid', province: 'Valladolid', estimatedAds: 160, status: 'libre', potentialMonthly: 400, isCapital: true },
  { name: 'Vitoria-Gasteiz', province: 'Álava', estimatedAds: 180, status: 'libre', potentialMonthly: 450, isCapital: true },
  { name: 'Zamora', province: 'Zamora', estimatedAds: 60, status: 'libre', potentialMonthly: 170, isCapital: true },
  { name: 'Ceuta', province: 'Ceuta', estimatedAds: 40, status: 'libre', potentialMonthly: 140, isCapital: true },
  { name: 'Melilla', province: 'Melilla', estimatedAds: 40, status: 'libre', potentialMonthly: 140, isCapital: true },

  // Grandes municipios y zonas clave adicionales de alto interés comercial
  { name: 'Vigo', province: 'Pontevedra', estimatedAds: 280, status: 'libre', potentialMonthly: 700, isCapital: false },
  { name: 'Gijón', province: 'Asturias', estimatedAds: 210, status: 'libre', potentialMonthly: 525, isCapital: false },
  { name: 'Marbella', province: 'Málaga', estimatedAds: 290, status: 'libre', potentialMonthly: 725, isCapital: false },
  { name: 'Cartagena', province: 'Murcia', estimatedAds: 140, status: 'libre', potentialMonthly: 350, isCapital: false },
  { name: 'Jerez de la Frontera', province: 'Cádiz', estimatedAds: 160, status: 'libre', potentialMonthly: 400, isCapital: false },
  { name: 'Elche', province: 'Alicante', estimatedAds: 140, status: 'libre', potentialMonthly: 350, isCapital: false },
  { name: 'Santiago de Compostela', province: 'A Coruña', estimatedAds: 110, status: 'libre', potentialMonthly: 275, isCapital: false },
  { name: 'Ibiza', province: 'Baleares', estimatedAds: 220, status: 'libre', potentialMonthly: 650, isCapital: false },
  { name: 'Benidorm', province: 'Alicante', estimatedAds: 190, status: 'libre', potentialMonthly: 475, isCapital: false },
];

export const CityLicensePage: React.FC<CityLicensePageProps> = ({
  onBackToHome,
  onNavigateToAffiliates,
  onOpenWhatsApp,
}) => {
  const { content } = usePromoContent();

  // Estados interactivos
  const [selectedPack, setSelectedPack] = useState<'1city' | '2cities' | '3cities' | '5cities'>('1city');
  const [searchCity, setSearchCity] = useState('');
  const [selectedCityForInquiry, setSelectedCityForInquiry] = useState<string>('Valencia');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // SEO
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Licencia de Explotación por Ciudad · Venta de la Herramienta AutoPubli 24/7";

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Compra la herramienta AutoPubli 24/7 en estricta exclusividad para tu ciudad. Quédate con el 100% de las cuotas de tus anunciantes y monta un negocio recurrente llave en mano.'
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute('content', prevDesc);
    };
  }, []);

  const getAdminWhatsAppTarget = () => {
    const raw = (content.offer?.adminWhatsAppNumber || '34622431478').replace(/\D/g, '');
    if (raw.length > 9) return raw;
    if (raw.length === 9) return `34${raw}`;
    return raw || '34622431478';
  };

  const handleContactWhatsApp = (cityName?: string, packLabel?: string) => {
    const city = cityName || selectedCityForInquiry || 'mi ciudad';
    const pack = packLabel || (
      selectedPack === '1city' ? '1 Ciudad Exclusiva (490€)' :
      selectedPack === '2cities' ? '2 Ciudades (790€)' :
      selectedPack === '3cities' ? '3 Ciudades (990€)' : 'Pack 5 Ciudades (1.490€)'
    );

    const price = selectedPack === '1city' ? 490 : selectedPack === '2cities' ? 790 : selectedPack === '3cities' ? 990 : 1490;
    trackXWhatsAppPurchase({
      planOrCity: `Licencia ${city} (${pack})`,
      value: price,
    });

    const msg = `¡Hola Lorena! Me interesa comprar la herramienta completa AutoPubli 24/7 en exclusividad para ${city} (${pack}). ¿Sigue disponible la plaza para bloquear mi zona y empezar?`;
    
    if (onOpenWhatsApp) {
      onOpenWhatsApp(msg);
      return;
    }

    const target = getAdminWhatsAppTarget();
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleWaitlistWhatsApp = (cityName?: string) => {
    const city = cityName || selectedCityForInquiry || 'mi ciudad';
    trackXWhatsAppPurchase({
      planOrCity: `Lista de espera Licencia ${city}`,
      value: 0,
    });

    const msg = `¡Hola Lorena! Veo que la exclusividad de la herramienta AutoPubli 24/7 para ${city} está actualmente OCUPADA. Me gustaría ponerme en la lista de espera prioritaria para que me avises cuando quede libre o por si hay alguna opción de traspaso o sublicencia con el operador actual. ¿Podrías apuntarme?`;

    if (onOpenWhatsApp) {
      onOpenWhatsApp(msg);
      return;
    }

    const target = getAdminWhatsAppTarget();
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Normalizador de texto sin acentos para búsqueda fluida
  const normalizeText = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  // Detectar si la ciudad actualmente seleccionada está ocupada
  const selectedCityObj = useMemo(() => {
    const q = normalizeText(selectedCityForInquiry);
    return ALL_SPANISH_CITIES.find(c => normalizeText(c.name) === q);
  }, [selectedCityForInquiry]);

  const isSelectedCityOccupied = selectedCityObj?.status === 'reservada';

  // Filtrado de ciudades en el buscador (todas las 50 capitales de España + Ceuta y Melilla)
  const filteredCities = useMemo(() => {
    // Si el usuario escribe en el buscador, busca sobre todo el catálogo completo de capitales
    if (searchCity.trim()) {
      const q = normalizeText(searchCity);
      return ALL_SPANISH_CITIES.filter(c => {
        const nameNorm = normalizeText(c.name);
        const provNorm = normalizeText(c.province);
        return nameNorm.includes(q) || provNorm.includes(q);
      }).sort((a, b) => {
        const aStarts = normalizeText(a.name).startsWith(q);
        const bStarts = normalizeText(b.name).startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    // Por defecto en PC se muestran las 8 ciudades principales como salía antes
    return ALL_SPANISH_CITIES.slice(0, 8);
  }, [searchCity]);

  const packData = {
    '1city': {
      title: '1 Ciudad en Exclusiva',
      badge: 'MÁS RECOMENDADO PARA EMPEZAR',
      price: 490,
      oldPrice: 850,
      citiesCount: 1,
      savings: 'Ahorras 360€ en implantación',
      ideal: 'Para quien quiere dominar su ciudad local sin competencia y recuperar la inversión en <25 días.',
      features: [
        'Exclusividad territorial blindada para 1 ciudad',
        'Panel de Control Total (añade, pausa y gestiona anunciantes)',
        'Bots en servidores dedicados 24/7 (tú no necesitas ordenador encendido)',
        'Cobras tú el 100% directo (Bizum, efectivo o transferencia)',
        'Cero comisiones: todo lo que cobras a tus clientes es íntegro para ti',
        'Radar de comprobación multicanal activo para tus clientes',
        'Pack de Scripts y Mensajes de captación probados por WhatsApp',
        'Mantenimiento y actualizaciones técnicas incluidas todo el año',
      ]
    },
    '2cities': {
      title: '2 Ciudades en Exclusiva',
      badge: 'PACK DÚO PROVINCIAL',
      price: 790,
      oldPrice: 1350,
      citiesCount: 2,
      savings: 'Ahorras 560€ (Solo 395€/ciudad)',
      ideal: 'Para quien opera en su ciudad y quiere sumar una ciudad vecina de alto volumen.',
      features: [
        'Exclusividad territorial blindada para 2 ciudades',
        'Panel multi-ciudad unificado con selector rápido',
        'Capacidad simultánea ampliada para cientos de publicaciones',
        'Cobro del 100% de ambas ciudades directo a tus cuentas',
        'Mismo sistema llave en mano sin saber programar',
        'Radar de posiciones multicanal para ambas localidades',
        'Soporte técnico directo preferente por WhatsApp',
        'Garantía de no cesión a ningún otro competidor en tus 2 zonas',
      ]
    },
    '3cities': {
      title: '3 Ciudades en Exclusiva',
      badge: 'PACK EXPANSIÓN REGIONAL',
      price: 990,
      oldPrice: 1950,
      citiesCount: 3,
      savings: 'Ahorras 960€ (Solo 330€/ciudad)',
      ideal: 'Para operadores o personas con visión de agencia regional con alta facturación.',
      features: [
        'Exclusividad territorial blindada para 3 ciudades',
        'Panel administrativo avanzado con roles y métricas',
        'Prioridad máxima en servidores de alta velocidad',
        'Scripts adaptados por tipología de zona y competencia',
        'Potencial superior a 3.000€/mes recurrentes',
        'Asesoría 1 a 1 de configuración y estrategia de captación',
        'Garantía contractual de bloqueo de plazas',
      ]
    },
    '5cities': {
      title: '5 Ciudades (Gran Operador)',
      badge: 'MÁXIMO MARGEN & EXPANSIÓN',
      price: 1490,
      oldPrice: 3200,
      citiesCount: 5,
      savings: 'Ahorras 1.710€ (Solo 298€/ciudad)',
      ideal: 'Para quien quiere un negocio a gran escala en las principales capitales.',
      features: [
        'Exclusividad territorial blindada para 5 ciudades',
        'Infraestructura de servidores dedicados de alto rendimiento',
        'Soporte VIP 24/7 directo con el equipo de desarrollo',
        'Posibilidad de personalizar marca o dominio para tus clientes',
        'Margen de facturación potencial de 5.000€ a 15.000€/mes',
        'Actualizaciones prioritarias ante cualquier cambio de los portales',
      ]
    }
  };

  const currentPack = packData[selectedPack];

  const faqs = [
    {
      q: '¿Qué significa exactamente que la licencia es exclusiva para 1 ciudad?',
      a: 'Significa que si tú compras la licencia de Valencia (o cualquier otra ciudad disponible), nosotros bloqueamos esa ciudad en nuestro sistema y NUNCA se la venderemos a otra persona. Tú serás el único operador con esta tecnología en esa localidad, evitando guerras de precios y asegurándote el monopolio local de clientes.'
    },
    {
      q: '¿Por qué aumenta el precio si elijo más ciudades?',
      a: 'Porque cada ciudad representa un mercado entero con cientos de anunciantes activos y requiere reservar recursos de servidor y bloquear comercialmente ese territorio para que nadie más pueda operarlo. Comprando packs de 2, 3 o 5 ciudades obtienes un descuento muy superior por ciudad (desde 298€/ciudad en vez de 490€).'
    },
    {
      q: '¿Tengo que pagar comisiones o porcentajes de mis ventas?',
      a: 'Cero. El 100% de lo que te paguen tus clientes anunciantes (sea por Bizum, transferencia bancaria o en mano) es tuyo. Nosotros no cobramos ningún porcentaje sobre tus ganancias.'
    },
    {
      q: '¿Necesito tener mi ordenador encendido o saber de informática?',
      a: 'No. Todo el sistema corre en nuestros servidores en la nube. Tú manejas un panel de administración visual y sencillo desde tu móvil o portátil donde solo tienes que poner el teléfono de la anunciante y el intervalo de publicación. Los bots trabajan solos 24 horas al día, 7 días a la semana.'
    },
    {
      q: '¿Cómo consigo a mis primeras clientas anunciantes?',
      a: 'Te entregamos el manual exacto y los scripts de WhatsApp probados con los que nosotros cerramos clientes todos los días. Con el radar puedes ver exactamente qué números están caídos en páginas 3, 4 y 5 de MilPasiones, PasiónValencia y MundoSexAnuncio, escribirles por WhatsApp ofreciéndoles la solución y cerrar suscripciones de 25€ a 50€ al mes en cuestión de minutos.'
    },
    {
      q: '¿Qué pasa si un portal cambia su diseño o sistema?',
      a: 'Nosotros nos encargamos del mantenimiento técnico de forma continua. Cuando un portal actualiza su web o sus filtros, nuestros ingenieros actualizan los bots en el servidor sin coste adicional para que tu negocio siga funcionando sin interrupciones.'
    },
    {
      q: '¿Puedo comprar 1 ciudad hoy y añadir más ciudades después?',
      a: 'Sí, siempre que las ciudades que quieras añadir sigan libres en ese momento. Se te descontará lo que ya pagaste para pasar al pack superior.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                if (onBackToHome) {
                  e.preventDefault();
                  onBackToHome();
                }
              }}
              className="text-lg sm:text-xl font-black tracking-tight text-slate-950 flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
              title="Volver a la página principal"
            >
              <span>AutoPubli</span>
              <span className="text-[#00a651]">24</span>
            </a>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
              <Building2 className="w-3 h-3 text-[#00a651]" />
              <span>Licencia Exclusiva por Ciudad</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            <button
              onClick={() => onNavigateToAffiliates && onNavigateToAffiliates()}
              className="hidden sm:inline-block text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ¿Prefieres solo afiliados?
            </button>
            <button
              onClick={() => handleContactWhatsApp()}
              className="inline-flex items-center gap-1.5 bg-[#00a651] hover:bg-[#008f45] text-white px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Hablar con nosotros</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 border-b border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent pointer-events-none blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black tracking-wide uppercase mb-6 shadow-xs animate-fadeIn">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>1 Único Operador por Ciudad · Exclusividad Garantizada</span>
          </div>

          <h1 className="font-['Outfit',sans-serif] font-[900] text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#0a1128] leading-[1.1] mb-6">
            Sé el dueño de la herramienta en tu ciudad y quédate con el{' '}
            <span className="text-[#00a651] underline decoration-[#00a651]/30">100% de los ingresos</span>
          </h1>

          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-slate-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Te entregamos la tecnología completa de <strong>AutoPubli 24/7</strong> configurada y lista para funcionar en tu localidad. Automatiza cientos de anunciantes en MilPasiones, PasiónValencia y MundoSexAnuncio, cobra entre <strong>25€ y 50€ al mes por cliente recurrente</strong> y nosotros nos encargamos de los servidores y el soporte técnico.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#calculadora-ciudades"
              className="inline-flex items-center justify-center gap-2 bg-[#00a651] hover:bg-[#008f45] text-white text-base sm:text-lg font-bold px-7 py-4 rounded-2xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Building2 className="w-5 h-5" />
              <span>Ver Precios por Ciudad</span>
            </a>

            <a
              href="#comprobar-ciudad"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 text-base sm:text-lg font-bold px-7 py-4 rounded-2xl border-2 border-slate-300 shadow-xs transition-all cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Comprobar si tu Ciudad está libre</span>
            </a>
          </div>

          {/* 4 Puntos Clave de Confianza */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Exclusividad Real</h4>
              <p className="text-slate-500 text-xs">Bloqueo de tu ciudad. No vendemos tu zona a nadie más.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-green-50 text-[#00a651] flex items-center justify-center mb-2 font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Cobro 100% Directo</h4>
              <p className="text-slate-500 text-xs">Bizum, transferencia o efectivo. Cero comisiones.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Amortización Rápida</h4>
              <p className="text-slate-500 text-xs">Con 15-20 clientas recuperas el 100% el primer mes.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Servidores 24/7</h4>
              <p className="text-slate-500 text-xs">Técnica incluida. Tú no necesitas programar nada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPROBADOR DE DISPONIBILIDAD DE CIUDAD */}
      <section id="comprobar-ciudad" className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Paso 1: Audita tu territorio
            </span>
            <h2 className="font-['Outfit',sans-serif] font-bold text-2xl sm:text-4xl text-[#0a1128] mt-2 mb-2">
              Comprueba si tu ciudad está disponible para bloquearla
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Solo admitimos 1 titular por localidad. Introduce tu ciudad para revisar el volumen de anunciantes y confirmar si la exclusividad sigue libre.
            </p>
          </div>

          {/* Caja de Búsqueda */}
          <div className="max-w-lg mx-auto mb-6">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchCity(val);
                  if (val.trim()) {
                    const match = ALL_SPANISH_CITIES.find(c => normalizeText(c.name) === normalizeText(val));
                    if (match) {
                      setSelectedCityForInquiry(match.name);
                    } else {
                      setSelectedCityForInquiry(val);
                    }
                  }
                }}
                placeholder="Escribe tu ciudad o capital (ej. Toledo, Cáceres, Valencia, Lugo...)"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-300 focus:border-[#00a651] focus:ring-4 focus:ring-green-500/15 rounded-2xl py-3.5 pl-12 pr-10 text-slate-900 font-semibold outline-none transition-all shadow-xs"
              />
              {searchCity.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchCity('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  title="Borrar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Indicador de estado de búsqueda (solo visible en modo PC como salía antes) */}
          <div className="hidden md:block text-center text-xs text-slate-500 mb-6">
            {!searchCity.trim() ? (
              <p>
                Mostrando <strong>8 principales ciudades de España</strong> · Escribe en el buscador para consultar cualquier otra capital de provincia.
              </p>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>
                  Mostrando <strong>{filteredCities.length}</strong> {filteredCities.length === 1 ? 'resultado' : 'resultados'} para "<strong>{searchCity}</strong>"
                </span>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setSearchCity('')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Ver las 8 principales
                </button>
              </div>
            )}
          </div>

          {/* Grid de Ciudades: visible en modo PC como salía antes, y en móvil ninguna (hidden en móvil) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {filteredCities.map((city, idx) => {
              const isOccupied = city.status === 'reservada';
              const isSelected = selectedCityForInquiry === city.name;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCityForInquiry(city.name);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    !isOccupied
                      ? isSelected
                        ? 'border-[#00a651] bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-sm'
                      : isSelected
                        ? 'border-amber-400 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30'
                        : 'border-amber-200/80 bg-amber-50/30 hover:border-amber-300 hover:bg-amber-50/60 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div>
                        <h4 className="font-['Outfit',sans-serif] font-bold text-slate-900 text-base leading-tight">
                          {city.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {city.province}{city.isCapital ? ' · Capital' : ''}
                        </span>
                      </div>

                      {!isOccupied ? (
                        <span className="shrink-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          LIBRE
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <Lock className="w-2.5 h-2.5 text-amber-700" />
                          <span>OCUPADA</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 space-y-0.5 mt-2">
                      <p>~{city.estimatedAds} anunciantes activas</p>
                      <p className={!isOccupied ? "text-emerald-700 font-bold" : "text-slate-600 font-semibold"}>
                        Potencial: ~{city.potentialMonthly}€/mes
                      </p>
                      {isOccupied && (
                        <p className="text-[11px] text-amber-800/90 font-medium flex items-center gap-1 pt-0.5">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Operador activo en exclusiva</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {!isOccupied ? (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                      <span>{isSelected ? '✓ Ciudad seleccionada' : 'Elegir esta ciudad'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 border-t border-amber-200/60">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCityForInquiry(city.name);
                          handleWaitlistWhatsApp(city.name);
                        }}
                        className="w-full inline-flex items-center justify-between text-[11px] font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-300/80 transition-all cursor-pointer group shadow-2xs"
                        title={`Avisarme por WhatsApp si ${city.name} queda libre`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Bell className="w-3 h-3 text-amber-700 group-hover:scale-110 transition-transform" />
                          <span>Avisarme cuando esté libre</span>
                        </span>
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Fallback interactivo si no encuentra coincidencia en las capitales */}
            {filteredCities.length === 0 && (
              <div className="col-span-full bg-emerald-50/80 border-2 border-dashed border-emerald-300 rounded-3xl p-8 text-center shadow-xs">
                <MapPin className="w-10 h-10 text-[#00a651] mx-auto mb-3" />
                <h4 className="font-['Outfit',sans-serif] font-bold text-slate-900 text-xl mb-1.5">
                  ¿Quieres la exclusiva para "{searchCity}"?
                </h4>
                <p className="text-slate-600 text-sm max-w-lg mx-auto mb-5 leading-relaxed">
                  Aunque no esté en la lista estándar de capitales, también puedes solicitar la herramienta completa para cualquier municipio, comarca o zona de España.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCityForInquiry(searchCity.trim())}
                  className="bg-[#00a651] hover:bg-[#008f45] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Seleccionar "{searchCity.trim()}" y consultar disponibilidad</span>
                </button>
              </div>
            )}
          </div>

          {/* Opción para seleccionar municipio personalizado si busca algo que no está exactamente nombrado (solo en PC) */}
          {searchCity.trim() && filteredCities.length > 0 && !filteredCities.some(c => normalizeText(c.name) === normalizeText(searchCity)) && (
            <div className="hidden md:flex mb-8 p-3 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600 flex-wrap items-center justify-center gap-2">
              <span>¿No es exactamente lo que buscas?</span>
              <button
                type="button"
                onClick={() => setSelectedCityForInquiry(searchCity.trim())}
                className="font-bold text-[#00a651] hover:underline cursor-pointer"
              >
                Seleccionar "{searchCity.trim()}" directamente para consultar disponibilidad →
              </button>
            </div>
          )}

          {/* Banner de Reserva de la Ciudad Seleccionada o Lista de Espera */}
          {!isSelectedCityOccupied ? (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Exclusividad Territorial Disponible</span>
                </div>
                <h3 className="font-['Outfit',sans-serif] font-bold text-2xl sm:text-3xl leading-tight">
                  ¿Quieres la exclusiva de <span className="underline decoration-white/40">{selectedCityForInquiry || 'tu ciudad'}</span>?
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
                  Al solicitarla, la retiramos inmediatamente de la venta para otros interesados y firmas el contrato de reserva.
                </p>
              </div>

              <button
                onClick={() => handleContactWhatsApp(selectedCityForInquiry)}
                className="shrink-0 bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 text-[#00a651]" />
                <span>Bloquear Exclusiva de {selectedCityForInquiry}</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full mb-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zona Ocupada · Lista de Espera Activa</span>
                </div>
                <h3 className="font-['Outfit',sans-serif] font-bold text-2xl sm:text-3xl leading-tight text-white">
                  {selectedCityForInquiry} tiene un operador activo en exclusividad
                </h3>
                <p className="text-amber-100/90 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
                  Para proteger su inversión, no concedemos licencias duplicadas en la misma plaza. Pero si el titular actual no renueva, cambia de zona o traspasa la licencia, contactamos por <strong>estricto orden de solicitud</strong>. Escríbenos para apuntarte o consultar opciones.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleWaitlistWhatsApp(selectedCityForInquiry)}
                  className="bg-[#00a651] hover:bg-[#008f45] text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Avisarme por WhatsApp de {selectedCityForInquiry}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN PRECIOS Y SELECTOR DE CIUDADES */}
      <section id="calculadora-ciudades" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-300">
              Paso 2: Elige tu escala de expansión
            </span>
            <h2 className="font-['Outfit',sans-serif] font-bold text-3xl sm:text-4xl text-[#0a1128] mt-3 mb-3">
              Licencia para 1 Ciudad o Expansión Multiciudad
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              La ofrecemos <strong>exclusivamente para 1 ciudad</strong> a un precio fijo llave en mano. Si quieres sumar más ciudades a tu panel, el precio aumenta pero el coste por ciudad se reduce notablemente.
            </p>
          </div>

          {/* Selector de Pestañas de Packs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPack('1city')}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 border-2 ${
                selectedPack === '1city'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#00a651]" />
              <span>1 Ciudad Exclusiva</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full ml-1">490€</span>
            </button>

            <button
              onClick={() => setSelectedPack('2cities')}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 border-2 ${
                selectedPack === '2cities'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4 text-orange-500" />
              <span>2 Ciudades (Dúo)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-1">790€</span>
            </button>

            <button
              onClick={() => setSelectedPack('3cities')}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 border-2 ${
                selectedPack === '3cities'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-500" />
              <span>3 Ciudades (Regional)</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full ml-1">990€</span>
            </button>

            <button
              onClick={() => setSelectedPack('5cities')}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 border-2 ${
                selectedPack === '5cities'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Globe2 className="w-4 h-4 text-blue-500" />
              <span>5 Ciudades (Gran Operador)</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full ml-1">1.490€</span>
            </button>
          </div>

          {/* Tarjeta de Detalle del Pack Seleccionado */}
          <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#00a651] text-white text-[11px] font-black uppercase tracking-wider px-6 py-1.5 rounded-bl-2xl shadow-xs">
              {currentPack.badge}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">
                  LICENCIA TERRITORIAL LLAVE EN MANO
                </span>
                <h3 className="font-['Outfit',sans-serif] font-bold text-3xl sm:text-4xl text-[#0a1128] mt-1 mb-3">
                  {currentPack.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {currentPack.ideal}
                </p>

                {/* Lista de Características */}
                <div className="space-y-2.5 mb-6">
                  {currentPack.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#00a651] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna de Precios y CTA */}
              <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 text-center flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-500 line-through font-mono">
                    Antes: {currentPack.oldPrice}€
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5 my-2">
                    <span className="font-['Outfit',sans-serif] font-[900] text-5xl sm:text-6xl text-[#0a1128]">
                      {currentPack.price}€
                    </span>
                    <span className="text-slate-500 font-bold text-xs uppercase">
                      pago único
                    </span>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                    ✓ {currentPack.savings}
                  </span>

                  <p className="text-xs text-slate-500 mb-6">
                    Sin cuotas ocultas. Cero comisiones de tus clientes. Incluye el año completo de mantenimiento de servidores.
                  </p>
                </div>

                <div>
                  {isSelectedCityOccupied && (
                    <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-900 flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        Tienes seleccionada <strong>{selectedCityForInquiry}</strong> (ocupada). Puedes consultar su lista de espera o indicarnos otra ciudad libre.
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isSelectedCityOccupied) {
                        handleWaitlistWhatsApp(selectedCityForInquiry);
                      } else {
                        handleContactWhatsApp(selectedCityForInquiry, currentPack.title);
                      }
                    }}
                    className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-base ${
                      isSelectedCityOccupied
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                        : 'bg-[#00a651] hover:bg-[#008f45] text-white shadow-green-600/20 hover:shadow-green-600/30'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>
                      {isSelectedCityOccupied
                        ? `Avisarme si queda libre ${selectedCityForInquiry}`
                        : `Reservar Exclusiva Ahora (${selectedCityForInquiry})`}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-400 block mt-2">
                    Te respondemos en &lt;10 min por WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ¿QUÉ INCLUYE LA HERRAMIENTA COMPLETA? */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-300">
              Entrega Inmediata Llave en Mano
            </span>
            <h2 className="font-['Outfit',sans-serif] font-bold text-3xl sm:text-4xl text-[#0a1128] mt-2 mb-3">
              Todo lo que recibes al comprar la herramienta
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Te entregamos el ecosistema listo para que no tengas que picar código ni contratar diseñadores:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00a651] flex items-center justify-center font-bold mb-4">
                  <Sliders className="w-6 h-6" />
                </div>
                <h4 className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900 mb-2">
                  1. Panel de Control de Clientes
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Añade el número de teléfono de tu clienta, los portales donde se anuncia y el intervalo de republicación. Activa, pausa o edita sus publicaciones en segundos.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block w-fit">
                ✓ Intuitivo desde el móvil o PC
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900 mb-2">
                  2. Servidores Cloud & Bots 24/7
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Los bots operan de forma ininterrumpida en servidores cloud de alto rendimiento. Conectan en directo con MilPasiones, PasiónValencia y MundoSexAnuncio sin consumir tus recursos.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block w-fit">
                ✓ Mantenimiento técnico incluido
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900 mb-2">
                  3. Scripts de Captación Directa
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Te facilitamos los mensajes exactos y el paso a paso de cómo contactar por WhatsApp con anunciantes caídas en puestos inferiores. Es una oferta irresistible que compran al instante.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block w-fit">
                ✓ Tasa de conversión &gt;25%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-['Outfit',sans-serif] font-bold text-3xl text-[#0a1128] mb-2">
              Preguntas Frecuentes sobre la Licencia
            </h2>
            <p className="text-slate-600 text-sm">
              Resolvemos todas las dudas sobre el funcionamiento comercial y técnico de la herramienta.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Reserva de Ciudad en Firme</span>
          </span>

          <h2 className="font-['Outfit',sans-serif] font-[900] text-3xl sm:text-5xl tracking-tight mb-4 leading-tight">
            ¿Preparado para ser el único operador de la herramienta en tu ciudad?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Escríbenos directamente para decirnos qué ciudad quieres. Revisamos el mapa de exclusividades y, si está libre, bloqueamos tu plaza hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                if (isSelectedCityOccupied) {
                  handleWaitlistWhatsApp(selectedCityForInquiry);
                } else {
                  handleContactWhatsApp(selectedCityForInquiry);
                }
              }}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white text-base sm:text-lg font-bold px-8 py-4 rounded-2xl shadow-xl transition-all cursor-pointer ${
                isSelectedCityOccupied
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-[#00a651] hover:bg-[#008f45] shadow-green-600/30'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {isSelectedCityOccupied
                  ? `Preguntar por ${selectedCityForInquiry} (Lista de espera por WhatsApp)`
                  : 'Hablar por WhatsApp con el Administrador'}
              </span>
            </button>

            <button
              onClick={() => onBackToHome && onBackToHome()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-base font-bold px-7 py-4 rounded-2xl border border-slate-700 transition-all cursor-pointer"
            >
              <span>Volver a la portada</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">AutoPubli 24/7</span>
            <span>· Licencia Comercial de Exclusividad Territorial</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => onBackToHome && onBackToHome()}
              className="hover:text-white cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigateToAffiliates && onNavigateToAffiliates()}
              className="hover:text-white cursor-pointer"
            >
              Afiliados
            </button>
            <button
              onClick={() => handleContactWhatsApp()}
              className="hover:text-[#00a651] cursor-pointer"
            >
              Contacto Exclusividad
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
