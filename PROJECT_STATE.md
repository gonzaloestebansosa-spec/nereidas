# Estado del Proyecto - 2026-09-11 / Reajuste Tipografía Móvil Paseos & Overlay Fullwidth v3.1

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid bidimensional, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`, `content-visibility: auto`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js v22, `sharp` (procesamiento y compresión de última generación), Google Chrome Headless, Git / GitHub, Vercel (CI/CD con HTTPS forzado y HTTP/2).
- **Optimización de Rendimiento Móvil & Core Web Vitals (CWV)**:
  - **LCP (Largest Contentful Paint) Optimizado**:
    - Precarga prioritaria en `<head>` con `<link rel="preload" as="image" fetchpriority="high">` segmentada por media queries para móvil y desktop.
    - Etiqueta `<picture>` responsiva con entrega de `01-mobile.webp` (800px, 99 KB, ahorro del -84.6% respecto a los 644 KB originales).
  - **Eliminación de Recursos Render-Blocking (FCP)**:
    - Google Fonts cargado de forma asíncrona no bloqueante (`media="print" onload="this.media='all'"` con `<noscript>` fallback) y `font-display: swap`.
  - **Diferimiento Inteligente de Diapositivas Fuera de Pantalla**:
    - Slides 2 a 5 del Hero Slideshow implementados con `data-src` / `data-srcset` (hidratación bajo demanda antes de la transición o en estado idle de la red), ahorrando más de 2 MB en la ventana inicial de carga.
    - Slides 2 a N de las 5 tarjetas de apartamentos diferidos con `data-src` (hidratación por interacción, hover o scroll), evitando la descarga de 41 fotos secundarias al inicio.
  - **Compresión de Cuellos de Botella Críticos**:
    - `senderos del bosque.jpeg`: 4.54 MB → WebP Mobile de 62 KB (-98.6%).
    - `Querandi.jpeg`: 739 KB → WebP Mobile de 13 KB (-98.2%).
    - Favicon: 350 KB → PNG optimizado de 1.4 KB (-99.6%).
    - Logos (Navbar, Drawer, Footer): Reemplazados por variantes WebP y PNG optimizados con dimensiones explícitas `width` y `height` (`CLS = 0`).
  - **Contención de Renderizado en CSS**: `content-visibility: auto;` aplicado en secciones inferiores (`#atracciones`, `#ubicacion`, `#faq`, `.footer`).
  - **Cache-Busting**: Actualizado a `?v=3.1` en `css/modern.css` y `js/app.js`.

## 2. Archivos Modificados / Creados Recientemente
- `css/modern.css`:
  - Corrección de `.attraction-card picture` con `position: absolute !important; inset: 0 !important; z-index: 1 !important; width: 100% !important; height: 100% !important;` para que la imagen ocupe todo el fondo sin alterar el flex layout.
  - Asignación de `.attraction-overlay` con `position: relative !important; z-index: 2 !important; width: 100% !important;` y gradiente oscuro de alta legibilidad (`rgba(15, 25, 60, 0.95)` a transparente).
  - Calibración tipográfica móvil (`@media (max-width: 768px)`): títulos `0.85rem` (13.6px) y párrafos `0.68rem` (10.8px) con padding `8px 10px 10px`, garantizando que todo el contenido quede 100% visible dentro del marco de la tarjeta sin desbordamientos ni cortes.
- `nereidas-demo_files/modern.css`: Réplica espejo sincronizada al 100% con `css/modern.css`.
- `index.html`: Cache-busting actualizado a `?v=3.1` para asegurar actualización inmediata en navegadores de usuarios y evaluadores de PageSpeed.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html` (`?v=3.1`).
- `PROJECT_STATE.md`: Registro del estado del proyecto tras la resolución de Paseos móvil v3.1.

## 3. Decisiones de Arquitectura
- **Independencia de Capas en Tarjetas Grid**: Al utilizar `<picture>` dentro de un contenedor `display: flex; align-items: flex-end;`, el elemento `<picture>` debe posicionarse obligatoriamente de forma absoluta (`position: absolute; inset: 0`) para evitar que el motor de renderizado flexbox lo trate como un hermano en línea y empuje al overlay hacia un costado.
- **Tipografía y Legibilidad en 2 Columnas Móviles**: En grillas móviles de 2 columnas (~165-180px de ancho por tarjeta), los textos deben conservar proporciones compactas (títulos <= `0.85rem`, textos descriptivos <= `0.70rem`) con interlineado ceñido (`1.2` a `1.25`) para alojar hasta 4 líneas de descripción sin superar la altura fija de la tarjeta.
- **Paridad 1:1 Inquebrantable**: Mantenimiento sincrónico absoluto entre el archivo productivo `index.html` y la plantilla de demostración `nereidas-demo.html`.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Ejecutar script de procesamiento y compresión WebP (`scripts/optimize_assets.cjs`).
- [x] Implementar preload LCP y carga asíncrona de fuentes en `index.html` y `nereidas-demo.html`.
- [x] Implementar hidratación progresiva de slides en `js/app.js` y `nereidas-demo_files/app.js`.
- [x] Aplicar reglas de `content-visibility: auto;` y picture styles en CSS.
- [x] Reemplazar favicon y logos con versiones comprimidas y dimensiones explícitas.
- [x] Reparar maquetación y jerarquía tipográfica en sección Paseos móvil (`#atracciones`).
- [x] Validar mediante suite automatizada (100% paridad, 0 errores 404, screenshots verificados).
- [x] Realizar commit y push a la rama `main` en Git para desplegar a Vercel (completado en commit `eb66125`).

## 5. Siguiente Acción Inmediata
- Esperar feedback del usuario sobre nuevas revisiones o continuar con la optimización de SEO/Schema o auditoría de Google Travel.
