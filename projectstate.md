# PROJECT STATE & CONTEXT MEMORY — APART NEREIDAS

### 1. VISIÓN GENERAL Y TECH STACK
- **Propósito**: Sitio web comercial de alta conversión y experiencia boutique para Apart Hotel Nereidas en Mar de las Pampas, con catálogo de unidades, consulta directa por WhatsApp y motor de reservas integrado.
- **Tech Stack**: HTML5 semántico nativo, CSS3 plano/puro (Custom Properties, Flexbox, CSS Grid, Scroll-Snap, Glassmorphism, `content-visibility: auto`), JavaScript Vanilla puro (ES6+, sin bundlers ni frameworks externos).

---

### 2. ARQUITECTURA DE ARCHIVOS Y RUTAS
- `index.html` -> Página principal (Single Page Application arquitectada en HTML5). Controlada por `js/app.js?v=4.9` y estilizada por `css/modern.css?v=4.9`.
- `403.html` -> Página de error de acceso prohibido con diseño corporativo y navegación de retorno.
- `404.html` -> Página de error de recurso no encontrado con enlaces directos al inicio y WhatsApp.
- `500.html` -> Página de error interno del servidor con opciones de contacto directo.
- `.htaccess` -> Configuración Apache de producción: redirección canónica HTTPS, compresión GZIP y directivas de caché (HTML revalidado al instante, estáticos 1 año inmutable).
- `scripts/` -> Herramientas CLI Node.js para procesamiento de imágenes con Sharp (`convert_all_to_webp.cjs`, `generate_thumbs.cjs`, `optimize_assets.cjs`).

---

### 3. CONEXIONES Y SCRIPTS (DATA & LOGIC FLOW)
- **Comunicación y Flujo JS**: 
  - Archivo único `js/app.js` modular y auto-contenido, organizado funcionalmente sin dependencias ni compiladores.
  - Inicialización centralizada vía evento `DOMContentLoaded`.
  - Exposición controlada al objeto global `window` únicamente para handlers inline requeridos por el DOM (`openApartmentModal`, `closeApartmentModal`, `setHeroSlide`, `nextHeroSlide`, `openWebStoryDirect`, etc.).
  - Uso de listeners pasivos (`{ passive: true }`) en scroll y touch para garantizar fluidez a 60 fps.
- **Origen y Persistencia de Datos**:
  - **DOM como Single Source of Truth**: Los datos de especificaciones, ambientes, amenities y fotos de los apartamentos residen en el HTML semántico de cada `.apartment-card` y son parseados dinámicamente al abrir el modal descriptivo.
  - **Estructuras en Memoria**: `WEB_HIGHLIGHTS_STORIES` en `js/app.js` suministra los títulos, iconos WebP, rutas de fotos y descripciones del visor interactivo de historias de servicios.
  - **Motor de Reservas Externo**: Script IIFE oficial de PXSOL (`pxsol-search-widget.iife.js`) cargado con `defer`, inyectado en `#buscador-pxsol` y parametrizado con `data-product-id="27792"` y `data-pos="NereidasApartMardelasPampas"`.
  - **Conversión a WhatsApp**: Generación dinámica de URLs codificadas (`encodeURIComponent`) con el detalle de fechas, cantidad de huéspedes y tipo de consulta dirigidas al número oficial `+5492255415282`.
  - **Lazy Loading**: `IntersectionObserver` desacoplado para hidratar imágenes con `data-src`/`data-srcset` y el `<iframe>` del mapa de Google solo cuando entran en el viewport.

---

### 4. ESTADO DE DESARROLLO ACTUAL
- **[COMPLETO]**:
  - Landing completa y responsiva: Hero con slideshow de 5 diapositivas y controles táctiles, sección Concepto, Paseos y Atracciones con `<picture>` responsivo, Grilla de 12 Servicios oficiales con pop-up de historias, Acordeón FAQ y formularios.
  - Módulo de 5 Apartamentos boutique con carruseles nativos táctiles (`scroll-snap`), contador dinámico y Modal Lightbox con ficha técnica y distribución de plantas.
  - Barra flotante de disponibilidad fija al pie (`bottom: 15px !important`), adaptada en mobile a dos filas (triggers compactos en una sola línea y botón Buscar inferior al 100%), alineada con el botón flotante de WhatsApp a exactamente 15px del margen inferior de la pantalla en desktop.
  - Panel desplegable de fechas/pasajeros de PXSOL anclado por encima de la barra flotante (`bottom: 92px !important; top: auto !important; left: 50%; transform: translateX(-50%)` en Desktop, `bottom: 116px !important` en Mobile) con altura compacta (~360px) y `max-height: calc(100dvh - 165px); overflow-y: auto`. Esto garantiza que los controles del calendario (CHECK-IN / CHECK-OUT, botón "Listo", selector "Ajustar noches") queden 100% visibles y nunca sean tapados por el pie ni colisionen con la barra de navegación superior. Mensajes y alertas de validación (`.pxsol-search-message`, `.pxsol-search-error`) flotan por encima de la barra.
  - Botón flotante de WhatsApp alineado a `bottom: 15px !important` en Desktop (al mismo nivel visual que la barra de búsqueda) y a `bottom: 120px` en mobile para flotar holgadamente sobre la barra de búsqueda móvil de 2 niveles.
  - Suite de rendimiento WebP: 100% de imágenes de la web migradas a WebP con ahorro global superior al 55% y versiones responsivas `-thumb.webp` de 500px para miniaturas.
  - Iconografía de Servicios: 12 iconos WebP en `img/highlights/` sincronizados y trackeados en Git (corregida regla de `.gitignore` que omitía la carpeta).
  - Carga optimizada de Google Fonts: reducida a 5 pesos estrictamente utilizados con carga asíncrona no bloqueante.
  - Carga diferida (`defer`) del widget externo de PXSOL y facade lazy con `IntersectionObserver` para el mapa de Google.
  - Política de caché configurada en `.htaccess` (HTML siempre fresco; imágenes, CSS, JS y fuentes inmutables por 1 año).
  - Desvinculación de Vercel y depuración de código muerto, simulador de Instagram y borradores preliminares.
  - Identidad & Favicon: Nuevo isotipo circular oficial integrado en todas las resoluciones (`favicon.png`, `favicon.ico` multi-resolución, `apple-touch-icon.png`) con versionado cache-buster `?v=2`.
  - Tarjeta de Previsualización Web (Open Graph & Twitter Cards): Nueva imagen oficial frente a la piscina (1200x675) en `img/og_preview.jpg` y texto comercial actualizado.
  - Barra de Búsqueda & Experiencia Móvil: Botón "Buscar" actualizado a color corporativo `#6e9db4`, calendario en mobile ajustado a vista compacta de 30 días (1 mes visible con navegación limpia), tipografía del Hero (H1 título a 1.72rem/1.48rem y H2/H3 descripción a 0.90rem/0.84rem) re-equilibrada para legibilidad premium y remoción limpia de las barras indicadoras de slides (`#hero-indicators`) dejando la transición de fondo despejada.
  - Despliegue continuo activo: `git push origin main` -> sincronización inmediata con DonWeb / Ferozo (`public_html/`).
- **[EN PROGRESO]**:
  - Auditoría de métricas Core Web Vitals en campo (LCP, INP, CLS) bajo la nueva entrega de assets WebP.
  - Validación continua de compatibilidad de fechas en motores de búsqueda PXSOL en distintos dispositivos móviles.
- **[BACKLOG]**:
  - Soporte multilingüe estructurado (i18n: ES / EN / PT).
  - Integración de reseñas de Google Maps en tiempo real mediante API o microdatos enriquecidos adicionales.

---

### 5. REGLAS TÉCNICAS CRÍTICAS (CONSTRAINTS)
- **Reglas de Estilos (CSS)**:
  - Todo estilo debe residir en `css/modern.css`, excepto overrides específicos para widgets inyectados externamente que requieran precedencia de especificidad en `<style id="pxsol-mobile-override">`.
  - Prohibido el uso de frameworks CSS (Bootstrap, Tailwind, etc.). Mantener CSS puro con variables en `:root`.
  - Construir layouts únicamente con Flexbox y CSS Grid. Prohibido el uso de `float` o tablas para estructura.
  - Mobile-First con breakpoint estandarizado en `@media (max-width: 768px)` y soporte para pantallas grandes en `@media (min-width: 992px)` y desktop centrado al 80%.
  - Toda modificación en la barra flotante de reservas debe respetar `bottom: 5px` y preservar la separación táctil del botón de WhatsApp.
- **Reglas de JavaScript (JS)**:
  - Prohibido el uso de librerías o dependencias externas (sin jQuery, sin React, sin Lodash). JavaScript Vanilla ES6+ nativo únicamente.
  - Nomenclatura estricta en `camelCase` para variables y funciones; `UPPER_SNAKE_CASE` para constantes de configuración.
  - Mantener las funciones de manipulación del DOM aisladas y modulares; no acoplar lógica de negocio con renderizado.
  - Utilizar delegación de eventos y listeners pasivos siempre que se escuche `scroll`, `touchstart` o `touchmove`.
  - Cualquier nueva imagen agregada a carruseles o galerías debe implementar `data-src` con formato `.webp` y versionado responsivo.
- **Reglas de Despliegue & Git**:
  - La rama `main` es el canal de producción directo. Cada `git push origin main` se refleja en vivo en DonWeb / Ferozo.
  - No generar archivos de configuración para Vercel ni reintroducir carpetas no productivas (`api/`, `Logo/`, `highlights/`).
  - Cada vez que se modifique `css/modern.css` o `js/app.js`, incrementar el parámetro de versión (`?v=X.X`) en `index.html` para invalidar la caché del navegador de los usuarios de forma determinista.
