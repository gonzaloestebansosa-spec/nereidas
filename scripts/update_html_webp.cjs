const fs = require('fs');

// 1. Actualizar index.html
let html = fs.readFileSync('index.html', 'utf8');

// A. Reemplazar img/highlights/*.jpg por .webp
html = html.replace(/img\/highlights\/([a-zA-Z0-9_]+)\.jpg/g, 'img/highlights/$1.webp');

// B. Reemplazar nereidas_imagenes/Atracciones/*.jpeg y .jpg por .webp
html = html.replace(/nereidas_imagenes\/Atracciones\/Playas%20amplias\.jpeg/g, 'nereidas_imagenes/Atracciones/Playas%20amplias.webp');
html = html.replace(/nereidas_imagenes\/Atracciones\/centro%20aldea\.jpg/g, 'nereidas_imagenes/Atracciones/centro%20aldea.webp');
html = html.replace(/nereidas_imagenes\/Atracciones\/Querandi\.jpeg/g, 'nereidas_imagenes/Atracciones/Querandi.webp');

// C. Reemplazar nereidas_imagenes/Servicios/*.jpg por .webp
html = html.replace(/nereidas_imagenes\/Servicios\/([a-zA-Z0-9_]+)\.(jpg|jpeg)/g, 'nereidas_imagenes/Servicios/$1.webp');

// D. Reemplazar fotos de Apartamentos en data-src por .webp con data-srcset responsivo
html = html.replace(/<img data-src="(nereidas_imagenes\/(Apart_[a-zA-Z_]+)\/([^"]+))\.(jpg|jpeg)" alt="([^"]*)" width="600" height="375">/g, (match, fullBase, apartDir, fileName, ext, alt) => {
  const webpSrc = `${fullBase}.webp`;
  const thumbSrc = `${fullBase}-thumb.webp`;
  return `<img data-src="${webpSrc}" data-srcset="${thumbSrc} 500w, ${webpSrc} 1000w" sizes="(max-width: 768px) 360px, 600px" alt="${alt}" width="600" height="375">`;
});

// E. Reemplazar en <picture> de portadas si queda algún .jpg o .jpeg
html = html.replace(/<img src="(nereidas_imagenes\/(Apart_[a-zA-Z_]+)\/([^"]+))\.(jpg|jpeg)" alt="([^"]*)" loading="lazy" width="600" height="375">/g, (match, fullBase, apartDir, fileName, ext, alt) => {
  const webpSrc = `${fullBase}.webp`;
  const thumbSrc = `${fullBase}-thumb.webp`;
  return `<img src="${thumbSrc}" srcset="${thumbSrc} 500w, ${webpSrc} 1000w" sizes="(max-width: 768px) 360px, 600px" alt="${alt}" loading="lazy" width="600" height="375">`;
});

// F. Google Fonts optimizado (pesos 400, 600, 700 para Montserrat; 600, 700 para Cormorant; Alex Brush; carga asíncrona sin doble link)
const oldFontsPattern = /<!-- ═══════════════════════════════════════════════\s*GOOGLE FONTS:[\s\S]*?<\/noscript>/;
const newFontsBlock = `<!-- ═══════════════════════════════════════════════
       GOOGLE FONTS: Carga asíncrona ultraliviana (pesos esenciales)
       ═══════════════════════════════════════════════ -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;600;700&display=swap" media="print" onload="this.media='all'">
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;600;700&display=swap">
  </noscript>`;

html = html.replace(oldFontsPattern, newFontsBlock);

// G. Pxsol Widget con defer
html = html.replace(
  '<script\n    src="https://pxsol-search-insert-widget.pages.dev/pxsol-search-widget.iife.js"',
  '<script\n    defer\n    src="https://pxsol-search-insert-widget.pages.dev/pxsol-search-widget.iife.js"'
);

// H. Google Maps Iframe: carga bajo demanda con IntersectionObserver para ahorrar 500 KB iniciales
const oldIframePattern = /<iframe class="map-embed" src="https:\/\/maps\.google\.com\/maps\?q=-37\.3277103,-57\.0202535&hl=es&z=16&output=embed" loading="lazy"([\s\S]*?)<\/iframe>/;
const newIframeBlock = `<iframe class="map-embed lazy-map" data-src="https://maps.google.com/maps?q=-37.3277103,-57.0202535&hl=es&z=16&output=embed" loading="lazy"$1</iframe>`;
html = html.replace(oldIframePattern, newIframeBlock);

fs.writeFileSync('index.html', html, 'utf8');
console.log('[OK] index.html actualizado con WebP, responsive srcset, Google Fonts optimizado, defer en PXSOL y lazy map.');

// 2. Actualizar js/app.js
let js = fs.readFileSync('js/app.js', 'utf8');

// A. Reemplazar iconos y fotos en WEB_HIGHLIGHTS_STORIES
js = js.replace(/img\/highlights\/([a-zA-Z0-9_]+)\.jpg/g, 'img/highlights/$1.webp');
js = js.replace(/nereidas_imagenes\/([a-zA-Z0-9_/ -]+)\.(jpg|jpeg)/g, 'nereidas_imagenes/$1.webp');

// B. Soportar data-srcset en hydrateGallery
const oldHydrate = `      const lazyImgs = gallery.querySelectorAll('img[data-src]');
      lazyImgs.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });`;

const newHydrate = `      const lazyImgs = gallery.querySelectorAll('img[data-src]');
      lazyImgs.forEach(img => {
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });`;
js = js.replace(oldHydrate, newHydrate);

// C. En modal thumbs, usar versión -thumb.webp para no descargar imágenes pesadas
const oldThumbs = `    thumbsEl.innerHTML = currentModalSlides.map((s, idx) => \`
      <button type="button" class="apt-modal-thumb-btn \${idx === currentModalSlideIndex ? 'is-active' : ''}" onclick="goToAptModalSlide(\${idx})" aria-label="Ver foto \${idx + 1}">
        <img src="\${s.src}" alt="\${s.alt}">
      </button>
    \`).join('');`;

const newThumbs = `    thumbsEl.innerHTML = currentModalSlides.map((s, idx) => {
      const thumbUrl = s.src.includes('-thumb.webp') ? s.src : s.src.replace(/(\.webp|\.jpg|\.jpeg)/i, '-thumb.webp');
      return \`
      <button type="button" class="apt-modal-thumb-btn \${idx === currentModalSlideIndex ? 'is-active' : ''}" onclick="goToAptModalSlide(\${idx})" aria-label="Ver foto \${idx + 1}">
        <img src="\${thumbUrl}" alt="\${s.alt}">
      </button>
    \`;
    }).join('');`;

js = js.replace(oldThumbs, newThumbs);

// D. Añadir lazy loader para el mapa de Google (IntersectionObserver)
if (!js.includes('initLazyMap')) {
  js += `\n
/**
 * 14. Carga bajo demanda del Mapa de Google (Ahorra ~500 KB iniciales)
 */
function initLazyMap() {
  const mapIframe = document.querySelector('iframe.lazy-map');
  if (!mapIframe) return;

  if ('IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (mapIframe.dataset.src) {
            mapIframe.src = mapIframe.dataset.src;
            mapIframe.removeAttribute('data-src');
          }
          observer.unobserve(mapIframe);
        }
      });
    }, { rootMargin: '300px' });
    mapObserver.observe(mapIframe);
  } else {
    mapIframe.src = mapIframe.dataset.src;
  }
}
document.addEventListener('DOMContentLoaded', initLazyMap);
`;
}

fs.writeFileSync('js/app.js', js, 'utf8');
console.log('[OK] js/app.js actualizado con soporte de srcset, thumbnails livianos en modal y lazy map observer.');
