# Estado del Proyecto - 2026-09-27 / Versión Final Productiva v4.2 (High-Performance Release)

## 1. Stack & Arquitectura Activa
- **Entorno Productivo**: Hosting DonWeb / Ferozo (Apache Server en `apartnereidas.com.ar`), Git Deployment automático desde GitHub (`main` -> `public_html/`). Desacoplado 100% de Vercel.
- **Frontend Core**: HTML5 semántico, CSS3 moderno modular (Variables CSS, Flexbox, Grid bidimensional, `content-visibility: auto`, `@media (max-width: 768px)` unificado), JavaScript Vanilla ES6+ ultraliviano (< 35 KB). Cero dependencias externas en tiempo de ejecución.
- **Estructura de Ramas**:
  - `main`: Versión final productiva limpia para el dominio comercial, optimizada en WebP, sin remanentes de simuladores, demos ni dependencias de Vercel.

## 2. Los 6 Cambios de Mayor Impacto Implementados (v4.2)

1. **Optimización Masiva de Imágenes (100% WebP)**:
   - 108 imágenes convertidas y recomprimidas a formato WebP moderno con Sharp.
   - Reducción de más de 20 MB originales a ~9 MB en disco, con reducciones de hasta -95% en imágenes críticas:
     - `senderos del bosque`: 4.54 MB -> 259 KB (Desktop) y 62 KB (Mobile).
     - `Querandi`: 739 KB -> 37 KB (Desktop) y 13 KB (Mobile).
     - Portadas Hero 01–05: ~650 KB c/u -> ~200 KB c/u (-68%).
   - Se eliminaron todos los enlaces a `.jpg`/`.jpeg` en la carga del sitio; únicamente se preservaron en metadatos OpenGraph para compatibilidad con rastreadores de WhatsApp/redes sociales.

2. **Servir Tamaños según Pantalla (Responsive `srcset` y Miniaturas)**:
   - 68 miniaturas responsivas generadas (`*-thumb.webp` a 500px de ancho) para todas las unidades de apartamentos.
   - Atributos `data-srcset` y `sizes="(max-width: 768px) 360px, 600px"` aplicados en todas las galerías de apartamentos: los celulares ahora descargan imágenes de 15–25 KB en lugar de fotos de 1200px.
   - Tira de miniaturas del modal interactivo (`.apt-modal-thumbs`) adaptada para consumir directamente `-thumb.webp`, ahorrando más de 500 KB al abrir la ficha de una unidad.
   - Hero y Atracciones con `<picture>` responsivo sirviendo versiones `-mobile.webp` en pantallas `<= 768px`.

3. **Google Fonts Ultraliviano y No Bloqueante**:
   - Reducción de 11 pesos/estilos innecesarios a solo los 5 pesos esenciales que realmente se consumen:
     - Montserrat: 400, 600, 700.
     - Cormorant Garamond: 600, 700.
     - Alex Brush: 400.
   - Eliminación de preload duplicado y links bloqueantes; carga asíncrona mediante `media="print" onload="this.media='all'"` con `font-display: swap`.

4. **Widget de Reservas PXSOL No Bloqueante**:
   - Se agregó el atributo `defer` al script del widget oficial de PXSOL (`pxsol-search-widget.iife.js`), liberando el parseo inicial del DOM y evitando el bloqueo del hilo principal.

5. **Mapa de Google Embebido en Modo Facade Lazy**:
   - El `<iframe>` de Google Maps se convirtió en un componente `lazy-map` con `data-src` hidratado dinámicamente mediante `IntersectionObserver` con margen de anticipación de 300px.
   - Se ahorran ~500 KB de scripts de terceros de Google Maps para todos los visitantes que no hagan scroll hasta el pie de la web.

6. **Estrategia de Caché Avanzada en `.htaccess`**:
   - Archivos estáticos inmutables con versión (CSS, JS, WebP, fuentes, logos): `max-age=31536000, public, immutable` (1 año de caché de máximo rendimiento).
   - Documento HTML (`index.html`): `no-cache, no-store, must-revalidate` con `Expires: 0` para asegurar despliegues instantáneos sin retención de caché en navegadores.
   - Versión de activos actualizada a `modern.css?v=4.2` y `app.js?v=4.2`.

## 3. Depuración y Saneamiento del Repositorio
- Eliminación de `vercel.json` y del directorio `api/` (función serverless del simulador viejo).
- Eliminación de la carpeta `Logo/` con 2.5 MB de borradores preliminares huérfanos.
- Eliminación de la carpeta raíz obsoleta `highlights/` y scripts/archivos de desarrollo no productivos (`faivcon nuevo.jpeg`, `image.png_...`, `download_images.py`, `AUDITORIA_GOOGLE_TRAVEL.md`).
- Repositorio limpio y sincronizado en la rama `main`.
