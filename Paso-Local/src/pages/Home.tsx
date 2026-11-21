import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import MapaGoogle from '../components/MapaGoogle';
import ResumenGoogle from '../components/ResumenGoogle';
import { useDatosGoogle } from '../hooks/useDatosGoogle';
import { MODALIDADES, colorModalidad, comercios } from '../lib/comercios';
import { tieneGoogleMaps } from '../lib/googleMaps';

const pinIcon = L.divIcon({
  className: 'custom-pin',
  html: '<div style="font-size: 28px; line-height: 1;">📍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const emojiPorCategoria: Record<string, string> = {
  Panadería: '🥐',
  Fonda: '🍲',
  Cafetería: '☕',
  Frutería: '🍉',
};

export default function Home() {
  const [filtro, setFiltro] = useState<string>('Todas');

  const comerciosFiltrados = useMemo(
    () =>
      filtro === 'Todas'
        ? comercios
        : comercios.filter((comercio) => comercio.modalidad === filtro),
    [filtro]
  );

  const idsClave = useMemo(
    () => comerciosFiltrados.map((comercio) => comercio.id).join('|'),
    [comerciosFiltrados]
  );
  const datosGoogle = useDatosGoogle(idsClave);

  return (
    <div className="pl-page">
      <div className="pl-page-header">
        <span className="pl-kicker">🗺️ Explora tu ciudad</span>
        <h2>¡Rutas locales en Cancún! 🎉</h2>
        <p>
          Elige un comercio cercano, visita el local y escanea su QR para
          desbloquear tu sello cultural y una recompensa ¡puro estilo local!
        </p>
      </div>

      {!tieneGoogleMaps && (
        <div className="pl-alert pl-alert--info" style={{ marginBottom: 20 }}>
          💡 Mapa en modo demo (OpenStreetMap). Para usar Google Maps con reseñas
          y valoraciones reales, copia <code>.env.example</code> a{' '}
          <code>.env.local</code> y agrega tu clave API.
        </div>
      )}

      <div className="pl-filters" role="group" aria-label="Filtrar por modalidad">
        {MODALIDADES.map((mod) => (
          <button
            key={mod}
            type="button"
            onClick={() => setFiltro(mod)}
            className={`pl-chip${filtro === mod ? ' is-active' : ''}`}
            aria-pressed={filtro === mod}
          >
            {mod}
          </button>
        ))}
      </div>

      <div className="pl-map-frame">
        <span className="pl-map-label">
          {tieneGoogleMaps ? '📍 GOOGLE MAPS' : '📍 MAPA DE RUTAS'}
        </span>
        {tieneGoogleMaps ? (
          <MapaGoogle comercios={comerciosFiltrados} datos={datosGoogle} />
        ) : (
          <MapContainer center={[21.1619, -86.8276]} zoom={13}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {comerciosFiltrados.map((comercio) => (
              <Marker
                key={comercio.id}
                position={[comercio.lat, comercio.lng]}
                icon={pinIcon}
              >
                <Popup>
                  <strong>{comercio.nombre}</strong>
                  <br />
                  {comercio.modalidad} · {comercio.horario}
                  <br />🎁 {comercio.beneficio}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <div className="pl-section-title">
        <h3>{comerciosFiltrados.length} comercios por descubrir</h3>
      </div>

      <div className="pl-grid">
        {comerciosFiltrados.map((comercio) => {
          const dato = datosGoogle[comercio.id];

          return (
            <article className="pl-comercio-card" key={comercio.id}>
              {dato?.fotoUrl && (
                <img
                  className="pl-comercio-foto"
                  src={dato.fotoUrl}
                  alt={`Foto de ${dato?.nombre ?? comercio.nombre}`}
                  loading="lazy"
                />
              )}
              <span className={`pl-badge pl-badge--${colorModalidad(comercio.modalidad)}`}>
                {comercio.modalidad}
              </span>
              <h3>
                <span aria-hidden="true">
                  {emojiPorCategoria[comercio.categoria] ?? '🏪'}
                </span>{' '}
                {dato?.nombre ?? comercio.nombre}
              </h3>
              <p className="pl-comercio-meta">
                📍 {comercio.zona} · 🕒 {comercio.horario} · 🎟️ {comercio.cupoDiario}/día
              </p>
              <p className="pl-comercio-reto">{comercio.reto}</p>
              <p className="pl-comercio-beneficio">🎁 {comercio.beneficio}</p>
              {dato && <ResumenGoogle dato={dato} compacto />}
              <div className="pl-tags">
                {comercio.accesibilidad.map((tag) => (
                  <span className="pl-tag" key={tag}>
                    ♿ {tag}
                  </span>
                ))}
              </div>
              <div className="pl-card-actions">
                <Link className="pl-btn pl-btn--sky pl-btn--sm" to={`/reto/${comercio.id}`}>
                  Ver reto →
                </Link>
                <Link
                  className="pl-btn pl-btn--yellow pl-btn--sm"
                  to={`/scanner?id=${comercio.id}`}
                >
                  📷 Escanear
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
