import datos from '../data/comercios.demo.json';

export interface Comercio {
  id: string;
  nombre: string;
  categoria: string;
  modalidad: string;
  zona: string;
  lat: number;
  lng: number;
  reto: string;
  beneficio: string;
  horario: string;
  cupoDiario: number;
  accesibilidad: string[];
  historia: string;
  seed: string;
  /** ID de Google Places. Si se deja vacío se busca el negocio por nombre. */
  placeId?: string;
}

export const comercios: Comercio[] = datos as Comercio[];

export const MODALIDADES = [
  'Todas',
  'Misión Rescate',
  'Consumo Local',
  'Reto Cultural',
  'Ruta Accesible',
] as const;

/** Devuelve el color de acento asociado a cada modalidad. */
export function colorModalidad(modalidad: string): string {
  switch (modalidad) {
    case 'Misión Rescate':
      return 'sky';
    case 'Consumo Local':
      return 'yellow';
    case 'Reto Cultural':
      return 'orange';
    case 'Ruta Accesible':
      return 'cyan';
    default:
      return 'yellow';
  }
}

export function buscarComercio(id: string | undefined): Comercio | undefined {
  if (!id) return undefined;
  return comercios.find((comercio) => comercio.id === id);
}
