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
  safeInit('initWebStoryViewer', initWebStoryViewer);
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

    gallery._pauseTimer = pauseTimer;
    gallery._resumeTimer = resumeTimer;

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

  // Pausa/Reanudación eficiente en segundo plano (único listener global)
  document.addEventListener('visibilitychange', () => {
    galleries.forEach(gallery => {
      if (document.hidden) {
        if (gallery._pauseTimer) gallery._pauseTimer();
      } else {
        if (gallery._resumeTimer) gallery._resumeTimer();
      }
    });
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
    ctaBtn.href = `https://wa.me/5492255415282?text=${waMsg}`;
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
    const whatsappUrl = `https://wa.me/5492255415282?text=${encodedMsg}`;

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
 * 8. Visor Interactivo de Historias en la Sección Servicios (Fotos de cada Categoría)
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

function initWebStoryViewer() {
  const modal = document.getElementById('web-story-modal');
  if (!modal) return;

  window.openWebStory = function(idx) {
    window.currentWebStoryIdx = idx;
    const item = WEB_HIGHLIGHTS_STORIES[idx];
    if (!item) return;
    const counter = document.getElementById('web-story-counter');
    if (counter) counter.textContent = (idx + 1) + ' de ' + WEB_HIGHLIGHTS_STORIES.length;
    const headerTitle = document.getElementById('web-story-header-title');
    const headerIcon = document.getElementById('web-story-header-icon');
    const title = document.getElementById('web-story-title');
    const desc = document.getElementById('web-story-desc');
    const img = document.getElementById('web-story-img');
    if (headerTitle) headerTitle.textContent = item.title;
    if (headerIcon) headerIcon.src = item.icon;
    if (title) title.textContent = item.title;
    if (desc) desc.textContent = item.desc;
    if (img) img.src = item.photo;
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
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.closeWebStory = function(e) {
    if (e.target.id === 'web-story-modal') {
      window.closeWebStoryDirect();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') window.closeWebStoryDirect();
      if (e.key === 'ArrowLeft') window.navigateWebStory(-1);
      if (e.key === 'ArrowRight') window.navigateWebStory(1);
    }
  });
}

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