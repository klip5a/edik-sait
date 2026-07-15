import { describe, expect, it } from 'vitest'
import { getCountdown } from './countdown'

describe('getCountdown', () => {
  const start = '2026-08-15T11:00:00+05:00'
  const end = '2026-08-16T00:00:00+05:00'

  it('returns a stable breakdown before the ceremony', () => {
    expect(getCountdown(start, end, new Date('2026-08-14T09:30:15+05:00'))).toEqual({
      status: 'before', days: 1, hours: 1, minutes: 29, seconds: 45,
    })
  })

  it('switches between wedding-day and after states', () => {
    expect(getCountdown(start, end, new Date('2026-08-15T12:00:00+05:00')).status).toBe('wedding-day')
    expect(getCountdown(start, end, new Date('2026-08-16T00:00:00+05:00')).status).toBe('after')
  })
})
