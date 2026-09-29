# Vision General

## Producto

RunTracker es una PWA personal para planificar rutas de running, ejecutarlas con GPS y revisar tiempos por checkpoint. El MVP se considera util cuando permite crear una ruta, guardarla, correrla desde un telefono y consultar el resultado despues.

## Arquitectura decidida

- **Interfaz:** React + TypeScript + Vite.
- **Mapa:** Google Maps JavaScript API.
- **Ruteo peatonal:** Routes API, Compute Routes Essentials, modo `WALK`.
- **GPS:** Geolocation API del navegador (`getCurrentPosition` para centrar y `watchPosition` solo durante una carrera activa).
- **Persistencia:** Dexie sobre IndexedDB, en el dispositivo.
- **Instalacion:** PWA con `vite-plugin-pwa`.
- **Backend y cuentas:** fuera del MVP.

No se usara Google Maps con capas OpenStreetMap, ni se reutilizara contenido de Google sobre mapas de otro proveedor. El mapa y los resultados de Routes se mostraran juntos en Google Maps.

## Datos y limites de persistencia

La base local conservara rutas compuestas por puntos que la persona usuaria eligio y sesiones calculadas a partir de sus propias lecturas GPS. La geometria, distancia y demas contenido devuelto por Google Routes se considera temporal: se consulta de nuevo al abrir o editar una ruta y no se guarda como si fuera informacion propia.

Las coordenadas personales solo se usaran con permiso explicito, se guardaran localmente y podran borrarse desde la aplicacion. No se enviara el track GPS a Google Routes: la API recibira unicamente los puntos que definen la ruta planificada.

## Costos de mapas

La modalidad elegida es pay-as-you-go, no una suscripcion mensual. A la fecha de revision (2026-09-29), Google publica un limite mensual de uso sin cargo de 10.000 eventos para Dynamic Maps y 10.000 solicitudes para Compute Routes Essentials, por SKU. Se requiere habilitar facturacion incluso al usar esas cuotas. El uso que exceda el limite puede generar cargos; consultar la tabla vigente antes de publicar o ampliar el uso.

Para reducir el riesgo: restringir la clave del mapa por origen web y APIs autorizadas, no recalcular mientras se arrastran puntos, solicitar la ruta al confirmar cambios y configurar cuotas diarias y alertas de presupuesto en Google Cloud. Una alerta de presupuesto no es un limite de gasto garantizado.

OpenStreetMap no se elige para este MVP. Sus datos son abiertos, pero los servidores publicos de teselas no son una API gratuita con disponibilidad garantizada y tienen politicas que impiden, entre otras cosas, la descarga para uso offline. Se reconsiderara un proveedor OSM hospedado o infraestructura propia si el costo real de Google resulta inaceptable.

## Fuera del MVP

Sin sincronizacion entre dispositivos, autenticacion, feed social, planes de entrenamiento, analitica avanzada, exportacion GPX, navegacion en segundo plano ni funcionamiento offline de mapas. Una PWA no garantiza GPS continuo con la pantalla bloqueada; esa capacidad requeriria otra evaluacion, posiblemente una app nativa.

## Fuentes verificadas

Consulta realizada el 2026-09-29. Los precios y limites pueden cambiar; revisarlos antes de habilitar el uso real.

- [Lista global de precios de Google Maps Platform](https://developers.google.com/maps/billing-and-pricing/pricing): cuota mensual sin cargo por SKU; Dynamic Maps y Compute Routes Essentials publican 10.000 eventos cada uno. Como referencia inicial sobre la cuota, la tabla lista USD 7 por 1.000 cargas Dynamic Maps y USD 5 por 1.000 solicitudes Compute Routes Essentials; pueden aplicar tramos/reglas regionales.
- [Facturacion y uso de Routes API](https://developers.google.com/maps/documentation/routes/usage-and-billing): habilitar facturacion; Compute Routes factura por solicitud; Essentials permite funciones basicas y hasta 10 waypoints intermedios.
- [Terminos especificos de Google Maps Platform](https://cloud.google.com/maps-platform/terms/maps-service-terms): Routes API permite cache temporal de latitud/longitud hasta 30 dias, no guardar indefinidamente geometria o resultados de ruta.
- [Politica de teselas de OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/): los datos son abiertos, pero el servidor comunitario de teselas tiene politica de uso, disponibilidad best-effort y no permite descarga offline.