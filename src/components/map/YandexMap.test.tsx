import { render, waitFor } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { wedding } from '../../data/wedding'
import { YandexMap } from './YandexMap'

describe('YandexMap', () => {
  afterEach(() => {
    delete window.ymaps3
  })

  it('adds two wedding markers without the paid router API', async () => {
    const addChild = vi.fn(function addChild(this: object) {
      return this
    })
    const destroy = vi.fn()
    const markerConstructor = vi.fn(function Marker(this: object, props: object, element: HTMLElement) {
      Object.assign(this, { props, element })
    })

    window.ymaps3 = {
      ready: Promise.resolve(),
      YMap: vi.fn(function Map(this: object) {
        Object.assign(this, { addChild, destroy })
      }) as never,
      YMapDefaultSchemeLayer: vi.fn(function Scheme(this: object) {}) as never,
      YMapDefaultFeaturesLayer: vi.fn(function Features(this: object) {}) as never,
      YMapMarker: markerConstructor as never,
    }

    const { unmount } = render(<YandexMap locations={wedding.locations} />)

    await waitFor(() => expect(markerConstructor).toHaveBeenCalledTimes(2))
    expect(markerConstructor).toHaveBeenNthCalledWith(
      1,
      { coordinates: wedding.locations[0].coordinates },
      expect.any(HTMLElement),
    )
    expect(markerConstructor).toHaveBeenNthCalledWith(
      2,
      { coordinates: wedding.locations[1].coordinates },
      expect.any(HTMLElement),
    )
    expect(addChild).toHaveBeenCalledTimes(4)

    unmount()
    expect(destroy).toHaveBeenCalledOnce()
  })
})
