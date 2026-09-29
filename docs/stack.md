# Stack Tecnologico

## Decisiones para el MVP

| Area | Eleccion | Uso |
| --- | --- | --- |
| Aplicacion | React + TypeScript + Vite | Desarrollo web, interfaz movil y compilacion |
| Mapa | Google Maps JavaScript API | Mapa interactivo y marcadores |
| Ruteo | Routes API, Compute Routes Essentials | Solicitudes peatonales con modo `WALK` y puntos intermedios |
| Geolocalizacion | Geolocation API del navegador | Ubicacion puntual y seguimiento durante la sesion activa |
| Persistencia | Dexie + IndexedDB | Rutas creadas por la persona usuaria y sesiones locales |
| PWA | `vite-plugin-pwa` | Instalacion y shell de aplicacion; no descarga de mapas offline |
| Geometria propia | Haversine, implementacion pequena y probada | Distancia acumulada entre posiciones GPS recibidas |

## Dependencias que no se agregan aun

- No agregar backend, Firebase ni Supabase: el MVP es de un solo usuario y de almacenamiento local.
- No agregar Tailwind por defecto; elegir CSS del proyecto y un sistema visual pequeno cuando se construya la interfaz.
- No agregar `@turf/turf` para el unico calculo Haversine requerido.
- No implementar ruteo propio ni consumir los servidores publicos de teselas de OpenStreetMap como si fueran un servicio gratuito garantizado.

## Google Cloud

Habilitar solo Maps JavaScript API y Routes API. Usar la clave web con restriccion HTTP referrer a los origenes de desarrollo y produccion, y restriccion de API. La clave del navegador es visible para el usuario; las restricciones reducen abuso, no la convierten en secreta. Si Routes API requiere una credencial que no pueda protegerse con estas restricciones, usar un proxy minimo del lado servidor y no exponer esa credencial en el cliente.

Configurar cuotas, monitoreo y alertas antes de usar el proyecto. No habilitar Places, Geocoding, Roads ni APIs que el MVP no necesita.