/** Generador determinístico de misiones a partir de datos reales de Google Places. */

import type { LugarCercano } from './places';

export type CategoriaMision =
  | 'Exploración'
  | 'Consumo local'
  | 'Comunidad'
  | 'Fotografía'
  | 'Accesibilidad';

export interface MisionGenerada {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  puntos: number;
  categoria: CategoriaMision;
}

export function formatearDistancia(metros: number): string {
  return metros < 1000 ? `${metros} m` : `${(metros / 1000).toFixed(1)} km`;
}

export function generarMisiones(lugar: LugarCercano): MisionGenerada[] {
  const texto = `${lugar.tipos.join(' ')} ${lugar.nombre}`.toLowerCase();
  const esComida = /restaurant|food|cafe|bakery|bar|coffee|panader|fonda|cocina/.test(texto);
  const esTienda = /store|shop|supermarket|grocery|market|fruter|mercado/.test(texto);
  const esAtractivo = /tourist|museum|park|attraction|playa|mural|gallery/.test(texto);
  const pocasResenas = (lugar.totalResenas ?? 0) < 25;

  const misiones: MisionGenerada[] = [
    {
      id: `${lugar.placeId}-explorar`,
      titulo: 'Explora este rincón',
      descripcion: `Visita ${lugar.nombre}, a ${formatearDistancia(
        lugar.distanciaMetros
      )} de tu ubicación, y descubre qué lo hace especial.`,
      icono: '🧭',
      puntos: 20,
      categoria: 'Exploración',
    },
  ];

  if (esComida) {
    misiones.push({
      id: `${lugar.placeId}-sabores`,
      titulo: 'Prueba un sabor local',
      descripcion: `Pide la recomendación de la casa en ${lugar.nombre} y anota qué ingrediente local reconociste.`,
      icono: '🍽️',
      puntos: 35,
      categoria: 'Consumo local',
    });
  } else if (esTienda) {
    misiones.push({
      id: `${lugar.placeId}-compra`,
      titulo: 'Apoya el comercio local',
      descripcion: `Compra un producto en ${lugar.nombre} y guarda el ticket como comprobante de tu misión.`,
      icono: '🛍️',
      puntos: 35,
      categoria: 'Consumo local',
    });
  } else if (esAtractivo) {
    misiones.push({
      id: `${lugar.placeId}-cultura`,
      titulo: 'Captura la esencia',
      descripcion: `Encuentra el detalle más fotogénico de ${lugar.nombre} y cuénta qué historia imaginas detrás.`,
      icono: '🎨',
      puntos: 30,
      categoria: 'Exploración',
    });
  } else {
    misiones.push({
      id: `${lugar.placeId}-negocio`,
      titulo: 'Conoce al equipo',
      descripcion: `Pregunta en ${lugar.nombre} desde cuándo están en la zona y escribe un dato curioso.`,
      icono: '💬',
      puntos: 30,
      categoria: 'Comunidad',
    });
  }

  misiones.push(
    pocasResenas
      ? {
          id: `${lugar.placeId}-resena`,
          titulo: 'Sé la voz de este lugar',
          descripcion: `${lugar.nombre} tiene pocas reseñas en Google. Visítalo y comparte tu opinión de forma honesta.`,
          icono: '⭐',
          puntos: 40,
          categoria: 'Comunidad',
        }
      : {
          id: `${lugar.placeId}-contrastar`,
          titulo: 'Contrasta una reseña',
          descripcion: `Lee una reseña de ${lugar.nombre} y comprueba si coincide con tu experiencia. (${lugar.rating?.toFixed(1) ?? '—'}★)`,
          icono: '🔍',
          puntos: 25,
          categoria: 'Comunidad',
        }
  );

  if (lugar.fotoUrl) {
    misiones.push({
      id: `${lugar.placeId}-foto`,
      titulo: 'Misión fotográfica',
      descripcion: `Toma tu propia foto de ${lugar.nombre} y compárala con la que aparece en Google Maps.`,
      icono: '📷',
      puntos: 25,
      categoria: 'Fotografía',
    });
  }

  if (lugar.abiertoAhora) {
    misiones.push({
      id: `${lugar.placeId}-ahora`,
      titulo: 'Aprovecha que está abierto',
      descripcion: `Google indica que ${lugar.nombre} está abierto ahora. ¡Ve antes de que cierre!`,
      icono: '🟢',
      puntos: 15,
      categoria: 'Exploración',
    });
  }

  misiones.push({
    id: `${lugar.placeId}-accesibilidad`,
    titulo: 'Revisa la accesibilidad',
    descripcion: `Observa el acceso a ${lugar.nombre} y anota si hay rampa, pasillo amplio o señalización clara.`,
    icono: '♿',
    puntos: 20,
    categoria: 'Accesibilidad',
  });

  return misiones.slice(0, 4).map((mision, indice) => ({
    ...mision,
    puntos: mision.puntos + indice * 5,
  }));
}
