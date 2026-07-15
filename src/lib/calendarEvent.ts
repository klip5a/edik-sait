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
    ics: [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anastasia & Eduard//Wedding Invitation//RU',
      'BEGIN:VEVENT',
      `UID:wedding-20260815@invitation.local`,
      `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
      `DTSTART:${toUtcStamp(wedding.startsAt)}`,
      `DTEND:${toUtcStamp(wedding.endsAt)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n'),
  }
}

export function downloadCalendarFile(content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'svadba-anastasia-eduard.ics'
  link.click()
  URL.revokeObjectURL(url)
}
