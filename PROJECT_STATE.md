# Estado del Proyecto - 2026-09-10 / Resolución Megamenús Dropdown, Slideshow 7s & Cache-Busting v2.5

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js (scripts de automatización, validación y headless testing), Google Chrome Headless.
- **Integraciones & APIs Clave**:
  - **Megamenús Desplegables PxNav**: Control interactivo dual (hover inteligente en desktop con debounce de 180ms + clic/tap en móvil y escritorio con cierre por tecla Escape y light-dismiss).
  - **WhatsApp Click-to-Chat API** (`https://wa.me/5491158085444?text=...`): Canal de reservas directas con mensaje contextual preconfigurado por unidad.
  - **IntersectionObserver API**: Para pausar y reanudar temporizadores de slideshow según la visibilidad real de cada tarjeta en el viewport.
  - **Page Visibility API** (`visibilitychange` / `document.hidden`): Suspensión de timers cuando la pestaña pasa a segundo plano.
  - **Modal Popup de Ficha Descriptiva** (`#apartment-modal`): Extracción dinámica del DOM, lightbox interactivo, tira de miniaturas activas y control de teclado.

## 2. Archivos Modificados / Creados Recientemente
- `PROJECT_STATE.md`: Archivo de verdad y protocolo de persistencia de estado actualizado con el diagnóstico y resolución de scripts.
- `js/app.js`: Reconstruida la cadena de inicialización con `initAll()`, guard de `document.readyState`, ejecución segura `safeInit` individual por módulo para evitar bloqueos en cascada. Implementado `initPxNav()` con soporte dual hover/clic y debouncing de 180ms.
- `nereidas-demo_files/app.js`: Réplica espejo sincronizada al 100% con `js/app.js`.
- `index.html`: Agregado cache-busting `?v=2.5` a las etiquetas `<link rel="stylesheet" href="css/modern.css?v=2.5">` y `<script src="js/app.js?v=2.5"></script>` para evitar que Vercel o los navegadores sirvan archivos antiguos cacheados. Reordenamiento de fotos y modal de ficha descriptiva integrados.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html`.

## 3. Decisiones de Arquitectura
- **Inicialización Resiliente (`safeInit`)**: Todas las funciones de inicialización (`initHeaderScroll`, `initMobileDrawer`, `initApartmentGalleries`, `initApartmentFilters`, `initFaqAccordion`, `initBookingForm`, `initFloatingBookingBar`, `initNewsletterForm`, `initHighlightsStories`, `initPxNav`) se ejecutan a través de un wrapper `safeInit` con `try/catch` individual y verificación de `document.readyState`, impidiendo que cualquier excepción local en una sección interrumpa la inicialización de las demás.
- **Interacción Dual en Megamenús Dropdown (Senior UI/UX)**:
  - En dispositivos con ratón / puntero fino (`matchMedia('(pointer: fine)').matches`), los paneles de "Apartamentos" y "Servicios" se abren de forma inmediata al posar el cursor (`mouseenter`) y se cierran con un delay de 180ms (`mouseleave` con debounce) para permitir transiciones orgánicas entre el botón y el panel flotante.
  - En pantallas táctiles o móviles, la apertura se gestiona mediante toque (`click` / `tap`), alternando el estado activo del panel.
  - Se garantiza cierre por clic exterior fuera del header o paneles, clic en cualquier enlace interno y tecla `Escape`.
- **Estrategia de Cache-Busting para Producción**: Inyección de parámetros de versión (`?v=2.5`) en assets estáticos críticos (`modern.css` y `app.js`) garantizando invalidación de caché inmediata en CDN / Vercel sin depender de borrado manual de caché de navegador.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Reordenar fotos en las 5 unidades de apartamentos (Miel 8/9, Premium A 6/10, Premium B 5/7, Familiar A 7/10, Familiar B 9/10).
- [x] Sincronizar miniaturas del megamenú con las nuevas fotos principales.
- [x] Inyectar contenedor accesible `#apartment-modal` y badges `.gallery-expand-badge` en `index.html` y `nereidas-demo.html`.
- [x] Implementar slideshow automático de 7s con controles UX (pausa en hover/touch, IntersectionObserver y Page Visibility).
- [x] Diagnosticar y resolver causa raíz de megamenús dropdown inactivos en producción (restitución de cabecera de scripts y DOMContentLoaded robusto).
- [x] Agregar soporte dual de despliegue en megamenús (hover con debounce en desktop + clic en móvil).
- [x] Aplicar cache-busting `?v=2.5` en `index.html` y `nereidas-demo.html`.
- [x] Ejecutar pruebas headless exhaustivas en Chrome (0 errores JS en consola, apertura de dropdowns verificada, apertura y cierre de modal verificada).
- [ ] Commit y push a la rama `main` en Git.

## 5. Siguiente Acción Inmediata
- Realizar commit y push a `origin/main` en Git para desplegar la versión v2.5 a Vercel con todos los cambios y fixes activos.
