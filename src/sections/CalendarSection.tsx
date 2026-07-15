import { Ornament, SectionFrame } from '../components/slide/SectionFrame'
import { wedding } from '../data/wedding'
import { createCalendarEvent, downloadCalendarFile } from '../lib/calendarEvent'
import type { SlideMeta } from '../types/wedding'

const week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const days = Array.from({ length: 36 }, (_, index) => (index < 5 ? null : index - 4))

export function CalendarSection({ slide }: { slide: SlideMeta }) {
  const event = createCalendarEvent(wedding)

  return (
    <SectionFrame slide={slide} compact>
      <p class="wedding-section__eyebrow reveal-item">Сохраните дату</p>
      <h2 id="slide-title-calendar" class="section-heading reveal-item">Август 2026</h2>
      <div class="calendar reveal-item" aria-label="Календарь на август 2026 года">
        {week.map((day) => <span class="calendar__weekday" key={day}>{day}</span>)}
        {days.map((day, index) => (
          <span class="calendar__day" data-wedding-day={day === 15 ? 'true' : undefined} key={`${day ?? 'blank'}-${index}`}>
            {day}
          </span>
        ))}
      </div>
      <p class="section-copy reveal-item">Мы очень ждём этот день и будем счастливы разделить его с вами.</p>
      <div class="button-row reveal-item">
        <button type="button" class="wedding-button" onClick={() => downloadCalendarFile(event.ics)}>Скачать .ics</button>
        <a class="wedding-button wedding-button--secondary" href={event.googleUrl} target="_blank" rel="noreferrer">Google Calendar</a>
      </div>
      <Ornament />
    </SectionFrame>
  )
}
