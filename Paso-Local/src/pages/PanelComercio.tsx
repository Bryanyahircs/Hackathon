import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Link } from 'react-router-dom';

import { comercios } from '../lib/comercios';
import { generarCodigoDelDia, getFechaUTC } from '../lib/hash';

export default function PanelComercio() {
  const [comercioId, setComercioId] = useState(comercios[0].id);
  const [codigoDia, setCodigoDia] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [pausado, setPausado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const comercioActual =
    comercios.find((comercio) => comercio.id === comercioId) ?? comercios[0];

  useEffect(() => {
    let activo = true;

    void generarCodigoDelDia(comercioActual.id, comercioActual.seed).then((codigo) => {
      if (activo) setCodigoDia(codigo);
    });
    void QRCode.toDataURL(comercioActual.id, { width: 260, margin: 2 }).then((url) => {
      if (activo) setQrUrl(url);
    });

    return () => {
      activo = false;
    };
  }, [comercioActual]);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoDia);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="pl-page">
      <div className="pl-page-header">
        <span className="pl-kicker" style={{ background: 'var(--yellow)' }}>
          🏪 Modo comercio
        </span>
        <h2>Panel de comercio</h2>
        <p>
          Genera tu QR oficial para el mostrador y valida los códigos del día sin
          necesidad de conexión a un servidor.
        </p>
      </div>

      <div className="pl-panel-layout">
        <section className="pl-card">
          <label className="pl-label" htmlFor="selector-comercio">
            <span> Selecciona tu negocio:</span>
            <select
              id="selector-comercio"
              className="pl-select"
              value={comercioId}
              onChange={(evento) => setComercioId(evento.target.value)}
            >
              {comercios.map((comercio) => (
                <option key={comercio.id} value={comercio.id}>
                  {comercio.nombre} ({comercio.modalidad})
                </option>
              ))}
            </select>
          </label>

          <div className="pl-alert pl-alert--info">
            📅 Código vigente hoy ({getFechaUTC()} UTC). Se renueva automáticamente
            cada día a medianoche.
          </div>

          <div className="pl-reto-lista" style={{ marginTop: 18 }}>
            <li>🖨️ Imprime el QR y ponlo en tu mostrador.</li>
            <li>🔎 El visitante lo escanea y obtiene un código.</li>
            <li>✅ Confirma el código en la pantalla de validación.</li>
          </div>

          <Link to="/comercio/validar" className="pl-btn pl-btn--cyan pl-btn--block" style={{ marginTop: 18 }}>
            ✔️ Ir a validar un código
          </Link>
        </section>

        <section className={`pl-card pl-qr-card${pausado ? ' is-pausado' : ''}`}>
          <span className="pl-badge pl-badge--orange">QR OFICIAL DEL DÍA</span>
          <h3 style={{ marginTop: 12 }}>{comercioActual.nombre}</h3>

          <div className="pl-code pl-codigo-dia">{codigoDia || '······'}</div>

          {qrUrl && (
            <div>
              <img
                className="pl-qr-img"
                src={qrUrl}
                alt={`Código QR de ${comercioActual.nombre}`}
              />
              <a
                className="pl-btn pl-btn--yellow pl-btn--block"
                href={qrUrl}
                download={`QR-${comercioActual.id}.png`}
              >
                ⬇️ Descargar QR para imprimir
              </a>
            </div>
          )}

          <div className="pl-panel-acciones">
            <button type="button" className="pl-btn pl-btn--cyan pl-btn--block" onClick={copiarCodigo}>
              {copiado ? '¡Copiado! 🎉' : '📋 Copiar código del día'}
            </button>
            <button
              type="button"
              className={`pl-btn pl-btn--block ${pausado ? 'pl-btn--yellow' : 'pl-btn--orange'}`}
              onClick={() => setPausado(!pausado)}
            >
              {pausado ? '▶️ Reanudar participación' : '⏸️ Pausar participación hoy'}
            </button>
          </div>
          {pausado && (
            <p style={{ marginTop: 12, fontWeight: 800, color: 'var(--muted)' }}>
              ⚠️ Participación en pausa para esta demo.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
