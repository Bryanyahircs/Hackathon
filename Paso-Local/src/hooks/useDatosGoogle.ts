import { useEffect, useState } from 'react';

import { buscarComercio } from '../lib/comercios';
import { tieneGoogleMaps } from '../lib/googleMaps';
import {
  obtenerDatosGoogle,
  obtenerDatosPorPlaceId,
} from '../lib/places';
import type { DatosGoogle } from '../lib/places';

/**
 * Carga datos de Google Places para una lista de IDs separados por "|".
 * Acepta tanto IDs del JSON demo como place_id reales de Google.
 */
export function useDatosGoogle(idsClave: string): Record<string, DatosGoogle> {
  const [datos, setDatos] = useState<Record<string, DatosGoogle>>({});

  useEffect(() => {
    if (!tieneGoogleMaps || !idsClave) return;

    let activo = true;
    const ids = idsClave.split('|').filter(Boolean);

    void Promise.all(
      ids.map(async (id) => {
        const comercio = buscarComercio(id);
        const dato = comercio
          ? await obtenerDatosGoogle(comercio)
          : await obtenerDatosPorPlaceId(id);
        return [id, dato] as const;
      })
    ).then((entradas) => {
      if (!activo) return;
      const resultado: Record<string, DatosGoogle> = {};
      entradas.forEach(([id, dato]) => {
        if (dato) resultado[id] = dato;
      });
      setDatos(resultado);
    });

    return () => {
      activo = false;
    };
  }, [idsClave]);

  return datos;
}
