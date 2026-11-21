# 🎡 PasoLocal

App React + Vite para explorar **retos locales en Cancún**, escanear códigos QR en comercios y coleccionar sellos culturales. Todo funciona en el dispositivo, sin cuentas ni servidor.

## ✨ Características

- 🗺️ **Mapa interactivo** con Google Maps (cuando hay clave) y fallback a Leaflet/OpenStreetMap, filtrable por modalidad.
- ⭐ **Datos reales de Google Places**: ubicación, valoración, reseñas y fotos de cada negocio.
- 🧭 **Misiones cercanas**: búsqueda en radio circular (500 m a 5 km), mapa con el área marcada y misiones generadas a partir de los datos de cada lugar.
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

## 🔑 Google Maps + Places (opcional)

La app funciona sin clave usando Leaflet. Si quieres mapa de Google, valoraciones y reseñas reales:

1. En [Google Cloud Console](https://console.cloud.google.com/), crea o elige un proyecto con **facturación activada** (hay crédito gratuito mensual).
2. Habilita **Maps JavaScript API** y **Places API (New)**. La app usa la API nueva por REST; no necesitas la API legacy.
3. Crea una clave API y restringe su uso por *HTTP referrers*:
   - `http://localhost:5173/*`
   - `http://127.0.0.1:5173/*`
   - `https://tu-dominio.com/*`
4. Copia `.env.example` a `.env.local` y pega tu clave:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIza...
   ```

5. Reinicia `npm run dev`.

Con la clave, el mapa cambia a Google Maps, los marcadores usan la ubicación real y las tarjetas muestran ⭐ rating, reseñas y foto del lugar. Si la clave falla o no hay resultados, se mantiene el modo demo sin romper la app y se muestra el motivo del error en pantalla.

### 🧭 Misiones por radio

En la pantalla **Misiones** puedes:

1. Al entrar, la app **pide tu ubicación** y busca automáticamente. Si la rechazas, usa Cancún como centro. También puedes tocar **📍 Usar mi ubicación**.
2. Elegir un radio de **500 m, 1 km, 3 km o 5 km**.
3. Ver los **5 lugares más cercanos** (ordenados por distancia real) y el **círculo de búsqueda** en el mapa.
4. Abrir un lugar para ver su ⭐ valoración, reseñas de Google, foto y las **misiones generadas automáticamente** según su categoría, valoración, número de reseñas, fotos y horario.
5. Aceptar misiones: se guardan en tu bitácora local con sus puntos.

> La geolocalización requiere HTTPS o `localhost`. Si abres la app desde una IP de tu red (por ejemplo `http://192.168.1.10:5173`), el navegador bloqueará la ubicación.

> Si Google responde `REQUEST_DENIED` con mensaje de API legacy, habilita **Places API (New)**; la app ya no usa la API antigua.

Ejemplos de misiones generadas: "Prueba un sabor local" en restaurantes, "Sé la voz de este lugar" cuando tiene pocas reseñas, "Misión fotográfica" si Google tiene fotos, o "Revisa la accesibilidad".

Si no hay clave, la misma pantalla funciona con los comercios del JSON como modo demo.

**Datos más precisos:** puedes poner el `place_id` real de cada negocio en `src/data/comercios.demo.json`:

```json
"placeId": "ChIJ..."
```

Si se deja vacío, la app busca el comercio por nombre y zona con `textSearch`.

> ⚠️ Recuerda las políticas de Google: muestra la atribución, enlaza a Google Maps y no almacenes reseñas más de 30 días. Las llamadas a Places tienen coste por petición; los resultados se cachean en memoria durante la sesión.

## 📁 Estructura

```
src/
├── App.tsx              # Layout, navegación y rutas
├── App.css              # Estilos por pantalla
├── index.css            # Tokens y sistema de diseño retro pop
├── components/          # MapaGoogle, MapaRango y ResumenGoogle
├── hooks/               # useDatosGoogle
├── data/                # Datos de ejemplo de comercios
├── lib/
│   ├── comercios.ts     # Tipos y helpers de comercios
│   ├── googleMaps.ts    # Carga diferida de la API de Google Maps
│   ├── places.ts        # Búsqueda por radio, detalles y caché de Places
│   ├── misiones.ts      # Generador de misiones desde datos de Places
│   ├── hash.ts          # Código determinístico del día
│   └── storage.ts       # Sellos y canjes en localStorage
└── pages/               # Inicio, misiones, detalle, escáner, álbum, panel y validación
```
