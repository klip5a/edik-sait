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
}

export async function submitRsvp(payload: RsvpPayload): Promise<'remote' | 'demo'> {
  const endpoint = import.meta.env.VITE_RSVP_ENDPOINT?.trim()

  if (!endpoint) {
    localStorage.setItem('wedding-rsvp-draft', JSON.stringify(payload))
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    return 'demo'
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Не удалось отправить ответ')
  return 'remote'
}
