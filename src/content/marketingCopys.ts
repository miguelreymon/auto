export interface MarketingCopyItem {
  id: string;
  category: 'anunciantes' | 'foros_anunciantes' | 'foros_clientes' | 'twitter_x' | 'clubs_locales' | 'licencia_ciudad';
  title: string;
  targetAudience: string;
  channel: string;
  description: string;
  text: string;
  tip?: string;
}

export const marketingCopys: MarketingCopyItem[] = [
  // ==========================================
  // 1. PROSPECCIÓN A ANUNCIANTES (WHATSAPP / DMS)
  // ==========================================
  {
    id: 'anunciantes_directo',
    category: 'anunciantes',
    title: 'Enfoque Directo y Beneficio (El más recomendado)',
    targetAudience: 'Anunciantes independientes en portales',
    channel: 'WhatsApp o DM de X',
    description: 'Ataca el dolor principal de perder el tiempo renovando a mano y perder llamadas al caer de página.',
    text: `¿Cansada de renovar a mano? Sube tu anuncio al PUESTO #1 cada 20 min (Automático)

Sabes que si no estás en la primera página, el teléfono no suena. Pero pasarte el día entero pendiente del móvil para renovar cada 20 minutos agota a cualquiera.

Deja que nuestro sistema trabaje por ti:
✅ Subida automática 24 horas: Tu anuncio siempre arriba sin que toques nada.
✅ Funciona con tu móvil apagado: Duerme y atiende a tus citas tranquila.
✅ Hasta 3 páginas a la vez: Sincronizado en los principales portales.
✅ 100% Seguro y discreto: Sistema anti-bloqueo con rotación de fotos y textos.

💥 Oferta especial de lanzamiento: solo 25€ el mes completo.
(Menos de lo que ganas con una sola cita).

📲 Pídeme información o prueba sin compromiso por WhatsApp:
👉 https://www.autopubli24.com`,
    tip: 'Ideal para enviar cuando consigues el teléfono desde un anuncio activo.'
  },
  {
    id: 'anunciantes_problema_solucion',
    category: 'anunciantes',
    title: 'Enfoque Problema / Solución (Empático y cercano)',
    targetAudience: 'Anunciantes que gestionan todo solas',
    channel: 'WhatsApp',
    description: 'Tono empático centrado en ganar tranquilidad y no vivir pegada al teléfono.',
    text: `Más llamadas y citas sin estar pegada a la pantalla todo el día

Si te anuncias aquí, ya sabes cómo funciona: publicas y a los 15 minutos tu anuncio ya está en la página 3 donde nadie lo ve.

Para qué gastar tu tiempo renovando manualmente cuando un sistema automático puede hacerlo por ti en piloto automático:

• Te mantiene en las primeras posiciones las 24 horas del día.
• Multiplica las llamadas y mensajes de nuevos clientes.
• Configuración inmediata en 2 minutos (te ayudamos nosotros paso a paso).
• Sin cuotas raras: pagas tu mes por Bizum (25€) y te olvidas.

Deja de trabajar para los portales y haz que los portales trabajen para ti.

💬 Escríbeme por WhatsApp y te explico cómo funciona en 1 minuto:
🌐 Visita: https://www.autopubli24.com`,
    tip: 'Muy efectivo para personas que llevan semanas quejándose de pocas llamadas.'
  },
  {
    id: 'anunciantes_contacto_suave',
    category: 'anunciantes',
    title: 'Primer Contacto Suave (Abrir conversación sin spam)',
    targetAudience: 'Cualquier anunciante nueva de tu lista',
    channel: 'WhatsApp',
    description: 'No vende de golpe; pregunta por su situación para que responda sin ponerse a la defensiva.',
    text: `Hola {nombre}, te he visto anunciada en {portal} en {ciudad}. Te escribo rápido porque hemos desarrollado un sistema para que tu anuncio suba a primera página cada 20 min en automático sin tener que estar tú pendiente del móvil todo el día. ¿Renuevas tú a mano actualmente?`,
    tip: 'Reemplaza {nombre}, {portal} y {ciudad} con los datos reales del anuncio. Si te dice "sí, estoy harta", la venta está hecha.'
  },
  {
    id: 'anunciantes_aclaracion_audio',
    category: 'anunciantes',
    title: 'Aclaración de Confusión / Audio ("No soy un cliente")',
    targetAudience: 'Anunciante que cree que le escribes para una cita',
    channel: 'WhatsApp',
    description: 'Respuesta educada, corta y con emoji para aclarar el malentendido con cercanía.',
    text: `¡Hola! Perdona la confusión, no soy cliente ni busco una cita 😅 

Solo te escribía por si te interesaba tener tu anuncio subiendo solo a primera página cada 20 minutos, para que no tengas que estar tú pendiente del móvil renovando a mano todo el día.

Si no te cuadra no te preocupes y perdona la molestia, ¡mucho éxito con el trabajo!`,
    tip: 'Úsalo cuando te respondan con tarifas, disponibilidad o preguntando si vas a ir a verla.'
  },
  {
    id: 'anunciantes_corto_rapido',
    category: 'anunciantes',
    title: 'Corto y al grano (Para portales o límites de texto)',
    targetAudience: 'Mensajes rápidos o plataformas con límite de caracteres',
    channel: 'DM en X / SMS / Clasificados',
    description: 'Mensaje comprimido con los 3 puntos clave.',
    text: `Auto-Publicador 24h para Anuncios · Siempre en Primera Posición

Sube tus anuncios en automático cada 20 minutos en hasta 3 portales a la vez. Olvídate de renovar a mano. Más visibilidad y más llamadas garantizadas todos los días.

🚀 Activación inmediata por Bizum: 25€ / mes completo.
🌐 Web: www.autopubli24.com`,
    tip: 'Perfecto si vas a pegar el anuncio en secciones de servicios informáticos en clasificados.'
  },

  // ==========================================
  // 2. FOROS DE ANUNCIANTES / SECTOR
  // ==========================================
  {
    id: 'foros_respuesta_natural',
    category: 'foros_anunciantes',
    title: 'Respuesta natural a hilos donde se quejan de renovaciones',
    targetAudience: 'Compañeras o anunciantes en foros que debaten sobre portales',
    channel: 'Respuestas en hilos de foros',
    description: 'Aporta una solución como usuario sin parecer publicidad invasiva ni levantar alarmas de spam.',
    text: `Yo para no estar todo el día pegada al móvil uso un sistema automático que sube el anuncio cada 20 min en varios portales a la vez (autopubli24.com). Te olvidas de renovar a mano y por 25€ al mes compensa de sobra solo con las llamadas extra que entran. Si a alguien le interesa que me escriba por privado y le cuento cómo lo tengo yo puesto.`,
    tip: 'Busca hilos con palabras como "renovar", "subir anuncio", "loquosex caídas" o "pocas llamadas".'
  },
  {
    id: 'foros_captacion_sellers',
    category: 'foros_anunciantes',
    title: 'Post de captación de colaboradores / gestoras (10€ Bizum)',
    targetAudience: 'Anunciantes o gestoras interesadas en ingresos extra',
    channel: 'Sección de colaboraciones o empleo en foros',
    description: 'No vendes el software, ofreces ganar 10€ limpios por Bizum recomendándolo en otras ciudades.',
    text: `[COLABORACIÓN] Para anunciantes / gestoras: 10€ por recomendación directos por Bizum

Tenemos una herramienta informática que automatiza la subida de anuncios cada 20 minutos en portales para que estén siempre arriba (AutoPubli 24/7). 

Buscamos compañeras o gestoras que quieran recomendarla a contactos de otras ciudades (para no competir en su propia zona) a cambio de 10€ limpios por Bizum por cada persona que active el mes de 25€. Os podéis sacar 150-300€ al mes fácilmente.

Nosotros nos encargamos de todo el soporte técnico y configuración por WhatsApp.

Toda la info aquí: https://www.autopubli24.com/afiliados o habladme por privado y os doy vuestro código.`,
    tip: 'Destaca que es para otras ciudades para quitarles el miedo a hacerse competencia.'
  },
  {
    id: 'foros_oferta_voucher',
    category: 'foros_anunciantes',
    title: 'Mensaje Privado a usuarias influyentes (Prueba gratuita)',
    targetAudience: 'Usuarias con mucha reputación o antigüedad en foros',
    channel: 'Mensaje Privado (MP) en el foro',
    description: 'Consigue que una usuaria de peso en el foro pruebe el bot gratis y deje una reseña pública.',
    text: `Hola {nombre_usuaria}, he visto que participas activamente en el foro. Hemos desarrollado una herramienta informática (AutoPubli 24/7) que sube los anuncios automáticamente cada 20 minutos en portales para estar siempre primera.

Antes de promocionarla abiertamente nos gustaría que una persona con experiencia real en el foro la pruebe gratis durante 1 semana para darnos su opinión honesta.

Si te interesa probarlo sin ningún coste ni compromiso, pásame el enlace de tu anuncio o escríbeme por WhatsApp y te lo dejo activo hoy mismo. ¡Un saludo!`,
    tip: 'Si una usuaria respetada comenta en el foro que el sistema le funciona, tendrás aval social inmediato.'
  },

  // ==========================================
  // 3. FOROS DE CLIENTES / CONSUMIDORES (AFILIADOS)
  // ==========================================
  {
    id: 'foros_clientes_presentacion_completa',
    category: 'foros_clientes',
    title: 'Post de presentación completo en foros de clientes',
    targetAudience: 'Clientes habituales y miembros activos de foros de escorts',
    channel: 'Creación de hilo nuevo en foros de ocio adulto',
    description: 'Informa a los clientes de que pueden sacarse 10€ por Bizum recomendando la herramienta a las chicas que visitan.',
    text: `TÍTULO DEL HILO:
¿Hablas con anunciantes a menudo? Cómo sacarte 10€ por Bizum con cada una recomendando esta herramienta

CUERPO DEL MENSAJE:
¡Buenas a todos los compañeros del foro!

Nos presentamos por aquí con una propuesta diferente pero que a muchos de los que os movéis por el mundillo os va a venir de lujo para financiaros salidas y caprichos.

Todos los que estáis aquí habláis a diario con anunciantes de portales (Pasión, LoquoSex, MilEróticos, etc.) o tenéis chicas de confianza con las que quedáis habitualmente. Y sabéis de sobra cuál es su mayor queja: la pesadilla de tener que estar todo el santo día pegadas al móvil renovando el anuncio cada 20 minutos a mano para no caer a la página 3 o 4 donde nadie las llama.

Para solucionar eso creamos AutoPubli 24/7 (www.autopubli24.com): un sistema automático que sube y mantiene sus anuncios en primera posición las 24 horas del día sin que tengan que tocar nada.

💰 ¿Dónde entráis vosotros y cómo ganáis dinero?

Hemos abierto nuestro Programa de Afiliados y Colaboradores, pensado para que cualquiera de vosotros pueda llevarse una comisión directa:

1. Recomendáis la herramienta: Cuando habléis con alguna anunciante (o con vuestras chicas de confianza), le comentáis la herramienta o le pasáis el texto e imagen promocional.
2. Ellas lo activan en 2 minutos: El pack de mes completo cuesta solo 25€ (con hasta 3 páginas incluidas), un precio que recuperan con una sola cita que les entre.
3. Os lleváis 10€ limpios por Bizum: En cuanto la chica activa su mes con vuestro código o nombre, os hacemos un Bizum de 10€ directos en el mismo día laborable.

Con que se lo comentes a 4 o 5 chicas que conozcas o con las que hables en una semana, ya te has sacado 40€ o 50€ para tu próxima cita, ayudándola a ella a tener más visibilidad y sin complicaciones técnicas de ningún tipo (el soporte técnico y la configuración se la damos nosotros directamente por WhatsApp).

---
Tenéis toda la información del programa explicada de forma rápida y sencilla aquí:
👉 Web de Afiliados: https://www.autopubli24.com/afiliados

Dejamos el hilo abierto para cualquier duda que tengáis sobre cómo funciona o cómo registraros como colaboradores. ¡Un saludo a todos!`,
    tip: 'Publicar en la sección general o de debate del foro. Es transparente, legal y muy atractivo para los miembros.'
  },
  {
    id: 'foros_clientes_whatsapp_chica',
    category: 'foros_clientes',
    title: 'Mensaje para que el afiliado se lo envíe a su chica de confianza',
    targetAudience: 'Anunciante de confianza del afiliado',
    channel: 'WhatsApp',
    description: 'El texto exacto que el cliente afiliado puede reenviar a la chica con la que habla.',
    text: `¡Hola! Si te anuncias en portales de contactos y estás cansada de renovar a mano cada 20 minutos, echa un vistazo a www.autopubli24.com. Es un sistema que te sube el anuncio a primera posición en automático todo el día por 25€ al mes. Te ahorras estar pegada al móvil.`,
    tip: 'Es el mismo texto que el afiliado tiene disponible en www.autopubli24.com/afiliados con botón de copiar en 1 clic.'
  },

  // ==========================================
  // 4. REDES SOCIALES (X / TWITTER)
  // ==========================================
  {
    id: 'twitter_bio_perfil',
    category: 'twitter_x',
    title: 'Biografía optimizada para la cuenta de X (@autopubli24)',
    targetAudience: 'Cualquiera que visite el perfil en X',
    channel: 'Bio de X / Twitter',
    description: 'Configuración de biografía clara, profesional y con llamada a la acción directa.',
    text: `AutoPubli 24/7 🚀
Sube tus anuncios a Primera Posición cada 20 min en automático en LoquoSex, Pasión, MilEróticos y más.
📱 Más llamadas sin estar pegada al móvil.
🌐 Web oficial: www.autopubli24.com
💬 WhatsApp soporte y altas: [Tu número]`,
    tip: 'Añade el enlace a https://www.autopubli24.com en el campo de sitio web del perfil.'
  },
  {
    id: 'twitter_post_3am',
    category: 'twitter_x',
    title: 'Tweet #1: El dolor de renovar de noche (3 AM)',
    targetAudience: 'Anunciantes activas en X de noche',
    channel: 'Publicación en X',
    description: 'Genera empatía y alta identificación con la rutina nocturna de las anunciantes.',
    text: `Son las 3 de la mañana, estás descansando o atendiendo a alguien, y tu anuncio ya va por la página 4 donde nadie llama.

Para eso creamos AutoPubli 24/7: tu anuncio sube solo a primera posición cada 20 minutos en automático mientras duermes.

Pruébalo por 25€/mes 👉 https://www.autopubli24.com`,
    tip: 'Prográmalo para publicarse entre las 23:00 y las 02:00 de la noche.'
  },
  {
    id: 'twitter_post_algoritmo',
    category: 'twitter_x',
    title: 'Tweet #2: ¿Por qué caes a la página 3 en 18 minutos?',
    targetAudience: 'Anunciantes en ciudades grandes (Madrid, Barcelona, Valencia)',
    channel: 'Publicación en X',
    description: 'Aporta valor educativo sobre el volumen de competencia.',
    text: `¿Por qué caen tan rápido los anuncios en ciudades como Madrid, Valencia o Barcelona?

Porque hay más de 200 anunciantes renovando a la vez. Si renuevas a mano una vez cada hora, eres invisible el 80% del día.

Estar en el Top 1 exige automatización constante cada 20 minutos.
Descubre cómo funciona 👉 https://www.autopubli24.com`,
    tip: 'Menciona o añade hashtags suaves de ciudades si encaja.'
  },
  {
    id: 'twitter_post_afiliados',
    category: 'twitter_x',
    title: 'Tweet #3: Programa de Afiliados (10€ Bizum)',
    targetAudience: 'Seguidores o anunciantes interesadas en comisiones',
    channel: 'Publicación en X',
    description: 'Promociona la oportunidad de ganar dinero recomendando en otras provincias.',
    text: `¿Tienes compañeras o amigas anunciándose en otras provincias?

Por cada una que active el mes completo de AutoPubli de tu parte te llevas 10€ limpios directos a tu Bizum en el mismo día.

Toda la información y cómo empezar aquí 👉 https://www.autopubli24.com/afiliados`,
    tip: 'Pégalo como tweet fijado o publícalo una vez por semana.'
  },
  {
    id: 'twitter_dm_prospeccion',
    category: 'twitter_x',
    title: 'Mensaje Privado (DM) en X para perfiles activos',
    targetAudience: 'Anunciantes que te siguen o tienen DM abierto en X',
    channel: 'Mensajes Directos de X',
    description: 'Mensaje respetuoso y no invasivo para enviar desde la cuenta oficial.',
    text: `Hola {nombre}, te he visto por aquí. Hemos lanzado una herramienta para tener el anuncio siempre en primera página cada 20 min en automático en los portales líderes sin tener que renovar a mano todo el día.

Si te interesa ver cómo funciona o probarla, la tienes disponible en www.autopubli24.com. ¡Un saludo y que tengas muy buen día!`,
    tip: 'No envíes más de 15 a 20 DMs al día para cuidar la reputación de tu cuenta.'
  },

  // ==========================================
  // 5. CLUBS Y LOCALES: PROMOCIÓN DEL LOCAL O WEB (Servicio de 25€/mes)
  // (IMPORTANTE: Aquí NO se habla de licencias ni de revender nada. Solo de llenar el local).
  // ==========================================
  {
    id: 'club_anuncio_institucional',
    category: 'clubs_locales',
    title: 'Para Clubs que NO anuncian chicas: Anuncio de Instalaciones y Suites',
    targetAudience: 'Encargados o dueños de clubs de alterne, locales de copas o suites',
    channel: 'WhatsApp o Email',
    description: 'Propuesta simple de 25€: anunciar el local (barra, reservados, suites, parking) en el puesto #1 para captar clientes que buscan ocio nocturno.',
    text: `Hola, buenas tardes. Un mensaje breve para la gerencia de {nombre_club}:

Mi nombre es Lorena, de AutoPubli 24/7. Sé que por política de discreción en vuestro club NO publicáis fotos individuales de chicas en portales de clasificados.

Sin embargo, a partir de las 23:00 de la noche, cientos de clientes en {ciudad} entran a los portales buscando ocio nocturno. Si no ven vuestro local, se van a pisos particulares.

Lo que os ofrecemos es muy simple:
Tener un ANUNCIO EXCLUSIVO DEL CLUB (mostrando vuestras instalaciones, barra de copas, suites privadas, parking discreto y horario nocturno) subiendo al PUESTO #1 cada 20 minutos de forma 100% automática durante toda la noche.

• Sin exponer a ninguna chica.
• Vuestro teléfono de información y reservas siempre visible en primera página.
• Por solo 25€ al mes completo.

¿Queréis que os prepare una muestra rápida de cómo quedaría el anuncio de {nombre_club} en primera posición?

Un saludo,
Lorena · AutoPubli 24/7
WhatsApp: +34 641 95 15 91`,
    tip: 'Ideal para locales que no quieren líos con fotos ni inspecciones: se vende el confort y el ocio del club.'
  },
  {
    id: 'club_embudo_web',
    category: 'clubs_locales',
    title: 'Para Locales con WEB PROPIA: Desvío de Tráfico Masivo a su Web',
    targetAudience: 'Clubs o agencias que tienen web con fotos pero dicen "no nos anunciamos en portales"',
    channel: 'WhatsApp',
    description: 'Resuelve la objeción: usa los portales como valla publicitaria para enviar clientes directos a su página web.',
    text: `Hola {nombre_encargado}, buenas tardes. Te escribo de parte de Lorena (AutoPubli 24/7) tras ver la web de {nombre_club}.

Tenéis una web excelente, pero como ya sabrás, Google penaliza este sector y casi nadie llega a la web por buscador si no conoce el nombre exacto de vuestro club.

Para multiplicar las visitas a vuestra web sin depender de Google, os proponemos utilizar los portales de clasificados de {ciudad} como valla publicitaria:

Ponemos un anuncio en el portal que invite a visitar vuestra web:
"Visita las instalaciones y el book completo de esta noche en: www.clubxxx.com"

Nuestra herramienta lo mantiene en el PUESTO #1 cada 20 minutos en automático. Todos los clientes que entren al portal en {ciudad} harán clic directo a vuestra web o llamarán a vuestra recepción.

Cuesta solo 25€ al mes y empezáis a notar las visitas hoy mismo. ¿Hacemos una prueba?

Lorena · WhatsApp: +34 641 95 15 91`,
    tip: 'Les hace entender que el portal no es para exponer chicas, sino un puente de visitas hacia la web que ya han pagado.'
  },
  {
    id: 'club_alquiler_habitaciones',
    category: 'clubs_locales',
    title: 'Para Locales de Alquiler de Habitaciones: Incentivo para llenar plazas',
    targetAudience: 'Locales que alquilan habitaciones o suites a señoritas',
    channel: 'WhatsApp o Charla en persona',
    description: 'Utilizan AutoPubli como servicio premium para que las chicas elijan su local antes que el de la competencia.',
    text: `Hola {nombre_encargado}, buenas tardes. Te contacto de AutoPubli 24/7.

Si en vuestro local alquiláis habitaciones o suites a señoritas independientes, tenéis la opción de ofrecerles una ventaja que ningún otro piso o local de {ciudad} les da:

Incluirles en el alquiler de la habitación la subida automática de su anuncio al Puesto #1 cada 20 minutos con nuestra herramienta.

A vosotras os cuesta una cuota mínima y para ellas es el mayor reclamo posible: saben que en vuestro local no tienen que perder el tiempo renovando a mano y van a tener llamadas todos los días. Llenáis las habitaciones más rápido y fidelizáis a las mejores anunciantes.

Si quieres te explico cómo activarlo en 5 minutos:
Lorena · +34 641 95 15 91`,
    tip: 'Perfecto para locales que compiten por atraer chicas independientes a sus habitaciones.'
  },

  // ==========================================
  // 6. VENTA DE LICENCIA DE CIUDAD: EL NEGOCIO COMPLETO
  // (IMPORTANTE: Esto es para vender la HERRAMIENTA como NEGOCIO/FRANQUICIA a un inversor o dueño).
  // ==========================================
  {
    id: 'licencia_propuesta_negocio_completo',
    category: 'licencia_ciudad',
    title: 'Propuesta de Inversión: Monopolio del Software en tu Ciudad',
    targetAudience: 'Empresarios de ocio nocturno, inversores o personas con contactos en el sector',
    channel: 'Email formal o Reunión de Negocios',
    description: 'Venta de la Licencia Territorial exclusiva: negocio llave en mano para cobrar 35-50€/mes a anunciantes de la zona.',
    text: `Asunto: Oportunidad de Exclusividad Territorial: Licencia Oficial de AutoPubli 24/7 para {ciudad}

Estimado/a {nombre},

Me pongo en contacto con usted porque acabamos de abrir la asignación de la Licencia Territorial Exclusiva de AutoPubli 24/7 para la plaza de {ciudad}.

¿EN QUÉ CONSISTE EL NEGOCIO?
AutoPubli 24/7 es el software informático líder que automatiza la publicación en portales de anuncios clasificados cada 20 minutos las 24 horas del día.

En lugar de comercializarlo directamente nosotros, cedemos la EXPLOTACIÓN EXCLUSIVA a un único titular por ciudad bajo un modelo de franquicia tecnológica:

1. MONOPOLIO TOTAL EN SU CIUDAD:
Solo concedemos 1 licencia para {ciudad}. Nadie más en su territorio podrá adquirir ni comercializar la herramienta.

2. INGRESOS RECURRENTES MENSUALES:
En {ciudad} existen decenas de anunciantes independientes que actualmente pierden horas al día renovando sus anuncios a mano. Como titular de la licencia, usted les ofrece el servicio de autopublicación a la tarifa que decida (ej. 35€ a 50€ al mes).
• Con 20 clientes en su ciudad: 700€ - 1.000€ limpios al mes.
• Con 40 clientes en su ciudad: 1.400€ - 2.000€ limpios al mes.

3. OPERATIVA 100% AUTOMÁTICA EN LA NUBE:
Usted no necesita servidores ni conocimientos de programación. Nosotros nos encargamos de toda la infraestructura técnica y el mantenimiento. Usted únicamente gestiona los clientes de su ciudad y cobra sus mensualidades.

Si desea conocer las condiciones de adquisición de la plaza de {ciudad} antes de que sea asignada a otro operador, quedo a su disposición para mantener una breve conversación telefónica.

Atentamente,

Lorena
Responsable de Expansión & Licencias Territoriales · AutoPubli 24/7
WhatsApp / Teléfono: +34 641 95 15 91
Web oficial: https://www.autopubli24.com/licencia-ciudad`,
    tip: 'Habla de inversión, rentabilidad y monopolio. No le vendas un programa para poner anuncios, sino una concesión territorial.'
  },
  {
    id: 'licencia_whatsapp_inversor',
    category: 'licencia_ciudad',
    title: 'WhatsApp a Empresario / Dueño: Venta del Negocio de la Ciudad',
    targetAudience: 'Dueños de salas, agencias o inversores locales',
    channel: 'WhatsApp',
    description: 'Mensaje directo para despertar interés en adquirir los derechos de su ciudad.',
    text: `Hola {nombre}, buenas tardes. Te escribo de parte de Lorena (AutoPubli 24/7).

Te contacto por un tema de negocio para {ciudad}:

Hemos abierto la concesión de la Licencia Exclusiva de nuestro software de autopublicación de anuncios para {ciudad}. Solo entregamos 1 licencia por ciudad.

El modelo es muy claro:
• Te quedas con la exclusividad territorial de la herramienta en {ciudad}.
• En tu ciudad hay decenas de anunciantes perdiendo tiempo y pagando renovaciones a mano.
• Tú les gestionas el servicio por 35€-50€/mes. Con solo 20-30 clientes, te genera entre 800€ y 1.500€ de beneficio limpio todos los meses.
• Nosotros ponemos el software en la nube y todo el soporte técnico; tú te quedas el margen del negocio.

¿Te interesa que te pase las condiciones de la licencia para {ciudad} antes de que se la asignemos a otro operador?

Un saludo,
Lorena · AutoPubli 24/7
Tel: +34 641 95 15 91`,
    tip: 'Enfocado 100% a números y exclusividad. Si la persona tiene visión de negocio, te pedirá precio de inmediato.'
  },
  {
    id: 'licencia_cierre_escasez',
    category: 'licencia_ciudad',
    title: 'Aviso de Cierre / Reserva de Ciudad ("Solo queda 1 plaza")',
    targetAudience: 'Contactos que pidieron información sobre la licencia de su ciudad',
    channel: 'WhatsApp',
    description: 'Presión de escasez real: recuerda que solo puede haber un dueño por municipio.',
    text: `Hola {nombre}, te contacto rápido desde AutoPubli 24/7 respecto a la Licencia Exclusiva de {ciudad}.

Nos ha entrado otra persona interesada en comprar la exclusividad de {ciudad}. Como tú preguntaste primero, quería confirmarte la disponibilidad antes de proceder con el bloqueo de la plaza.

Recuerda que en el momento en que se firma la licencia, cerramos el acceso para siempre a cualquier otra persona o empresa en {ciudad}.

Si quieres quedarte con la exclusividad de tu zona, avísame hoy y formalizamos la reserva.

Un saludo,
Lorena · +34 641 95 15 91`,
    tip: 'Fundamental para cerrar ventas de personas que lo están pensando o posponiendo.'
  }
];

