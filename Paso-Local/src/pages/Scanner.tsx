import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import comerciosData from '../data/comercios.demo.json';
import { generarCodigoDelDia } from '../lib/hash';
import { guardarSello, registrarCanjeHoy, yaCanjeoHoy } from '../lib/storage';

type Comercio = (typeof comerciosData)[number];

export default function Scanner() {
  const [escaneando, setEscaneando] = useState(false);
  const [codigoManual, setCodigoManual] = useState('');
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<{
    comercio: Comercio;
    codigoDia: string;
    selloNuevo: boolean;
    yaCanjeado: boolean;
  } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const detenerCamara = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Ignorar si ya estaba detenido
      }
    }
    setEscaneando(false);
  };

  useEffect(() => {
    return () => {
      detenerCamara();
    };
  }, []);

  const procesarIdComercio = async (idLeido: string) => {
    setError('');
    const idLimpio = idLeido.trim();
    const comercio = comerciosData.find((c) => c.id === idLimpio);

    if (!comercio) {
      setError(`No se encontró ningún comercio registrado con el código "${idLimpio}".`);
      return;
    }

    await detenerCamara();

    const yaCanjeado = yaCanjeoHoy(comercio.id);
    const selloNuevo = guardarSello(comercio.id);
    if (!yaCanjeado) {
      registrarCanjeHoy(comercio.id);
    }

    const codigoDia = await generarCodigoDelDia(comercio.id, comercio.seed);

    setResultado({
      comercio,
      codigoDia,
      selloNuevo,
      yaCanjeado,
    });
  };

  const iniciarCamara = async () => {
    setError('');
    setResultado(null);
    setEscaneando(true);

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          procesarIdComercio(decodedText);
        },
        () => {
          // Errores frame a frame mientras enfoca; se ignoran
        }
      );
    } catch {
      setEscaneando(false);
      setError('No se pudo acceder a la cámara. Puedes usar la validación manual de abajo.');
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h2>📷 Escanear QR del Comercio</h2>
      <p style={{ color: '#555' }}>
        Escanea el código impreso en el mostrador para desbloquear tu sello cultural y tu código de canje del día.
      </p>

      {/* Contenedor de la cámara */}
      <div
        id="qr-reader"
        style={{
          width: '100%',
          maxWidth: 360,
          margin: '0 auto 16px',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        {!escaneando ? (
          <button
            onClick={iniciarCamara}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#0f172a',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            📷 Activar cámara
          </button>
        ) : (
          <button
            onClick={detenerCamara}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ⏹️ Detener cámara
          </button>
        )}
      </div>

      {/* Opción manual / modo demo */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 'bold' }}>
          ¿Sin cámara o probando en PC? Ingresa el ID del comercio:
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            placeholder="Ej: panaderia-tulum-01"
            style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
          <button
            onClick={() => procesarIdComercio(codigoManual)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Validar
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: '#fee2e2',
            color: '#991b1b',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Resultado del escaneo: código de canje + micro-historia */}
      {resultado && (
        <div
          style={{
            border: '2px solid #16a34a',
            borderRadius: 12,
            padding: 20,
            background: '#f0fdf4',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: '#166534',
              background: '#dcfce7',
              padding: '4px 10px',
              borderRadius: 12,
            }}
          >
            {resultado.selloNuevo ? '🏅 ¡Nuevo sello agregado a tu álbum!' : '✅ Sello ya coleccionado'}
          </span>

          <h3 style={{ margin: '12px 0 4px' }}>{resultado.comercio.nombre}</h3>
          <p style={{ margin: '0 0 12px', color: '#15803d', fontWeight: 'bold' }}>
            🎁 {resultado.comercio.beneficio}
          </p>

          <div
            style={{
              background: '#fff',
              border: '1px dashed #16a34a',
              borderRadius: 10,
              padding: 14,
              textAlign: 'center',
              marginBottom: 14,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
              Muestra este código en caja para tu canje:
            </p>
            <div style={{ fontSize: 34, fontWeight: 'bold', letterSpacing: 6, marginTop: 4 }}>
              {resultado.codigoDia}
            </div>
            {resultado.yaCanjeado && (
              <small style={{ color: '#b45309' }}>
                Nota: Este dispositivo ya registró un canje hoy en este comercio.
              </small>
            )}
          </div>

          <div style={{ background: '#fff', padding: 12, borderRadius: 8, fontSize: 14 }}>
            <strong>📖 Cápsula cultural:</strong>
            <p style={{ margin: '6px 0 0', color: '#334155' }}>{resultado.comercio.historia}</p>
          </div>
        </div>
      )}
    </div>
  );
}