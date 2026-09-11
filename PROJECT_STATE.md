# Estado del Proyecto - 2026-09-11 / Optimización Móvil Integral (Core Web Vitals & PageSpeed) & WebP Pipeline v3.0

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
  - **Cache-Busting**: Actualizado a `?v=3.0` en `css/modern.css` y `js/app.js`.

## 2. Archivos Modificados / Creados Recientemente
- `scripts/optimize_assets.cjs`: Script automatizado de generación de assets WebP y compresión de alta fidelidad con `sharp`.
- `index.html`: Implementación de preloads LCP, Google Fonts asíncrono, `<picture>` responsivos en Hero, Atracciones, Concepto y Apartamentos, logos optimizados y cache-busting `v=3.0`.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html`.
- `css/modern.css`: Estilos para `<picture>` en carruseles y mosaicos, más reglas de `content-visibility: auto;`.
- `nereidas-demo_files/modern.css`: Réplica espejo sincronizada al 100% con `css/modern.css`.
- `js/app.js`: Lógica de hidratación progresiva de slides para Hero y carruseles de apartamentos con soporte para `data-src`.
- `nereidas-demo_files/app.js`: Réplica espejo sincronizada al 100% con `js/app.js`.
- `favicon.png`, `favicon.ico`, `apple-touch-icon.png`: Reemplazados por versiones optimizadas de 1.4 KB y 7 KB.
- `PROJECT_STATE.md`: Registro del estado del proyecto tras la optimización móvil.

## 3. Decisiones de Arquitectura
- **Preservación de Activos Originales y Entrega Negociada en WebP**: Los archivos originales en JPEG/PNG se mantienen intactos en sus carpetas para asegurar la máxima calidad de archivo maestro, mientras que la web entrega versiones WebP optimizadas con fallback automático.
- **Hidratación Progresiva de Diapositivas**: En lugar de saturar el ancho de banda móvil con 46 imágenes de apartamentos y 5 fotos pesadas de cabecera en el arranque, la web carga únicamente las portadas iniciales y activa las secundarias de forma reactiva ante la interacción del huésped.
- **Paridad 1:1 Inquebrantable**: Mantenimiento sincrónico absoluto entre el archivo productivo `index.html` y la plantilla de demostración `nereidas-demo.html`.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Ejecutar script de procesamiento y compresión WebP (`scripts/optimize_assets.cjs`).
- [x] Implementar preload LCP y carga asíncrona de fuentes en `index.html` y `nereidas-demo.html`.
- [x] Implementar hidratación progresiva de slides en `js/app.js` y `nereidas-demo_files/app.js`.
- [x] Aplicar reglas de `content-visibility: auto;` y picture styles en CSS.
- [x] Reemplazar favicon y logos con versiones comprimidas y dimensiones explícitas.
- [x] Validar mediante suite automatizada (100% paridad, 0 errores 404, 100% pass).
- [x] Actualizar `PROJECT_STATE.md` con el hito v3.0.
- [ ] Realizar commit y push a la rama `main` en Git para desplegar a Vercel.

## 5. Siguiente Acción Inmediata
- Ejecutar `git add`, `git commit` y `git push origin main` para publicar en producción la versión v3.0 optimizada para PageSpeed Mobile.
