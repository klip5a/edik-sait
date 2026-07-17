import { describe, expect, it } from 'vitest'
import { createYandexRouteUrl } from './yandexRoute'

describe('createYandexRouteUrl', () => {
  it('builds a driving route from the guest location to a destination', () => {
    const destination = 'Отделение ЗАГС Ленинского района Екатеринбург Хохрякова 104'
    const url = new URL(createYandexRouteUrl(destination))

    expect(url.origin).toBe('https://yandex.ru')
    expect(url.pathname).toBe('/maps/')
    expect(url.searchParams.get('mode')).toBe('routes')
    expect(url.searchParams.get('rtext')).toBe(`~${destination}`)
    expect(url.searchParams.get('rtt')).toBe('auto')
  })
})
