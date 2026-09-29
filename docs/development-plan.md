# Plan de Desarrollo

El orden de trabajo prioriza una prueba temprana del ruteo y luego un ciclo completo en telefono. No iniciar persistencia de resultados Google ni funciones que dependan de GPS en segundo plano.

## Fase 0: Prueba tecnica de Google Maps

1. Crear un proyecto de Google Cloud, habilitar facturacion y las APIs estrictamente necesarias.
2. Configurar la clave con restriccion por origen web y por API; no incluir una clave sin restricciones en el repositorio.
3. Probar mapa, marcador de posicion actual y una solicitud peatonal con dos o tres puntos en la zona real de uso.
4. Confirmar cobertura, geometria y distancia devueltas, permisos del navegador, costo/SKU y mecanismo seguro para invocar Routes API desde la web.
5. Configurar cuota diaria y alerta de presupuesto. Si el flujo seguro o la experiencia de ruteo no funcionan, detenerse y reevaluar proveedor antes de ampliar el desarrollo.

## Fase 1: Planificador

- Crear una ruta con nombre, punto inicial, checkpoints ordenados y punto final. Una ruta no se cierra automaticamente; para volver al inicio se agrega ese punto como destino final.
- Centrar el mapa manualmente o solicitar ubicacion actual con permiso.
- Agregar, mover, renombrar y eliminar puntos.
- Pedir ruta peatonal por calles al confirmar cambios; mostrar distancia total y de cada tramo mientras el resultado esta en memoria.
- Guardar solo los datos introducidos por la persona usuaria (puntos y nombres) en IndexedDB. Al reabrir, volver a solicitar la ruta; no persistir polilinea ni distancias de Google.
- Probar los casos de permiso denegado, falta de red, ruta no encontrada y clave/API no disponible.

## Fase 2: Modo carrera

- Instalar y probar la PWA en el telefono mediante HTTPS.
- Iniciar, pausar, reanudar y finalizar una sesion; activar `watchPosition` solo mientras corresponda y limpiar la suscripcion al salir.
- Mostrar tiempo total, distancia observada por GPS, ritmo aproximado y precision GPS.
- Detectar checkpoints en orden, con radio inicial configurable de 25 m y filtro por precision; permitir registrar manualmente un checkpoint omitido.
- Guardar localmente tiempos y distancias medidos desde las posiciones del dispositivo. Mostrar claramente que el GPS puede desviarse.
- Mantener el telefono despierto si el navegador lo permite; no prometer seguimiento en segundo plano o pantalla bloqueada.

## Fase 3: Historial basico

- Listar sesiones por fecha y ruta.
- Comparar tiempo total y splits de una misma ruta.
- Permitir borrar rutas y sesiones.
- Considerar exportacion GPX/JSON solo despues de validar el MVP.

## Criterios para probar el MVP

- Una ruta puede crearse, cerrarse y abrirse despues sin perder los puntos elegidos.
- El mapa calcula una ruta peatonal por calles y muestra una distancia coherente para la zona de prueba.
- Una carrera registra inicio, checkpoints, splits y final sin duplicar pasos.
- Si GPS, permiso, red o API falla, la interfaz informa el problema y no pierde una sesion ya guardada.
- Se completan varias salidas reales y se anotan diferencias frente a reloj/medicion de referencia antes de ajustar radios y metricas.