import type { DatosGoogle } from '../lib/places';

interface Props {
  dato?: DatosGoogle;
  compacto?: boolean;
}

/** Muestra valoración, reseñas y enlace a Google Places (con atribución). */
export default function ResumenGoogle({ dato, compacto = false }: Props) {
  if (!dato) return null;

  const primera = dato.resenas[0];

  return (
    <div className={`pl-google${compacto ? ' pl-google--compacto' : ''}`}>
      <div className="pl-google-cabecera">
        <span className="pl-google-rating">
          ⭐ {dato.rating ? dato.rating.toFixed(1) : '—'}{' '}
          <small>({dato.totalResenas ?? 0} reseñas)</small>
        </span>
        <a href={dato.urlGoogle} target="_blank" rel="noreferrer">
          Ver en Google ↗
        </a>
      </div>

      <p className="pl-google-direccion">📍 {dato.direccion}</p>

      {!compacto && primera && (
        <blockquote className="pl-google-resena">
          “{primera.texto}” <small>— {primera.autor}</small>
        </blockquote>
      )}

      <small className="pl-google-atribucion">Datos y reseñas de Google</small>
    </div>
  );
}
