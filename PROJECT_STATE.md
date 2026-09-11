# Estado del Proyecto - 2026-09-11 / Auditoría Forense Google Travel & Enriquecimiento Schema.org

## 1. Stack & Configuración Activa
- **Framework/Entorno**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, CSS Grid bidimensional, Scroll-Snap nativo, Glassmorphism con `backdrop-filter`), JavaScript Vanilla ES6+ modular (cero dependencias externas, ultraliviano).
- **Entorno de Ejecución & Herramientas**: Windows PowerShell, Node.js, Google Chrome Headless, Git / GitHub, Vercel (CI/CD con HTTPS forzado y HTTP/2).
- **Integraciones & APIs Clave**:
  - **SEO Local & Datos Estructurados Schema.org (`@type: LodgingBusiness`)**:
    - NAP completo y validado: *"Apart Nereidas"*, `El Chajá y Querandíes`, `Mar de las Pampas`, `B7160`, Argentina.
    - Coordenadas geográficas exactas (`-37.3277103, -57.0202535`).
    - Horarios normativos hoteleros: Check-in `15:00`, Check-out `10:00`.
    - Capacidad declarada: `numberOfRooms: 5`.
    - Catálogo de servicios auditado: Piscina climatizada, Servicio de playa, Wi-Fi gratis, Desayuno incluido, Parrilla individual, Estacionamiento propio.
  - **Modal Pop-up Flotante de Apartamentos** (`#apartment-modal`): 80% de área en Desktop sin scrollbar, halo glow dorado y 2 filas de pastillas en Mobile.
  - **Estrategia Google Travel & Desintermediación**: Documentación y directrices de conexión ARI (Google Free Booking Links) para canalizar reservas directas a comisión 0%.

## 2. Archivos Modificados / Creados Recientemente
- `AUDITORIA_GOOGLE_TRAVEL.md`: Archivo maestro de conocimiento con el análisis forense, diagnóstico de GBP, comparativa de comisiones OTAs vs. Web Oficial, requerimientos técnicos de Google Hotel Center y hoja de ruta en 3 fases.
- `index.html`: Enriquecimiento del bloque `<script type="application/ld+json">` con `streetAddress`, `postalCode`, `checkinTime`, `checkoutTime` y `numberOfRooms`.
- `nereidas-demo.html`: Réplica espejo sincronizada al 100% con `index.html`.
- `PROJECT_STATE.md`: Registro del estado del proyecto tras la integración de la auditoría y actualización del marcado estructurado.

## 3. Decisiones de Arquitectura
- **Persistencia de Inteligencia Estratégica en el Repositorio**: La creación de `AUDITORIA_GOOGLE_TRAVEL.md` garantiza que todo el análisis de posicionamiento en Google Travel, comisiones de OTAs y requisitos técnicos de conexión ARI quede documentado y versionado para futuras iteraciones del motor de reservas.
- **Alineación de Semántica Web con Estándares de Google Travel**: La inclusión de `checkinTime`, `checkoutTime`, `streetAddress` y `postalCode` en el JSON-LD optimiza el scoring de exhaustividad de los rastreadores de Google, facilitando la futura vinculación de Google Hotel Center con la ficha del establecimiento.
- **Paridad 1:1 Inquebrantable**: Mantenimiento sincrónico absoluto entre el archivo productivo `index.html` y la plantilla de demostración `nereidas-demo.html`.

## 4. Tareas Pendientes (Backlog Inmediato)
- [x] Procesar y estructurar el reporte forense en `AUDITORIA_GOOGLE_TRAVEL.md`.
- [x] Enriquecer el marcado Schema.org JSON-LD en `index.html` y `nereidas-demo.html`.
- [x] Verificar consistencia de código y sintaxis JSON-LD.
- [x] Actualizar `PROJECT_STATE.md` con el nuevo hito.
- [ ] Realizar commit y push a la rama `main` en Git para desplegar a Vercel.
- [ ] **Acción Externa (Propietario / GBP)**: Reclasificar categoría primaria a "Apart-hotel" y completar los 12 atributos hoteleros en Google Business Profile.
- [ ] **Acción Futura (Fase 3)**: Evaluar e integrar motor transaccional con feed ARI certificado para activar el botón gratuito "Sitio Oficial" en Google Travel.

## 5. Siguiente Acción Inmediata
- Ejecutar `git add`, `git commit` y `git push origin main` para consolidar los cambios en el repositorio remoto y actualizar el deploy en producción.
