/**
 * APART NEREIDAS — MODERN VANILLA JS (ES6+)
 * Cero dependencias (sin jQuery), modular, accesible y ultraliviano (< 6KB)
 */

function initAll() {
  const safeInit = (fnName, fn) => {
    try {
      if (typeof fn === 'function') {
        fn();
      }
    } catch (err) {
      console.warn('[Init Warning] Error en ' + fnName + ':', err);
    }
  };

  safeInit('initHeaderScroll', initHeaderScroll);
  safeInit('initMobileDrawer', initMobileDrawer);
  safeInit('initApartmentGalleries', initApartmentGalleries);
  safeInit('initApartmentFilters', initApartmentFilters);
  safeInit('initFaqAccordion', initFaqAccordion);
  safeInit('initBookingForm', initBookingForm);
  safeInit('initFloatingBookingBar', initFloatingBookingBar);
  safeInit('initNewsletterForm', initNewsletterForm);
  safeInit('initHighlightsStories', initHighlightsStories);
  safeInit('initPxNav', initPxNav);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

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
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 3. Carruseles Táctiles Nativos (Scroll-Snap) en Apartamentos
 *    + Slideshow Automático (cada 7 segundos) con UX Senior
 *    + Pop-up Modal con Ficha Descriptiva y Lightbox Completo
 */
let currentModalSlides = [];
let currentModalSlideIndex = 0;

function initApartmentGalleries() {
  const galleries = document.querySelectorAll('.apartment-gallery');
  if (!galleries.length) return;

  galleries.forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const prevBtn = gallery.querySelector('.gallery-nav-prev');
    const nextBtn = gallery.querySelector('.gallery-nav-next');
    const counter = gallery.querySelector('.gallery-counter');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const expandBadge = gallery.querySelector('.gallery-expand-badge');
    const card = gallery.closest('.apartment-card');
    const total = slides.length;

    if (!track || total === 0) return;

    let autoSlideTimer = null;
    let isPaused = false;
    let isVisible = false;

    const hydrateGallery = () => {
      if (gallery.dataset.hydrated) return;
      gallery.dataset.hydrated = 'true';
      const lazyImgs = gallery.querySelectorAll('img[data-src]');
      lazyImgs.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    };

    const getCurrentIndex = () => {
      const width = track.clientWidth;
      if (!width) return 0;
      return Math.min(total - 1, Math.max(0, Math.round(track.scrollLeft / width)));
    };

    const updateCounter = () => {
      if (!counter || !track.clientWidth) return;
      const index = getCurrentIndex() + 1;
      counter.textContent = `${index} / ${total}`;
    };

    const goToSlide = (index, smooth = true) => {
      hydrateGallery();
      const slideWidth = track.clientWidth;
      track.scrollTo({
        left: index * slideWidth,
        behavior: smooth ? 'smooth' : 'auto'
      });
      setTimeout(updateCounter, 320);
    };

    const nextSlide = () => {
      const current = getCurrentIndex();
      const next = (current + 1 >= total) ? 0 : current + 1;
      goToSlide(next);
    };

    const prevSlide = () => {
      const current = getCurrentIndex();
      const prev = (current <= 0) ? total - 1 : current - 1;
      goToSlide(prev);
    };

    // Temporizador Automático cada 7 segundos (7000ms)
    const resetTimer = () => {
      clearInterval(autoSlideTimer);
      if (!isPaused && isVisible && !document.hidden) {
        autoSlideTimer = setInterval(() => {
          nextSlide();
        }, 7000);
      }
    };

    const pauseTimer = () => {
      isPaused = true;
      clearInterval(autoSlideTimer);
    };

    const resumeTimer = () => {
      isPaused = false;
      resetTimer();
    };

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateCounter();
        resetTimer();
      }, 60);
    }, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        resetTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        resetTimer();
      });
    }

    // Senior UX: Hidratación bajo demanda al interactuar
    gallery.addEventListener('mouseenter', hydrateGallery, { once: true });
    gallery.addEventListener('touchstart', hydrateGallery, { passive: true, once: true });

    // Senior UX: Pausa al posar el cursor o interactuar táctilmente
    gallery.addEventListener('mouseenter', pauseTimer);
    gallery.addEventListener('mouseleave', resumeTimer);
    gallery.addEventListener('touchstart', pauseTimer, { passive: true });
    gallery.addEventListener('touchend', resumeTimer, { passive: true });

    // Senior UX: Pausa si la pestaña pasa a segundo plano
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    });

    // Senior UX: IntersectionObserver para pausar cuando la tarjeta no esté visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            resetTimer();
          } else {
            isVisible = false;
            clearInterval(autoSlideTimer);
          }
        });
      }, { threshold: 0.25 });
      observer.observe(card || gallery);
    } else {
      isVisible = true;
      resetTimer();
    }

    // Clic sobre las fotos: Abrir pop up con ficha descriptiva del apartamento
    slides.forEach((slide, slideIdx) => {
      slide.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-nav-btn')) return;
        openApartmentModal(card, slideIdx);
      });

      slide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openApartmentModal(card, slideIdx);
        }
      });
    });

    if (expandBadge) {
      expandBadge.style.cursor = 'pointer';
      expandBadge.style.pointerEvents = 'auto';
      expandBadge.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openApartmentModal(card, getCurrentIndex());
      });
    }
  });

  // Inicializar listeners del teclado para el Modal de Apartamentos
  initApartmentModalEvents();
}

/**
 * Lógica del Modal Pop-up Ficha Descriptiva de Apartamento
 */
function initApartmentModalEvents() {
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('apartment-modal');
    if (!modal || !modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeApartmentModal();
    } else if (e.key === 'ArrowLeft') {
      navigateAptModalImage(-1);
    } else if (e.key === 'ArrowRight') {
      navigateAptModalImage(1);
    }
  });
}

function openApartmentModal(card, initialSlideIndex = 0) {
  const modal = document.getElementById('apartment-modal');
  if (!modal || !card) return;

  const titleEl = modal.querySelector('#apt-modal-title');
  const capacityEl = modal.querySelector('#apt-modal-capacity');
  const surfaceEl = modal.querySelector('#apt-modal-surface');
  const specsEl = modal.querySelector('#apt-modal-specs');
  const amenitiesEl = modal.querySelector('#apt-modal-amenities');
  const distribContentEl = modal.querySelector('#apt-modal-distrib-content');
  const ctaBtn = modal.querySelector('#apt-modal-cta');
  const thumbsEl = modal.querySelector('#apt-modal-thumbs');

  const title = card.querySelector('.apartment-title')?.textContent?.trim() || 'Apartamento';
  const capacity = card.querySelector('.apartment-capacity-badge')?.textContent?.trim() || '';
  const surface = card.querySelector('.apt-surface-badge')?.textContent?.trim() || '';
  const specsHtml = card.querySelector('.apt-specs-bar')?.innerHTML || '';
  const amenitiesHtml = card.querySelector('.apt-amenities-row')?.innerHTML || '';

  const plantsGrid = card.querySelector('.apt-plants-grid');
  const detailsList = card.querySelector('.apt-details-list');
  let distribHtml = '';
  if (plantsGrid) {
    distribHtml = plantsGrid.outerHTML;
  } else if (detailsList) {
    distribHtml = detailsList.outerHTML;
  }

  // Recopilar fotos de la unidad (soporta data-src diferido)
  const slideImgs = Array.from(card.querySelectorAll('.gallery-slide img')).map(img => ({
    src: img.getAttribute('data-src') || img.getAttribute('src') || img.src,
    alt: img.getAttribute('alt') || title
  }));

  currentModalSlides = slideImgs;
  currentModalSlideIndex = Math.max(0, Math.min(initialSlideIndex, slideImgs.length - 1));

  if (titleEl) titleEl.textContent = title;
  if (capacityEl) capacityEl.textContent = capacity;
  if (surfaceEl) surfaceEl.textContent = surface;
  if (specsEl) specsEl.innerHTML = specsHtml;
  if (amenitiesEl) amenitiesEl.innerHTML = amenitiesHtml;
  if (distribContentEl) distribContentEl.innerHTML = distribHtml;

  // Botón directo a WhatsApp con texto personalizado por apartamento
  if (ctaBtn) {
    const waMsg = encodeURIComponent(`¡Hola Apart Nereidas! Me interesa consultar disponibilidad y tarifas para el ${title}. ¿Podrían brindarme información?`);
    ctaBtn.href = `https://wa.me/5491158085444?text=${waMsg}`;
  }

  // Miniaturas del carrusel
  if (thumbsEl) {
    thumbsEl.innerHTML = currentModalSlides.map((s, idx) => `
      <button type="button" class="apt-modal-thumb-btn ${idx === currentModalSlideIndex ? 'active' : ''}" onclick="setAptModalSlide(${idx})" aria-label="Ver foto ${idx + 1}">
        <img src="${s.src}" alt="${s.alt}" loading="lazy">
      </button>
    `).join('');
  }

  setAptModalSlide(currentModalSlideIndex);

  // Abrir modal y bloquear scroll de fondo
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('apt-modal-open');

  const closeBtn = modal.querySelector('.apt-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeApartmentModal() {
  const modal = document.getElementById('apartment-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('apt-modal-open');
}

function setAptModalSlide(index) {
  if (!currentModalSlides.length) return;
  currentModalSlideIndex = (index + currentModalSlides.length) % currentModalSlides.length;

  const mainImg = document.getElementById('apt-modal-main-img');
  const counter = document.getElementById('apt-modal-counter');
  const thumbs = document.querySelectorAll('.apt-modal-thumb-btn');

  const current = currentModalSlides[currentModalSlideIndex];
  if (mainImg && current) {
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
      mainImg.src = current.src;
      mainImg.alt = current.alt;
      mainImg.style.opacity = '1';
    }, 120);
  }

  if (counter) {
    counter.textContent = `${currentModalSlideIndex + 1} / ${currentModalSlides.length}`;
  }

  thumbs.forEach((th, i) => {
    if (i === currentModalSlideIndex) {
      th.classList.add('active');
      th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      th.classList.remove('active');
    }
  });
}

function navigateAptModalImage(direction) {
  setAptModalSlide(currentModalSlideIndex + direction);
}

// Exponer en el objeto global window para invocación desde eventos inline
window.openApartmentModal = openApartmentModal;
window.closeApartmentModal = closeApartmentModal;
window.setAptModalSlide = setAptModalSlide;
window.navigateAptModalImage = navigateAptModalImage;


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

    // Asegurar estado contraído inicial
    item.classList.remove('active');
    body.style.maxHeight = null;
    header.setAttribute('aria-expanded', 'false');

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
        body.style.maxHeight = (body.scrollHeight + 30) + 'px';
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

/**
 * 9. Visor Interactivo de Historias en la Sección Highlights de la Web
 */
const WEB_HIGHLIGHTS_STORIES = [
  {
    title: 'Desayuno Artesanal',
    icon: 'img/highlights/01_desayuno.jpg',
    photo: 'nereidas_imagenes/Servicios/Desayuno.jpg',
    desc: 'Bandeja artesanal con panificación fresca, mermeladas e infusiones servida directamente en tu apart o junto a la piscina.'
  },
  {
    title: 'Servicio de Mucama',
    icon: 'img/highlights/03_limpieza.jpg',
    photo: 'nereidas_imagenes/Apart_Miel/08_1725739803_66dcb31be0abd.jpg',
    desc: 'Limpieza diaria y provisión de blancos con recambio periódico para una estadía impecable y relajante.'
  },
  {
    title: 'Servicio de Playa',
    icon: 'img/highlights/04_sombrillas.jpg',
    photo: 'nereidas_imagenes/Atracciones/Playas amplias.jpeg',
    desc: 'Sombrillas y reposeras listas para disfrutar de las amplias playas de Mar de las Pampas a solo 100 metros.'
  },
  {
    title: 'Estadía Pet Friendly',
    icon: 'img/highlights/05_mascotas.jpg',
    photo: 'nereidas_imagenes/Servicios/01.jpg',
    desc: 'Recibimos a tu mascota educada en nuestras instalaciones y parque cerrado con coordinación previa.'
  },
  {
    title: 'Bicicletas de Paseo',
    icon: 'img/highlights/06_bicicletas.jpg',
    photo: 'nereidas_imagenes/Servicios/03.jpg',
    desc: 'Bicicletas a disposición con canasto y sillita infantil para recorrer las calles de arena y senderos del bosque.'
  },
  {
    title: 'Ropa Blanca & Sommier',
    icon: 'img/highlights/07_ropa_de_cama.jpg',
    photo: 'nereidas_imagenes/Apart_Premium_B/b4adeece-a0d2-4ea7-8a0e-034e719cb86f_1726508996_66e86fc43031c.jpeg',
    desc: 'Sommiers hoteleros King Size y juegos completos de sábanas y toallones de puro algodón para un descanso superior.'
  },
  {
    title: 'Parrilla Individual',
    icon: 'img/highlights/08_parrilla.jpg',
    photo: 'nereidas_imagenes/Apart_Miel/02_1725894620_66df0fdce4584.jpg',
    desc: 'Cada departamento cuenta con su propio asador en balcón terraza o deck privado con mesa exterior.'
  },
  {
    title: 'Piscina Climatizada',
    icon: 'img/highlights/09_piscina.jpg',
    photo: 'nereidas_imagenes/Servicios/04.jpg',
    desc: 'Piscina exterior templada rodeada de solarium de madera, reposeras y la serenidad de los pinos.'
  },
  {
    title: 'Equipamiento Total',
    icon: 'img/highlights/10_habitaciones.jpg',
    photo: 'nereidas_imagenes/Apart_Familiar_B/859db912-7b53-4fc0-aa14-0b2ff7bcfeb2_1726512449_66e87d41767c8.jpeg',
    desc: 'Cocina completamente equipada con heladera con freezer, microondas, vajilla completa y baño con hidromasaje.'
  },
  {
    title: 'Ubicación Estratégica',
    icon: 'img/highlights/11_ubicacion.jpg',
    photo: 'nereidas_imagenes/Servicios/05.jpg',
    desc: 'Privilegiada ubicación en medio del bosque, a solo 100 metros del mar y a 250 metros del centro comercial de aldea.'
  },
  {
    title: 'Galería & Parque',
    icon: 'img/highlights/12_galeria.jpg',
    photo: 'nereidas_imagenes/Servicios/06.jpg',
    desc: 'Parque arbolado privado con camastros, senderos naturales y rincones de relax en plena naturaleza.'
  },
  {
    title: 'Paseos por la Aldea',
    icon: 'img/highlights/15_actividades.jpg',
    photo: 'nereidas_imagenes/Atracciones/centro aldea.jpg',
    desc: 'Construcciones rústicas de piedra y madera, gastronomía gourmet de autor, chocolaterías y artesanías.'
  }
];

window.currentWebStoryIdx = 0;

window.openWebStory = function(idx) {
  window.currentWebStoryIdx = idx;
  const item = WEB_HIGHLIGHTS_STORIES[idx];
  if (!item) return;
  const modal = document.getElementById('web-story-modal');
  if (!modal) return;
  const counter = document.getElementById('web-story-counter');
  if (counter) counter.textContent = (idx + 1) + ' de ' + WEB_HIGHLIGHTS_STORIES.length;
  document.getElementById('web-story-header-title').textContent = item.title;
  document.getElementById('web-story-header-icon').src = item.icon;
  document.getElementById('web-story-title').textContent = item.title;
  document.getElementById('web-story-desc').textContent = item.desc;
  document.getElementById('web-story-img').src = item.photo;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.navigateWebStory = function(direction) {
  let nextIdx = (window.currentWebStoryIdx || 0) + direction;
  if (nextIdx < 0) nextIdx = WEB_HIGHLIGHTS_STORIES.length - 1;
  if (nextIdx >= WEB_HIGHLIGHTS_STORIES.length) nextIdx = 0;
  window.openWebStory(nextIdx);
};

window.closeWebStoryDirect = function() {
  const modal = document.getElementById('web-story-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
};

window.closeWebStory = function(e) {
  if (e.target.id === 'web-story-modal') {
    closeWebStoryDirect();
  }
};

document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('web-story-modal');
  if (modal && modal.style.display === 'flex') {
    if (e.key === 'ArrowLeft') window.navigateWebStory(-1);
    if (e.key === 'ArrowRight') window.navigateWebStory(1);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('stories-prev-btn');
  const nextBtn = document.getElementById('stories-next-btn');
  const track = document.getElementById('stories-track');
  if (prevBtn && track) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -220, behavior: 'smooth' });
    });
  }
  if (nextBtn && track) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }
});

/* ==========================================================================
   HERO SLIDESHOW (5 IMÁGENES, AUTO SLIDE CADA 5 SEGUNDOS)
   ========================================================================== */
(function initHeroSlideshow() {
  function setup() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    if (!slides || slides.length <= 1) return;

    let currentSlide = 0;
    let slideInterval = null;

    function hydrateSlide(slide) {
      if (!slide || slide.dataset.hydrated) return;
      slide.dataset.hydrated = 'true';
      slide.querySelectorAll('source[data-srcset]').forEach(s => {
        s.srcset = s.dataset.srcset;
        s.removeAttribute('data-srcset');
      });
      const img = slide.querySelector('img[data-src]');
      if (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    }

    window.setHeroSlide = function(index) {
      if (index < 0 || index >= slides.length) return;
      hydrateSlide(slides[index]);
      slides[currentSlide].classList.remove('active');
      if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
      
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');

      resetInterval();
    };

    window.nextHeroSlide = function() {
      const next = (currentSlide + 1) % slides.length;
      hydrateSlide(slides[next]);
      window.setHeroSlide(next);
    };

    window.prevHeroSlide = function() {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      hydrateSlide(slides[prev]);
      window.setHeroSlide(prev);
    };

    function nextSlide() {
      window.nextHeroSlide();
    }

    // Hidratar slides secundarios cuando la red esté libre tras el inicio
    if (typeof window !== 'undefined') {
      const scheduleHydration = window.requestIdleCallback || function(cb) { setTimeout(cb, 2500); };
      window.addEventListener('load', function() {
        scheduleHydration(function() {
          slides.forEach(hydrateSlide);
        });
      });
    }

    function resetInterval() {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    resetInterval();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

/**
 * 9. Barra de Búsqueda de Disponibilidad Fija en el Foot al hacer Scroll
 */
function initFloatingBookingBar() {
  const bar = document.getElementById('quick-booking-bar');
  const mobileToggle = document.getElementById('booking-mobile-toggle');
  const minimizeBtn = document.getElementById('booking-minimize-btn');
  const pill = document.getElementById('booking-minimized-pill');
  const checkinInput = document.getElementById('booking-checkin');
  const checkoutInput = document.getElementById('booking-checkout');
  const summaryText = document.getElementById('booking-mobile-summary');
  const expandText = document.getElementById('booking-expand-text');

  if (!bar) return;

  const updateSummary = () => {
    if (!summaryText) return;
    const ci = checkinInput?.value;
    const co = checkoutInput?.value;
    if (ci && co) {
      summaryText.textContent = `${ci.slice(5)} al ${co.slice(5)}`;
    }
  };

  checkinInput?.addEventListener('change', updateSummary);
  checkoutInput?.addEventListener('change', updateSummary);

  // Fija y visible desde la carga inicial de la web
  bar.classList.add('is-visible');

  // Expansión / Colapso interactivo en móviles
  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      if (e.target.closest('#quick-booking-form')) return;
      const isExpanded = bar.classList.toggle('is-mobile-expanded');
      document.body.classList.toggle('booking-mobile-open', isExpanded);
      if (expandText) {
        expandText.textContent = isExpanded ? 'Cerrar' : 'Seleccionar';
      }
    });
  }
}

/**
 * 10. Megamenús Desplegables PxNav en Header (Soporte Dual: Hover Inteligente + Clic)
 */
function initPxNav() {
  const menuButtons = document.querySelectorAll('.pxnav__item--btn');
  const drops = document.querySelectorAll('.pxnav-drop');
  if (!menuButtons.length || !drops.length) return;

  let closeTimer = null;

  function closeAllDrops() {
    clearTimeout(closeTimer);
    drops.forEach(d => d.classList.remove('is-open'));
    menuButtons.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-expanded', 'false');
    });
  }

  function openDrop(menuId) {
    clearTimeout(closeTimer);
    const targetDrop = document.querySelector('.pxnav-drop[data-pxnav-panel="' + menuId + '"]');
    const btn = document.querySelector('.pxnav__item--btn[data-pxnav-menu="' + menuId + '"]');

    drops.forEach(d => {
      if (d !== targetDrop) d.classList.remove('is-open');
    });
    menuButtons.forEach(b => {
      if (b !== btn) {
        b.classList.remove('is-active');
        b.setAttribute('aria-expanded', 'false');
      }
    });

    if (targetDrop && btn) {
      targetDrop.classList.add('is-open');
      btn.classList.add('is-active');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      closeAllDrops();
    }, 180);
  }

  menuButtons.forEach(btn => {
    const menuId = btn.getAttribute('data-pxnav-menu');
    const targetDrop = document.querySelector('.pxnav-drop[data-pxnav-panel="' + menuId + '"]');

    // 1. Interacción por Clic / Tap
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = targetDrop && targetDrop.classList.contains('is-open');
      if (isOpen) {
        closeAllDrops();
      } else {
        openDrop(menuId);
      }
    });

    // 2. Interacción por Hover en dispositivos de puntero fino (Desktop)
    btn.addEventListener('mouseenter', () => {
      if (window.matchMedia('(pointer: fine)').matches) {
        openDrop(menuId);
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (window.matchMedia('(pointer: fine)').matches) {
        scheduleClose();
      }
    });

    if (targetDrop) {
      targetDrop.addEventListener('mouseenter', () => {
        if (window.matchMedia('(pointer: fine)').matches) {
          clearTimeout(closeTimer);
        }
      });
      targetDrop.addEventListener('mouseleave', () => {
        if (window.matchMedia('(pointer: fine)').matches) {
          scheduleClose();
        }
      });
    }
  });

  // Cerrar al hacer clic en cualquier enlace dentro de un panel
  document.querySelectorAll('.pxnav-drop a').forEach(a => {
    a.addEventListener('click', () => {
      closeAllDrops();
    });
  });

  // Cerrar al hacer clic fuera del header o de los paneles
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header') && !e.target.closest('.pxnav-drops')) {
      closeAllDrops();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDrops();
    }
  });

  window.closeAllPxDrops = closeAllDrops;
}

/**
 * Redirección suave al área visible de búsqueda de fechas en el Hero
 */
function scrollToBookingBar() {
  const bar = document.getElementById('quick-booking-bar');
  if (bar) {
    bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bar.classList.add('pulse-highlight');
    setTimeout(() => bar.classList.remove('pulse-highlight'), 1200);
    const checkin = document.getElementById('booking-checkin');
    if (checkin) {
      setTimeout(() => checkin.focus(), 600);
    }
  } else {
    const hero = document.getElementById('inicio');
    if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.scrollToBookingBar = scrollToBookingBar;

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