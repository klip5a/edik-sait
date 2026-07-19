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
  const response = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.ok) throw new Error(result.message || 'Не удалось отправить ответ')
  return 'remote'
}
