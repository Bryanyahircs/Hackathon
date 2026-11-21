import { getFechaUTC } from './hash';

const KEY_SELLOS = 'pasolocal_sellos';
const KEY_CANJES = 'pasolocal_canjes';

export interface RegistroSello {
  idComercio: string;
  fechaDesbloqueo: string;
}

function leerJSON<T>(clave: string, valorPorDefecto: T): T {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
}

/** Obtiene todos los sellos desbloqueados en el dispositivo. */
export function obtenerSellos(): RegistroSello[] {
  const sellos = leerJSON<RegistroSello[]>(KEY_SELLOS, []);
  return Array.isArray(sellos) ? sellos : [];
}

/** Guarda un sello si el usuario aún no lo tiene en su álbum. */
export function guardarSello(idComercio: string): boolean {
  const sellos = obtenerSellos();
  if (sellos.some((sello) => sello.idComercio === idComercio)) {
    return false;
  }

  sellos.push({ idComercio, fechaDesbloqueo: getFechaUTC() });
  localStorage.setItem(KEY_SELLOS, JSON.stringify(sellos));
  return true;
}

/** Verifica si el dispositivo ya canjeó en este comercio hoy. */
export function yaCanjeoHoy(idComercio: string): boolean {
  const canjes = leerJSON<Record<string, string>>(KEY_CANJES, {});
  return canjes[idComercio] === getFechaUTC();
}

/** Registra el canje del día para evitar doble uso en el mismo dispositivo. */
export function registrarCanjeHoy(idComercio: string): void {
  const canjes = leerJSON<Record<string, string>>(KEY_CANJES, {});
  canjes[idComercio] = getFechaUTC();
  localStorage.setItem(KEY_CANJES, JSON.stringify(canjes));
}

/** Borra todo el progreso guardado (útil para la demo). */
export function reiniciarProgreso(): void {
  localStorage.removeItem(KEY_SELLOS);
  localStorage.removeItem(KEY_CANJES);
}
