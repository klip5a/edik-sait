import { describe, expect, it } from 'vitest'
import { wedding } from '../data/wedding'
import { createCalendarEvent } from './calendarEvent'

describe('createCalendarEvent', () => {
  it('creates a direct Google Calendar link with UTC wedding times', () => {
    const event = createCalendarEvent(wedding)
    expect(event.googleUrl).toContain('dates=20260815T060000Z/20260815T190000Z')
  })
})
