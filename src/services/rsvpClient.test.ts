import { beforeEach, describe, expect, it } from 'vitest'
import { submitRsvp, type RsvpPayload } from './rsvpClient'

describe('submitRsvp', () => {
  beforeEach(() => localStorage.clear())

  it('keeps a local draft when the production endpoint is not configured', async () => {
    const payload: RsvpPayload = {
      name: 'Иван Иванов', attendance: 'no', ceremony: '', photoSession: '', guestCount: '',
      drinksAlcohol: '', alcohol: [], alcoholOther: '', dietary: '', comment: '', website: '',
    }

    await expect(submitRsvp(payload)).resolves.toBe('demo')
    expect(JSON.parse(localStorage.getItem('wedding-rsvp-draft') || '{}')).toMatchObject({ name: 'Иван Иванов' })
  })
})
