import { eyebrowClass, headingClass, SectionFrame } from '../components/slide/SectionFrame'
import { schedule } from '../data/schedule'
import type { SlideMeta } from '../types/wedding'

export function ScheduleSection({ slide }: { slide: SlideMeta }) {
  return (
    <SectionFrame slide={slide} compact>
      <p class={eyebrowClass}>Расписание</p>
      <h2 id="slide-title-schedule" class={headingClass}>Наш день</h2>
      <ol class="reveal-item mt-5 grid w-full max-w-[44rem] list-none gap-0 p-0 text-left">
        {schedule.map((event, index) => (
          <li class="relative grid min-h-19 grid-cols-[2.75rem_5.25rem_1fr] items-center gap-3 not-last:after:absolute not-last:after:top-[calc(50%+1.35rem)] not-last:after:bottom-[calc(-50%+1.35rem)] not-last:after:left-[1.35rem] not-last:after:w-px not-last:after:bg-gold-deep/40 not-last:after:content-['']" key={event.id}>
            <span class="grid size-[2.7rem] place-items-center rounded-full bg-white/70 text-gold-deep shadow-soft" aria-hidden="true">{index + 1}</span>
            <time class="text-2xl leading-[1.15] font-semibold text-gold-deep tabular-nums" dateTime={`2026-08-15T${event.time}:00+05:00`}>{event.time}</time>
            <span class="grid gap-1">
              <span class="text-2xl leading-[1.15]">{event.title}</span>
              {event.detail ? <span class="text-base leading-snug text-ink-soft">{event.detail}</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </SectionFrame>
  )
}
