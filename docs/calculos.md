// src/utils/geo.ts

/**
 * Calcula la distancia en metros entre dos coordenadas geográficas (Haversine).
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Verifica si la posición actual está dentro del radio de tolerancia de un checkpoint.
 */
export function isInsideCheckpointArea(
  currentLat: number,
  currentLng: number,
  checkpointLat: number,
  checkpointLng: number,
  radiusMeters: number = 25
): boolean {
  const distance = calculateDistanceMeters(
    currentLat,
    currentLng,
    checkpointLat,
    checkpointLng
  );
  return distance <= radiusMeters;
}

/**
 * Formatea segundos a tiempo legible HH:MM:SS / MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${remMins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${remMins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

// La distancia GPS suma Haversine entre posiciones aceptadas; redondear solo al mostrar.
// Haversine no representa calles. No guardar distancias ni polilineas devueltas por Routes API.
// Filtrar lecturas antiguas/imprecisas; procesar checkpoints en orden y una sola vez.
// Ritmo aproximado: segundos activos / (metros GPS / 1000); sin distancia, no hay ritmo.