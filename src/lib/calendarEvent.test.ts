import { describe, expect, it } from 'vitest'
import { wedding } from '../data/wedding'
import { createCalendarEvent } from './calendarEvent'

describe('createCalendarEvent', () => {
  it('creates calendar exports with UTC wedding times', () => {
    const event = createCalendarEvent(wedding)
    expect(event.ics).toContain('DTSTART:20260815T060000Z')
    expect(event.ics).toContain('DTEND:20260815T190000Z')
    expect(event.googleUrl).toContain('dates=20260815T060000Z/20260815T190000Z')
  })
})
