import { useState } from 'react';
import { Link } from 'react-router-dom';

import { comercios } from '../lib/comercios';
import { generarCodigoDelDia, getFechaUTC } from '../lib/hash';

type Estado = 'inicial' | 'validando' | 'valido' | 'invalido';

export default function ValidarCodigo() {
  const [comercioId, setComercioId] = useState(comercios[0].id);
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState<Estado>('inicial');

  const validar = async () => {
    setEstado('validando');
    const comercio = comercios.find((item) => item.id === comercioId);
    if (!comercio) {
      setEstado('invalido');
      return;
    }

    const esperado = await generarCodigoDelDia(comercio.id, comercio.seed);
    setEstado(codigo.trim().toUpperCase() === esperado ? 'valido' : 'invalido');
  };

  return (
    <div className="pl-page">
      <div className="pl-page-header">
        <span className="pl-kicker">✔️ Validación en caja</span>
        <h2>Validar código del día</h2>
        <p>
          Compara el código que muestra el visitante con el código determinístico
          generado para este comercio y esta fecha.
        </p>
      </div>

      <div className="pl-validar-layout">
        <section className="pl-card">
          <label className="pl-label" htmlFor="comercio-validar">
            <span>🏪 Comercio:</span>
            <select
              id="comercio-validar"
              className="pl-select"
              value={comercioId}
              onChange={(evento) => {
                setComercioId(evento.target.value);
                setEstado('inicial');
              }}
            >
              {comercios.map((comercio) => (
                <option key={comercio.id} value={comercio.id}>
                  {comercio.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="pl-label" htmlFor="codigo-validar">
            <span>🔢 Código de 6 caracteres:</span>
            <input
              id="codigo-validar"
              className="pl-input pl-code"
              style={{ fontSize: '1.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
              value={codigo}
              maxLength={6}
              onChange={(evento) => {
                setCodigo(evento.target.value.toUpperCase());
                setEstado('inicial');
              }}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') void validar();
              }}
              placeholder="ABC123"
              aria-label="Código de canje"
            />
          </label>

          <button
            type="button"
            className="pl-btn pl-btn--sky pl-btn--block"
            onClick={() => void validar()}
            disabled={estado === 'validando'}
          >
            {estado === 'validando' ? '⏳ Validando…' : '🔍 Validar código'}
          </button>

          <Link to="/comercio" className="pl-btn pl-btn--sm pl-btn--block" style={{ marginTop: 12 }}>
            ← Volver al panel de comercio
          </Link>
        </section>

        <aside style={{ display: 'grid', gap: 20 }}>
          <section className="pl-card pl-estado-card">
            {estado === 'valido' ? (
              <div className="pl-pop">
                <div className="pl-estado-icono" aria-hidden="true">🎉</div>
                <h3>¡Código válido!</h3>
                <p style={{ color: 'var(--sky-deep)', fontWeight: 800, marginTop: 6 }}>
                  Puedes entregar el beneficio al visitante.
                </p>
              </div>
            ) : estado === 'invalido' ? (
              <div className="pl-pop">
                <div className="pl-estado-icono" aria-hidden="true">🚫</div>
                <h3>Código no válido</h3>
                <p style={{ color: 'var(--orange-deep)', fontWeight: 800, marginTop: 6 }}>
                  Revisa que sea el código de hoy y del comercio correcto.
                </p>
              </div>
            ) : (
              <div>
                <div className="pl-estado-icono pl-float" aria-hidden="true">🎟️</div>
                <h3>En espera…</h3>
                <p style={{ color: 'var(--muted)', fontWeight: 700, marginTop: 6 }}>
                  Ingresa un código y presiona validar.
                </p>
              </div>
            )}
          </section>

          <section className="pl-card">
            <h3>¿Cómo funciona?</h3>
            <ol className="pl-pasos" style={{ marginTop: 14 }}>
              <li>El visitante escanea tu QR.</li>
              <li>Recibe un código de 6 caracteres.</li>
              <li>Lo escribes aquí y comparamos con el código del día.</li>
            </ol>
            <p style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 800 }}>
              📅 Fecha UTC actual: {getFechaUTC()}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
