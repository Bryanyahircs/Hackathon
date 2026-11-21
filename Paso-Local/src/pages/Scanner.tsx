import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link, useSearchParams } from 'react-router-dom';

import { comercios } from '../lib/comercios';
import { generarCodigoDelDia } from '../lib/hash';
import {
  guardarSello,
  registrarCanjeHoy,
  yaCanjeoHoy,
} from '../lib/storage';

type Comercio = (typeof comercios)[number];

type Resultado = {
  comercio: Comercio;
  codigoDia: string;
  selloNuevo: boolean;
  yaCanjeado: boolean;
};

export default function Scanner() {
  const [parametros] = useSearchParams();
  const idSugerido = parametros.get('id') ?? '';

  const [escaneando, setEscaneando] = useState(false);
  const [codigoManual, setCodigoManual] = useState(idSugerido);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const bloqueadoRef = useRef(false);

  const detenerCamara = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {
        // La cámara ya estaba detenida.
      }
    }
    setEscaneando(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        void scannerRef.current.stop().catch(() => undefined);
      }
    };
  }, []);

  const procesarIdComercio = async (idLeido: string) => {
    if (bloqueadoRef.current) return;

    const idLimpio = idLeido.trim();
    const comercio = comercios.find((item) => item.id === idLimpio);

    if (!comercio) {
      setError(`No encontramos ningún comercio con el código "${idLimpio}". ¡Revisa el QR!`);
      return;
    }

    bloqueadoRef.current = true;
    setError('');
    await detenerCamara();

    const yaCanjeado = yaCanjeoHoy(comercio.id);
    const selloNuevo = guardarSello(comercio.id);
    registrarCanjeHoy(comercio.id);

    const codigoDia = await generarCodigoDelDia(comercio.id, comercio.seed);

    setResultado({ comercio, codigoDia, selloNuevo, yaCanjeado });
    bloqueadoRef.current = false;
  };

  const iniciarCamara = async () => {
    setError('');
    setResultado(null);
    bloqueadoRef.current = false;
    setEscaneando(true);

    try {
      const lector = new Html5Qrcode('qr-reader');
      scannerRef.current = lector;
      await lector.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (textoLeido) => {
          void procesarIdComercio(textoLeido);
        },
        () => {
          // Se ignoran los errores de cada frame mientras enfoca.
        }
      );
    } catch {
      setEscaneando(false);
      setError('No pudimos acceder a la cámara. Usa la opción manual de abajo 👇');
    }
  };

  return (
    <div className="pl-page">
      <div className="pl-page-header">
        <span className="pl-kicker">📷 Escáner cultural</span>
        <h2>Escanea el QR del comercio</h2>
        <p>
          Escanea el código impreso en el mostrador para desbloquear tu sello y
          generar tu código de canje del día.
        </p>
      </div>

      <div className="pl-scanner-layout">
        <div className="pl-card pl-scanner-stage">
          <div id="qr-reader" className="pl-qr-reader" />

          {!escaneando ? (
            <button type="button" className="pl-btn pl-btn--sky" onClick={iniciarCamara}>
              📷 Activar cámara
            </button>
          ) : (
            <button type="button" className="pl-btn pl-btn--orange" onClick={detenerCamara}>
              ⏹️ Detener cámara
            </button>
          )}
          <p style={{ color: 'var(--muted)', fontWeight: 800, fontSize: '0.85rem' }}>
            Consejo: apunta el QR con buena luz 📸
          </p>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <section className="pl-card">
            <span className="pl-kicker" style={{ background: 'var(--yellow)' }}>
              Modo demo
            </span>
            <h3 style={{ marginBottom: 10 }}>¿Sin cámara? ¡No hay problema!</h3>
            <p style={{ color: 'var(--muted)', fontWeight: 700, marginBottom: 14 }}>
              Escribe el ID del comercio o toca uno de los atajos:
            </p>

            <div className="pl-demo-id">
              <input
                className="pl-input"
                type="text"
                value={codigoManual}
                onChange={(evento) => setCodigoManual(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter') void procesarIdComercio(codigoManual);
                }}
                placeholder="Ej: panaderia-tulum-01"
                aria-label="ID del comercio"
              />
              <button
                type="button"
                className="pl-btn pl-btn--cyan pl-btn--block"
                onClick={() => void procesarIdComercio(codigoManual)}
              >
                ✨ Validar comercio
              </button>
            </div>

            <div className="pl-demo-botones" style={{ marginTop: 14 }}>
              {comercios.map((comercio) => (
                <button
                  key={comercio.id}
                  type="button"
                  className="pl-chip"
                  onClick={() => {
                    setCodigoManual(comercio.id);
                    void procesarIdComercio(comercio.id);
                  }}
                >
                  {comercio.nombre.split(' ').slice(-1)[0]}
                </button>
              ))}
            </div>
          </section>

          {error && (
            <div className="pl-alert pl-alert--error pl-pop" role="alert">
              ⚠️ {error}
            </div>
          )}

          {resultado && (
            <section className="pl-card pl-resultado pl-pop" aria-live="polite">
              <span className="pl-resultado-badge">
                {resultado.selloNuevo
                  ? '🏅 ¡Nuevo sello desbloqueado!'
                  : '✅ Sello ya en tu álbum'}
              </span>
              <h3>{resultado.comercio.nombre}</h3>
              <p style={{ color: 'var(--sky-deep)', fontWeight: 800, marginTop: 4 }}>
                🎁 {resultado.comercio.beneficio}
              </p>

              <div className="pl-ticket">
                <small>Muestra este código en caja para canjear:</small>
                <div className="pl-code">{resultado.codigoDia}</div>
                <small>Vigente solo hoy · {resultado.comercio.zona}</small>
                {resultado.yaCanjeado && (
                  <p style={{ color: 'var(--orange-deep)', marginTop: 8, fontSize: '0.8rem' }}>
                    ℹ️ Ya registraste un canje aquí hoy en este dispositivo.
                  </p>
                )}
              </div>

              <div className="pl-capsula">
                <strong>📖 Cápsula cultural:</strong>{' '}
                {resultado.comercio.historia}
              </div>

              <Link
                to="/album"
                className="pl-btn pl-btn--yellow pl-btn--block"
                style={{ marginTop: 16 }}
              >
                🏅 Ver mi álbum
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
