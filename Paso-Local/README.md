# 🎡 PasoLocal

App React + Vite para explorar **retos locales en Cancún**, escanear códigos QR en comercios y coleccionar sellos culturales. Todo funciona en el dispositivo, sin cuentas ni servidor.

## ✨ Características

- 🗺️ **Mapa interactivo** con Leaflet y OpenStreetMap, filtrable por modalidad.
- 🎯 **Retos y cápsulas culturales** de cada comercio.
- 📷 **Escáner QR** con cámara (html5-qrcode) y modo manual para probar en PC.
- 🎟️ **Códigos de canje diarios** determinísticos (SHA-256, con fallback para HTTP).
- 🏅 **Álbum de sellos** con progreso guardado en `localStorage`.
- 🏪 **Panel de comercio**: QR imprimible, código del día y validación en caja.
- 🎨 **Diseño retro pop cartoon**: paleta azul claro, amarillo y naranja, bordes gruesos, sombras duras, tipografía redondeada y animaciones.
- 📱 **Adaptable a móviles**: navegación táctil en cuadrícula, áreas seguras para pantallas con notch, mapa redimensionado y controles de 44 px.

## 🚀 Ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

## 📜 Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de producción |
| `npm run typecheck` | Verifica tipos con TypeScript |
| `npm run lint` | Analiza el código con Oxlint |

## 🧭 Modo demo

En la pantalla **Escanear QR** hay atajos con los IDs de los comercios de ejemplo, así que puedes probar el flujo completo sin cámara:

- `panaderia-tulum-01`
- `fonda-mercado28-02`
- `cafe-palapas-03`
- `fruteria-uni-04`

También puedes imprimir el QR desde **Panel Comercio** y validar el código desde **Validar código**.

## 📁 Estructura

```
src/
├── App.tsx              # Layout, navegación y rutas
├── App.css              # Estilos por pantalla
├── index.css            # Tokens y sistema de diseño retro pop
├── data/                # Datos de ejemplo de comercios
├── lib/
│   ├── comercios.ts     # Tipos y helpers de comercios
│   ├── hash.ts          # Código determinístico del día
│   └── storage.ts       # Sellos y canjes en localStorage
└── pages/               # Inicio, detalle, escáner, álbum, panel y validación
```
