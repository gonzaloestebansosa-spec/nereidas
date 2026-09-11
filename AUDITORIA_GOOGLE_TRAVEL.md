# Auditoría Forense y Plan de Optimización: Nereidas Apart en Google Travel

**Fecha de Registro:** 2026-09-11  
**Estado:** Activo / Base de Conocimiento para Decisiones Comerciales y Técnicas  
**Objetivo Estratégico:** Reducir la dependencia de OTAs (Booking.com, Agoda), activar el botón gratuito "Sitio Oficial" (Google Free Booking Links) y maximizar la conversión de reservas directas.

---

## 1. Resumen Ejecutivo & Diagnóstico de Cuellos de Botella

Nereidas Apart cuenta con ventajas competitivas clave para el viajero de Mar de las Pampas: proximidad al mar (~100–150 m), bosque nativo, unidades amplias de 2 a 6 plazas (parejas y familias), decks con parrillas individuales y piscina climatizada.

Sin embargo, en el ecosistema digital de Google se identificaron tres cuellos de botella críticos:

| Cuello de Botella | Situación Identificada | Estado en Proyecto Actual / Solución |
| :--- | :--- | :--- |
| **1. Google Business Profile (GBP)** | Categorización incorrecta ("Alquiler vacacional" en vez de "Apart-hotel") y atributos hoteleros omitidos. | **Acción externa**: Reclasificar categoría en GBP y completar los 12 atributos hoteleros clave. |
| **2. Vulnerabilidad y Semántica Web** | La web histórica operaba sobre HTTP no seguro y sin datos estructurados Schema.org. | **Resuelto en código nuevo**: Despliegue seguro HTTPS en Vercel, Core Web Vitals optimizados, SPA Vanilla ES6+ y Schema.org `LodgingBusiness` inyectado. |
| **3. Fuga de Comisiones hacia OTAs (15%-22%)** | Ausencia del botón directo "Sitio Oficial" en Google Travel. Todo el tráfico de precios es capturado por Booking.com / Agoda. | **Fase de Integración**: Se requiere motor de reservas transaccional con Deep Link y conexión ARI (Availability, Rates & Inventory) vía Channel Manager/PMS certificado. |

---

## 2. Diagnóstico Detallado: Google Business Profile (GBP) & Maps

### 2.1. Categoría Primaria y Secundarias (Elegibilidad en Google Travel)
- **Problema:** Si la categoría principal en GBP no es hotelera, el algoritmo de Google Travel excluye automáticamente la ficha de los resultados verticales (`google.com/travel/hotels`).
- **Configuración Requerida:**
  - **Categoría Primaria (Obligatoria):** `Apart-hotel` (o `Hotel`).
  - **Categorías Secundarias:** `Complejo hotelero`, `Hostería` o `Cabañas`.

### 2.2. Atributos Hoteleros Específicos (Google Hotel Attributes)
Configuración de metadatos en la pestaña de servicios hoteleros de GBP:
- **Horarios Normativos:** Check-in (`15:00 hs`) y Check-out (`10:00 hs`). Crucial para el scoring de exhaustividad de Google.
- **Piscina:** Marcar *"Piscina al aire libre"* y *"Climatizada"*.
- **Estacionamiento:** Especificar *"Estacionamiento privado gratuito descubierto"*.
- **Parrilla:** Declarar *"Parrilla / Asador individual por unidad"*.
- **Mascotas:** Definir política explícita sobre admisión o no admisión (filtro de alta tracción en Costa Atlántica).
- **Conectividad:** *"Wi-Fi gratuito en áreas comunes y habitaciones"*.
- **Accesibilidad:** Declarar accesos para personas con movilidad reducida en planta baja.

### 2.3. Curaduría Multimedia y Catálogo Visual
- Subir mínimo 25 a 30 fotografías en alta resolución (1920×1080 px mínimo) clasificadas bajo las etiquetas nativas de Google:
  1. *Habitaciones / Interiores:* 2 y 3 ambientes, sommiers, cocinas completas, hidromasaje.
  2. *Exteriores y Entorno:* Bosque nativo, decks privados, senderos de madera.
  3. *Piscina y Solárium:* Área de piscina climatizada y reposeras.
- Eliminar marcas de agua invasivas, bordes o fechas impresas que reducen visibilidad en el carrusel de Maps.

### 2.4. Gestión Activa de Reseñas (Social Proof & SEO Local)
- Protocolo de respuesta al 100% de opiniones recibidas en menos de 48 horas.
- Redacción estratégica que incorpore palabras clave semánticas: *"apart en Mar de las Pampas"*, *"cerca de la playa"*, *"apart con piscina climatizada y parrilla"*.

---

## 3. Diagnóstico Técnico de la Web Oficial & Estado Actual

### 3.1. Seguridad y Cifrado (HTTP vs HTTPS)
- **Diagnóstico:** El sitio anterior servía tráfico sobre HTTP sin TLS, generando advertencias de "Sitio no seguro" y penalizaciones de Google Travel.
- **Estado Actual:** El nuevo desarrollo está alojado en arquitectura moderna (Vercel) con certificado SSL automático, protocolo HTTP/2 y redirección HTTPS estricta obligatoria.

### 3.2. Rendimiento Móvil y Experiencia de Usuario (Core Web Vitals)
- **Diagnóstico:** Antiguo diseño en Bootstrap/PHP con sliders desactualizados y tiempos de carga lentos en redes móviles costeras.
- **Estado Actual:** Código Vanilla ES6+ sin librerías pesadas (<6KB JS), diseño 100% responsive, touch-targets >48px, carruseles fluidos con Scroll-Snap nativo y carga diferida (`loading="lazy"`).

### 3.3. Marcado Semántico Schema.org JSON-LD
Inyección y enriquecimiento del bloque de metadatos estructurados para buscadores e IA:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Apart Nereidas",
  "description": "Apart hotel boutique en Mar de las Pampas con piscina climatizada, a 100 metros del mar y rodeado del bosque.",
  "image": "https://apartnereidas.com.ar/img/link_preview.jpg",
  "telephone": "+54 9 2255 45-8000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "El Chajá y Querandíes",
    "addressLocality": "Mar de las Pampas",
    "addressRegion": "Buenos Aires",
    "postalCode": "B7160",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -37.3277103,
    "longitude": -57.0202535
  },
  "url": "https://apartnereidas.com.ar/",
  "checkinTime": "15:00",
  "checkoutTime": "10:00",
  "numberOfRooms": 5,
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Piscina climatizada", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Servicio de playa con reposeras y sombrillas", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Wi-Fi gratis de alta velocidad", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Desayuno incluido", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Parrilla individual", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Estacionamiento propio", "value": true }
  ]
}
</script>
```

---

## 4. Desintermediación y Google Free Booking Links

### 4.1. Cuadro Comparativo del Escenario Comercial
```
┌─────────────────────────────────────────────────────────────────────────┐
│ FLUJO ACTUAL DE RESERVAS VÍA GOOGLE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Viajero busca "Nereidas Apart" en Google                                │
│   │                                                                     │
│   ├──> Tarifa Booking.com: $140.000 (Comisión retenida: $28.000 ~ 20%) │
│   ├──> Tarifa Agoda:       $142.000                                     │
│   └──> Sitio Oficial:      [ NO DISPONIBLE EN EL MÓDULO DE TARIFAS ]   │
└─────────────────────────────────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────────────────────────────────┐
│ FLUJO OBJETIVO CON GOOGLE FREE BOOKING LINKS                            │
├─────────────────────────────────────────────────────────────────────────┤
│ Viajero busca "Nereidas Apart" en Google                                │
│   │                                                                     │
│   ├──> [Sitio oficial] $125.000  (★ MEJOR PRECIO · COMISIÓN 0%)         │
│   ├──> Booking.com:    $140.000                                         │
│   │                                                                     │
│   └──> El clic dirige al huésped al motor directo con fechas ya cargadas│
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Los 3 Requisitos Tecnológicos Obligatorios para "Sitio Oficial"
1. **Google Business Profile Verificado:** Coincidencia exacta de NAP (Name, Address, Phone) entre la ficha y el motor.
2. **Motor de Reservas con Deep Linking:** URL de aterrizaje dinámico que recibe parámetros de Google: `?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&guests=2` y preselecciona la habitación sin requerir que el usuario vuelva a buscar.
3. **Conexión ARI (Availability, Rates & Inventory) Certificada:** Envío automático diario de tarifas y disponibilidad en tiempo real a Google Hotel Center mediante un PMS/Channel Manager homologado (ej. PXSol, WuBook/Zak, Cloudbeds, Octorate o Sinergia).

---

## 5. Hoja de Ruta de Implementación (Roadmap)

| Fase | Ámbito | Tareas Concretas | Plazo Estimado | Costo Estimado |
| :--- | :--- | :--- | :--- | :--- |
| **Fase 1** | **Google Business Profile** | • Cambiar categoría primaria a `Apart-hotel`.<br>• Cargar Check-in (15:00) y Check-out (10:00).<br>• Completar atributos (Piscina climatizada, Parrilla, Estacionamiento, Mascotas).<br>• Subir álbum fotográfico profesional clasificado por ambiente. | 48 - 72 horas | Nulo ($0) |
| **Fase 2** | **Web & SEO Estructurado** | • Verificar SSL activo (HTTPS forzado) en Vercel.<br>• Enriquecer Schema.org JSON-LD con dirección completa, horarios normativos y amenities.<br>• Mantener paridad responsive y velocidad móvil (<1.5s LCP). | Inmediato (1-2 días) | Ya absorbido en desarrollo web |
| **Fase 3** | **Google Hotel Center & Desintermediación** | • Evaluar y contratar motor transaccional con conexión ARI certificada por Google (ej. PXSol o WuBook).<br>• Conectar Google Free Booking Links.<br>• Configurar política de paridad tarifaria con ventaja de reserva directa (ej. 10% descuento o beneficios exclusivos en web oficial). | 2 a 3 semanas | Suscripción del motor de reservas seleccionado |

---

## 6. Siguientes Pasos Recomendados
1. **Acción Inmediata en Código:** Actualizar el bloque Schema.org en `index.html` y `nereidas-demo.html` incorporando los datos de dirección postal (`streetAddress`, `postalCode`) y horarios normativos (`checkinTime`, `checkoutTime`).
2. **Acción Inmediata del Propietario:** Acceder al panel de administración de Google Business Profile y ejecutar las configuraciones de la Fase 1.
3. **Planificación Estratégica:** Definir la plataforma de PMS/Channel Manager para implementar la Fase 3 y activar los enlaces gratuitos de reserva directa en Google.
