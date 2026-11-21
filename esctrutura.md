Paso-Local/
├─ node_modules/
├─ public/
│  ├─ favicon.svg
│  ├─ icons.svg
│  └─ qr/                 <-- (Aquí guardaremos los QR de prueba)
├─ src/
│  ├─ app/                <-- (Configuración de rutas, contexto global)
│  ├─ assets/             <-- (Imágenes locales)
│  ├─ components/         <-- (Botones, tarjetas de comercios, etc.)
│  ├─ data/               <-- (Aquí irá comercios.demo.json)
│  ├─ lib/                <-- (Lógica pura: hash.ts, storage.ts, qr.ts, geo.ts)
│  ├─ pages/              <-- (Las 6 pantallas del MVP)
│  │  ├─ Home.tsx
│  │  ├─ RetoDetalle.tsx
│  │  ├─ Scanner.tsx
│  │  ├─ Album.tsx
│  │  ├─ PanelComercio.tsx
│  │  └─ ValidarCodigo.tsx
│  ├─ App.tsx             <-- (Renombró  a App.tsx)
│  ├─ index.css
│  └─ main.tsx            <-- (Renombró a main.tsx)
├─ .gitignore
├─ index.html
├─ package.json
├─ tsconfig.json          
└─ vite.config.js


cosas a instalar 

 instala TypeScript y los tipos para React:
npm install -D typescript @types/react @types/react-dom

Segundo, instala las librerías que usaremos para el MVP (enrutamiento, QR, mapas y utilidades):

npm install react-router-dom html5-qrcode qrcode leaflet react-leaflet
npm install -D @types/qrcode @types/leaflet