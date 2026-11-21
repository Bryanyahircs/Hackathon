/**
 * Carga diferida de la API de Google Maps.
 * Si no hay clave configurada, la app sigue usando el mapa de Leaflet.
 */

export const googleMapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim();

export const tieneGoogleMaps = googleMapsApiKey.length > 0;

const ID_SCRIPT = 'pasolocal-google-maps';

let promesaCarga: Promise<typeof google.maps> | null = null;

export function cargarGoogleMaps(): Promise<typeof google.maps> {
  if (!tieneGoogleMaps) {
    return Promise.reject(new Error('Falta VITE_GOOGLE_MAPS_API_KEY'));
  }

  if (promesaCarga) return promesaCarga;

  promesaCarga = new Promise<typeof google.maps>((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps?.Map) {
      resolve(google.maps);
      return;
    }

    const script = document.createElement('script');
    script.id = ID_SCRIPT;
    script.async = true;
    script.defer = true;
    script.src =
      'https://maps.googleapis.com/maps/api/js' +
      `?key=${encodeURIComponent(googleMapsApiKey)}` +
      '&v=weekly&loading=async&libraries=places';

    script.onload = () => {
      if (typeof google !== 'undefined' && google.maps?.Map) {
        resolve(google.maps);
      } else {
        promesaCarga = null;
        reject(
          new Error(
            'Google Maps no se inicializó. Revisa la clave y que las APIs estén habilitadas.'
          )
        );
      }
    };

    script.onerror = () => {
      promesaCarga = null;
      reject(new Error('No se pudo cargar Google Maps. Revisa la clave API.'));
    };

    document.getElementById(ID_SCRIPT)?.remove();
    document.head.appendChild(script);
  });

  return promesaCarga;
}
