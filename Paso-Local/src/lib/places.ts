/**
 * Servicio de Google Places (API nueva): busca lugares en un radio circular,
 * obtiene valoraciones, reseñas, fotos y horarios reales.
 *
 * La API nueva se llama por REST (fetch), a diferencia de la antigua
 * PlacesService de JavaScript, que muchós proyectos ya no tienen habilitada.
 */

import { comercios, type Comercio } from './comercios';
import { googleMapsApiKey, tieneGoogleMaps } from './googleMaps';

const BASE_URL = 'https://places.googleapis.com/v1';

const CAMPOS_BUSQUEDA = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.reviews',
  'places.photos',
  'places.types',
  'places.googleMapsUri',
  'places.websiteUri',
  'places.currentOpeningHours',
  'places.priceLevel',
].join(',');

const CAMPOS_DETALLE = CAMPOS_BUSQUEDA.replaceAll('places.', '');

interface TextoPlace {
  text?: string;
}

interface ResenaPlace {
  text?: TextoPlace | string;
  authorAttribution?: { displayName?: string };
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface FotoPlace {
  name?: string;
}

interface PlaceNew {
  id?: string;
  displayName?: TextoPlace;
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  reviews?: ResenaPlace[];
  photos?: FotoPlace[];
  types?: string[];
  googleMapsUri?: string;
  websiteUri?: string;
  currentOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
  priceLevel?: string;
}

interface RespuestaBusqueda {
  places?: PlaceNew[];
}

interface ErrorGoogle {
  error?: { message?: string; status?: string };
}

export interface ResenaGoogle {
  autor: string;
  rating: number;
  texto: string;
  fecha?: string;
}

export interface DatosGoogle {
  placeId: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  rating?: number;
  totalResenas?: number;
  urlGoogle: string;
  fotoUrl?: string;
  horario?: string[];
  resenas: ResenaGoogle[];
}

export interface LugarCercano extends DatosGoogle {
  distanciaMetros: number;
  tipos: string[];
  nivelPrecio?: string;
  sitioWeb?: string;
  abiertoAhora?: boolean;
  esDemo?: boolean;
}

export interface ResultadoBusqueda {
  lugares: LugarCercano[];
  error?: string;
}

const cache = new Map<string, DatosGoogle | null>();

function traducirError(error: unknown): string {
  const mensaje = error instanceof Error ? error.message : String(error);

  if (/permission.?denied|not enabled|not activated|has not been used/i.test(mensaje)) {
    return 'Places API (New) no está habilitada en tu proyecto de Google Cloud.';
  }
  if (/api key|invalid|not valid|key.*invalid/i.test(mensaje)) {
    return 'La clave de Google no es válida o no tiene acceso a Places API (New).';
  }
  if (/quota|resource.?exhausted|billing/i.test(mensaje)) {
    return 'Google rechazó la petición por cuota o facturación. Revisa tu proyecto.';
  }
  if (/failed to fetch|networkerror|network error/i.test(mensaje)) {
    return 'No se pudo contactar con Google. Revisa tu conexión o el bloqueo del navegador.';
  }
  return `Google Places: ${mensaje}`;
}

async function consultarPlaces<T>(
  url: string,
  init: RequestInit,
  campos: string
): Promise<T> {
  const respuesta = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleMapsApiKey,
      'X-Goog-FieldMask': campos,
    },
  });

  if (!respuesta.ok) {
    let mensaje = `Google Places respondió ${respuesta.status}`;
    try {
      const cuerpo = (await respuesta.json()) as ErrorGoogle;
      if (cuerpo.error?.message) mensaje = cuerpo.error.message;
    } catch {
      // Se conserva el mensaje genérico si la respuesta no es JSON.
    }
    throw new Error(mensaje);
  }

  return (await respuesta.json()) as T;
}

function distanciaMetros(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const radioTierra = 6371000;
  const aRad = (lat1 * Math.PI) / 180;
  const bRad = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRad) * Math.cos(bRad) * Math.sin(dLng / 2) ** 2;
  return 2 * radioTierra * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function textoDeResena(resena: ResenaPlace): string {
  if (typeof resena.text === 'string') return resena.text;
  return resena.text?.text ?? '';
}

function urlFoto(place: PlaceNew): string | undefined {
  const nombre = place.photos?.[0]?.name;
  if (!nombre) return undefined;
  return `${BASE_URL}/${nombre}/media?maxWidthPx=640&key=${encodeURIComponent(
    googleMapsApiKey
  )}`;
}

function mapearPlace(
  place: PlaceNew,
  centro?: { lat: number; lng: number }
): DatosGoogle {
  const posicion = place.location ?? {
    latitude: centro?.lat ?? 0,
    longitude: centro?.lng ?? 0,
  };

  return {
    placeId: place.id ?? '',
    nombre: place.displayName?.text ?? 'Negocio local',
    direccion: place.formattedAddress ?? 'Cancún, Quintana Roo',
    lat: posicion.latitude,
    lng: posicion.longitude,
    rating: place.rating,
    totalResenas: place.userRatingCount,
    urlGoogle:
      place.googleMapsUri ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.displayName?.text ?? 'negocio local'
      )}`,
    fotoUrl: urlFoto(place),
    horario: place.currentOpeningHours?.weekdayDescriptions,
    resenas: (place.reviews ?? []).slice(0, 2).map((resena) => ({
      autor: resena.authorAttribution?.displayName ?? 'Visitante',
      rating: resena.rating ?? 0,
      texto: textoDeResena(resena).slice(0, 180),
      fecha: resena.relativePublishTimeDescription ?? resena.publishTime,
    })),
  };
}

/** Busca por texto con la API nueva (para los comercios del JSON). */
async function buscarPorTexto(
  consulta: string,
  centro: { lat: number; lng: number }
): Promise<PlaceNew[]> {
  const respuesta = await consultarPlaces<RespuestaBusqueda>(
    `${BASE_URL}/places:searchText`,
    {
      method: 'POST',
      body: JSON.stringify({
        textQuery: consulta,
        locationBias: {
          circle: {
            center: { latitude: centro.lat, longitude: centro.lng },
            radius: 12000,
          },
        },
        maxResultCount: 3,
      }),
    },
    CAMPOS_BUSQUEDA
  );
  return respuesta.places ?? [];
}

/** Datos de un lugar usando directamente su place_id de Google. */
export async function obtenerDatosPorPlaceId(
  placeId: string
): Promise<DatosGoogle | null> {
  if (!tieneGoogleMaps || !placeId) return null;
  if (cache.has(placeId)) return cache.get(placeId) ?? null;

  try {
    const place = await consultarPlaces<PlaceNew>(
      `${BASE_URL}/places/${encodeURIComponent(placeId)}`,
      { method: 'GET' },
      CAMPOS_DETALLE
    );
    const dato = mapearPlace(place);
    cache.set(placeId, dato);
    return dato;
  } catch {
    cache.set(placeId, null);
    return null;
  }
}

/** Enriquece un comercio del JSON con datos reales de Google. */
export async function obtenerDatosGoogle(
  comercio: Comercio
): Promise<DatosGoogle | null> {
  if (!tieneGoogleMaps) return null;

  const claveCache = comercio.placeId || comercio.nombre;
  if (cache.has(claveCache)) return cache.get(claveCache) ?? null;

  try {
    if (comercio.placeId) {
      const dato = await obtenerDatosPorPlaceId(comercio.placeId);
      if (dato) {
        cache.set(claveCache, dato);
        return dato;
      }
    }

    const resultados = await buscarPorTexto(
      `${comercio.nombre}, ${comercio.zona}, Cancún`,
      { lat: comercio.lat, lng: comercio.lng }
    );
    if (resultados.length === 0) {
      cache.set(claveCache, null);
      return null;
    }

    const dato = mapearPlace(resultados[0]);
    cache.set(claveCache, dato);
    return dato;
  } catch {
    cache.set(claveCache, null);
    return null;
  }
}

/**
 * Devuelve los 5 lugares más cercanos dentro de un círculo.
 * Usa rankPreference=DISTANCE y además filtra por distancia real (Haversine).
 */
export async function buscarLugaresCercanos(
  centro: { lat: number; lng: number },
  radioMetros: number,
  limite = 5
): Promise<ResultadoBusqueda> {
  if (!tieneGoogleMaps) {
    return { lugares: [], error: 'Falta la clave de Google Maps en .env.local.' };
  }

  try {
    const respuesta = await consultarPlaces<RespuestaBusqueda>(
      `${BASE_URL}/places:searchNearby`,
      {
        method: 'POST',
        body: JSON.stringify({
          maxResultCount: Math.min(Math.max(limite, 1), 20),
          rankPreference: 'DISTANCE',
          locationRestriction: {
            circle: {
              center: { latitude: centro.lat, longitude: centro.lng },
              radius: radioMetros,
            },
          },
        }),
      },
      CAMPOS_BUSQUEDA
    );

    const lugares = (respuesta.places ?? [])
      .map((place) => ({
        ...mapearPlace(place, centro),
        distanciaMetros: place.location
          ? Math.round(
              distanciaMetros(
                centro.lat,
                centro.lng,
                place.location.latitude,
                place.location.longitude
              )
            )
          : 0,
        tipos: place.types ?? [],
        nivelPrecio: place.priceLevel,
        sitioWeb: place.websiteUri,
        abiertoAhora: place.currentOpeningHours?.openNow,
        esDemo: false,
      }))
      .filter((lugar) => lugar.distanciaMetros <= radioMetros)
      .sort((a, b) => a.distanciaMetros - b.distanciaMetros)
      .slice(0, limite);

    return { lugares };
  } catch (error) {
    return { lugares: [], error: traducirError(error) };
  }
}

/** Modo demo: usa los comercios del JSON como si fueran resultados del radio. */
export function lugaresDemoCercanos(
  centro: { lat: number; lng: number },
  radioMetros: number,
  limite = 5
): LugarCercano[] {
  return comercios
    .map((comercio) => ({
      placeId: comercio.placeId ?? comercio.id,
      nombre: comercio.nombre,
      direccion: comercio.zona,
      lat: comercio.lat,
      lng: comercio.lng,
      rating: undefined,
      totalResenas: undefined,
      urlGoogle: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${comercio.nombre} Cancún`
      )}`,
      horario: [comercio.horario],
      resenas: [],
      distanciaMetros: Math.round(
        distanciaMetros(centro.lat, centro.lng, comercio.lat, comercio.lng)
      ),
      tipos: [comercio.categoria, comercio.modalidad],
      abiertoAhora: undefined,
      esDemo: true,
    }))
    .filter((lugar) => lugar.distanciaMetros <= radioMetros)
    .sort((a, b) => a.distanciaMetros - b.distanciaMetros)
    .slice(0, limite);
}
