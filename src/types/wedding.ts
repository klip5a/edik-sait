export type SlideId =
  | 'hero'
  | 'countdown'
  | 'calendar'
  | 'schedule'
  | 'location'
  | 'seating'
  | 'wishes'
  | 'rsvp'
  | 'finale'

export interface SlideMeta {
  id: SlideId
  title: string
  eyebrow: string
  description: string
  background?: string
  backgroundFallback?: string
  tone: 'light' | 'dark'
}

export interface WeddingLocation {
  id: 'ceremony' | 'banquet'
  title: string
  venue: string
  address: string
  startsAt: string
  mapQuery: string
}

export interface ScheduleEvent {
  id: string
  time: string
  title: string
  locationId?: WeddingLocation['id']
}

export interface WeddingDetails {
  couple: {
    bride: string
    groom: string
  }
  startsAt: string
  endsAt: string
  rsvpDeadline: string
  timeZone: 'Asia/Yekaterinburg'
  locations: readonly WeddingLocation[]
}
