import { useEffect, useState, useCallback, useMemo } from 'react'
import './App.css'
import { useMap } from './hooks/useMap'
import { Point } from './types'

const STEP = 0.0005
const NOVGOROD_CENTER: Point = { lng: 31.2803, lat: 58.5282 }

// координаты улиц Великого Новгорода
const NOVGOROD_STREETS: Point[] = [
  { lng: 31.277, lat: 58.528 },
  { lng: 31.283, lat: 58.529 },
  { lng: 31.281, lat: 58.525 },
  { lng: 31.275, lat: 58.523 },
  { lng: 31.285, lat: 58.531 },
  { lng: 31.279, lat: 58.530 },
  { lng: 31.272, lat: 58.527 },
  { lng: 31.280, lat: 58.520 },
  { lng: 31.288, lat: 58.524 },
  { lng: 31.276, lat: 58.532 },
]

export default function App() {
  const { isLoaded, addRoutePoint, setCurrentPosition, addRoute, panTo } = useMap('map-container')

  const [currentPos, setCurrentPos] = useState<Point>(NOVGOROD_CENTER)
  const [nearestIndex, setNearestIndex] = useState<number | null>(null)
  const [isRouteActive, setIsRouteActive] = useState(false)

  // генерация точек (useMemo)
  const points = useMemo(() => {
    const newPoints: Point[] = []
    for (let i = 0; i < 15; i++) {
      newPoints.push(NOVGOROD_STREETS[i % NOVGOROD_STREETS.length])
    }
    return newPoints.map((p) => ({
      lng: p.lng + (Math.random() - 0.5) * 0.001,
      lat: p.lat + (Math.random() - 0.5) * 0.001,
    }))
  }, []) 

  useEffect(() => {
    if (!isLoaded) return

    console.log(' Initializing map...')

    // добавить только зелёные
    points.forEach((p, i) => {
      addRoutePoint(p, (i + 1).toString())
    })

    setCurrentPosition(NOVGOROD_CENTER)
    panTo(NOVGOROD_CENTER)

    console.log('✅ Map initialized with', points.length, 'points')
  }, [isLoaded]) 

  // поиск ближайшей
  const findNearestPoint = useCallback(() => {
    if (points.length === 0) return null

    let nearest = 0
    let minDistance = Infinity

    points.forEach((p, i) => {
      const dx = p.lng - currentPos.lng
      const dy = p.lat - currentPos.lat
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < minDistance) {
        minDistance = distance
        nearest = i
      }
    })

    return nearest
  }, [points, currentPos])

  // показать маршрут
  const handleShowRoute = useCallback(() => {
    const nearest = findNearestPoint()
    if (nearest === null) return

    setNearestIndex(nearest)
    setIsRouteActive(true)
    addRoute(currentPos, points[nearest])
    console.log(`🗺️ Route to point ${nearest + 1}`)
  }, [findNearestPoint, addRoute, currentPos, points])

  // перемещение по координатам
  const handleMove = useCallback(
    (dx: number, dy: number) => {
      const newPos: Point = {
        lng: currentPos.lng + dx,
        lat: currentPos.lat + dy,
      }

      setCurrentPos(newPos)
      setCurrentPosition(newPos)
      panTo(newPos)

      if (isRouteActive && nearestIndex !== null) {
        addRoute(newPos, points[nearestIndex])
      }
    },
    [currentPos, isRouteActive, nearestIndex, points, setCurrentPosition, panTo, addRoute]
  )

  return (
    <div className="app">
      <div id="map-container" className="map-container" />

      <div className="panel">
        <h2>🗺️ Карта Великого Новгорода</h2>

        <div className="info">
          <p>📍 Ваша позиция:</p>
          <p style={{ fontSize: '12px', color: '#00FF00' }}>
            {currentPos.lng.toFixed(4)}, {currentPos.lat.toFixed(4)}
          </p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Целей: {points.length}
            {nearestIndex !== null && ` | Ближайшая: ${nearestIndex + 1}`}
          </p>
        </div>

        <button onClick={handleShowRoute} className="btn btn-primary" disabled={!isLoaded}>
          🎯 Маршрут к ближайшей
        </button>

        <div className="controls">
          <p className="label">⬆️ ⬇️ ⬅️ ➡️</p>

          <div className="d-pad">
            <button
              onClick={() => handleMove(0, STEP)}
              className="btn btn-dpad up"
              disabled={!isLoaded}
              title="Север"
            >
              ⬆️
            </button>

            <div className="d-pad-middle">
              <button
                onClick={() => handleMove(-STEP, 0)}
                className="btn btn-dpad left"
                disabled={!isLoaded}
                title="Запад"
              >
                ⬅️
              </button>
              <div className="d-pad-center" />
              <button
                onClick={() => handleMove(STEP, 0)}
                className="btn btn-dpad right"
                disabled={!isLoaded}
                title="Восток"
              >
                ➡️
              </button>
            </div>

            <button
              onClick={() => handleMove(0, -STEP)}
              className="btn btn-dpad down"
              disabled={!isLoaded}
              title="Юг"
            >
              ⬇️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
