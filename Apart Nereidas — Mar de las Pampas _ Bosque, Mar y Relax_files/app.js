/**
 * APART NEREIDAS — MODERN VANILLA JS (ES6+)
 * Cero dependencias (sin jQuery), modular, accesible y ultraliviano (< 6KB)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initHighlightsStories();
  initApartmentGalleries();
  initApartmentFilters();
  initFaqAccordion();
  initBookingForm();
  initNewsletterForm();
});

/**
 * 1. Efecto Scroll en Header (Glassmorphism sutil al bajar)
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 2. Menú Lateral Móvil (Drawer / Offcanvas) Accesible
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-menu a');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('visible');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Evita el scroll de fondo
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Cerrar al hacer clic en cualquier enlace
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });
}

/**
 * 3. Carruseles Táctiles Nativos (Scroll-Snap) en Apartamentos
 */
function initApartmentGalleries() {
  const galleries = document.querySelectorAll('.apartment-gallery');

  galleries.forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const prevBtn = gallery.querySelector('.gallery-nav-prev');
    const nextBtn = gallery.querySelector('.gallery-nav-next');

    if (!track) return;

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
      });
    }
  });
}

/**
 * 4. Filtro Interactivo de Categorías de Apartamentos
 */
function initApartmentFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.apartment-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/**
 * 5. Acordeón Accesible de Preguntas Frecuentes
 */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar otros acordeones
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
          const otherBtn = otherItem.querySelector('.accordion-header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar estado actual
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 6. Generador Inteligente de Consulta WhatsApp desde la Barra de Búsqueda
 * (Check-in, Check-out, Adultos, Menores, Bebés)
 */
function initBookingForm() {
  const bookingForm = document.getElementById('quick-booking-form');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const checkin = document.getElementById('booking-checkin')?.value || '';
    const checkout = document.getElementById('booking-checkout')?.value || '';
    const adultos = document.getElementById('booking-adultos')?.value || '2';
    const menores = document.getElementById('booking-menores')?.value || '0';
    const bebes = document.getElementById('booking-bebes')?.value || '0';

    let message = `¡Hola Apart Nereidas! Quisiera consultar disponibilidad y tarifas para mi estadía:\n`;
    if (checkin) message += `📅 Check-In: ${checkin}\n`;
    if (checkout) message += `📅 Check-Out: ${checkout}\n`;
    message += `👥 Adultos: ${adultos}\n`;
    if (menores && menores !== '0') message += `🧒 Menores (2-12 años): ${menores}\n`;
    if (bebes && bebes !== '0') message += `👶 Bebés (0-2 años): ${bebes}\n`;
    message += `\n¿Podrían indicarme qué opciones tienen disponibles y las tarifas correspondientes? ¡Muchas gracias!`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5492255458000?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/**
 * 7. Formulario de Newsletter con Feedback Amigable
 */
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input?.value;

    if (email) {
      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = '✓ ¡Suscripción exitosa!';
      btn.style.backgroundColor = 'var(--turquesa)';
      btn.style.color = '#fff';
      input.value = '';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 4000);
    }
  });
}

/**
 * 8. SECCIÓN HIGHLIGHTS: REEL DE HISTORIAS & MODAL INTERACTIVO
 * 16 Íconos exactos recreados en SVG vectorial limpio y fotos reales del complejo
 */
const HIGHLIGHTS_DATA = [
  {
    id: 'desayuno',
    title: 'Desayuno',
    category: 'Servicio en la Unidad',
    badge: 'Desayuno Seco Artesanal',
    image: 'nereidas_imagenes/Servicios/03.jpg',
    shortDesc: 'Bandeja artesanal con panificación fresca, infusiones y café servida en la privacidad de tu apart.',
    longDesc: 'Comenzá tus mañanas en el bosque con nuestra bandeja de desayuno seco servido directamente en tu apart: café, infusiones variadas, panificación artesanal fresca, mermeladas y manteca para disfrutar sin apuros.',
    actionText: 'Consultar con Desayuno',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20por%20el%20servicio%20de%20desayuno%20y%20tarifas',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 24h24v8a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8v-8z"/><path d="M34 26h4a4 4 0 0 1 0 8h-4"/><line x1="6" y1="44" x2="38" y2="44"/><path d="M17 17c-1-3 1-5 0-8M22 17c-1-3 1-5 0-8M27 17c-1-3 1-5 0-8"/></svg>`
  },
  {
    id: 'wifi',
    title: 'WiFi',
    category: 'Conectividad Total',
    badge: 'Fibra Óptica de Alta Velocidad',
    image: 'nereidas_imagenes/Servicios/11.jpg',
    shortDesc: 'Internet de fibra óptica de alta velocidad distribuida en todos los departamentos y parque.',
    longDesc: 'Conectividad confiable por fibra óptica en todo el predio. Ideal para nómadas digitales, videollamadas de trabajo o streaming mientras disfrutás del entorno natural y la tranquilidad de los pinos.',
    actionText: 'Consultar Conectividad',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20por%20la%20conexion%20WiFi%20para%20trabajar%20y%20descansar',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="24" y1="21" x2="16" y2="43"/><line x1="24" y1="21" x2="32" y2="43"/><circle cx="24" cy="21" r="2.5" fill="currentColor"/><path d="M19 15a7 7 0 0 1 10 0"/><path d="M15 11a13 13 0 0 1 18 0"/><path d="M11 7a19 19 0 0 1 26 0"/></svg>`
  },
  {
    id: 'limpieza',
    title: 'Limpieza',
    category: 'Atención & Confort',
    badge: 'Mucama Diaria & Blanquería',
    image: 'nereidas_imagenes/Servicios/14.jpg',
    shortDesc: 'Servicio diario de mucama y provisión de sábanas y toallas con recambio periódico.',
    longDesc: 'Cuidamos cada detalle para que disfrutes de tu estadía sin preocupaciones domésticas. Incluye limpieza diaria del departamento y provisión de toallas y sábanas de primera línea.',
    actionText: 'Consultar Servicios Incluidos',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20por%20los%20servicios%20de%20mucama%20y%20limpieza',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 15h24v19H11z"/><path d="M11 27h24"/><line x1="7" y1="15" x2="11" y2="15"/><line x1="11" y1="38" x2="35" y2="38"/><circle cx="15" cy="41" r="3"/><circle cx="31" cy="41" r="3"/><path d="M16 15v-5h4v5M26 15v-7h4v7"/><rect x="15" y="20" width="5" height="7" rx="1"/></svg>`
  },
  {
    id: 'sombrillas',
    title: 'Sombrillas',
    category: 'Playa en Verano',
    badge: 'Reposeras & Sombrilla Incluidas',
    image: 'nereidas_imagenes/Atracciones/playaa.jpeg',
    shortDesc: 'Servicio de playa con sombrillas y reposeras de cortesía para cada unidad en verano.',
    longDesc: 'Durante toda la temporada de verano (diciembre a marzo inclusive), proveemos a cada unidad reposeras y sombrilla de playa para llevar a la orilla del mar a solo 100 metros del complejo.',
    actionText: 'Consultar Temporada Verano',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20disponibilidad%20para%20verano%20y%20servicio%20de%20playa',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 25C9 13 39 13 41 25c-5-2-12-3-17-3s-12 1-17 3z"/><line x1="24" y1="11" x2="24" y2="13"/><line x1="24" y1="22" x2="19" y2="43"/></svg>`
  },
  {
    id: 'mascotas',
    title: 'Mascotas',
    category: 'Pet Friendly',
    badge: 'Mascotas Educadas Bienvenidas',
    image: 'nereidas_imagenes/Servicios/05.jpg',
    shortDesc: 'Aceptamos mascotas educadas pequeñas/medianas en unidades seleccionadas con aviso previo.',
    longDesc: 'Tu mascota es parte de la familia. Recibimos mascotas educadas de tamaño pequeño a mediano en unidades seleccionadas, previa consulta y respetando la armonía del complejo y del bosque.',
    actionText: 'Consultar Estadía con Mascota',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20si%20tienen%20disponibilidad%20para%20viajar%20con%20mascota',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="18" r="4"/><circle cx="33" cy="18" r="4"/><circle cx="9" cy="27" r="3.5"/><circle cx="39" cy="27" r="3.5"/><path d="M16 35c2-4 14-4 16 0 2 3-1 7-8 7s-10-4-8-7z"/></svg>`
  },
  {
    id: 'bicicletas',
    title: 'Bicicletas',
    category: 'Naturaleza & Paseos',
    badge: 'Circuitos por el Bosque',
    image: 'nereidas_imagenes/Atracciones/caminata-2.png',
    shortDesc: 'Calles de arena y senderos seguros entre pinos ideales para recorrer Mar de las Pampas.',
    longDesc: 'Las calles sin asfalto y el aire puro de Mar de las Pampas invitan a paseos inolvidables en bicicleta o caminatas familiares bajo la sombra de los pinos y acacias.',
    actionText: 'Consultar Circuitos de Paseo',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20informacion%20sobre%20paseos%20y%20circuitos%20en%20bicicleta',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="33" r="8"/><circle cx="36" cy="33" r="8"/><circle cx="24" cy="33" r="2.5"/><polyline points="12 33 22 33 28 20 18 20 12 33"/><polyline points="22 33 24 23"/><polyline points="28 20 36 33"/><polyline points="28 20 32 15 36 15"/><line x1="15" y1="18" x2="21" y2="18"/></svg>`
  },
  {
    id: 'ropa-de-cama',
    title: 'Ropa de cama',
    category: 'Descanso Hotelero',
    badge: 'Sommiers & Blanquería Premium',
    image: 'nereidas_imagenes/Apart_Miel/02_1725894620_66df0fdce4584.jpg',
    shortDesc: 'Sommiers Queen y King de alta gama, almohadas anatómicas y sábanas de suave algodón.',
    longDesc: 'Tu descanso reparador es nuestra máxima prioridad: sommiers hoteleros de alta densidad, almohadas ergonómicas, frazadas abrigadas y juegos completos de toallas y sábanas de excelente confección.',
    actionText: 'Ver Confort de Unidades',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20por%20las%20camas%20y%20comodidades%20de%20las%20unidades',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="14" width="30" height="24" rx="2"/><line x1="9" y1="30" x2="39" y2="30"/><rect x="12" y="17" width="10" height="7" rx="1"/><rect x="26" y="17" width="10" height="7" rx="1"/><line x1="9" y1="38" x2="9" y2="42"/><line x1="39" y1="38" x2="39" y2="42"/></svg>`
  },
  {
    id: 'parrilla',
    title: 'Parrilla',
    category: 'Asador Propio',
    badge: 'Parrilla Individual por Apart',
    image: 'nereidas_imagenes/Apart_Premium_A/01_1725739862_66dcb3569579c.jpg',
    shortDesc: 'Parrilla individual propia en deck o terraza privada para disfrutar el asado en el bosque.',
    longDesc: 'El clásico ritual del asado: todos los apartamentos poseen su propia parrilla individual con juego de asador en el deck o balcón privado con hermosa vista a la arboleda.',
    actionText: 'Ver Departamentos con Parrilla',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20disponibilidad%20de%20apartamentos%20con%20parrilla%20privada',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="28" x2="40" y2="28"/><line x1="13" y1="28" x2="11" y2="33"/><line x1="18" y1="28" x2="17" y2="33"/><line x1="24" y1="28" x2="24" y2="33"/><line x1="30" y1="28" x2="31" y2="33"/><line x1="35" y1="28" x2="37" y2="33"/><line x1="9" y1="33" x2="39" y2="33"/><path d="M24 8c-3 4-5 7-2 11 1 1 3 3 2 5 4-2 6-5 4-8-1-2 1-4 0-6s-2-2-4-2z"/><path d="M18 36c1 3 3 5 6 5s5-2 6-5"/></svg>`
  },
  {
    id: 'piscina',
    title: 'Piscina',
    category: 'Relax al Aire Libre',
    badge: 'Piscina Climatizada & Solarium',
    image: 'nereidas_imagenes/Servicios/01.jpg',
    shortDesc: 'Piscina exterior climatizada rodeada de pinos con amplio deck solarium y reposeras.',
    longDesc: 'Piscina exterior templada inmersa en el bosque con amplio solarium de madera, reposeras y sombrillas para relajarse bajo el sol de Mar de las Pampas.',
    actionText: 'Consultar sobre la Piscina',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20consultar%20por%20la%20piscina%20climatizada%20y%20temporadas',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="3"/><path d="M10 8v2M10 18v2M4 14h2M14 14h2M6 10l1.5 1.5M12.5 16.5l1.5 1.5M6 18l1.5-1.5M12.5 11.5l1.5-1.5"/><circle cx="34" cy="24" r="4"/><path d="M23 23l7-5 7 4"/><path d="M4 33c3-2 6-2 9 0s6 2 9 0 6-2 9 0 6 2 9 0"/><path d="M4 39c3-2 6-2 9 0s6 2 9 0 6-2 9 0 6 2 9 0"/></svg>`
  },
  {
    id: 'habitaciones',
    title: 'Habitaciones',
    category: 'Unidades & Confort',
    badge: 'De 2 a 6 Pasajeros',
    image: 'nereidas_imagenes/Apart_Familiar_A/02_1725581702_66da4986912c6.jpg',
    shortDesc: 'Apartamentos luminosos de 1 y 2 plantas, con cocina completa, sommiers y estar cómodo.',
    longDesc: 'Contamos con opciones diseñadas para cada tipo de viaje: desde suites para parejas (Apart Miel con hidromasaje) hasta departamentos familiares de 2 plantas con dos dormitorios y dos baños.',
    actionText: 'Ver Todos los Apartamentos',
    actionUrl: '#apartamentos',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="32" height="32" rx="1"/><line x1="24" y1="8" x2="24" y2="20"/><line x1="24" y1="26" x2="24" y2="40"/><line x1="8" y1="24" x2="18" y2="24"/><line x1="24" y1="24" x2="40" y2="24"/><rect x="11" y="11" width="7" height="9"/><rect x="28" y="11" width="9" height="7"/><rect x="11" y="27" width="9" height="9"/></svg>`
  },
  {
    id: 'ubicacion',
    title: 'Ubicación',
    category: 'Punto Estratégico',
    badge: 'A 100m del Mar y 250m del Centro',
    image: 'nereidas_imagenes/Atracciones/MardelasPampas.jpeg',
    shortDesc: 'Caminá descalzo a la playa en 2 minutos o paseá al centro de compras sin mover el auto.',
    longDesc: 'En el corazón de Mar de las Pampas: a 100 metros del mar y a 250 metros del centro comercial de aldea, disfrutando del silencio del bosque sin depender del automóvil.',
    actionText: 'Ver en Google Maps',
    actionUrl: 'https://maps.app.goo.gl/agkrR1yuJtyzSXsP6',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c-8 0-14 6-14 14 0 11 14 22 14 22s14-11 14-22c0-8-6-14-14-14z"/><polygon points="24,14 26,18 30,18.5 27,21.5 28,26 24,23.5 20,26 21,21.5 18,18.5 22,18" fill="currentColor"/></svg>`
  },
  {
    id: 'galeria',
    title: 'Galería',
    category: 'Postales Reales',
    badge: 'Fotos del Complejo y Entorno',
    image: 'nereidas_imagenes/Portada/03.jpg',
    shortDesc: 'Fotos auténticas del parque arbolado, decks, unidades y naturaleza viva en Mar de las Pampas.',
    longDesc: 'Descubrí la atmósfera de nuestro complejo a través de sus imágenes reales: vegetación autóctona, decks de madera, arquitectura cálida y rincones de paz.',
    actionText: 'Consultar Estadías',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20vi%20las%20fotos%20del%20complejo%20y%20quisiera%20consultar%20por%20una%20estadia',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="15" width="22" height="22" rx="2" transform="rotate(6 29 26)"/><rect x="8" y="15" width="22" height="22" rx="2" transform="rotate(-6 19 26)"/><rect x="13" y="13" width="22" height="22" rx="2"/><circle cx="18" cy="18" r="2"/><polyline points="15 31 22 23 27 28 30 25 33 31"/></svg>`
  },
  {
    id: 'contacto',
    title: 'Contacto',
    category: 'Atención Directa',
    badge: 'Atendido por sus Dueños',
    image: 'nereidas_imagenes/Portada/fotoinicio.jpg',
    shortDesc: 'Atención personalizada y directa por sus propios dueños para asesorarte en tu estadía.',
    longDesc: 'Sin intermediarios: nos encargamos personalmente de recibirte, coordinar tus horarios y brindarte la mejor información local para que aproveches al máximo tus vacaciones.',
    actionText: 'Escribir a los Dueños',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20hacerles%20una%20consulta%20directa',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="11" width="34" height="26" rx="3"/><polyline points="7 13 24 26 41 13"/><line x1="7" y1="35" x2="18" y2="23"/><line x1="41" y1="35" x2="30" y2="23"/></svg>`
  },
  {
    id: 'tarifas',
    title: 'Tarifas',
    category: 'Precios & Promos',
    badge: 'Cotizaciones Claras & Escapadas',
    image: 'nereidas_imagenes/Portada/04.jpg',
    shortDesc: 'Precios por noche transparentes, promociones para fines de semana largos y escapadas.',
    longDesc: 'Cotizamos tu estadía a medida de la cantidad de pasajeros y fechas. Consultá por promociones de temporada baja, paquetes de feriados largos y beneficios por estadías prolongadas.',
    actionText: 'Pedir Cotización de Tarifas',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20solicitar%20cotizacion%20de%20tarifas%20para%20mi%20grupo',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="16" cy="37" rx="8" ry="3"/><ellipse cx="16" cy="32" rx="8" ry="3"/><ellipse cx="16" cy="27" rx="8" ry="3"/><path d="M8 27v10c0 1.7 3.6 3 8 3s8-1.3 8-3V27"/><path d="M25 15l10-10 9 9-10 10-9-9z"/><circle cx="39" cy="9" r="2" fill="currentColor"/></svg>`
  },
  {
    id: 'actividades',
    title: 'Actividades',
    category: 'Aventura & Naturaleza',
    badge: 'Faro Querandí, Dunas & Mar',
    image: 'nereidas_imagenes/Atracciones/IMG_8137.jpeg',
    shortDesc: 'Travesías en 4x4, surf, caminatas por las dunas protegidas y paseos gastronómicos.',
    longDesc: 'Mar de las Pampas ofrece actividades para todas las edades: visitas guiadas al Faro Querandí, senderismo dunícola, cabalgatas por el bosque y gastronomía gourmet artesanal.',
    actionText: 'Consultar Paseos y Actividades',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20saber%20mas%20sobre%20actividades%20y%20paseos%20en%20la%20zona',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6c-4 10-4 26 0 36 4-10 4-26 0-36z"/><line x1="14" y1="6" x2="14" y2="42"/><rect x="23" y="20" width="19" height="15" rx="3"/><path d="M29 20v-3h7v3"/><circle cx="32.5" cy="27.5" r="4"/></svg>`
  },
  {
    id: 'reservas',
    title: 'Reservas',
    category: 'Check-in / Check-out',
    badge: 'Reserva Simple por WhatsApp',
    image: 'nereidas_imagenes/Portada/02.jpg',
    shortDesc: 'Ingreso 15:00 hs, Egreso 10:00 hs. Congelá tu tarifa con seña bancaria de forma rápida y segura.',
    longDesc: 'Coordinamos tu reserva en minutos a través de WhatsApp. Solicitá disponibilidad para tus fechas deseadas y asegurá tu lugar en el bosque con una seña del 30% al 50%.',
    actionText: 'Reservar Mi Estadía Ahora',
    actionUrl: 'https://wa.me/5492255458000?text=Hola%20Apart%20Nereidas,%20quisiera%20reservar%20mi%20estadia',
    icon: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="10" width="34" height="30" rx="3"/><line x1="7" y1="18" x2="41" y2="18"/><line x1="14" y1="6" x2="14" y2="12"/><line x1="34" y1="6" x2="34" y2="12"/><rect x="13" y="24" width="4" height="4"/><rect x="21" y="24" width="4" height="4"/><rect x="29" y="24" width="4" height="4"/><rect x="13" y="32" width="4" height="4"/><circle cx="34" cy="34" r="7" fill="white"/><circle cx="34" cy="34" r="7"/><polyline points="31 34 33 36 37 32"/></svg>`
  }
];

function initHighlightsStories() {
  const reelContainer = document.getElementById('stories-reel');
  const gridContainer = document.getElementById('highlights-grid');
  const modal = document.getElementById('story-modal');

  if (!reelContainer || !gridContainer || !modal) return;

  // 1. Renderizar los 16 ítems en el Stories Reel
  reelContainer.innerHTML = HIGHLIGHTS_DATA.map((item, idx) => `
    <button class="story-item" data-index="${idx}" aria-label="Ver historia destacada: ${item.title}">
      <div class="story-ring">
        <div class="story-avatar">
          ${item.icon}
        </div>
      </div>
      <span class="story-label">${item.title}</span>
    </button>
  `).join('');

  // 2. Renderizar las 16 tarjetas en la Grilla
  gridContainer.innerHTML = HIGHLIGHTS_DATA.map((item, idx) => `
    <article class="highlight-card" data-index="${idx}">
      <div class="highlight-card-thumb">
        <img src="${item.image}" alt="${item.title} - Apart Nereidas" loading="lazy" width="300" height="180">
        <div class="highlight-card-icon-badge">
          ${item.icon}
        </div>
      </div>
      <div class="highlight-card-body">
        <span class="highlight-card-cat">${item.category}</span>
        <h3 class="highlight-card-title">${item.title}</h3>
        <p class="highlight-card-desc">${item.shortDesc}</p>
        <span class="highlight-card-link">
          Ver detalles & fotos
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </article>
  `).join('');

  // 3. Scroll buttons para el Reel en Desktop
  const prevScrollBtn = document.querySelector('.reel-scroll-prev');
  const nextScrollBtn = document.querySelector('.reel-scroll-next');
  if (prevScrollBtn) {
    prevScrollBtn.addEventListener('click', () => {
      reelContainer.scrollBy({ left: -260, behavior: 'smooth' });
    });
  }
  if (nextScrollBtn) {
    nextScrollBtn.addEventListener('click', () => {
      reelContainer.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  // 4. Modal de Historias Interactivo
  const progressBar = document.getElementById('story-progress-bar');
  const avatarIcon = document.getElementById('modal-avatar-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalImg = document.getElementById('modal-story-img');
  const modalBadge = document.getElementById('modal-badge-pill');
  const modalDesc = document.getElementById('modal-desc');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const modalSecondaryBtn = document.getElementById('modal-secondary-btn');
  const modalCloseBtn = document.getElementById('story-modal-close');
  const modalPrevBtn = document.getElementById('story-nav-prev');
  const modalNextBtn = document.getElementById('story-nav-next');
  const backdrop = modal.querySelector('.story-modal-backdrop');

  // Inicializar segmentos de la barra de progreso
  if (progressBar) {
    progressBar.innerHTML = HIGHLIGHTS_DATA.map((_, i) => `<div class="story-progress-seg" id="prog-seg-${i}"></div>`).join('');
  }

  let currentIndex = 0;

  function updateStoryView(idx) {
    if (idx < 0) idx = 0;
    if (idx >= HIGHLIGHTS_DATA.length) idx = HIGHLIGHTS_DATA.length - 1;
    currentIndex = idx;
    const item = HIGHLIGHTS_DATA[currentIndex];

    // Marcar historia como vista en el reel
    const storyItem = reelContainer.querySelector(`.story-item[data-index="${currentIndex}"]`);
    if (storyItem) storyItem.classList.add('viewed');

    // Actualizar elementos visuales del modal
    if (avatarIcon) avatarIcon.innerHTML = item.icon;
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalCategory) modalCategory.textContent = item.category;
    if (modalImg) {
      modalImg.src = item.image;
      modalImg.alt = `${item.title} - Apart Nereidas Mar de las Pampas`;
    }
    if (modalBadge) modalBadge.textContent = item.badge;
    if (modalDesc) modalDesc.textContent = item.longDesc;
    if (modalActionBtn) {
      modalActionBtn.textContent = item.actionText;
      modalActionBtn.href = item.actionUrl;
      if (item.actionUrl.startsWith('#')) {
        modalActionBtn.removeAttribute('target');
        modalActionBtn.onclick = () => closeModal();
      } else {
        modalActionBtn.setAttribute('target', '_blank');
        modalActionBtn.setAttribute('rel', 'noopener');
        modalActionBtn.onclick = null;
      }
    }

    if (modalSecondaryBtn) {
      if (currentIndex === HIGHLIGHTS_DATA.length - 1) {
        modalSecondaryBtn.textContent = 'Volver al Inicio';
        modalSecondaryBtn.onclick = () => updateStoryView(0);
      } else {
        modalSecondaryBtn.textContent = 'Siguiente Historia →';
        modalSecondaryBtn.onclick = () => updateStoryView(currentIndex + 1);
      }
    }

    // Actualizar barra de progreso superior
    for (let i = 0; i < HIGHLIGHTS_DATA.length; i++) {
      const seg = document.getElementById(`prog-seg-${i}`);
      if (!seg) continue;
      seg.className = 'story-progress-seg';
      if (i < currentIndex) {
        seg.classList.add('filled');
      } else if (i === currentIndex) {
        seg.classList.add('active');
      }
    }

    // Scroll suave en el reel para mantener el elemento visible
    if (storyItem) {
      storyItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function openModal(idx) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateStoryView(idx);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners para abrir modal desde Reel y desde Cards
  reelContainer.addEventListener('click', (e) => {
    const itemBtn = e.target.closest('.story-item');
    if (itemBtn) {
      const idx = parseInt(itemBtn.getAttribute('data-index'), 10);
      openModal(idx);
    }
  });

  gridContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.highlight-card');
    if (card) {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openModal(idx);
    }
  });

  // Controles de navegación del Modal
  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex > 0) {
        updateStoryView(currentIndex - 1);
      }
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex < HIGHLIGHTS_DATA.length - 1) {
        updateStoryView(currentIndex + 1);
      } else {
        closeModal();
      }
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentIndex > 0) updateStoryView(currentIndex - 1);
    if (e.key === 'ArrowRight') {
      if (currentIndex < HIGHLIGHTS_DATA.length - 1) {
        updateStoryView(currentIndex + 1);
      } else {
        closeModal();
      }
    }
  });
}

// Manejo de Despliegue de Distribución y Equipamiento en Tarjetas de Apartamentos
window.toggleAptCollapse = function(btn) {
  if (!btn) return;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  const wrapper = btn.closest('.apt-collapse-wrapper');
  if (!wrapper) return;
  const content = wrapper.querySelector('.apt-collapse-content');
  if (!content) return;
  const textSpan = btn.querySelector('.apt-toggle-text');

  if (isExpanded) {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('active');
    content.classList.remove('open');
    content.setAttribute('aria-hidden', 'true');
    if (textSpan) textSpan.textContent = 'Ver distribución y equipamiento';
  } else {
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('active');
    content.classList.add('open');
    content.setAttribute('aria-hidden', 'false');
    if (textSpan) textSpan.textContent = 'Ocultar distribución y equipamiento';
  }
};