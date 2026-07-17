import { SectionFrame } from '../components/slide/SectionFrame'
import { schedule } from '../data/schedule'
import type { SlideMeta } from '../types/wedding'

export function ScheduleSection({ slide }: { slide: SlideMeta }) {
  return (
    <SectionFrame slide={slide} compact>
      <p class="wedding-section__eyebrow reveal-item">Расписание</p>
      <h2 id="slide-title-schedule" class="section-heading reveal-item">Наш день</h2>
      <ol class="schedule-list reveal-item">
        {schedule.map((event, index) => (
          <li class="schedule-event" key={event.id} style={{ '--event-index': index }}>
            <span class="schedule-event__marker" aria-hidden="true">{index + 1}</span>
            <time dateTime={`2026-08-15T${event.time}:00+05:00`}>{event.time}</time>
            <span class="schedule-event__content">
              <span class="schedule-event__title">{event.title}</span>
              {event.detail ? <span class="schedule-event__detail">{event.detail}</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </SectionFrame>
  )
}
