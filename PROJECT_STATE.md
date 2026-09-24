# Estado del Proyecto - 2026-09-24 / Versión Final Productiva v4.0 & Rama Demo en GitHub

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid bidimensional, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`, `content-visibility: auto`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano, reducido a < 34 KB).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js v22, Google Chrome Headless, Git / GitHub, Vercel & Hosting DonWeb / Ferozo.
- **Estructura de Ramas**:
  - `main`: Versión final productiva limpia para el dominio comercial (sin barra de muestras superior, optimizada y libre de código muerto).
  - `version-demo`: Versión de presentación completa (conserva la barra superior `.demo-top-switcher-bar`, el enlace al simulador móvil de Instagram y las herramientas de muestra).

## 2. Optimizaciones Críticas Realizadas en v4.0
1. **Transición a Versión Productiva**:
   - Eliminación de la barra superior de muestras (`.demo-top-switcher-bar`) de `index.html`.
   - Reajuste de la variable CSS `--demo-top-height: 0px` por defecto, permitiendo que el header, el menú lateral y el hero ocupen el 100% superior sin ningún salto o margen negro de 42px.
   - Activación condicional (`body:has(.demo-top-switcher-bar)` y `body.has-demo-bar`) para cuando se acceda a la versión de demostración.
2. **Slideshow de Portada (Hero)**:
   - Incorporación de flechas de navegación lateral táctiles y accesibles (`.hero-arrow-prev`, `.hero-arrow-next`) con diseño glassmorphic y control por teclado.
   - Reajuste tipográfico en Hero Title (H1) y Subtitle (H2): reducción armónica de 4px en desktop, tablet y mobile para maximizar la legibilidad y visibilidad del paisaje natural de fondo.
3. **Depuración Integral de Scripts y Código Muerto**:
   - Eliminación de más de 480 líneas de código obsoleto e inerte (`HIGHLIGHTS_DATA`, listeners huérfanos a `stories-track`).
   - Eliminación del bloque inline `<script>` duplicado al final del documento que re-declaraba `toggleAptCollapse`.
   - Consolidación de 8 event listeners redundantes de `visibilitychange` en 1 único listener pasivo optimizado para toda la galería.
   - Eliminación de consultas innecesarias al DOM (`minimizeBtn`, `pill`) en la barra flotante de reservas.
   - Reemplazo de alerta nativa bloqueante `alert()` en el newsletter por feedback visual dinámico no intrusivo en el botón.
   - Cache-busting actualizado a `?v=4.0` en `modern.css` y `app.js`.

## 3. Archivos Modificados
- `index.html`: Versión final productiva sin barra de muestras, con flechas de hero, H2 semántico y scripts optimizados v4.0.
- `nereidas-demo.html`: Versión demo con soporte de barra superior preservada y clase `.has-demo-bar`.
- `css/modern.css`: Estilos de flechas de hero, reducción tipográfica -4px y `--demo-top-height: 0px` condicional.
- `nereidas-demo_files/modern.css`: Réplica espejo sincronizada.
- `js/app.js`: Código saneado, modularizado, reducido de 1354 a 857 líneas sin código muerto.
- `nereidas-demo_files/app.js`: Réplica espejo sincronizada.
- `PROJECT_STATE.md`: Documentación de release v4.0.

## 4. Estrategia de Despliegue en DonWeb / Ferozo Hosting
- **Opción Recomendada: Git Deployment (Panel Ferozo / Git)**
  - Repositorio: `https://github.com/gonzaloestebansosa-spec/nereidas.git`
  - Rama a desplegar: `main`
  - Directorio destino: `public_html/`
  - Beneficios: Despliegue en 1 clic, historial inmutable, sin riesgo de archivos corruptos o subidas incompletas.
- **Opción Alternativa: FTP (FileZilla / WinSCP)**
  - Host: Servidor FTP de DonWeb
  - Directorio destino: `public_html/`
  - Riesgo: Subida manual propensa a omisión de archivos multimedia grandes.
