import { useEffect, useRef, useState } from 'react';

import type { Comercio } from '../lib/comercios';
import { cargarGoogleMaps } from '../lib/googleMaps';
import type { DatosGoogle } from '../lib/places';

interface Props {
  comercios: Comercio[];
  datos: Record<string, DatosGoogle>;
}

/** Mapa de Google Maps con marcadores enriquecidos con datos de Places. */
export default function MapaGoogle({ comercios, datos }: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<google.maps.Map | null>(null);
  const marcadoresRef = useRef<google.maps.Marker[]>([]);
  const [maps, setMaps] = useState<typeof google.maps | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    void cargarGoogleMaps()
      .then((api) => {
        if (activo) setMaps(api);
      })
      .catch((e: Error) => {
        if (activo) setError(e.message);
      });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!maps || !contenedorRef.current) return;

    if (!mapaRef.current) {
      mapaRef.current = new maps.Map(contenedorRef.current, {
        center: { lat: 21.1619, lng: -86.8276 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false,
      });
    }

    const mapa = mapaRef.current;
    const info = new maps.InfoWindow();

    marcadoresRef.current.forEach((marcador) => marcador.setMap(null));
    marcadoresRef.current = [];

    comercios.forEach((comercio) => {
      const dato = datos[comercio.id];
      const nombre = dato?.nombre ?? comercio.nombre;
      const posicion = dato
        ? { lat: dato.lat, lng: dato.lng }
        : { lat: comercio.lat, lng: comercio.lng };

      const marcador = new maps.Marker({
        position: posicion,
        map: mapa,
        title: nombre,
      });

      const valoracion = dato?.rating
        ? `⭐ ${dato.rating.toFixed(1)} (${dato.totalResenas ?? 0} reseñas)<br />`
        : '';
      const enlace = dato
        ? `<a href="${dato.urlGoogle}" target="_blank" rel="noreferrer">Ver en Google ↗</a>`
        : '';

      marcador.addListener('click', () => {
        info.setContent(
          '<div style="font-family:Nunito,sans-serif;min-width:170px;color:#163047">' +
            `<strong>${nombre}</strong><br />${valoracion}` +
            `${comercio.modalidad} · ${comercio.horario}<br />${enlace}` +
            '</div>'
        );
        info.open(mapa, marcador);
      });

      marcadoresRef.current.push(marcador);
    });
  }, [maps, comercios, datos]);

  useEffect(() => {
    return () => {
      marcadoresRef.current.forEach((marcador) => marcador.setMap(null));
      marcadoresRef.current = [];
      mapaRef.current = null;
    };
  }, []);

  if (error) {
    return <div className="pl-alert pl-alert--error">⚠️ {error}</div>;
  }

  return <div ref={contenedorRef} style={{ height: '100%', width: '100%' }} />;
}
