import { getFechaUTC } from './hash';

const KEY_SELLOS = 'pasolocal_sellos';
const KEY_CANJES = 'pasolocal_canjes';

export interface RegistroSello {
  idComercio: string;
  fechaDesbloqueo: string;
}

/**
 * Obtiene todos los sellos desbloqueados en el dispositivo.
 */
export function obtenerSellos(): RegistroSello[] {
  const raw = localStorage.getItem(KEY_SELLOS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RegistroSello[];
  } catch {
    return [];
  }
}

/**
 * Guarda un sello si el usuario aún no lo tiene en su álbum.
 */
export function guardarSello(idComercio: string): boolean {
  const sellos = obtenerSellos();
  const yaExiste = sellos.some((s) => s.idComercio === idComercio);

  if (!yaExiste) {
    sellos.push({
      idComercio,
      fechaDesbloqueo: getFechaUTC(),
    });
    localStorage.setItem(KEY_SELLOS, JSON.stringify(sellos));
    return true;
  }
  return false;
}

/**
 * Verifica si el dispositivo ya canjeó en este comercio hoy.
 */
export function yaCanjeoHoy(idComercio: string): boolean {
  const hoy = getFechaUTC();
  const raw = localStorage.getItem(KEY_CANJES);
  if (!raw) return false;

  try {
    const canjes = JSON.parse(raw) as Record<string, string>;
    return canjes[idComercio] === hoy;
  } catch {
    return false;
  }
}

/**
 * Registra el canje del día para evitar doble uso en el mismo dispositivo.
 */
export function registrarCanjeHoy(idComercio: string): void {
  const hoy = getFechaUTC();
  const raw = localStorage.getItem(KEY_CANJES);
  const canjes: Record<string, string> = raw ? JSON.parse(raw) : {};

  canjes[idComercio] = hoy;
  localStorage.setItem(KEY_CANJES, JSON.stringify(canjes));
}