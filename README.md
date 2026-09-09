# Apart Nereidas — Mar de las Pampas

Plataforma web y suite de presentación digital para **Apart Nereidas**, complejo boutique ubicado entre el mar y el bosque en Mar de las Pampas, Provincia de Buenos Aires, Argentina.

---

## 🌐 Módulos del Proyecto

### 1. Web Demo Oficial (`index.html` y `nereidas-demo.html`)
- **Cabecera Flotante con Megamenús**:
  - **Apartamentos**: Fichas visuales con las 5 unidades disponibles (Apart Miel, Apart Premium A, Apart Premium B, Apart Familiar A, Apart Familiar B), badges de capacidad, especificaciones y enlace a reserva directa.
  - **Servicios**: 16 categorías oficiales distribuidas en 2 filas de 8 tarjetas compactas, con iconos en miniatura circulares (`img/highlights/`) y apertura de pop-up interactivo de historias con fotos en alta definición.
- **Hero Interactivo**: Carrusel fotográfico del complejo con transición suave y barra de reserva rápida con redirección desde el megamenú.
- **Secciones Integradas**:
  - *El Complejo*: Propuesta de desconexión y hospitalidad atendida por sus propios dueños.
  - *Paseos*: Puntos de interés de Mar de las Pampas (Playas amplias, senderos del bosque, centro de aldea y Faro Querandí).
  - *Ubicación*: Mapa interactivo y coordenadas geográficas exactas.
  - *Preguntas Frecuentes (FAQ)*: Acordeón interactivo con políticas de estadía, piscina, desayuno y check-in.
  - *Footer*: Contacto directo, acceso a redes sociales y formulario de suscripción.

### 2. Simulador Móvil de Instagram (`instagram/index.html`)
- **Simulador de Perfil**: Mockup de smartphone con feed interactivo @nereidasapart.
- **Muestras A y B**:
  - *Muestra A*: Estilo Revista & Editorial.
  - *Muestra B*: Paleta Mar Profundo.
- **Herramientas de Personalización**:
  - Drag & Drop interactivo para reordenar casilleros del feed.
  - Selector y carga de fotos desde explorador local o galería de 94 fotos reales del complejo.
  - Paleta de color interactiva con previsualización en tiempo real.

---

## 📁 Estructura del Repositorio

```
.
├── css/
│   ├── modern.css           # Estilos principales de la web demo
│   └── ...
├── js/
│   └── app.js               # Lógica interactiva de historias, reservas y menús
├── img/
│   └── highlights/          # Iconos y portadas de servicios oficiales
├── instagram/
│   ├── index.html           # Simulador móvil interactivo
│   └── ...
├── nereidas_imagenes/       # Banco fotográfico en alta resolución
│   ├── Apart_Familiar_A/
│   ├── Apart_Familiar_B/
│   ├── Apart_Miel/
│   ├── Apart_Premium_A/
│   ├── Apart_Premium_B/
│   ├── Atracciones/
│   ├── Portada/
│   └── Servicios/
├── index.html               # Página principal
├── nereidas-demo.html       # Réplica demo completa
├── logo.png                 # Logotipo oficial
└── README.md                # Documentación del proyecto
```

---

## 🚀 Visualización Local

Para visualizar el proyecto localmente, podés abrir directamente `index.html` o servirlo mediante cualquier servidor HTTP:

```bash
# Opción con Node.js (npx serve)
npx serve .

# Opción con Python
python -m http.server 8080
```

Luego abrir en el navegador: [http://localhost:8080](http://localhost:8080).

---

© 2026 Apart Nereidas — Mar de las Pampas.
