# Estado del Proyecto - 2026-09-10 / Pop up al 80% del Área en Desktop, Eliminación de Filtros & Cache-Busting v2.7

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid bidimensional, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js (scripts de automatización, validación y headless testing), Google Chrome Headless.
- **Integraciones & APIs Clave**:
  - **Modal Pop-up Flotante de Apartamentos** (`#apartment-modal`):
    - **Desktop**: Dimensionado al 80% del área del viewport (`width: 80vw; max-width: 1400px; height: 82vh;`), con distribución en 2 columnas lado a lado (slideshow a la izquierda ocupando toda la altura disponible y ficha técnica/distribución a la derecha) calculada para visualización 100% libre de scrollbar.
    - **Mobile**: Tarjeta flotante centrada con halo glow dorado, pastillas de servicios en 2 filas exactas y tipografía compacta (-2px).
  - **Megamenús Desplegables PxNav**: Control interactivo dual (hover inteligente en desktop con debounce de 180ms + clic/tap en móvil y escritorio con cierre por tecla Escape y light-dismiss).
  - **Grilla de Apartamentos**: Acceso directo e inmediato a las 5 unidades sin filtros por capacidad ni botones "Todos los Apartamentos", garantizando una navegación fluida.

## 2. Archivos Modificados / Creados Recientemente
- `PROJECT_STATE.md`: Checkpoint actualizado con las dimensiones al 80% del área y eliminación de filtros.
- `index.html`: 
  - Eliminado el contenedor `.apartments-filters` con los botones "Todos los Apartamentos", "Para Parejas (2 Pax)" y "Familias (4 a 6 Pax)".
  - Actualizado cache-busting de estilos y scripts a `?v=2.7`.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html`.
- `css/modern.css`: 
  - Modificado `.apt-modal-dialog` en Desktop para ocupar el 80% del área (`width: 80vw; max-width: 1400px; height: 82vh; max-height: 86vh;`).
  - `.apt-modal-gallery` y `.apt-modal-viewport` configurados con `flex: 1; min-height: 0;` para expandir la fotografía a gran escala ocupando la altura del 80%.
  - Reajustados márgenes y rellenos internos en `.apt-modal-content` (`padding: 14px 20px; gap: 9px;`) para certificar que el contenido de todas las unidades (incluyendo las de dos plantas) se muestre con cero scrollbar.
- `nereidas-demo_files/modern.css`: Réplica espejo sincronizada al 100% con `css/modern.css`.

## 3. Decisiones de Arquitectura
- **Ocupación del 80% del Área en Desktop**: La proporción `80vw` × `82vh` genera un marco perimetral simétrico de ~10% en los cuatro lados sobre el fondo oscuro difuminado (`backdrop-filter: blur(12px)`), magnificando la presencia visual de las fotografías del complejo sin invadir de borde a borde la pantalla.
- **Eliminación Total de Filtros en Ambas Versiones**: Al contar con una oferta exclusiva y curada de 5 unidades, la supresión de los filtros reduce la fricción de navegación, permitiendo al usuario explorar todas las opciones en un scroll natural continuo.
- **Cero Scroll Garantizado en 80% de Altura**: La calibración milimétrica de espaciados en la columna derecha asegura que incluso la ficha con mayor cantidad de datos (Apart Premium A con distribución de 2 plantas) mida ~418px de altura, quedando muy por debajo de los ~500-650px disponibles en el 82vh.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Ajustar pop-up de unidad en Desktop al 80% del área (`width: 80vw; height: 82vh`).
- [x] Eliminar filtros de unidades por cantidad de personas y "Todos los Apartamentos" en ambas versiones (Desktop y Mobile).
- [x] Certificar visualización con cero scroll en resoluciones de escritorio (1280x800, 1440x900).
- [x] Actualizar cache-busting a `v=2.7` en `index.html` y `nereidas-demo.html`.
- [x] Validar mediante suite de pruebas headless (0 errores, 100% pass).
- [ ] Commit y push a la rama `main` en Git.

## 5. Siguiente Acción Inmediata
- Realizar commit y push a `origin/main` en Git para desplegar la versión v2.7 a Vercel.
