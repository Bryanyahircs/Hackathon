import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import comerciosData from '../data/comercios.demo.json';
import { generarCodigoDelDia, getFechaUTC } from '../lib/hash';

export default function PanelComercio() {
  const [comercioId, setComercioId] = useState(comerciosData[0].id);
  const [codigoDia, setCodigoDia] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [pausado, setPausado] = useState(false);

  const comercioActual =
    comerciosData.find((c) => c.id === comercioId) || comerciosData[0];

  useEffect(() => {
    // 1. Calcula el código determinístico del día con SHA-256
    generarCodigoDelDia(comercioActual.id, comercioActual.seed).then(setCodigoDia);

    // 2. Genera el QR con el ID del comercio
    QRCode.toDataURL(comercioActual.id, { width: 220, margin: 2 }).then(setQrUrl);
  }, [comercioActual]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h2>🏪 Panel de Comercio</h2>
      <p style={{ color: '#555' }}>
        Valida cupones sin internet y descarga tu QR oficial para el mostrador.
      </p>

      {/* Selector de comercio */}
      <label style={{ display: 'block', marginBottom: 16 }}>
        <strong>Selecciona tu negocio:</strong>
        <select
          value={comercioId}
          onChange={(e) => setComercioId(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 6, borderRadius: 8 }}
        >
          {comerciosData.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} ({c.modalidad})
            </option>
          ))}
        </select>
      </label>

      {/* Tarjeta con código del día y QR */}
      <div
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          background: pausado ? '#f1f5f9' : '#fff',
          opacity: pausado ? 0.7 : 1,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
          Código vigente hoy ({getFechaUTC()} UTC)
        </p>
        <div
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            letterSpacing: 6,
            margin: '10px 0 16px',
            color: '#0f172a',
          }}
        >
          {codigoDia || '------'}
        </div>

        {qrUrl && (
          <div style={{ margin: '16px 0' }}>
            <img src={qrUrl} alt={`QR de ${comercioActual.nombre}`} style={{ borderRadius: 8 }} />
            <br />
            <a
              href={qrUrl}
              download={`QR-${comercioActual.id}.png`}
              style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '8px 14px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
              }}
            >
              ⬇️ Descargar QR para imprimir
            </a>
          </div>
        )}

        <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />

        <button
          onClick={() => setPausado(!pausado)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            background: pausado ? '#16a34a' : '#dc2626',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {pausado ? '▶️ Reanudar participación' : '⏸️ Pausar participación hoy'}
        </button>
      </div>
    </div>
  );
}