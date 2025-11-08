import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { Point } from '../types'

const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster' as const,
      source: 'osm',
    },
  ],
}

export function useMap(container: string) {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const currentMarkerRef = useRef<maplibregl.Marker | null>(null)
  const routePointMarkersRef = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    const containerEl = document.getElementById(container)
    if (!containerEl) {
      console.error('❌ Container not found:', container)
      return
    }

    try {
      mapRef.current = new maplibregl.Map({
        container: containerEl,
        style: MAP_STYLE as any,
        center: [31.2803, 58.5282],
        zoom: 14,
      })

      mapRef.current.on('load', () => {
        console.log('✅ Map loaded')
        setIsLoaded(true)
        mapRef.current?.addControl(new maplibregl.NavigationControl(), 'top-right')
      })

      mapRef.current.on('error', e => {
        console.error('❌ Map error:', e)
      })
    } catch (err) {
      console.error('❌ Init error:', err)
    }

    return () => {
      try {
        mapRef.current?.remove()
      } catch (e) {
        console.error('Error removing map:', e)
      }
    }
  }, [container])

  const addRoutePoint = (point: Point, label: string) => {
    if (!mapRef.current) return

    try {
      const el = document.createElement('div')
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #00FF00;
        border: 2px solid white;
        box-shadow: 0 0 8px #00FF00;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: black;
      `
      el.textContent = label

      const marker = new maplibregl.Marker({ element: el }).setLngLat([point.lng, point.lat]).addTo(mapRef.current)

      routePointMarkersRef.current.push(marker)
    } catch (err) {
      console.error('❌ Error adding route point:', err)
    }
  }

  const setCurrentPosition = (point: Point) => {
    if (!mapRef.current) return

    try {
      if (currentMarkerRef.current) {
        currentMarkerRef.current.remove()
      }

      const el = document.createElement('div')
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #FF0099;
        border: 3px solid white;
        box-shadow: 0 0 12px #FF0099;
      `

      const marker = new maplibregl.Marker({ element: el }).setLngLat([point.lng, point.lat]).addTo(mapRef.current)

      currentMarkerRef.current = marker
    } catch (err) {
      console.error('❌ Error setting current position:', err)
    }
  }

  // ✅ ДОБАВИТЬ МАРШРУТ
  const addRoute = (start: Point, end: Point) => {
    if (!mapRef.current) return

    try {
      const routeId = 'main-route'

      if (mapRef.current.getLayer(routeId)) {
        mapRef.current.removeLayer(routeId)
      }
      if (mapRef.current.getSource(routeId)) {
        mapRef.current.removeSource(routeId)
      }

      mapRef.current.addSource(routeId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat],
            ],
          },
          properties: {},
        },
      })

      mapRef.current.addLayer({
        id: routeId,
        type: 'line',
        source: routeId,
        paint: {
          'line-color': '#FF00FF',
          'line-width': 3,
          'line-opacity': 0.8,
        },
      })
    } catch (err) {
      console.error('❌ Error adding route:', err)
    }
  }

  // ✅ ПЕРЕМЕСТИТЬ КАРТУ
  const panTo = (point: Point) => {
    if (!mapRef.current) return

    try {
      mapRef.current.easeTo({
        center: [point.lng, point.lat],
        zoom: 14,
        duration: 300,
      })
    } catch (err) {
      console.error('Error panning to point:', err)
    }
  }

  return {
    map: mapRef.current,
    isLoaded,
    addRoutePoint,
    setCurrentPosition,
    addRoute,
    panTo,
  }
}
