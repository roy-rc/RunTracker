import { decode } from '@googlemaps/polyline-codec'
import type { Coordinate } from '../geo'

const ROUTES_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes'

type RoutesResponse = {
  routes?: Array<{
    distanceMeters?: number
    polyline?: { encodedPolyline?: string }
  }>
}

export type StreetRoute = {
  distanceMeters: number
  path: Coordinate[]
}

export async function computeWalkingRoute(points: Coordinate[], apiKey: string): Promise<StreetRoute> {
  if (points.length < 2) throw new Error('Se necesitan al menos dos puntos para calcular una ruta.')

  const [origin, ...rest] = points
  const destination = rest.pop() as Coordinate
  const response = await fetch(ROUTES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.distanceMeters,routes.polyline.encodedPolyline',
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      intermediates: rest.map((point) => ({ location: { latLng: { latitude: point.lat, longitude: point.lng } } })),
      travelMode: 'WALK',
      computeAlternativeRoutes: false,
      languageCode: 'es-CL',
      units: 'METRIC',
    }),
  })

  if (!response.ok) throw new Error(`Routes API respondió con error ${response.status}. Revisa APIs, facturación y restricciones de la clave.`)
  const data = await response.json() as RoutesResponse
  const route = data.routes?.[0]
  const encodedPolyline = route?.polyline?.encodedPolyline
  if (!route?.distanceMeters || !encodedPolyline) throw new Error('Routes API no devolvió una ruta para estos puntos.')

  return { distanceMeters: route.distanceMeters, path: decode(encodedPolyline, 5).map(([lat, lng]) => ({ lat, lng })) }
}
