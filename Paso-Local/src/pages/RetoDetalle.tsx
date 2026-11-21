import { Link, useParams } from 'react-router-dom';

import ResumenGoogle from '../components/ResumenGoogle';
import { useDatosGoogle } from '../hooks/useDatosGoogle';
import { buscarComercio, colorModalidad } from '../lib/comercios';

export default function RetoDetalle() {
  const { id } = useParams();
  const comercio = buscarComercio(id);
  const datosGoogle = useDatosGoogle(id ?? '');

  if (!comercio) {
    return (
      <div className="pl-page pl-vacio">
        <div style={{ fontSize: 72 }} aria-hidden="true">
          🔎
        </div>
        <h2>No encontramos ese reto</h2>
        <p style={{ color: 'var(--muted)', fontWeight: 700 }}>
          Puede que el comercio ya no esté en la ruta.
        </p>
        <Link to="/" className="pl-btn pl-btn--sky">
          🗺️ Ver todos los comercios
        </Link>
      </div>
    );
  }

  return (
    <div className="pl-page">
      <Link to="/" className="pl-btn pl-btn--sm" style={{ marginBottom: 20 }}>
        ← Volver al mapa
      </Link>

      <div className="pl-reto-hero pl-pop">
        <div className="pl-reto-emoji" aria-hidden="true">
          🎯
        </div>
        <div>
          <span className={`pl-badge pl-badge--${colorModalidad(comercio.modalidad)}`}>
            {comercio.modalidad}
          </span>
          <h2 style={{ marginTop: 8 }}>
            {datosGoogle[id ?? '']?.nombre ?? comercio.nombre}
          </h2>
          <p style={{ color: 'var(--muted)', fontWeight: 800, marginTop: 6 }}>
            📍 {comercio.zona} · 🕒 {comercio.horario} · {comercio.categoria}
          </p>
        </div>
      </div>

      {datosGoogle[id ?? ''] && (
        <div className="pl-card" style={{ marginBottom: 20 }}>
          <ResumenGoogle dato={datosGoogle[id ?? '']} />
        </div>
      )}

      <div className="pl-reto-panel">
        <section className="pl-card">
          <span className="pl-kicker">Tu misión</span>
          <h3>¿Qué debes hacer?</h3>
          <p style={{ lineHeight: 1.55, fontWeight: 700 }}>{comercio.reto}</p>
          <ul className="pl-reto-lista">
            <li>✅ Visita el local en el horario indicado.</li>
            <li>📷 Escanea el QR del mostrador.</li>
            <li>🎁 Muestra tu código del día en caja.</li>
          </ul>
          <div style={{ marginTop: 18 }}>
            <Link
              className="pl-btn pl-btn--sky pl-btn--block"
              to={`/scanner?id=${comercio.id}`}
            >
              📷 Escanear y reclamar
            </Link>
          </div>
        </section>

        <section className="pl-card" style={{ background: '#eaf9ff' }}>
          <span className="pl-kicker" style={{ background: 'var(--yellow)' }}>
            Tu recompensa
          </span>
          <h3>🎁 Beneficio local</h3>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>
            {comercio.beneficio}
          </p>
          <hr style={{ border: '2px dashed var(--ink)', margin: '16px 0' }} />
          <h3>📖 Cápsula cultural</h3>
          <p style={{ lineHeight: 1.55, marginTop: 8 }}>{comercio.historia}</p>
        </section>
      </div>

      <section className="pl-card" style={{ marginTop: 22 }}>
        <h3>♿ Accesibilidad y cupo</h3>
        <div className="pl-tags" style={{ marginTop: 12 }}>
          {comercio.accesibilidad.map((tag) => (
            <span className="pl-tag" key={tag}>
              ♿ {tag}
            </span>
          ))}
          <span className="pl-tag">🎟️ Cupo diario: {comercio.cupoDiario}</span>
        </div>
      </section>
    </div>
  );
}
