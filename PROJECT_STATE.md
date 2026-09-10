# Estado del Proyecto - 2026-09-10 / Optimización de Apartamentos & Experiencia Visual

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`), JavaScript Vanilla ES6+ modular (sin dependencias pesadas ni frameworks externos).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js (scripts de automatización, validación y testing en scratch), Chrome DevTools / Puppeteer.
- **Integraciones & APIs Clave**:
  - **WhatsApp Click-to-Chat API** (`https://wa.me/5491158085444?text=...`): Para canal de reservas directas con mensaje contextual preconfigurado por unidad.
  - **IntersectionObserver API**: Para pausar y reanudar temporizadores de slideshow según la visibilidad real de cada tarjeta en el viewport.
  - **Page Visibility API** (`visibilitychange` / `document.hidden`): Para suspender timers cuando la pestaña no esté activa.
  - **Web Story Viewer** (`#web-story-modal`) y nuevo **Modal Popup de Ficha Descriptiva** (`#apartment-modal`).
  - **Google Fonts**: Tipografías corporativas "Playfair Display" (serif de lujo) y tipografía sans moderna de alta legibilidad.

## 2. Archivos Modificados / Creados Recientemente
- `PROJECT_STATE.md`: Archivo de verdad y protocolo de persistencia de estado del proyecto para checkpoints y reinicios.
- `index.html`: Reordenadas las fotografías de las 5 unidades en `.apartments-grid` (Apart Miel 8/9 pasa a 1ª; Apart Premium A 6/10 pasa a 1ª; Apart Premium B 5/7 pasa a 1ª; Apart Familiar A 7/10 pasa a 1ª; Apart Familiar B 9/10 pasa a 1ª), actualizadas las miniaturas del megamenú, incorporados badges `.gallery-expand-badge` y contenedor accesible `#apartment-modal`.
- `nereidas-demo.html`: Réplica espejo sincronizada 100% con `index.html`.
- `css/modern.css`: Estilos para hover zoom de fotos, badges `.gallery-expand-badge`, diálogo modal, lightbox con tira de miniaturas activas (`.apt-modal-thumbs`), especificaciones, amenidades, distribución y CTA de WhatsApp responsivo (móvil y escritorio).
- `nereidas-demo_files/modern.css`: Réplica espejo sincronizada 100% con `css/modern.css`.
- `js/app.js`: Slideshow automático cada 7 segundos (7000ms) con pausa en hover/touch, reseteo en clics manuales e `IntersectionObserver`. Funciones de modal `openApartmentModal`, `closeApartmentModal`, `navigateAptModalImage` y `setAptModalSlide` con extracción dinámica del DOM y navegación por teclado (Escape y flechas).
- `nereidas-demo_files/app.js`: Réplica espejo sincronizada 100% con `js/app.js`.

## 3. Decisiones de Arquitectura
- **Sincronización Dual Estricta**: Mantenimiento en paralelo de los archivos principales (`index.html`, `js/app.js`, `css/modern.css`) y sus copias de distribución/demo (`nereidas-demo.html`, `nereidas-demo_files/app.js`, `nereidas-demo_files/modern.css`) para evitar divergencias entre entornos.
- **Extracción Dinámica del DOM para el Modal Descriptivo**: El modal `#apartment-modal` extrae en caliente la información de la tarjeta que recibió el clic (título, capacidad, specs, amenidades, fotos y distribución), garantizando una única fuente de verdad en el HTML y eliminando duplicación de datos en JavaScript.
- **Slideshow de 7 Segundos con Lógica Senior UI/UX**:
  - Temporizador de `7000ms` por unidad con looping infinito suave al llegar al final del carrusel.
  - Pausa automática en hover (`mouseenter`), toque (`touchstart`) o pestaña en segundo plano (`document.hidden`).
  - Reseteo instantáneo del timer de 7 segundos ante cualquier interacción manual (clic en flechas prev/next o arrastre táctil).
  - Suspensión mediante `IntersectionObserver` cuando la tarjeta queda fuera de pantalla para ahorro de recursos y batería.
- **Accesibilidad y Patrón Light-Dismiss**: Cierre con tecla `Escape`, clic en backdrop con desenfoque, botón accesible "X", bloqueo de scroll de fondo (`body.apt-modal-open`) y navegación de fotos con flechas del teclado.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Reordenar fotos en las 5 unidades de apartamentos (Miel 8/9, Premium A 6/10, Premium B 5/7, Familiar A 7/10, Familiar B 9/10).
- [x] Sincronizar miniaturas del megamenú con las nuevas fotos principales.
- [x] Inyectar el contenedor `#apartment-modal` y badges `.gallery-expand-badge` en `index.html` y `nereidas-demo.html`.
- [x] Incorporar estilos CSS en `css/modern.css` y `nereidas-demo_files/modern.css` para el modal de ficha descriptiva, lightbox, tira de miniaturas (`apt-modal-thumbs`), badges flotantes y transiciones fluidas.
- [x] Implementar la lógica JavaScript en `js/app.js` y `nereidas-demo_files/app.js` (slideshow automático 7s con controles UX y funciones `openApartmentModal`, `closeApartmentModal`, `navigateAptModalImage`, `setAptModalSlide`).
- [x] Validar visualmente y funcionalmente mediante pruebas y capturas de pantalla en escritorio y dispositivos móviles.
- [ ] Commit y push a la rama `main` en Git.

## 5. Siguiente Acción Inmediata
- Realizar el commit y push a la rama `main` de Git con el mensaje descriptivo de las mejoras visuales, ordenamiento de fotos, slideshow de 7s y modal interactivo.
