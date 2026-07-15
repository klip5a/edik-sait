import { callAppsScript } from './appsScriptClient'

export interface RsvpPayload {
  name: string
  attendance: string
  ceremony: string
  photoSession: string
  guestCount: string
  drinksAlcohol: string
  alcohol: string[]
  alcoholOther: string
  dietary: string
  comment: string
  website: string
}

export async function submitRsvp(payload: RsvpPayload): Promise<'remote' | 'demo'> {
  const endpoint = import.meta.env.VITE_RSVP_ENDPOINT?.trim()

  if (!endpoint) {
    localStorage.setItem('wedding-rsvp-draft', JSON.stringify(payload))
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    return 'demo'
  }

  const response = await callAppsScript(endpoint, 'submitRsvp', { ...payload })
  if (!response.ok) throw new Error(response.message || 'Не удалось отправить ответ')
  return 'remote'
}
