# Idea del Proyecto

RunTracker es una herramienta personal, sin objetivo de monetizacion, para planificar recorridos de running cerca de casa y medir el progreso durante entrenamientos de 3 km y 5 km, con posibilidad de ampliar a 10 km.

La persona usuaria debe poder elegir puntos en un mapa, obtener una ruta por calles con distancia estimada, guardar la secuencia de puntos y correrla desde el telefono. Durante la carrera, la aplicacion muestra el tiempo, detecta checkpoints y registra tiempos parciales para comparar sesiones.

## Resultado buscado

Contar con una PWA sencilla que permita completar este ciclo: disenar una ruta, correrla con el telefono y revisar el tiempo total y los splits. La prioridad es validar que la planificacion y el seguimiento resulten utiles en entrenamientos reales; no construir una plataforma social ni un producto comercial.

## Decisiones iniciales

- El MVP se construira como aplicacion web instalable (PWA), no como app nativa.
- Se usara Google Maps para el mapa y Google Routes API para obtener distancias por calles.
- Se empezara con persistencia local, sin cuentas ni backend de producto.
- El seguimiento GPS del MVP funcionara con la aplicacion abierta y en primer plano.
- Las carreras se mediran con los puntos GPS recibidos por el dispositivo; una ruta planificada es una referencia, no una garantia de seguridad ni de distancia exacta.

