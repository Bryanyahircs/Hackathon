import { useEffect, useRef, useState } from 'react';

import { cargarGoogleMaps } from '../lib/googleMaps';
import type { LugarCercano } from '../lib/places';

interface Props {
  centro: { lat: number; lng: number };
  radioMetros: number;
  lugares: LugarCercano[];
  onSeleccionar?: (lugar: LugarCercano) => void;
}

/** Mapa con un círculo que representa el radio de búsqueda y los lugares encontrados. */
export default function MapaRango({
  centro,
  radioMetros,
  lugares,
  onSeleccionar,
}: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<google.maps.Map | null>(null);
  const circuloRef = useRef<google.maps.Circle | null>(null);
  const marcadoresRef = useRef<google.maps.Marker[]>([]);
  const seleccionRef = useRef(onSeleccionar);
  const [maps, setMaps] = useState<typeof google.maps | null>(null);

  useEffect(() => {
    seleccionRef.current = onSeleccionar;
  }, [onSeleccionar]);

  useEffect(() => {
    let activo = true;
    void cargarGoogleMaps()
      .then((api) => {
        if (activo) setMaps(api);
      })
      .catch(() => undefined);
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!maps || !contenedorRef.current) return;

    if (!mapaRef.current) {
      mapaRef.current = new maps.Map(contenedorRef.current, {
        mapTypeId: maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false,
      });
    }
    const mapa = mapaRef.current;

    circuloRef.current?.setMap(null);
    circuloRef.current = new maps.Circle({
      map: mapa,
      center: centro,
      radius: radioMetros,
      strokeColor: '#ff8c42',
      strokeOpacity: 0.95,
      strokeWeight: 3,
      fillColor: '#46c2f2',
      fillOpacity: 0.14,
    });

    marcadoresRef.current.forEach((marcador) => marcador.setMap(null));
    marcadoresRef.current = lugares.map((lugar) => {
      const marcador = new maps.Marker({
        position: { lat: lugar.lat, lng: lugar.lng },
        map: mapa,
        title: lugar.nombre,
      });
      marcador.addListener('click', () => seleccionRef.current?.(lugar));
      return marcador;
    });

    const limites = new maps.LatLngBounds();
    limites.extend(centro);
    lugares.forEach((lugar) => limites.extend({ lat: lugar.lat, lng: lugar.lng }));
    mapa.fitBounds(limites, { top: 36, right: 36, bottom: 36, left: 36 });
  }, [maps, centro, radioMetros, lugares]);

  useEffect(() => {
    return () => {
      marcadoresRef.current.forEach((marcador) => marcador.setMap(null));
      circuloRef.current?.setMap(null);
      marcadoresRef.current = [];
      mapaRef.current = null;
    };
  }, []);

  return <div ref={contenedorRef} style={{ height: '100%', width: '100%' }} />;
}
