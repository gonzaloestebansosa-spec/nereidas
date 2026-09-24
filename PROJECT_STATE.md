# Estado del Proyecto - 2026-09-23 / Mapeo y Redirección de Servicios en Visor Interactivo (Web Story) v3.2

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid bidimensional, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`, `content-visibility: auto`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js v22, `sharp` (procesamiento y compresión de última generación), Google Chrome Headless, Git / GitHub, Vercel (CI/CD con HTTPS forzado y HTTP/2).
- **Visor Interactivo de Servicios (Web Story Modal)**:
  - Reestructurado a un set limpio de 12 servicios sincronizados 1:1 con la grilla de la sección `#servicios` y el Megamenú del encabezado.
  - Corrección de desfasaje de índices: cada tarjeta abre de forma unívoca su historia correspondiente (0 a 11).
  - Asignación de fotografías reales verificadas de alta definición para cada categoría desde `nereidas_imagenes/`.
  - Contador adaptativo ("1 de 12", "2 de 12", etc.) y textos descriptivos contextuales de alta conversión.
  - Cache-busting actualizado a `?v=3.2` en `index.html` y `nereidas-demo.html`.

## 2. Archivos Modificados / Creados Recientemente
- `js/app.js`: Reemplazo del arreglo `WEB_HIGHLIGHTS_STORIES` con los 12 servicios mapeados a sus fotos reales verificadas y textos descriptivos exactos.
- `nereidas-demo_files/app.js`: Réplica espejo sincronizada al 100% con `js/app.js`.
- `index.html`: Sincronización del modal por defecto, contador `1 de 12`, foto inicial `Desayuno.jpg` y actualización de script a `?v=3.2`.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html`.
- `scratch/verify_stories.cjs`: Script de validación de paridad 1:1 y verificación de presencia de activos en disco (12/12 activos confirmados).
- `scratch/capture_story_modal.cjs`: Test automatizado con Chrome Headless que valida la apertura y visualización correcta del modal.
- `PROJECT_STATE.md`: Registro del hito v3.2.

## 3. Decisiones de Arquitectura
- **Alineación 1:1 de Índices en Interacción UI**: Se eliminaron categorías desconectadas de la grilla principal (como WiFi Fibra, Tarifas sueltas, etc.) dentro del carrusel de historias, garantizando que el orden visual de las 12 tarjetas de la web se corresponda exactamente con la navegación secuencial del visor.
- **Fidelidad Visual Directa**: Cada servicio utiliza su foto maestra más representativa (ej. mesa servida real junto a la piscina para Desayuno, bicicletas blancas en deck para Bicicletas de Paseo, sommier King size y ropa blanca de hotelería para Ropa Blanca & Sommier, etc.).
- **Paridad 1:1 Inquebrantable**: Mantenimiento sincrónico absoluto entre el archivo productivo `index.html` y la plantilla de demostración `nereidas-demo.html`.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Analizar carpetas en `nereidas_imagenes` e inventariar fotos reales por categoría.
- [x] Rediseñar y alinear `WEB_HIGHLIGHTS_STORIES` con los 12 servicios de la grilla.
- [x] Asignar fotos reales y textos descriptivos a cada servicio en `js/app.js` y `nereidas-demo_files/app.js`.
- [x] Actualizar marcado modal y cache-busting `?v=3.2` en `index.html` y `nereidas-demo.html`.
- [x] Validar paridad 1:1 y existencia de activos mediante script automatizado (100% pass).
- [x] Verificar renderizado visual headless del modal interactivo (screenshots capturados).
- [x] Actualizar `PROJECT_STATE.md` con el hito v3.2.
- [ ] Realizar commit y push a la rama `main` en Git para desplegar a Vercel.

## 5. Siguiente Acción Inmediata
- Ejecutar `git add`, `git commit` y `git push origin main` para publicar en producción el nuevo mapeo del visor de servicios v3.2.
