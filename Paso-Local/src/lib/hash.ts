/**
 * Devuelve la fecha actual en formato YYYY-MM-DD usando UTC
 * para que cambie exactamente a medianoche UTC.
 */
export function getFechaUTC(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Genera el código determinístico diario de 6 caracteres
 * usando SHA-256 vía Web Crypto API (sin servidor).
 */
export async function generarCodigoDelDia(
  idComercio: string,
  seed: string,
  fechaUTC: string = getFechaUTC()
): Promise<string> {
  const texto = `${idComercio}|${fechaUTC}|${seed}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Tomamos los primeros 6 caracteres en mayúsculas para que sea fácil de leer en caja
  return hashHex.slice(0, 6).toUpperCase();
}