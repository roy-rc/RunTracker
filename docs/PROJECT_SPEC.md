# RunTracker: Especificacion del MVP

## Objetivo
Crear una PWA personal para disenar rutas de running por calles, guardarlas en el dispositivo, correrlas con seguimiento GPS en primer plano y consultar tiempos por checkpoint.

## Historias y alcance

1. Como corredor, quiero centrar el mapa en mi ubicacion o navegarlo manualmente para crear una ruta cerca de casa.
2. Quiero agregar y ordenar puntos, ver una ruta peatonal y sus distancias antes de guardarla.
3. Quiero reabrir una ruta y volver a calcular su geometria con Routes API.
4. Quiero iniciar, pausar, reanudar y finalizar una sesion desde el telefono.
5. Quiero ver tiempo, distancia GPS, ritmo aproximado y splits registrados al pasar por checkpoints.
6. Quiero revisar y borrar sesiones guardadas localmente.

Una ruta es una secuencia abierta: inicio, cero o mas checkpoints intermedios y final. No se conecta el final con el inicio automaticamente.

## Reglas de datos

- Guardar las coordenadas y nombres de checkpoints que la persona usuaria coloca y confirma, con permiso explicito.
- Mantener en memoria, sin persistir, la geometria y las distancias que devuelve Google Routes.
- Calcular splits con posiciones GPS del dispositivo y guardar sesiones localmente; no enviar tracks a un servidor.

No persistir la traza GPS completa en la primera version. Si luego se necesita mapa del recorrido real o exportacion, definir retencion, privacidad y borrado antes de almacenarla.

## Requisitos y exclusiones

- Una ruta requiere al menos inicio y final; IDs y orden son estables.
- Mostrar estados de carga/error de mapa, ubicacion y ruteo.
- Los checkpoints se detectan en orden y pueden registrarse manualmente como respaldo.
- Pausar detiene reloj y seguimiento; finalizar guarda la sesion sin duplicar pasos.
- Informar que GPS y distancia son aproximados y que la PWA debe permanecer abierta y activa.
- HTTPS es necesario fuera de localhost para geolocalizacion.
- Sin backend, autenticacion, sincronizacion, estadisticas avanzadas, notificaciones en segundo plano ni mapas offline.
- No usar datos de Routes API sobre un mapa distinto de Google Maps.

## Modelo TypeScript propuesto

```ts
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Checkpoint {
  id: string;
  name: string;
  order: number;
  coordinate: Coordinate;
}

export interface Route {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  checkpoints: Checkpoint[];
}

export interface SectorSplit {
  checkpointId: string;
  reachedAt: number;
  elapsedSeconds: number; // Duracion activa del sector, no acumulada desde el inicio
  gpsDistanceMeters: number;
  paceSecondsPerKm: number | null;
}

export interface RunSession {
  id: string;
  routeId: string;
  startedAt: number;
  endedAt?: number;
  elapsedSeconds: number;
  gpsDistanceMeters: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  splits: SectorSplit[];
}
```