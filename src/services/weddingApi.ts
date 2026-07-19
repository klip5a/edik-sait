import type { RsvpPayload } from './rsvpClient'

export interface AdminGuest {
  id: number
  name: string
  publicName: string
  attendance: string
  ceremony: string
  photoSession: string
  guestCount: number
  drinksAlcohol: string
  alcohol: string[]
  alcoholOther: string
  dietary: string
  comment: string
  tableNumber: number | null
  seatNumber: number | null
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.message || 'Ошибка сервера.')
  return result as T
}

export const weddingApi = {
  seating: () => request<{ ok: true; guests: Array<{ id: number; name: string; tableNumber: number; seatNumber: number }> }>('/api/seating'),
  rsvp: (payload: RsvpPayload) => request<{ ok: true }>('/api/rsvp', { method: 'POST', body: JSON.stringify(payload) }),
  session: () => request<{ authenticated: boolean }>('/api/admin/session'),
  login: (username: string, password: string) => request('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/api/admin/logout', { method: 'POST' }),
  guests: () => request<{ guests: AdminGuest[] }>('/api/admin/guests'),
  addGuest: (name: string) => request('/api/admin/guests', { method: 'POST', body: JSON.stringify({ name }) }),
  deleteGuest: (id: number) => request(`/api/admin/guests/${id}`, { method: 'DELETE' }),
  assignSeat: (table: number, seat: number, guestId: number) => request(`/api/admin/seats/${table}/${seat}`, { method: 'PUT', body: JSON.stringify({ guestId }) }),
  clearSeat: (table: number, seat: number) => request(`/api/admin/seats/${table}/${seat}`, { method: 'DELETE' }),
}
