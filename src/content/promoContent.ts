/**
 * ============================================================================
 * ARCHIVO MAESTRO DE TEXTOS Y CONTENIDO: AutoPubli24
 * ============================================================================
 * Todos los textos, titulares, insignias, características, preguntas frecuentes,
 * precios y opciones de la página oficial a medida se configuran en este archivo.
 * 
 * Puedes editar cualquier texto directamente aquí y se reflejará automáticamente
 * en toda la aplicación.
 */

export interface PortalLogoItem {
  id: string;
  name: string;
  logo: string;
}

export interface BenefitItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AntiBanItem {
  number: number;
  boldTitle: string;
  description: string;
}

export interface AntiBanSection {
  title: string;
  subtitle: string;
  items: AntiBanItem[];
}

export interface UrgencyBannerContent {
  label: string;
  text: string;
  highlight: string;
  cta: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  city: string;
  portal: string;
  timeAgo: string;
  message: string;
  resultBadge: string;
  imagePlaceholder?: string;
}

export interface SocialProofContent {
  badge: string;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
  footerNote: string;
}

export interface PromoContent {
  // 1. Cabecera y Navbar
  navbar: {
    brandName: string;
    brandNumber: string;
    navLinks: Array<{ label: string; href: string }>;
    extensionButtonText: string;
    whatsappButtonText: string;
    ctaButtonText: string;
  };

  // 2. Banner Superior Fijo
  turboBanner: {
    title: string;
    text: string;
    cta: string;
    messages: string[];
  };

  // 3. Hero Principal
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    ctaButton: string;
    trustBadges: [string, string, string];
    dashboardImage: string;
    dashboardImageAlt: string;
    dashboardLiveBadge: string;
  };

  // 3B. Urgencia Técnica Real (Límite de Plazas por Ciudad)
  urgencyBanner: UrgencyBannerContent;

  // 4. Beneficios con Demostración Visual
  benefits: {
    badge: string;
    title: string;
    subtitle: string;
    items: BenefitItem[];
  };

  // 5. Portales Principales (Slider Horizontal de Logos)
  portals: {
    badge: string;
    title: string;
    subtitle: string;
    logos: PortalLogoItem[];
  };

  // 6. Tecnología Anti-Baneo con IPs Móviles
  antiBan: AntiBanSection;

  // 7. Garantía de Devolución
  guarantee: {
    title: string;
    descriptionBeforeBold: string;
    boldText: string;
    descriptionAfterBold: string;
    buttonText: string;
  };

  // 7B. Prueba Social (Capturas y Testimonios Reales)
  socialProof: SocialProofContent;

  // 8. Preguntas Frecuentes
  faq: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    items: FaqItem[];
  };

  // 9. Oferta y Formulario de Activación
  offer: {
    simpleMode?: boolean;
    adminWhatsAppNumber?: string;
    badge: string;
    title: string;
    subtitle: string;
    formHeaderTitle: string;
    formHeaderSubtitle: string;
    durationStepTitle: string;
    durations: {
      sevenDays: {
        label: string;
        originalPrice: number;
        price: number;
        note: string;
      };
      thirtyDays: {
        badge: string;
        label: string;
        originalPrice: number;
        price: number;
        note: string;
      };
    };
    whatsappStepTitle: string;
    whatsappPlaceholder: string;
    whatsappHelper: string;
    paymentStepTitle: string;
    bizum: {
      title: string;
      subtitle: string;
      phoneLabel: string;
      phone: string;
      conceptLabel: string;
      concept: string;
      copyButtonText: string;
      copiedSuccessText: string;
    };
    paysafecard: {
      title: string;
      subtitle: string;
      badge: string;
      instruction: string;
      pinPlaceholder: string;
    };
    submitButtonPrefix: string;
    trustFooter: string;
    directChatHelper: string;
    successMessage: {
      title: string;
      description: string;
      whatsappConfirmButtonText: string;
    };
  };

  // 9. Barra Sticky Inferior
  stickyBar: {
    title: string;
    subtitle: string;
    buttonText: string;
  };

  // 10. Footer Limpio
  footer: {
    brandName: string;
    brandNumber: string;
    description: string;
    ctaLinkText: string;
    whatsappText: string;
    guaranteeText: string;
    copyright: string;
  };
}

export const promoContent: PromoContent = {
  navbar: {
    brandName: 'AutoPubli',
    brandNumber: '24',
    navLinks: [
      { label: 'Cómo Funciona', href: '#como-funciona' },
      { label: 'Probar Demo', href: '#demo' },
      { label: 'Opiniones', href: '#opiniones' },
      { label: 'Precios', href: '#oferta' },
    ],
    extensionButtonText: 'Extensión',
    whatsappButtonText: 'WhatsApp',
    ctaButtonText: 'Activar Ahora',
  },

  turboBanner: {
    title: 'MODO TURBO ACTIVADO:',
    text: 'Renovación automática cada 20 minutos las 24 horas · Tus anuncios siempre arriba en primera posición',
    cta: '',
    messages: [
      'Renovación automática cada 20 minutos las 24 horas · Tus anuncios siempre arriba en primera posición',
    ],
  },

  hero: {
    badge: 'SIN INSTALAR NADA · PAGO POR BIZUM O EFECTIVO EN ESTANCOS',
    titleLine1: 'Tus Anuncios Arriba Todo el Día',
    titleHighlight: 'Renovándose Cada 20 Minutos',
    description:
      'Tú no tienes que hacer nada. El programa sube tu anuncio a primera posición las 24 horas y tu teléfono no para de recibir llamadas y WhatsApps.',
    ctaButton: 'ACTIVAR MI ANUNCIO AHORA (50% DTO)',
    trustBadges: [
      'Listo en 2 minutos',
      'Funciona con el móvil apagado',
      '+1,400 personas lo usan',
    ],
    dashboardImage: '/src/assets/images/autopubli_dashboard_1791066162940.jpg',
    dashboardImageAlt: 'Panel de control AutoPubli24 y rotación automática en nube',
    dashboardLiveBadge: '🟢 PANEL EN VIVO · ROTANDO CADA 20 MINUTOS',
  },

  urgencyBanner: {
    label: 'Límite por ciudad:',
    text: 'Máximo 8 anunciantes por zona para garantizar siempre el puesto #1.',
    highlight: 'Quedan 3 plazas disponibles hoy.',
    cta: 'Reservar plaza →',
  },

  benefits: {
    badge: 'BENEFICIOS CLAVE',
    title: 'Diseñado para que No Tengas que Preocuparte de Nada',
    subtitle:
      'Olvídate de estar pendiente de alarmas cada hora para subir tus anuncios a mano.',
    items: [
      {
        id: 'benefit_mobile_off',
        badge: '⚡ AUTONOMÍA TOTAL',
        title: 'Móvil Apagado y Sin Gastar Batería',
        description:
          'El robot se ejecuta las 24 horas desde nuestros servidores seguros en la nube. Puedes apagar tu teléfono o irte a dormir, tus anuncios siguen en primera página.',
        image: '/src/assets/images/mobile_off_cloud_1791066163350.jpg',
        imageAlt: 'Robot ejecutándose en la nube 24/7 sin gastar batería',
      },
      {
        id: 'benefit_clean_ip',
        badge: '🛡️ 100% SEGURO',
        title: 'Anti-Baneo con IP Móvil 4G Limpia',
        description:
          'Rotamos la conexión con IPs móviles reales españolas en cada subida. Los portales detectan una persona normal navegando, garantizando cero bloqueos.',
        image: '/src/assets/images/anti_ban_network_1791066163580.jpg',
        imageAlt: 'Red 4G móvil protegida y limpia anti baneo',
      },
      {
        id: 'benefit_private_pay',
        badge: '🔒 CERO TARJETAS',
        title: '100% Privado y Sin Tarjeta',
        description:
          'Pagas por Bizum o con dinero en metálico en cualquier estanco con Paysafecard. Cero datos bancarios en internet y cero cobros recurrentes.',
        image: '/src/assets/images/bizum_private_cash_1791066163820.jpg',
        imageAlt: 'Pago privado en metálico y Bizum sin tarjeta',
      },
    ],
  },

  portals: {
    badge: 'COMPATIBILIDAD TOTAL',
    title: 'Funciona en Todos los Portales Principales',
    subtitle:
      'Sube tus anuncios a primera posición en las plataformas líderes de contactos de España de forma simultánea.',
    logos: [
      { id: 'loquosex', name: 'Loquosex', logo: '/logos/loquosex.png' },
      { id: 'milpasiones', name: 'Milpasiones', logo: '/logos/milpasiones.png' },
      { id: 'mileroticos', name: 'Mileróticos', logo: '/logos/mileroticos.webp' },
      { id: 'nuevapasion', name: 'NuevaPasión', logo: '/logos/nuevapasion.webp' },
      { id: 'pasionvalencia', name: 'Pasión Valencia', logo: '/logos/pasionvalencia.png' },
      { id: 'mundosexanuncio', name: 'MundoSexAnuncio', logo: '/logos/mundosexanuncio.webp' },
      { id: 'follamigas', name: 'Follamigas', logo: '/logos/follamigas.png' },
    ],
  },

  antiBan: {
    title: 'Tecnología Anti-Baneo con IPs Móviles 4G/5G',
    subtitle:
      'Para las páginas de contactos, parece que eres una persona real usando el móvil desde su casa.',
    items: [
      {
        number: 1,
        boldTitle: 'Cambio de IP constante:',
        description: 'Cada publicación se hace desde una IP residencial española limpia diferente.',
      },
      {
        number: 2,
        boldTitle: 'Rotación de Títulos y Fotos:',
        description: 'El sistema cambia pequeños detalles del texto para que nunca parezca repetido.',
      },
      {
        number: 3,
        boldTitle: 'Intervalo de 20 minutos con variación:',
        description: 'Publica exactamente en los tiempos que premian los portales para subir a la cima.',
      },
    ],
  },

  guarantee: {
    title: 'Garantía de Devolución por BIZUM en 10 Minutos',
    descriptionBeforeBold:
      'Pruébalo durante 14 días. Si ves que no tienes más llamadas o simplemente no te convence, nos escribes por WhatsApp y ',
    boldText: 'te hacemos un Bizum de vuelta al mismo número',
    descriptionAfterBold: ' sin hacerte preguntas ni poner pegas.',
    buttonText: 'ACTIVAR POR BIZUM SIN RIESGO',
  },

  socialProof: {
    badge: 'PRUEBA SOCIAL REAL',
    title: 'Lo Que Dicen Quienes Ya Tienen Sus Anuncios en Piloto Automático',
    subtitle:
      'Mensajes reales de anunciantes que reciben llamadas y chats de WhatsApp todos los días:',
    items: [
      {
        id: 'test_1',
        author: 'Marta R.',
        city: 'Madrid (Centro)',
        portal: 'Milanuncios & Loquosex',
        timeAgo: 'Ayer a las 19:42',
        message:
          '«¡Increíble de verdad! Llevaba 3 días sin que me escribiera ni una sola persona y en cuanto se activó la subida de los 20 min me han entrado 6 llamadas seguidas. Vale cada euro.»',
        resultBadge: '🔥 +6 llamadas en 1 hora',
      },
      {
        id: 'test_2',
        author: 'Sofía K.',
        city: 'Barcelona (Eixample)',
        portal: 'Loquosex & Agenda69',
        timeAgo: 'Hoy a las 11:15',
        message:
          '«Lo que más me gusta es poder apagar el teléfono para dormir tranquila y que por la mañana cuando me levanto tengo 4 chats nuevos de WhatsApp listos para concertar cita.»',
        resultBadge: '📱 Móvil apagado toda la noche',
      },
      {
        id: 'test_3',
        author: 'Carla G.',
        city: 'Valencia (Zona Puerto)',
        portal: 'PasionValencia & Milanuncios',
        timeAgo: 'Hace 2 días',
        message:
          '«Os hice el Bizum y a los 5 minutos ya vi mi anuncio arriba del todo de la lista. Además el cambio de fotos cuando quiero me lo hacéis al momento. Súper contenta.»',
        resultBadge: '⚡ Activada en 5 minutos',
      },
    ],
    footerNote: '⭐ Más del 98% de anunciantes renuevan su mes tras probar el servicio.',
  },

  faq: {
    badge: 'DUDAS RESUELTAS',
    titleLine1: 'Preguntas Frecuentes sobre el',
    titleLine2: 'Servicio y Pagos',
    items: [
      {
        question: '¿Cómo funciona la garantía de devolución del 100% de mi dinero?',
        answer:
          'Dispones de 14 días completos de prueba. Si por cualquier motivo no estás satisfecho con las llamadas, visitas o el servicio de autopublicación, nos mandas un mensaje por WhatsApp diciendo "solicito devolución" y te devolvemos el 100% del importe a tu Bizum en menos de 10 minutos, sin preguntas ni letra pequeña.',
      },
      {
        question: '¿Hay algún riesgo de que me bloqueen o borren la cuenta en los portales?',
        answer:
          'Cero riesgo. Nuestro sistema utiliza tecnología anti-baneo con rotación de IPs residenciales 4G españolas, variaciones inteligentes en textos y títulos, e intervalos aleatorios naturales. Los portales detectan las publicaciones como si tú misma las hicieras desde tu móvil con los dedos.',
      },
      {
        question: '¿Tengo que instalar programas o dejar mi móvil/ordenador encendido?',
        answer:
          'No tienes que instalar absolutamente nada. Todo el sistema funciona en nuestros servidores en la nube 24 horas al día, 7 días a la semana. Puedes apagar tu móvil o irte a dormir, que tus anuncios seguirán renovándose en primera posición cada 20 minutos de forma puntual.',
      },
      {
        question: '¿Puedo cambiar fotos, textos, ciudades o teléfono durante el mes?',
        answer:
          'Sí, totalmente gratis y cuantas veces quieras. Solo tienes que escribirnos por WhatsApp con los nuevos datos (fotos, descripción o nuevo teléfono) y nuestro equipo de soporte técnico te los actualiza en tus anuncios en menos de 5 minutos.',
      },
      {
        question: '¿Qué pasa si me equivoco en el concepto del Bizum?',
        answer:
          'No te preocupes. Con solo enviarnos la captura del Bizum por WhatsApp a nuestro teléfono de soporte, te activamos la cuenta a mano en menos de 2 minutos.',
      },
      {
        question: '¿Cuánto tarda en empezar a publicarse mi anuncio tras el pago?',
        answer:
          'En cuanto se confirma el Bizum o el código Paysafecard, tu primer ciclo de publicación sube a los 30 segundos y queda programado automáticamente cada 20 minutos las 24 horas.',
      },
      {
        question: '¿Funciona con bancos como Santander, BBVA, CaixaBank o Sabadell?',
        answer:
          'Sí, con el 100% de los bancos españoles que admitan Bizum (CaixaBank, BBVA, Santander, ING, Sabadell, Openbank, Unicaja, Kutxabank, etc.).',
      },
    ],
  },

  offer: {
    simpleMode: false,
    adminWhatsAppNumber: '600 000 000',
    badge: '🔥 OFERTA DE LANZAMIENTO · HASTA 3 PÁGINAS INCLUIDAS',
    title: 'Activa Tu Anuncio Ahora Sin Riesgo',
    subtitle:
      'Sin líos de paquetes complicados. Con esta oferta tienes hasta 3 páginas incluidas (Milanuncios, Loquosex, Agenda69 o las que tú elijas) renovándose automáticamente cada 20 minutos las 24 horas.',
    formHeaderTitle: 'Formulario de Activación Inmediata',
    formHeaderSubtitle: '✓ Hasta 3 portales incluidos en esta oferta',
    durationStepTitle: '1. Elige el tiempo de tu anuncio:',
    durations: {
      sevenDays: {
        label: 'Plan 1 Semana (7 Días)',
        originalPrice: 25,
        price: 10,
        note: '3 webs incluidas · Sin permanencia',
      },
      thirtyDays: {
        badge: '⭐ MÁS RENTABLE',
        label: 'Plan Mes Completo (30 Días)',
        originalPrice: 49,
        price: 19,
        note: '3 webs incluidas · Ahorras más del 60%',
      },
    },
    whatsappStepTitle: '2. Tu teléfono de WhatsApp (donde recibes llamadas):',
    whatsappPlaceholder: 'Ej: 612 34 56 78',
    whatsappHelper: 'Es el número que subiremos a primera posición en hasta 3 páginas a la vez.',
    paymentStepTitle: '3. Método de pago seguro (cero datos de tarjeta):',
    bizum: {
      title: '🟢 BIZUM',
      subtitle: 'Desde tu banco al instante',
      phoneLabel: 'Teléfono Bizum:',
      phone: '613 48 92 10',
      conceptLabel: 'Concepto:',
      concept: 'PUB-24',
      copyButtonText: 'Copiar',
      copiedSuccessText: '¡Copiado!',
    },
    paysafecard: {
      title: '🔵 PAYSAFECARD',
      subtitle: 'En efectivo en estancos',
      badge: 'EFECTIVO',
      instruction:
        'Pide un ticket Paysafecard en cualquier estanco e introduce aquí tu código PIN de 16 dígitos:',
      pinPlaceholder: '0123 4567 8901 2345',
    },
    submitButtonPrefix: 'ACTIVAR AHORA',
    trustFooter:
      '🛡️ Garantía de devolución por Bizum en 10 minutos si no te convence · Sin permanencia',
    directChatHelper:
      '💡 Como ya estamos hablando por WhatsApp, si prefieres que te lo deje activo yo mismo a mano, respóndeme al mismo chat y te lo configuro en 2 minutos.',
    successMessage: {
      title: '¡PAGO ENVIADO CON ÉXITO!',
      description:
        'Hemos registrado tu solicitud para activar tus anuncios en hasta 3 páginas a la vez.',
      whatsappConfirmButtonText: 'Confirmar Activación por WhatsApp',
    },
  },

  stickyBar: {
    title: 'Tus Anuncios Arriba Cada 20 Min',
    subtitle: 'Hasta 3 webs incluidas · Pago por Bizum o Efectivo',
    buttonText: 'ACTIVAR MI ANUNCIO AHORA',
  },

  footer: {
    brandName: 'AutoPubli',
    brandNumber: '24',
    description:
      'Herramienta automática para publicar anuncios en páginas de contactos y foros de adultos cada 20 minutos.',
    ctaLinkText: 'Activar Anuncio',
    whatsappText: 'WhatsApp de Ayuda',
    guaranteeText: 'Garantía 100%',
    copyright: '© 2026 AutoPubli 24. Todos los derechos reservados.',
  },
};
