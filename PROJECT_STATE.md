# Estado del Proyecto - 2026-09-10 / Rediseño Pop up de Apartamentos (Desktop & Mobile Senior UI/UX) & v2.6

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid bidimensional, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js (scripts de automatización, validación y headless testing), Google Chrome Headless.
- **Integraciones & APIs Clave**:
  - **Modal Pop-up Flotante de Apartamentos** (`#apartment-modal`): Lógica adaptativa dual. En Desktop: 2 columnas lado a lado (slideshow a la izquierda, ficha descriptiva a la derecha) calculada para visualización 100% sin scrollbar. En Mobile: tarjeta flotante con efecto glow halo dorado, 2 filas exactas de pastillas de servicios y tipografía reducida (-2px).
  - **Megamenús Desplegables PxNav**: Control interactivo dual (hover inteligente en desktop con debounce de 180ms + clic/tap en móvil y escritorio con cierre por tecla Escape y light-dismiss).
  - **WhatsApp Click-to-Chat API**: Mensajes directos con mensaje contextual preconfigurado por unidad.
  - **IntersectionObserver API & Page Visibility API**: Control inteligente de rotación y pausa de timers de slideshow según visibilidad en pantalla y pestaña.

## 2. Archivos Modificados / Creados Recientemente
- `PROJECT_STATE.md`: Actualizado con las especificaciones de diseño, métricas de viewport y protocolo de persistencia.
- `css/modern.css`: 
  - Desktop: Transformado `.apt-modal-body` a grilla de 2 columnas (`480px 1fr`) con eliminación total de scroll vertical (`overflow: hidden`). Ajustados espaciados, tamaños de fuente y pastillas de servicios para encajar armónicamente en el viewport.
  - Mobile: Rediseñado el diálogo a pop-up flotante centrado con bordes redondeados (`border-radius: 18px`), nuevo estilo glow de lujo con halo dorado (`box-shadow: 0 0 0 1px rgba(197,160,89,0.5), 0 0 28px rgba(197,160,89,0.3), 0 20px 50px rgba(7,16,31,0.7)`), pastillas de servicios en 2 filas exactas (`grid-template-columns: repeat(3, minmax(0, 1fr))`) y textos reducidos en -2px.
  - Eliminados los botones inferiores ("Cerrar Ficha" y "Consultar por WhatsApp") con `.apt-modal-footer { display: none !important; }`.
- `nereidas-demo_files/modern.css`: Réplica espejo sincronizada al 100% con `css/modern.css`.
- `index.html`: Eliminado el bloque de pie de modal `.apt-modal-footer` y actualizado cache-busting a `?v=2.6`.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html`.

## 3. Decisiones de Arquitectura
- **Ajuste Dimensional Sin Scroll en Desktop**: Se calculó la altura total del modal (cabecera ~48px + cuerpo ~390px = ~438px) asegurando que el contenido descriptivo (especificaciones, 6 amenidades y distribución completa) conviva lado a lado con el carrusel fotográfico sin provocar scrollbar interno ni desbordar la pantalla del usuario.
- **Ajuste de 2 Filas en Pastillas Móviles**: Con 6 comodidades por unidad, la distribución en 3 columnas (`repeat(3, minmax(0, 1fr))`) garantiza matemáticamente una grilla balanceada de exactamente 2 filas horizontales sin saltos irregulares.
- **Reducción Tipográfica Uniforme (-2px)**: Aplicada en todos los elementos textuales de la ficha móvil (insignias, títulos, superficies, especificaciones y viñetas de distribución) para maximizar el área visible y mantener una proporción estética delicada.
- **Eliminación de Botones de Cierre y Consulta en el Modal**: Se suprimieron los botones inferiores para limpiar la vista. El cierre se realiza de forma limpia y accesible mediante el botón "X" superior derecho, clic en el fondo difuminado o tecla `Escape`.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Eliminar botones de cerrar fichas y consultar por WhatsApp en Desktop y Mobile.
- [x] Ubicar texto descriptivo a la derecha del slideshow de fotos en versión Desktop.
- [x] Ajustar pastillas de servicios y textos en Desktop para evitar scroll vertical.
- [x] Ajustar pastillas de servicios en exactamente 2 filas en versión Mobile.
- [x] Reducir tamaño de textos en -2px en versión Mobile.
- [x] Cambiar estilo del pop-up móvil a pop-up flotante con glow de halo dorado de lujo.
- [x] Actualizar cache-busting a `v=2.6` en `index.html` y `nereidas-demo.html`.
- [x] Validar con capturas visuales en resoluciones Desktop (1280x800) y Mobile (390x844 / 500x880) y tests automatizados (0 errores).
- [ ] Commit y push a la rama `main` en Git.

## 5. Siguiente Acción Inmediata
- Realizar commit y push a `origin/main` en Git para desplegar la versión v2.6 a Vercel con el nuevo diseño del pop up.
