export type Coordinate = { lat: number; lng: number }

const EARTH_RADIUS_METERS = 6_371_000

export function distanceMeters(first: Coordinate, second: Coordinate) {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const latitudeDelta = radians(second.lat - first.lat)
  const longitudeDelta = radians(second.lng - first.lng)
  const firstLatitude = radians(first.lat)
  const secondLatitude = radians(second.lat)
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(2)} km`
}
