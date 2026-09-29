# Geolocalizacion y Seguimiento

## Permisos y ubicacion inicial

- Solicitar ubicacion solo al pulsar "Usar mi ubicacion" o al iniciar una carrera; explicar para que se necesita.
- Usar `getCurrentPosition` para centrar el mapa. Si se deniega el permiso o falla, permitir crear la ruta moviendo el mapa manualmente.
- Geolocalizacion requiere contexto seguro: HTTPS en un despliegue y localhost durante desarrollo.
- No obtener ubicacion continuamente mientras la persona solo planifica una ruta.

## Sesion activa

- Iniciar `watchPosition` al comenzar o reanudar; cancelarlo al pausar, finalizar o abandonar la pantalla.
- Usar `enableHighAccuracy: true`, `maximumAge` bajo y timeout razonable, probando consumo de bateria en el dispositivo real.
- Guardar localmente solo las metricas y splits requeridos. No enviar el track GPS a Routes API.
- Mostrar estado de permiso, ultima lectura, precision horizontal y errores recuperables.
- Si `accuracy` supera el umbral de calidad de la sesion, no usar esa posicion para sumar distancia ni completar checkpoints.
- Calcular distancia entre muestras GPS aceptadas; la posicion planificada no se usa como sustituto del track real.

## Checkpoints

- Evaluar solo el siguiente checkpoint pendiente en el orden de la ruta.
- Activar al entrar en un radio inicial de 25 m, siempre que la lectura sea suficientemente precisa.
- Guardar una sola marca de paso y tiempo activo por checkpoint. Incorporar accion manual de "Registrar checkpoint" como respaldo.
- Probar radios distintos en recorridos reales; no asumir que 15 m funciona para todos los telefonos o entornos.

## Limitaciones de PWA

El navegador puede pausar JavaScript o GPS con la pantalla bloqueada, durante ahorro de energia o al cambiar de aplicacion. El MVP solo pretende seguimiento con la PWA abierta y activa; debe mostrar esta limitacion antes de iniciar. No ofrecer modo offline de mapas ni prometer alertas fiables con la pantalla apagada.

## Privacidad

Las coordenadas de inicio/checkpoints y el resultado GPS pueden revelar ubicaciones personales. Solicitar consentimiento, evitar telemetria con coordenadas, guardar localmente y facilitar el borrado de rutas y sesiones.