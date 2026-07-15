export type CountdownStatus = 'before' | 'wedding-day' | 'after'

export interface CountdownValue {
  status: CountdownStatus
  days: number
  hours: number
  minutes: number
  seconds: number
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function getCountdown(startsAt: string, endsAt: string, now = new Date()): CountdownValue {
  const start = new Date(startsAt).getTime()
  const end = new Date(endsAt).getTime()
  const current = now.getTime()

  if (current >= end) {
    return { status: 'after', days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  if (current >= start) {
    return { status: 'wedding-day', days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  let remainder = start - current
  const days = Math.floor(remainder / DAY)
  remainder -= days * DAY
  const hours = Math.floor(remainder / HOUR)
  remainder -= hours * HOUR
  const minutes = Math.floor(remainder / MINUTE)
  remainder -= minutes * MINUTE

  return {
    status: 'before',
    days,
    hours,
    minutes,
    seconds: Math.floor(remainder / SECOND),
  }
}
