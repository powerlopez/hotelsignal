/**
 * DEMO DATA — Mediterráneo Bay Hotel & Resort
 *
 * Datos hardcodeados para el MVP. Estructura idéntica a la respuesta de NocoDB REST API.
 * Para conectar datos reales: sustituir las exportaciones por fetch() a la API de NocoDB.
 * Las claves y tipos en lib/types.ts son la interfaz permanente.
 */

import type { Hotel, Finding, Recommendation, Review, AnalysisCycle } from '@/lib/types'

// ---------------------------------------------------------------------------
// Hotel profile
// ---------------------------------------------------------------------------

export const hotel: Hotel = {
  id: 'mediterraneo-bay-001',
  name: 'Mediterráneo Bay Hotel & Resort',
  city: 'Roquetas de Mar',
  province: 'Almería',
  country: 'España',
  stars: 4,
  segment: 'vacacional',
  category: 'resort de playa',
  website_url: 'https://www.mediterraneobay.com',
  offers_page_url: 'https://www.mediterraneobay.com/es/ofertas',
  opportunity_score: 54,
  score_breakdown: {
    commercial_coherence: 45,
    review_utilization: 38,
    offer_quality: 72,
  },
  adr_eur: 95,
  avg_stay_nights: 5,
  ota_commission_pct: 18,
}

// ---------------------------------------------------------------------------
// Analysis cycles
// ---------------------------------------------------------------------------

export const analysisCycles: AnalysisCycle[] = [
  {
    id: 'cycle-003',
    triggered_at: '2026-04-03T09:15:00Z',
    status: 'completed',
    findings_count: 8,
    recommendations_count: 8,
    days_ago: 2,
  },
  {
    id: 'cycle-002',
    triggered_at: '2026-03-20T09:15:00Z',
    status: 'completed',
    findings_count: 9,
    recommendations_count: 9,
    days_ago: 16,
  },
  {
    id: 'cycle-001',
    triggered_at: '2026-03-06T09:15:00Z',
    status: 'completed',
    findings_count: 11,
    recommendations_count: 11,
    days_ago: 30,
  },
]

export const latestCycle = analysisCycles[0]

// ---------------------------------------------------------------------------
// Reviews (ingested from Google, Booking, TripAdvisor)
// ---------------------------------------------------------------------------

export const reviews: Review[] = [
  {
    id: 'rv-001',
    platform: 'google',
    author: 'María G.',
    rating: 9,
    date: '2026-03-28',
    text: 'El desayuno buffet es espectacular, una de las mejores cosas del hotel. Variedad increíble y siempre fresco. La piscina grande está muy bien mantenida. Lo único mejorable es el parking, un poco lejos.',
  },
  {
    id: 'rv-002',
    platform: 'booking',
    author: 'Famille Dupont',
    rating: 9,
    date: '2026-03-25',
    text: 'Parfait pour les familles. Les enfants ont adoré les piscines et les animations. Le buffet du petit-déjeuner était exceptionnel. Nous reviendrons sûrement.',
  },
  {
    id: 'rv-003',
    platform: 'tripadvisor',
    author: 'Pedro A.',
    rating: 8,
    date: '2026-03-22',
    text: 'Hotel en primera línea de playa, lo que es un punto muy a favor. Las habitaciones con vistas al mar son otra cosa. El personal de recepción muy atento. El desayuno, de lo mejor que hemos encontrado en la zona.',
  },
  {
    id: 'rv-004',
    platform: 'google',
    author: 'Ana M.',
    rating: 10,
    date: '2026-03-20',
    text: 'Repetimos solo por el desayuno y por las vistas. La playa justo enfrente es un lujo. Las familias estaban muy bien atendidas. Me sorprendió no encontrar un paquete familiar en su web cuando lo miramos antes de venir.',
  },
  {
    id: 'rv-005',
    platform: 'booking',
    author: 'Thomas K.',
    rating: 6,
    date: '2026-03-18',
    text: 'The room was a bit smaller than expected for four people and the air conditioning was not working properly the first day. Reception solved it but took too long. Breakfast was great though.',
  },
  {
    id: 'rv-006',
    platform: 'tripadvisor',
    author: 'Laura S.',
    rating: 9,
    date: '2026-03-15',
    text: 'Nos alojamos 7 noches. Los niños no querían irse, hay mucho entretenimiento y las piscinas son fantásticas. El acceso a la playa es directo, genial. El buffet variadísimo. Volveremos en verano.',
  },
  {
    id: 'rv-007',
    platform: 'google',
    author: 'Roberto F.',
    rating: 7,
    date: '2026-03-12',
    text: 'Buen hotel en general. La ubicación en primera línea es inmejorable. El desayuno muy bien. El parking está bastante lejos y no hay señalización clara. Lo reservamos por Booking porque en la web del hotel no encontramos oferta similar.',
  },
  {
    id: 'rv-008',
    platform: 'booking',
    author: 'Sonia P.',
    rating: 6,
    date: '2026-03-10',
    text: 'El hotel tiene mucho potencial pero le falta comunicar mejor lo que ofrece. No sabíamos que estaba tan cerca de Cabo de Gata hasta que llegamos y vimos un folleto en recepción. Deberían anunciarlo más.',
  },
  {
    id: 'rv-009',
    platform: 'tripadvisor',
    author: 'Ingrid N.',
    rating: 9,
    date: '2026-03-08',
    text: 'Amplio espacio para familias numerosas. Los desayunos son de notable alto. La piscina infantil es perfecta para los más pequeños. Muy bien situado en la playa. Repetiríamos.',
  },
  {
    id: 'rv-010',
    platform: 'google',
    author: 'Carlos M.',
    rating: 8,
    date: '2026-03-05',
    text: 'Muy buen hotel. La zona de playa directa es el punto fuerte. El personal muy amable. Habría estado bien poder reservar con desayuno incluido directamente desde su web, al final lo hicimos por Booking.',
  },
]

// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------

export const findings: Finding[] = [
  {
    id: 'f-001',
    cycle_id: 'cycle-003',
    category: 'offers',
    title: 'La primera línea de playa no impulsa ninguna oferta directa',
    description:
      'El hotel está en primera línea de playa, su ventaja competitiva más diferencial, pero ninguna de las 4 ofertas activas en la web la menciona para incentivar la reserva directa frente a las OTAs.',
    evidence:
      'Análisis de la página de ofertas (3 abril 2026): 4 ofertas activas. Ninguna menciona "primera línea", "playa a metros" ni acceso directo a la arena. Las OTAs sí lo destacan en su listing.',
    impact_level: 'high',
    impact_rationale:
      'La primera línea es el principal driver de decisión en resorts costeros. No comunicarlo en el canal propio es ceder esa decisión a las OTAs, que cobran el 18% de comisión.',
    created_at: '2026-04-03T10:20:00Z',
  },
  {
    id: 'f-002',
    cycle_id: 'cycle-003',
    category: 'reviews',
    title: 'El desayuno buffet es el activo más elogiado pero no tiene oferta asociada',
    description:
      '23 de las últimas 40 reseñas mencionan el desayuno buffet como punto destacado o motivo de repetición. La web no tiene ningún paquete "alojamiento + desayuno" ni media pensión visible como oferta diferenciada.',
    evidence:
      '"El desayuno buffet es espectacular, una de las mejores cosas del hotel." (Google ★★★★★) · "Repetimos solo por el desayuno y las vistas." (Google ★★★★★) · "Habría estado bien reservar con desayuno desde su web, al final lo hicimos por Booking." (Google ★★★★)',
    impact_level: 'high',
    impact_rationale:
      'Cuando los huéspedes convierten un servicio en motivo de repetición, ese servicio es un activo comercial que debe estar en el centro de al menos una oferta de venta directa.',
    created_at: '2026-04-03T10:21:00Z',
  },
  {
    id: 'f-003',
    cycle_id: 'cycle-003',
    category: 'offers',
    title: 'No hay oferta familiar pese a que el 40% de las reseñas son de familias',
    description:
      'Aproximadamente 4 de cada 10 reseñas son de familias con hijos que mencionan la piscina infantil, las animaciones y el espacio. No existe ningún paquete específico para familias en la página de ofertas.',
    evidence:
      '"Los niños no querían irse, hay mucho entretenimiento." (TripAdvisor ★★★★★) · "Amplio espacio para familias numerosas." (TripAdvisor ★★★★★) · "Parfait pour les familles." (Booking 9.0) · "No encontramos un paquete familiar en su web cuando lo miramos." (Google ★★★★★)',
    impact_level: 'high',
    impact_rationale:
      'Un segmento que representa el 40% de la demanda real sin una oferta específica es pérdida directa de conversión. Las familias buscan certeza (habitación adecuada, actividades para niños) y están dispuestas a pagar un premium por ello.',
    created_at: '2026-04-03T10:22:00Z',
  },
  {
    id: 'f-004',
    cycle_id: 'cycle-003',
    category: 'web',
    title: 'Cabo de Gata (15 min) no aparece en ningún copy comercial',
    description:
      'El hotel está a 15 minutos del Parque Natural de Cabo de Gata, uno de los destinos de naturaleza más valorados del Mediterráneo español. No aparece mencionado en ninguna página de la web ni en las ofertas.',
    evidence:
      'Análisis completo de web (homepage, habitaciones, ofertas, sobre nosotros): la expresión "Cabo de Gata" aparece 0 veces. "Parque natural" aparece 0 veces. "Naturaleza" aparece 0 veces. Una reseña menciona: "No sabíamos que estaba tan cerca de Cabo de Gata hasta que llegamos y vimos un folleto en recepción."',
    impact_level: 'medium',
    impact_rationale:
      'Cabo de Gata atrae a un perfil de viajero activo y con mayor disposición a pagar. Posicionarse como base para visitar el parque amplía el mercado objetivo y eleva el valor percibido del destino.',
    created_at: '2026-04-03T10:23:00Z',
  },
  {
    id: 'f-005',
    cycle_id: 'cycle-003',
    category: 'reviews',
    title: '8 reseñas negativas recientes sin respuesta (>15 días)',
    description:
      'De las últimas 40 reseñas, 8 con valoración de 3 estrellas o menos no han recibido respuesta del hotel en más de 15 días. Dos de ellas llevan más de 20 días sin atención.',
    evidence:
      '"La habitación era pequeña para cuatro personas y el aire acondicionado no funcionaba bien el primer día." (Google ★★★, hace 18 días, sin respuesta) · "El parking está bastante lejos y no hay señalización clara." (Booking 6.5, hace 22 días, sin respuesta)',
    impact_level: 'medium',
    impact_rationale:
      'Las reseñas sin respuesta transmiten desinterés y reducen la tasa de conversión en fichas OTA. Una respuesta bien redactada puede convertir una queja visible en argumento de confianza para futuros huéspedes.',
    created_at: '2026-04-03T10:24:00Z',
  },
  {
    id: 'f-006',
    cycle_id: 'cycle-003',
    category: 'web',
    title: 'La página de ofertas no tiene ningún incentivo exclusivo de reserva directa',
    description:
      'La página de ofertas lista 4 promociones pero ninguna tiene un beneficio exclusivo por reservar en la web del hotel: no hay badge "precio exclusivo web", ni parking gratuito, ni late check-out garantizado.',
    evidence:
      'Análisis página de ofertas: 4 ofertas activas. El botón "Reservar" redirige al motor sin diferenciación del canal. Ninguna oferta incluye texto como "solo en nuestra web", "ventaja exclusiva reserva directa" o beneficios adicionales no disponibles en OTAs.',
    impact_level: 'medium',
    impact_rationale:
      'Si el precio y las condiciones son iguales en la web del hotel y en Booking, el usuario reserva en Booking por confianza y comodidad. El canal directo necesita una razón de ser explícita.',
    created_at: '2026-04-03T10:25:00Z',
  },
  {
    id: 'f-007',
    cycle_id: 'cycle-003',
    category: 'copy',
    title: 'Las descripciones de habitaciones no mencionan vistas al mar',
    description:
      'Las descripciones de habitaciones en la web son genéricas y no diferencian las habitaciones con vistas al mar, que suelen tener un 20-30% de premium de precio y mayor tasa de conversión.',
    evidence:
      '"Amplia habitación con todas las comodidades para su estancia." (descripción actual habitación Superior en web). Sin mención a vistas, orientación, planta ni acceso a terraza. Reseña: "Las habitaciones con vistas al mar son otra cosa." (TripAdvisor)',
    impact_level: 'low',
    impact_rationale:
      'Las vistas al mar son un upsell natural y un argumento de reserva directa cuando el huésped puede seleccionarlas explícitamente desde la web propia.',
    created_at: '2026-04-03T10:26:00Z',
  },
  {
    id: 'f-008',
    cycle_id: 'cycle-003',
    category: 'offers',
    title: 'Sin campaña de early booking para temporada alta 2026',
    description:
      'Estamos en abril 2026 y no existe ninguna oferta de early booking para julio-agosto, la temporada de máxima ocupación donde la venta directa anticipada es más rentable.',
    evidence:
      'Revisión página de ofertas (5 abril 2026): ninguna oferta menciona "julio", "agosto", "verano 2026", "temporada alta", "reserva anticipada" ni "early booking".',
    impact_level: 'low',
    impact_rationale:
      'El early booking permite asegurar reservas directas antes de que las OTAs llenen el cupo. Es la táctica más eficaz para reducir la dependencia de OTAs en temporada alta, el período de mayor margen.',
    created_at: '2026-04-03T10:27:00Z',
  },
]

// ---------------------------------------------------------------------------
// Recommendations (1:1 with findings)
// ---------------------------------------------------------------------------

export const recommendations: Recommendation[] = [
  {
    id: 'r-001',
    finding_id: 'f-001',
    category: 'offers',
    title: 'Crear oferta "Primera línea de arena" exclusiva para reserva directa',
    action_detail:
      '1. Diseñar oferta destacada en la web con titular "Primera línea de arena – solo en nuestra web".\n2. Incluir acceso prioritario a hamacas de playa (10 hamacas reservadas para reservas directas).\n3. Añadir foto de la playa desde el hotel como imagen principal de la oferta.\n4. Badge visible: "Precio exclusivo reservando aquí" con CTA diferenciado.\n5. Añadir el mismo mensaje en la homepage: "Primera línea de playa · Reserva directa · Mejor precio garantizado".',
    priority: 5,
    estimated_impact: '+8–12 reservas directas adicionales/mes',
    estimated_bookings_min: 8,
    estimated_bookings_max: 12,
    status: 'pending',
    updated_at: '2026-04-03T10:20:00Z',
  },
  {
    id: 'r-002',
    finding_id: 'f-002',
    category: 'offers',
    title: 'Activar paquete "Desayuno incluido" con precio exclusivo web',
    action_detail:
      '1. Crear oferta "Nuestro desayuno legendario incluido" en la página de ofertas.\n2. Precio diferencial: -5% sobre precio rack para reservas directas con desayuno incluido.\n3. Añadir foto del buffet como imagen principal: es el activo más mencionado en reseñas.\n4. Incluir cita de reseña real en la oferta: "Repetimos solo por el desayuno" para reforzar credibilidad.\n5. Configurar en el motor de reservas como tarifa "Reserva directa + desayuno".',
    priority: 5,
    estimated_impact: '+5–9 reservas directas con upgrade incluido/mes',
    estimated_bookings_min: 5,
    estimated_bookings_max: 9,
    status: 'in_progress',
    notes: 'Hablado con el equipo de revenue. Pendiente de configurar en el motor.',
    updated_at: '2026-04-04T14:30:00Z',
  },
  {
    id: 'r-003',
    finding_id: 'f-003',
    category: 'offers',
    title: 'Lanzar paquete "Vacaciones en familia" con habitación y actividades',
    action_detail:
      '1. Crear oferta "Vacaciones en familia – solo reservando aquí" con habitación familiar o comunicada.\n2. Incluir: acceso a piscina infantil, 1 actividad de animación infantil/día, early check-in 12h si disponible.\n3. Imagen principal: familias en la piscina del hotel (foto real).\n4. Añadir sección específica "Para familias" en la homepage con enlace a la oferta.\n5. Destacar la oferta familiar en toda campaña de verano.',
    priority: 5,
    estimated_impact: '+6–10 reservas familiares adicionales/mes',
    estimated_bookings_min: 6,
    estimated_bookings_max: 10,
    status: 'pending',
    updated_at: '2026-04-03T10:22:00Z',
  },
  {
    id: 'r-004',
    finding_id: 'f-004',
    category: 'web',
    title: 'Añadir sección "Tu base para descubrir Cabo de Gata"',
    action_detail:
      '1. Añadir sección en la homepage: "A 15 minutos del Parque Natural de Cabo de Gata".\n2. Incluir mapa visual de la distancia hotel → parque.\n3. Crear landing "Explora Cabo de Gata desde el hotel" con: rutas recomendadas, calas más cercanas, consejos de temporada.\n4. Opcionalmente: ofrecer excursión guiada a Cabo de Gata como add-on de reserva (+€25/persona).\n5. Añadir keywords "Cabo de Gata", "naturaleza", "parque natural" en meta descriptions.',
    priority: 3,
    estimated_impact: '+4–6 reservas de turismo activo/mes',
    estimated_bookings_min: 4,
    estimated_bookings_max: 6,
    status: 'pending',
    updated_at: '2026-04-03T10:23:00Z',
  },
  {
    id: 'r-005',
    finding_id: 'f-005',
    category: 'reviews',
    title: 'Responder las 8 reseñas negativas pendientes y establecer protocolo 48h',
    action_detail:
      '1. Responder inmediatamente las 8 reseñas sin respuesta con template específico por tipo de queja.\n2. Template parking: "Entendemos que la distancia al parking puede ser una incomodidad. Estamos evaluando mejoras en la señalización...".\n3. Template habitación/AC: "Lamentamos los inconvenientes del primer día. Nuestro equipo de mantenimiento actúa siempre que se notifica...".\n4. Establecer protocolo interno: revisión de reseñas cada 48h, respuesta obligatoria en ese plazo.\n5. Asignar responsable de reputación online (puede ser el mismo responsable de recepción).',
    priority: 3,
    estimated_impact: '-15% abandono en fichas OTA · +0.2 en rating medio estimado',
    estimated_bookings_min: 3,
    estimated_bookings_max: 5,
    status: 'done',
    notes: 'Respondidas todas las reseñas el 4 de abril. Protocolo de 48h acordado con recepción.',
    updated_at: '2026-04-04T16:00:00Z',
  },
  {
    id: 'r-006',
    finding_id: 'f-006',
    category: 'web',
    title: 'Añadir beneficios exclusivos de reserva directa en cada oferta web',
    action_detail:
      '1. Revisar las 4 ofertas activas y añadir a cada una al menos 1 beneficio exclusivo web.\n2. Opciones de beneficios: parking gratuito, late check-out hasta 13h garantizado, botella de bienvenida, upgrade de habitación sujeto a disponibilidad.\n3. Añadir badge "Solo en nuestra web" prominente en cada tarjeta de oferta.\n4. Revisar el texto del botón "Reservar" → cambiarlo a "Reservar con esta ventaja".\n5. Añadir sección fija en la web: "¿Por qué reservar directamente?" con los 3 beneficios principales.',
    priority: 4,
    estimated_impact: '+10–15% conversión en motor de reserva directa',
    estimated_bookings_min: 5,
    estimated_bookings_max: 8,
    status: 'pending',
    updated_at: '2026-04-03T10:25:00Z',
  },
  {
    id: 'r-007',
    finding_id: 'f-007',
    category: 'copy',
    title: 'Reescribir descripciones de habitaciones diferenciando por vista y planta',
    action_detail:
      '1. Identificar qué habitaciones tienen vistas al mar, vistas al jardín, vistas a la piscina.\n2. Reescribir las descripciones con esa diferenciación explícita.\n3. Ejemplo: "Habitación Superior con vistas al Mediterráneo – Disfruta del mar desde tu propia terraza con orientación sur".\n4. Activar selección de vista como filtro en el motor de reservas.\n5. Precio diferencial: +10% para vistas al mar (si no existe ya).',
    priority: 2,
    estimated_impact: '+8% en valor medio de reserva directa (upgrade habitación)',
    estimated_bookings_min: 2,
    estimated_bookings_max: 4,
    status: 'dismissed',
    notes: 'Pendiente para cuando se renueve la web completa.',
    updated_at: '2026-04-04T09:00:00Z',
  },
  {
    id: 'r-008',
    finding_id: 'f-008',
    category: 'offers',
    title: 'Lanzar campaña early booking verano 2026 antes del 30 de abril',
    action_detail:
      '1. Crear oferta "Reserva tu verano con antelación" con 12% de descuento sobre precio rack.\n2. Condiciones: reservas realizadas antes del 30 de abril para estancias de junio-agosto 2026.\n3. Política: no reembolsable o con cancelación hasta 15 días antes.\n4. Destacar en homepage con banner de urgencia: "Solo hasta el 30 de abril".\n5. Comunicar por email a base de datos de clientes anteriores (si existe).',
    priority: 2,
    estimated_impact: '+12–20 reservas anticipadas de temporada alta',
    estimated_bookings_min: 12,
    estimated_bookings_max: 20,
    status: 'in_progress',
    notes: 'Diseño del banner en curso. Se lanza la semana que viene.',
    updated_at: '2026-04-05T08:00:00Z',
  },
]
