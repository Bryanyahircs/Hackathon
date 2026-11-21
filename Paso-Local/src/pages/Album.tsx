import { useState } from 'react';
import { Link } from 'react-router-dom';

import { colorModalidad, comercios } from '../lib/comercios';
import { obtenerSellos, reiniciarProgreso } from '../lib/storage';

export default function Album() {
  const [sellos, setSellos] = useState(obtenerSellos);

  const totalComercios = comercios.length;
  const totalDesbloqueados = sellos.length;
  const porcentaje = Math.round((totalDesbloqueados / totalComercios) * 100);

  const reiniciarDemo = () => {
    reiniciarProgreso();
    setSellos([]);
  };

  return (
    <div className="pl-page">
      <div className="pl-album-toolbar">
        <div>
          <span className="pl-kicker">🏅 Tu colección</span>
          <h2>¡Mi álbum de sellos!</h2>
          <p style={{ color: 'var(--muted)', fontWeight: 700, marginTop: 6 }}>
            Tu progreso se guarda solo en este dispositivo. Sin cuentas ni registros.
          </p>
        </div>
        {totalDesbloqueados > 0 && (
          <button type="button" className="pl-btn pl-btn--sm" onClick={reiniciarDemo}>
            🗑️ Reiniciar demo
          </button>
        )}
      </div>

      <div className="pl-progreso">
        <div className="pl-progreso-info">
          <span>🔥 Llevas {totalDesbloqueados} de {totalComercios} sellos</span>
          <span>{porcentaje}%</span>
        </div>
        <div
          className="pl-barra"
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del álbum"
        >
          <div className="pl-barra-relleno" style={{ width: `${porcentaje}%` }} />
        </div>
      </div>

      {totalDesbloqueados === 0 && (
        <div className="pl-alert pl-alert--info" style={{ marginBottom: 22 }}>
          👋 ¡Tu álbum está esperando! Escanea el QR de un comercio para coleccionar tu primer sello.
        </div>
      )}

      <div className="pl-grid">
        {comercios.map((comercio) => {
          const registro = sellos.find((sello) => sello.idComercio === comercio.id);
          const desbloqueado = Boolean(registro);

          return (
            <article
              className={`pl-sello-card${desbloqueado ? '' : ' is-bloqueado'}`}
              key={comercio.id}
            >
              <div className="pl-sello-icono" aria-hidden="true">
                {desbloqueado ? '🏅' : '🔒'}
              </div>
              <span className={`pl-badge pl-badge--${colorModalidad(comercio.modalidad)}`}>
                {comercio.modalidad}
              </span>
              <h3>{comercio.nombre}</h3>
              <small>
                📍 {comercio.zona} · {comercio.categoria}
              </small>

              {desbloqueado ? (
                <>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.5, marginTop: 4 }}>
                    <strong>📖 {comercio.historia}</strong>
                  </p>
                  <small style={{ color: 'var(--sky-deep)' }}>
                    ✅ Desbloqueado el {registro?.fechaDesbloqueo}
                  </small>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.5, marginTop: 4, color: 'var(--muted)' }}>
                    Visita el local y escanea su QR para descubrir su historia.
                  </p>
                  <Link
                    className="pl-btn pl-btn--sm pl-btn--yellow"
                    to={`/scanner?id=${comercio.id}`}
                  >
                    📷 Ir a escanear
                  </Link>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
