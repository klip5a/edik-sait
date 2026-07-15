import { useEffect, useRef, useState } from 'preact/hooks'
import type { WeddingLocation } from '../../types/wedding'

interface GeoObject {
  geometry: { getCoordinates: () => number[] }
  properties: { set: (values: Record<string, string>) => void }
}

interface YandexApi {
  ready: (callback: () => void) => void
  geocode: (query: string) => Promise<{ geoObjects: { get: (index: number) => GeoObject } }>
  Map: new (
    element: HTMLElement,
    state: { center: number[]; zoom: number; controls: string[] },
    options?: Record<string, boolean>,
  ) => {
    geoObjects: {
      add: (item: GeoObject) => void
      getBounds: () => number[][] | null
    }
    setBounds: (bounds: number[][], options: Record<string, boolean | number[]>) => void
    destroy: () => void
  }
}

declare global {
  interface Window {
    ymaps?: YandexApi
  }
}

let loader: Promise<YandexApi> | null = null

function loadYandexMaps(apiKey: string) {
  if (window.ymaps) return Promise.resolve(window.ymaps)
  if (loader) return loader

  loader = new Promise<YandexApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
    script.async = true
    script.onload = () => {
      if (!window.ymaps) {
        reject(new Error('Yandex Maps API is unavailable'))
        return
      }
      window.ymaps.ready(() => resolve(window.ymaps as YandexApi))
    }
    script.onerror = () => reject(new Error('Unable to load Yandex Maps API'))
    document.head.append(script)
  })

  return loader
}

export function YandexMap({ locations }: { locations: readonly WeddingLocation[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim()

  useEffect(() => {
    const container = containerRef.current
    if (!container || !apiKey) return
    let disposed = false
    let map: InstanceType<YandexApi['Map']> | null = null

    loadYandexMaps(apiKey)
      .then(async (api) => {
        if (disposed) return
        map = new api.Map(container, {
          center: [56.83, 60.6],
          zoom: 13,
          controls: ['zoomControl', 'fullscreenControl'],
        }, { suppressMapOpenBlock: true })

        const points = await Promise.all(locations.map((location) => api.geocode(location.mapQuery)))
        if (disposed || !map) return

        points.forEach((result, index) => {
          const point = result.geoObjects.get(0)
          point.properties.set({
            iconCaption: locations[index].venue,
            balloonContentHeader: locations[index].title,
            balloonContentBody: locations[index].address,
          })
          map?.geoObjects.add(point)
        })

        const bounds = map.geoObjects.getBounds()
        if (bounds) map.setBounds(bounds, { checkZoomRange: true, zoomMargin: [36, 36, 36, 36] })
      })
      .catch(() => setError('Карта временно недоступна. Используйте кнопки маршрута ниже.'))

    return () => {
      disposed = true
      map?.destroy()
    }
  }, [apiKey, locations])

  if (!apiKey) {
    return <p class="map-fallback">Для встроенной карты добавьте ключ в <code>VITE_YANDEX_MAPS_API_KEY</code>. Ссылки на маршруты уже работают.</p>
  }

  return (
    <div class="map-shell">
      <div ref={containerRef} class="yandex-map" aria-label="Интерактивная карта с местами свадьбы" />
      {error ? <p class="map-fallback" role="status">{error}</p> : null}
    </div>
  )
}
