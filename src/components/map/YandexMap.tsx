import { useEffect, useRef, useState } from 'preact/hooks'
import type { WeddingLocation } from '../../types/wedding'

type LngLat = readonly [number, number]

interface YMapInstance {
  addChild: (child: object) => YMapInstance
  destroy: () => void
}

interface YandexApi3 {
  ready: Promise<void>
  YMap: new (
    element: HTMLElement,
    props: {
      location: { center: LngLat; zoom: number }
      showScaleInCopyrights?: boolean
    },
  ) => YMapInstance
  YMapDefaultSchemeLayer: new (props?: Record<string, unknown>) => object
  YMapDefaultFeaturesLayer: new (props?: Record<string, unknown>) => object
  YMapMarker: new (props: { coordinates: LngLat }, element: HTMLElement) => object
}

declare global {
  interface Window {
    ymaps3?: YandexApi3
  }
}

let loader: Promise<YandexApi3> | null = null

function loadYandexMaps(apiKey: string) {
  if (window.ymaps3) return window.ymaps3.ready.then(() => window.ymaps3 as YandexApi3)
  if (loader) return loader

  loader = new Promise<YandexApi3>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
    script.async = true
    script.onload = async () => {
      if (!window.ymaps3) {
        reject(new Error('Yandex Maps API is unavailable'))
        return
      }

      await window.ymaps3.ready
      resolve(window.ymaps3)
    }
    script.onerror = () => reject(new Error('Unable to load Yandex Maps API'))
    document.head.append(script)
  }).catch((error) => {
    loader = null
    throw error
  })

  return loader
}

function createMarkerElement(location: WeddingLocation) {
  const marker = document.createElement('div')
  marker.className = 'pointer-events-none -translate-x-1/2 -translate-y-full drop-shadow-[0_5px_7px_rgba(92,38,26,0.28)]'
  marker.setAttribute('role', 'img')
  marker.setAttribute('aria-label', `${location.title}: ${location.venue}`)
  marker.title = `${location.venue}, ${location.address}`

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 36 48')
  icon.setAttribute('aria-hidden', 'true')
  icon.classList.add('h-12', 'w-9', 'overflow-visible')

  const pin = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pin.setAttribute('d', 'M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0Z')
  pin.setAttribute('fill', '#ef3f46')
  pin.setAttribute('stroke', '#ffffff')
  pin.setAttribute('stroke-width', '1.5')

  const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  center.setAttribute('cx', '18')
  center.setAttribute('cy', '18')
  center.setAttribute('r', '6')
  center.setAttribute('fill', '#ffffff')

  icon.append(pin, center)
  marker.append(icon)
  return marker
}

export function YandexMap({ locations }: { locations: readonly WeddingLocation[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim()

  useEffect(() => {
    const container = containerRef.current
    if (!container || !apiKey) return
    let disposed = false
    let map: YMapInstance | null = null

    setError('')
    setReady(false)

    loadYandexMaps(apiKey)
      .then((api) => {
        if (disposed) return

        const center: LngLat = [
          locations.reduce((sum, location) => sum + location.coordinates[0], 0) / locations.length,
          locations.reduce((sum, location) => sum + location.coordinates[1], 0) / locations.length,
        ]

        map = new api.YMap(container, {
          location: { center, zoom: 14 },
          showScaleInCopyrights: true,
        })
        map.addChild(new api.YMapDefaultSchemeLayer({}))
        map.addChild(new api.YMapDefaultFeaturesLayer({}))

        locations.forEach((location) => {
          map?.addChild(new api.YMapMarker(
            { coordinates: location.coordinates },
            createMarkerElement(location),
          ))
        })

        setReady(true)
      })
      .catch(() => {
        if (!disposed) setError('Карта временно недоступна. Используйте кнопки маршрута ниже.')
      })

    return () => {
      disposed = true
      map?.destroy()
    }
  }, [apiKey, locations])

  if (!apiKey) {
    return (
      <p class="grid h-full min-h-72 place-items-center rounded-2xl bg-white/90 p-5 text-center text-ink-soft shadow-soft">
        Для встроенной карты добавьте ключ в <code class="text-gold-deep">VITE_YANDEX_MAPS_API_KEY</code>. Ссылки на маршруты уже работают.
      </p>
    )
  }

  return (
    <div class="relative h-full min-h-72 w-full min-w-0 overflow-hidden rounded-2xl bg-white/90 shadow-soft outline-1 -outline-offset-1 outline-black/10" aria-busy={!error && !ready}>
      <div ref={containerRef} class="h-full min-h-72 w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(236,227,211,0.72))]" aria-label="Интерактивная карта с ЗАГСом и рестораном" />
      {!ready && !error ? <p class="pointer-events-none absolute inset-0 grid place-items-center bg-white/55 p-4 text-center text-sm text-ink-soft backdrop-blur-[1px]" role="status">Загружаем карту…</p> : null}
      {error ? <p class="absolute inset-x-0 bottom-0 m-0 bg-white/92 p-3 text-center text-sm text-ink-soft shadow-soft" role="status">{error}</p> : null}
    </div>
  )
}
