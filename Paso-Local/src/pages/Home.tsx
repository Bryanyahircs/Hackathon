import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import comerciosData from '../data/comercios.demo.json';

// Ícono personalizado para evitar problemas de rutas de imágenes en Vite
const pinIcon = L.divIcon({
  className: 'custom-pin',
  html: '<div style="font-size: 24px; line-height: 1;">📍</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const MODALIDADES = [
  'Todas',
  'Misión Rescate',
  'Consumo Local',
  'Reto Cultural',
  'Ruta Accesible',
];

export default function Home() {
  const [filtro, setFiltro] = useState('Todas');

  const comerciosFiltrados =
    filtro === 'Todas'
      ? comerciosData
      : comerciosData.filter((c) => c.modalidad === filtro);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      <h2>🏠 Rutas Locales en Cancún</h2>
      <p style={{ color: '#555' }}>
        Elige un comercio cercano, visita el local y escanea su QR para desbloquear tu sello y beneficio.
      </p>

      {/* Filtros por modalidad */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {MODALIDADES.map((mod) => (
          <button
            key={mod}
            onClick={() => setFiltro(mod)}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: '1px solid #ccc',
              cursor: 'pointer',
              background: filtro === mod ? '#1e293b' : '#f8fafc',
              color: filtro === mod ? '#fff' : '#1e293b',
              fontWeight: filtro === mod ? 'bold' : 'normal',
            }}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Mapa interactivo con OpenStreetMap + Leaflet */}
      <div style={{ height: 320, width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 24, border: '1px solid #ddd' }}>
        <MapContainer
          center={[21.1619, -86.8276]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {comerciosFiltrados.map((comercio) => (
            <Marker key={comercio.id} position={[comercio.lat, comercio.lng]} icon={pinIcon}>
              <Popup>
                <strong>{comercio.nombre}</strong>
                <br />
                <span>{comercio.modalidad} • {comercio.horario}</span>
                <br />
                <small>{comercio.beneficio}</small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Lista de tarjetas de comercios */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {comerciosFiltrados.map((comercio) => (
          <div
            key={comercio.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 16,
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                padding: '3px 8px',
                borderRadius: 12,
                background: '#e0f2fe',
                color: '#0369a1',
              }}
            >
              {comercio.modalidad}
            </span>
            <h3 style={{ margin: '10px 0 4px' }}>{comercio.nombre}</h3>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b' }}>
              {comercio.zona} • 🕒 {comercio.horario} • Cupo: {comercio.cupoDiario}/día
            </p>
            <p style={{ fontSize: 14, margin: '8px 0' }}>{comercio.reto}</p>
            <p style={{ fontSize: 14, fontWeight: 'bold', color: '#15803d', margin: '8px 0' }}>
              🎁 {comercio.beneficio}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {comercio.accesibilidad.map((tag) => (
                <span
                  key={tag}
                  style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}
                >
                  ♿ {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}