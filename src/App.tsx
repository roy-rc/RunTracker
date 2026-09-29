import { useEffect, useMemo, useState } from 'react'
import { APIProvider, Map, Marker, Polyline } from '@vis.gl/react-google-maps'
import { db, type Checkpoint, type Route } from './db'
import { distanceMeters, formatDistance } from './geo'
import { computeWalkingRoute, type StreetRoute } from './services/routes'
import './App.css'

const DEFAULT_CENTER = { lat: -33.485, lng: -70.588 }
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

function App() {
  const [title, setTitle] = useState('Ruta de entrenamiento')
  const [points, setPoints] = useState<Checkpoint[]>([])
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([])
  const [notice, setNotice] = useState('Añade al menos dos puntos para empezar a medir.')
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [currentPosition, setCurrentPosition] = useState<Checkpoint['coordinate'] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [streetRoute, setStreetRoute] = useState<StreetRoute | null>(null)
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)

  const totalDistance = useMemo(() => points.reduce((total, point, index) => {
    if (index === 0) return total
    return total + distanceMeters(points[index - 1].coordinate, point.coordinate)
  }, 0), [points])

  const addPoint = (coordinate: Checkpoint['coordinate']) => {
    const nextPoint: Checkpoint = {
      id: crypto.randomUUID(),
      name: points.length === 0 ? 'Inicio' : points.length === 1 ? 'Meta' : `Checkpoint ${points.length}`,
      order: points.length,
      coordinate,
    }
    setPoints((current) => [...current, nextPoint])
    setStreetRoute(null)
    setNotice('Punto añadido. Puedes moverlo, renombrarlo o seguir trazando.')
  }

  const saveRoute = async () => {
    if (points.length < 2) {
      setNotice('La ruta necesita un inicio y un destino.')
      return
    }
    const now = Date.now()
    const route: Route = { id: crypto.randomUUID(), title: title.trim() || 'Ruta sin nombre', createdAt: now, updatedAt: now, checkpoints: points }
    await db.routes.put(route)
    setSavedRoutes((current) => [route, ...current])
    setNotice('Ruta guardada en este dispositivo.')
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setNotice('Este navegador no permite obtener la ubicación.')
      return
    }

    setIsLocating(true)
    setNotice('Solicitando tu ubicación...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter = { lat: position.coords.latitude, lng: position.coords.longitude }
        setMapCenter(nextCenter)
        setCurrentPosition(nextCenter)
        setIsLocating(false)
        setNotice(`Ubicación encontrada · precisión aproximada de ${Math.round(position.coords.accuracy)} m.`)
      },
      (error) => {
        setIsLocating(false)
        setNotice(error.code === error.PERMISSION_DENIED ? 'Permiso de ubicación denegado. Puedes mover el mapa manualmente.' : 'No fue posible obtener tu ubicación. Inténtalo nuevamente.')
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 },
    )
  }

  const calculateStreetRoute = async () => {
    if (!GOOGLE_MAPS_KEY) {
      setNotice('Configura VITE_GOOGLE_MAPS_API_KEY para calcular rutas por calles.')
      return
    }
    setIsCalculatingRoute(true)
    setNotice('Calculando ruta peatonal por calles...')
    try {
      const result = await computeWalkingRoute(points.map((point) => point.coordinate), GOOGLE_MAPS_KEY)
      setStreetRoute(result)
      setNotice(`Ruta peatonal calculada · ${formatDistance(result.distanceMeters)}.`)
    } catch (error) {
      setStreetRoute(null)
      setNotice(error instanceof Error ? error.message : 'No fue posible calcular la ruta.')
    } finally {
      setIsCalculatingRoute(false)
    }
  }

  useEffect(() => { void db.routes.orderBy('updatedAt').reverse().toArray().then(setSavedRoutes) }, [])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">RT</div>
        <div><p className="eyebrow">RUNTRACKER / PLANIFICADOR</p><h1>Traza una ruta que quieras volver a correr.</h1></div>
        <span className="status-pill"><span className="status-dot" /> Local</span>
      </header>
      <section className="workspace">
        <aside className="control-panel">
          <div className="panel-heading"><div><p className="eyebrow">NUEVA RUTA</p><h2>Diseñador</h2></div><span className="step-label">01 / 03</span></div>
          <label className="field-label" htmlFor="route-title">Nombre de la ruta</label>
          <input id="route-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="metric-panel"><span>{streetRoute ? 'Distancia por calles' : 'Distancia directa estimada'}</span><strong>{formatDistance(streetRoute?.distanceMeters ?? totalDistance)}</strong><small>{points.length} puntos marcados</small></div>
          <div className="point-list" aria-live="polite">
            {points.length === 0 && <p className="empty-copy">Haz clic en el mapa para marcar el inicio de tu recorrido.</p>}
            {points.map((point, index) => <div className="point-row" key={point.id}>
              <span className={`point-index ${index === 0 ? 'start' : index === points.length - 1 ? 'finish' : ''}`}>{index + 1}</span>
              <input aria-label={`Nombre del punto ${index + 1}`} value={point.name} onChange={(event) => setPoints((current) => current.map((item) => item.id === point.id ? { ...item, name: event.target.value } : item))} />
              <button className="icon-button" title="Eliminar punto" onClick={() => setPoints((current) => current.filter((item) => item.id !== point.id).map((item, itemIndex) => ({ ...item, order: itemIndex })))}>×</button>
            </div>)}
          </div>
          <button className="secondary-button" onClick={() => void calculateStreetRoute()} disabled={isCalculatingRoute || points.length < 2}>{isCalculatingRoute ? 'Calculando...' : 'Calcular ruta por calles'}</button>
          <button className="primary-button" onClick={() => void saveRoute()}><span>+</span> Guardar ruta</button>
          <p className="notice">{notice}</p>
          <div className="saved-section"><div className="section-title"><span>RUTAS GUARDADAS</span><span>{savedRoutes.length}</span></div>
            {savedRoutes.slice(0, 3).map((route) => <button className="saved-route" key={route.id} onClick={() => { setTitle(route.title); setPoints(route.checkpoints); setNotice('Ruta cargada. La distancia de calles se recalculará al conectar Google Maps.') }}><span><strong>{route.title}</strong><small>{route.checkpoints.length} puntos</small></span><span>→</span></button>)}
            {savedRoutes.length === 0 && <p className="empty-copy">Tus rutas aparecerán aquí.</p>}
          </div>
        </aside>
        <section className="map-section"><MapCanvas points={points} center={mapCenter} currentPosition={currentPosition} streetPath={streetRoute?.path ?? null} onCenterChange={setMapCenter} onAddPoint={addPoint} /><button className="location-button" onClick={useCurrentLocation} disabled={isLocating} title="Centrar en mi ubicación">{isLocating ? '⌛' : '⌖'} <span>{isLocating ? 'Buscando...' : 'Usar mi ubicación'}</span></button><div className="map-legend"><span className="legend-line" /> {streetRoute ? 'Ruta peatonal por calles' : 'Recorrido directo para prototipo'} <span className="legend-separator" /> GPS aproximado</div></section>
      </section>
    </main>
  )
}

function MapCanvas({ points, center, currentPosition, streetPath, onCenterChange, onAddPoint }: { points: Checkpoint[]; center: Checkpoint['coordinate']; currentPosition: Checkpoint['coordinate'] | null; streetPath: Checkpoint['coordinate'][] | null; onCenterChange: (center: Checkpoint['coordinate']) => void; onAddPoint: (coordinate: Checkpoint['coordinate']) => void }) {
  if (GOOGLE_MAPS_KEY) return <APIProvider apiKey={GOOGLE_MAPS_KEY}><Map center={center} defaultZoom={14} gestureHandling="greedy" disableDefaultUI onCameraChanged={(event) => onCenterChange(event.detail.center)} onClick={(event) => event.detail.latLng && onAddPoint({ lat: event.detail.latLng.lat, lng: event.detail.latLng.lng })}>{points.map((point) => <Marker key={point.id} position={point.coordinate} title={point.name} />)}{currentPosition && <Marker position={currentPosition} title="Mi ubicación actual" />}{streetPath ? <Polyline path={streetPath} options={{ strokeColor: '#e65f38', strokeOpacity: 0.95, strokeWeight: 5 }} /> : points.length > 1 && <Polyline path={points.map((point) => point.coordinate)} options={{ strokeColor: '#e65f38', strokeOpacity: 0.65, strokeWeight: 3, strokeDasharray: '6 6' }} />}</Map></APIProvider>
  const toPosition = (point: Checkpoint) => ({ x: 50 + ((point.coordinate.lng - center.lng) / 0.02) * 100, y: 50 - ((point.coordinate.lat - center.lat) / 0.015) * 100 })
  const linePoints = points.map((point) => { const position = toPosition(point); return `${position.x},${position.y}` }).join(' ')
  const currentMarker = currentPosition ? toPosition({ id: 'current', name: 'Mi ubicación', order: -1, coordinate: currentPosition }) : null
  return <div className="map-fallback" onClick={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); onAddPoint({ lat: center.lat + (0.5 - (event.clientY - bounds.top) / bounds.height) * 0.03, lng: center.lng + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.04 }) }}><div className="map-grid" /><div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" /><div className="map-label label-a">MACUL</div><div className="map-label label-b">SANTIAGO</div>{points.length > 1 && <svg className="fallback-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={linePoints} /></svg>}{points.map((point, index) => { const position = toPosition(point); return <span className="fallback-marker" style={{ left: `${position.x}%`, top: `${position.y}%` }} key={point.id}>{index + 1}</span> })}{currentMarker && <span className="current-marker" style={{ left: `${currentMarker.x}%`, top: `${currentMarker.y}%` }} title="Mi ubicación actual" /> }<div className="map-hint"><span>⌖</span> Haz clic para marcar puntos</div><div className="map-provider-note">Ubicación inicial: Macul · usa el botón para obtener GPS</div></div>
}

export default App
