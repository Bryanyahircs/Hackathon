/**
 * Devuelve la fecha actual en formato YYYY-MM-DD usando UTC
 * para que cambie exactamente a medianoche UTC.
 */
export function getFechaUTC(): string {
  return new Date().toISOString().split('T')[0];
}

/** Hash FNV-1a de 32 bits usado cuando Web Crypto no está disponible. */
function fnv1a(texto: string, semilla: number): number {
  let hash = semilla >>> 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Genera el código determinístico diario de 6 caracteres.
 * Usa SHA-256 vía Web Crypto API cuando está disponible (localhost/HTTPS).
 * Si la app se abre por IP en HTTP, Web Crypto no existe y se usa un
 * fallback determinístico para que la demo siga funcionando sin servidor.
 */
export async function generarCodigoDelDia(
  idComercio: string,
  seed: string,
  fechaUTC: string = getFechaUTC()
): Promise<string> {
  const texto = `${idComercio}|${fechaUTC}|${seed}`;

  if (globalThis.crypto?.subtle) {
    const datos = new TextEncoder().encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', datos);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    return hashHex.slice(0, 6).toUpperCase();
  }

  const parteUno = fnv1a(texto, 0x811c9dc5).toString(16).padStart(8, '0');
  const parteDos = fnv1a(texto, 0x9e3779b9).toString(16).padStart(8, '0');
  return (parteUno + parteDos).slice(0, 6).toUpperCase();
}
