import { afterEach, describe, expect, it, vi } from 'vitest'
import { callAppsScript } from './appsScriptClient'

describe('callAppsScript', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sends an action envelope and parses a JSON response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, found: true, tableNumber: '4' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await callAppsScript('https://example.test/exec', 'lookupSeat', { name: 'Иван Иванов' })

    expect(result).toMatchObject({ ok: true, found: true, tableNumber: '4' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/exec',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ action: 'lookupSeat', payload: { name: 'Иван Иванов' } }),
      }),
    )
  })

  it('rejects malformed server responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ hello: 'world' }) }))
    await expect(callAppsScript('https://example.test/exec', 'lookupSeat', { name: 'Иван' })).rejects.toThrow('INVALID_RESPONSE')
  })
})
