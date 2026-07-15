import { callAppsScript } from './appsScriptClient'

export type SeatLookupResult =
  | { status: 'unconfigured' }
  | { status: 'not-found' }
  | { status: 'found'; guestName: string; tableNumber: string; note: string }

export async function lookupSeat(name: string): Promise<SeatLookupResult> {
  const endpoint = (import.meta.env.VITE_SEATING_ENDPOINT || import.meta.env.VITE_RSVP_ENDPOINT)?.trim()
  if (!endpoint) return { status: 'unconfigured' }

  const response = await callAppsScript(endpoint, 'lookupSeat', { name })
  if (!response.ok) throw new Error(response.message || 'Не удалось выполнить поиск.')
  if (!response.found) return { status: 'not-found' }

  return {
    status: 'found',
    guestName: String(response.guestName || name),
    tableNumber: String(response.tableNumber || ''),
    note: String(response.note || ''),
  }
}
