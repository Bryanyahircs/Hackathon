import { useEffect, useMemo, useState } from 'react';

import MapaRango from '../components/MapaRango';
import ResumenGoogle from '../components/ResumenGoogle';
import { getFechaUTC } from '../lib/hash';
import { formatearDistancia, generarMisiones } from '../lib/misiones';
import type { MisionGenerada } from '../lib/misiones';
import { tieneGoogleMaps } from '../lib/googleMaps';
import {
  buscarLugaresCercanos,
  lugaresDemoCercanos,
} from '../lib/places';
import type { LugarCercano, ResultadoBusqueda } from '../lib/places';
import {
  eliminarMision,
  guardarMision,
  obtenerMisionesGuardadas,
} from '../lib/storage';

const CENTRO_CANCUN = { lat: 21.1619, lng: -86.8276 };
const RADIOS = [500, 1000, 3000, 5000];
const LIMITE_LUGARES = 5;

const etiquetasTipos: Record<string, string> = {
  restaurant: 'Restaurante',
  cafe: 'Café',
  bakery: 'Panadería',
  bar: 'Bar',
  store: 'Tienda',
  supermarket: 'Supermercado',
  grocery_or_supermarket: 'Mercado',
  tourist_attraction: 'Atractivo',
  museum: 'Museo',
  park: 'Parque',
  lodging: 'Hospedaje',
  health: 'Salud',
};

function formatearTipos(tipos: string[]): string {
  return tipos
    .filter((tipo) => tipo !== 'establishment' && tipo !== 'point_of_interest')
    .slice(0, 2)
    .map((tipo) => etiquetasTipos[tipo] ?? tipo.replace(/_/g, ' '))
    .join(' · ');
}

export default function Misiones() {
  const [centro, setCentro] = useState(CENTRO_CANCUN);
  const [esMiUbicacion, setEsMiUbicacion] = useState(false);
  const [radio, setRadio] = useState(3000);
  const [lugares, setLugares] = useState<LugarCercano[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [ubicando, setUbicando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<LugarCercano | null>(null);
  const [guardadas, setGuardadas] = useState(obtenerMisionesGuardadas);

  const buscar = async (
    centroBusqueda = centro,
    radioBusqueda = radio
  ): Promise<void> => {
    setCargando(true);
    setMensaje('');
    setEsError(false);
    setSeleccionado(null);

    try {
      const resultado: ResultadoBusqueda = tieneGoogleMaps
        ? await buscarLugaresCercanos(
            centroBusqueda,
            radioBusqueda,
            LIMITE_LUGARES
          )
        : {
            lugares: lugaresDemoCercanos(
              centroBusqueda,
              radioBusqueda,
              LIMITE_LUGARES
            ),
          };

      setLugares(resultado.lugares);

      if (resultado.error) {
        setMensaje(resultado.error);
        setEsError(true);
      } else if (resultado.lugares.length === 0) {
        setMensaje(
          'No encontramos lugares en ese radio. Prueba con 5 km o usa tu ubicación actual.'
        );
      }
    } finally {
      setCargando(false);
    }
  };

  const usarMiUbicacion = (silencioso = false): void => {
    if (!navigator.geolocation) {
      setUbicando(false);
      if (!silencioso) {
        setMensaje('Tu navegador no permite obtener la ubicación.');
        setEsError(true);
      }
      return;
    }

    setUbicando(true);
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const nuevoCentro = {
          lat: posicion.coords.latitude,
          lng: posicion.coords.longitude,
        };
        setCentro(nuevoCentro);
        setEsMiUbicacion(true);
        setUbicando(false);
        void buscar(nuevoCentro, radio);
      },
      () => {
        setUbicando(false);
        if (!silencioso) {
          setMensaje(
            'No pudimos acceder a tu ubicación. Seguimos usando Cancún como centro.'
          );
          setEsError(true);
        }
        void buscar(CENTRO_CANCUN, radio);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    // Al entrar, pedimos la ubicación; si el usuario la rechaza usamos Cancún.
    usarMiUbicacion(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const misiones = useMemo(
    () => (seleccionado ? generarMisiones(seleccionado) : []),
    [seleccionado]
  );
  const idsGuardadas = useMemo(
    () => new Set(guardadas.map((mision) => mision.id)),
    [guardadas]
  );
  const puntosTotales = guardadas.reduce((total, mision) => total + mision.puntos, 0);

  const aceptarMision = (mision: MisionGenerada) => {
    if (!seleccionado) return;
    guardarMision({
      id: mision.id,
      lugarId: seleccionado.placeId,
      lugarNombre: seleccionado.nombre,
      titulo: mision.titulo,
      icono: mision.icono,
      puntos: mision.puntos,
      fecha: getFechaUTC(),
    });
    setGuardadas(obtenerMisionesGuardadas());
  };

  return (
    <div className="pl-page">
      <div className="pl-page-header">
        <span className="pl-kicker" style={{ background: 'var(--orange)' }}>
          🧭 Misiones con Google Places
        </span>
        <h2>Descubre lugares cerca de ti</h2>
        <p>
          Buscamos los {LIMITE_LUGARES} negocios más cercanos dentro de un radio
          circular y creamos misiones a partir de sus datos reales: categoría,
          valoración, reseñas, fotos y horarios.
        </p>
      </div>

      {!tieneGoogleMaps && (
        <div className="pl-alert pl-alert--info" style={{ marginBottom: 18 }}>
          💡 Estás viendo el modo demo con los comercios de ejemplo. Agrega tu clave
          en <code>.env.local</code> para buscar lugares reales con Google Places.
        </div>
      )}

      <section className="pl-card pl-misiones-controles">
        <div className="pl-misiones-opciones">
          <button
            type="button"
            className="pl-btn pl-btn--sky pl-btn--sm"
            onClick={() => usarMiUbicacion()}
            disabled={ubicando}
          >
            {ubicando ? '📡 Ubicando…' : '📍 Usar mi ubicación'}
          </button>
          <div className="pl-filters" style={{ margin: 0 }} role="group" aria-label="Radio de búsqueda">
            {RADIOS.map((valor) => (
              <button
                key={valor}
                type="button"
                className={`pl-chip${radio === valor ? ' is-active' : ''}`}
                onClick={() => setRadio(valor)}
              >
                {valor >= 1000 ? `${valor / 1000} km` : `${valor} m`}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="pl-btn pl-btn--orange pl-btn--sm"
            onClick={() => void buscar()}
            disabled={cargando}
          >
            {cargando ? '⏳ Buscando…' : '🔎 Buscar lugares'}
          </button>
        </div>
        <p className="pl-misiones-centro">
          Centro: {esMiUbicacion ? 'tu ubicación' : 'Cancún'} ({centro.lat.toFixed(4)},{' '}
          {centro.lng.toFixed(4)}) · Radio: {formatearDistancia(radio)} · Ordenados
          por distancia
        </p>
      </section>

      {lugares.length > 0 && (
        <div className="pl-map-frame pl-rango-map" style={{ marginTop: 20 }}>
          <span className="pl-map-label">🔵 RADIO {formatearDistancia(radio)}</span>
          <MapaRango
            centro={centro}
            radioMetros={radio}
            lugares={lugares}
            onSeleccionar={setSeleccionado}
          />
        </div>
      )}

      {mensaje && (
        <div
          className={`pl-alert ${esError ? 'pl-alert--error' : 'pl-alert--info'}`}
          style={{ marginTop: 18 }}
        >
          {esError ? '⚠️' : 'ℹ️'} {mensaje}
        </div>
      )}

      <div className="pl-section-title" style={{ marginTop: 28 }}>
        <h3>
          {lugares.length > 0
            ? `Los ${lugares.length} lugares más cercanos`
            : 'Lugares dentro del radio'}
        </h3>
      </div>

      <div className="pl-grid">
        {lugares.map((lugar) => (
          <article
            className={`pl-lugar-card${seleccionado?.placeId === lugar.placeId ? ' is-seleccionado' : ''}`}
            key={lugar.placeId}
          >
            {lugar.fotoUrl && (
              <img
                className="pl-lugar-foto"
                src={lugar.fotoUrl}
                alt={`Foto de ${lugar.nombre}`}
                loading="lazy"
              />
            )}
            <div className="pl-lugar-cabecera">
              <span className="pl-badge pl-badge--sky">
                📏 {formatearDistancia(lugar.distanciaMetros)}
              </span>
              {lugar.rating && (
                <span className="pl-badge pl-badge--yellow">
                  ⭐ {lugar.rating.toFixed(1)} ({lugar.totalResenas ?? 0})
                </span>
              )}
            </div>
            <h3 className="pl-lugar-titulo">{lugar.nombre}</h3>
            <p className="pl-lugar-meta">📍 {lugar.direccion}</p>
            {lugar.tipos.length > 0 && (
              <div className="pl-tags">
                {formatearTipos(lugar.tipos)
                  .split(' · ')
                  .filter(Boolean)
                  .map((tipo) => (
                    <span className="pl-tag" key={tipo}>
                      {tipo}
                    </span>
                  ))}
              </div>
            )}
            {lugar.resenas[0] && (
              <p className="pl-lugar-resena">“{lugar.resenas[0].texto}”</p>
            )}
            <div className="pl-lugar-acciones">
              <button
                type="button"
                className="pl-btn pl-btn--sky pl-btn--sm"
                onClick={() => setSeleccionado(lugar)}
              >
                Ver misiones →
              </button>
              <a
                className="pl-btn pl-btn--sm"
                href={lugar.urlGoogle}
                target="_blank"
                rel="noreferrer"
              >
                Google ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      {seleccionado && (
        <section className="pl-card pl-mision-detalle pl-pop" style={{ marginTop: 28 }}>
          <div className="pl-section-title">
            <h3>🎯 Misiones para {seleccionado.nombre}</h3>
          </div>
          <div style={{ marginBottom: 18 }}>
            <ResumenGoogle dato={seleccionado} />
          </div>
          <div className="pl-grid pl-misiones-grid">
            {misiones.map((mision) => {
              const yaGuardada = idsGuardadas.has(mision.id);
              return (
                <div className="pl-mision-item" key={mision.id}>
                  <div className="pl-mision-cabecera">
                    <span style={{ fontSize: 26 }} aria-hidden="true">
                      {mision.icono}
                    </span>
                    <span className="pl-badge pl-badge--orange">
                      +{mision.puntos} pts
                    </span>
                  </div>
                  <h3>{mision.titulo}</h3>
                  <p>{mision.descripcion}</p>
                  <small className="pl-mision-categoria">{mision.categoria}</small>
                  <button
                    type="button"
                    className={`pl-btn pl-btn--sm pl-btn--block ${yaGuardada ? 'pl-btn--cyan' : 'pl-btn--yellow'}`}
                    onClick={() => aceptarMision(mision)}
                    disabled={yaGuardada}
                  >
                    {yaGuardada ? '✅ Misión aceptada' : '＋ Aceptar misión'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {guardadas.length > 0 && (
        <section className="pl-card pl-misiones-guardadas" style={{ marginTop: 28 }}>
          <div className="pl-album-toolbar">
            <div>
              <span className="pl-kicker" style={{ background: 'var(--yellow)' }}>
                🏆 Tu bitácora
              </span>
              <h3>Misiones aceptadas</h3>
            </div>
            <span className="pl-badge pl-badge--sky">Total: {puntosTotales} pts</span>
          </div>
          <div className="pl-misiones-guardadas-lista">
            {guardadas.map((mision) => (
              <div className="pl-mision-guardada" key={mision.id}>
                <span aria-hidden="true">{mision.icono}</span>
                <div>
                  <strong>{mision.titulo}</strong>
                  <small>
                    {mision.lugarNombre} · {mision.fecha}
                  </small>
                </div>
                <button
                  type="button"
                  className="pl-btn pl-btn--sm"
                  onClick={() => {
                    eliminarMision(mision.id);
                    setGuardadas(obtenerMisionesGuardadas());
                  }}
                  aria-label={`Eliminar misión ${mision.titulo}`}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
