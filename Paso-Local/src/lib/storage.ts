import { getFechaUTC } from './hash';

const KEY_SELLOS = 'pasolocal_sellos';
const KEY_CANJES = 'pasolocal_canjes';
const KEY_MISIONES = 'pasolocal_misiones';

export interface RegistroSello {
  idComercio: string;
  fechaDesbloqueo: string;
}

export interface MisionGuardada {
  id: string;
  lugarId: string;
  lugarNombre: string;
  titulo: string;
  icono: string;
  puntos: number;
  fecha: string;
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

/** Devuelve las misiones aceptadas guardadas en el dispositivo. */
export function obtenerMisionesGuardadas(): MisionGuardada[] {
  const misiones = leerJSON<MisionGuardada[]>(KEY_MISIONES, []);
  return Array.isArray(misiones) ? misiones : [];
}

/** Guarda una misión aceptada (evita duplicados). */
export function guardarMision(mision: MisionGuardada): boolean {
  const misiones = obtenerMisionesGuardadas();
  if (misiones.some((item) => item.id === mision.id)) return false;

  misiones.unshift(mision);
  localStorage.setItem(KEY_MISIONES, JSON.stringify(misiones));
  return true;
}

/** Quita una misión de la lista guardada. */
export function eliminarMision(id: string): void {
  const misiones = obtenerMisionesGuardadas().filter((item) => item.id !== id);
  localStorage.setItem(KEY_MISIONES, JSON.stringify(misiones));
}

/** Borra todo el progreso guardado (útil para la demo). */
export function reiniciarProgreso(): void {
  localStorage.removeItem(KEY_SELLOS);
  localStorage.removeItem(KEY_CANJES);
  localStorage.removeItem(KEY_MISIONES);
}
