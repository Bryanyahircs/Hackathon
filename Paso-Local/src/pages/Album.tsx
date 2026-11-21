import { useState } from 'react';
import comerciosData from '../data/comercios.demo.json';
import { obtenerSellos } from '../lib/storage';

export default function Album() {
  const [sellos, setSellos] = useState(() => obtenerSellos());

  const totalComercios = comerciosData.length;
  const totalDesbloqueados = sellos.length;
  const porcentaje = Math.round((totalDesbloqueados / totalComercios) * 100);

  const reiniciarDemo = () => {
    localStorage.removeItem('pasolocal_sellos');
    localStorage.removeItem('pasolocal_canjes');
    setSellos([]);
  };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ margin: 0 }}>🏅 Mi Álbum de Sellos</h2>
          <p style={{ color: '#555', margin: '4px 0 0' }}>
            Progreso guardado solo en tu dispositivo (sin cuentas ni registro).
          </p>
        </div>

        {totalDesbloqueados > 0 && (
          <button
            onClick={reiniciarDemo}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 12,
              color: '#64748b',
            }}
          >
            🗑️ Reiniciar demo
          </button>
        )}
      </div>

      {/* Barra de progreso */}
      <div style={{ margin: '18px 0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
          <strong>Sellos coleccionados: {totalDesbloqueados} de {totalComercios}</strong>
          <span>{porcentaje}%</span>
        </div>
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              width: `${porcentaje}%`,
              height: '100%',
              background: '#16a34a',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Cuadrícula de sellos */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {comerciosData.map((comercio) => {
          const registro = sellos.find((s) => s.idComercio === comercio.id);
          const desbloqueado = Boolean(registro);

          return (
            <div
              key={comercio.id}
              style={{
                border: desbloqueado ? '2px solid #16a34a' : '1px dashed #cbd5e1',
                borderRadius: 12,
                padding: 16,
                background: desbloqueado ? '#fff' : '#f8fafc',
                opacity: desbloqueado ? 1 : 0.65,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>
                {desbloqueado ? '🏅' : '🔒'}
              </div>
              <h3 style={{ margin: '0 0 4px' }}>{comercio.nombre}</h3>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748b' }}>
                {comercio.zona} • {comercio.modalidad}
              </p>

              {desbloqueado ? (
                <>
                  <p style={{ fontSize: 13, color: '#334155', margin: '0 0 8px' }}>
                    <strong>📖 Historia:</strong> {comercio.historia}
                  </p>
                  <small style={{ color: '#15803d', fontWeight: 'bold' }}>
                    Desbloqueado el {registro?.fechaDesbloqueo}
                  </small>
                </>
              ) : (
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  Visita este comercio y escanea su QR para desbloquear su cápsula histórica.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}