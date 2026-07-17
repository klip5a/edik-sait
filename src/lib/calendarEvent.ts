import type { WeddingDetails } from '../types/wedding'

function toUtcStamp(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export function createCalendarEvent(wedding: WeddingDetails) {
  const title = `Свадьба ${wedding.couple.bride} и ${wedding.couple.groom}`
  const location = wedding.locations.map((item) => `${item.venue}, ${item.address}`).join(' / ')
  const description = 'Будем счастливы разделить этот день с вами!'

  return {
    title,
    googleUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${toUtcStamp(wedding.startsAt)}/${toUtcStamp(wedding.endsAt)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`,
  }
}
