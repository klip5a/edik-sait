import { useEffect, useRef, useState } from 'preact/hooks'
import { Ornament, SectionFrame } from '../components/slide/SectionFrame'
import { wedding } from '../data/wedding'
import { createCalendarEvent } from '../lib/calendarEvent'
import { getCountdown } from '../lib/countdown'
import type { SlideMeta } from '../types/wedding'

const labels = ['дней', 'часов', 'минут', 'секунд'] as const
const week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const days = Array.from({ length: 36 }, (_, index) => (index < 5 ? null : index - 4))

export function CountdownSection({ slide }: { slide: SlideMeta }) {
  const [countdown, setCountdown] = useState(() => getCountdown(wedding.startsAt, wedding.endsAt))
  const calendarDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const update = () => setCountdown(getCountdown(wedding.startsAt, wedding.endsAt))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]
  const event = createCalendarEvent(wedding)
  const deviceCalendarUrl = new URL('/calendar/wedding.ics', window.location.origin).href
  const closeCalendarDialog = () => calendarDialogRef.current?.close()

  return (
    <SectionFrame slide={slide} compact>
      {/* <p class="wedding-section__eyebrow reveal-item">15 августа 2026</p> */}
      <h2
        id="slide-title-countdown"
        class="reveal-item m-0 max-w-[16ch] font-script text-[clamp(2.75rem,7vw,5rem)] leading-[0.95] font-normal text-balance"
      >
        До нашей свадьбы осталось
      </h2>
      {countdown.status === 'before' ? (
        <div
          class="reveal-item mt-4 grid w-full max-w-[50rem] grid-cols-4 sm:mt-6"
          aria-label="Обратный отсчёт"
        >
          {values.map((value, index) => (
            <div
              class="grid min-w-0 place-content-center px-1 text-center [&:not(:first-child)]:border-l [&:not(:first-child)]:border-gold-deep/25 sm:px-3"
              key={labels[index]}
            >
              <strong class="font-serif text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.82] font-normal text-gold-deep tabular-nums">
                {String(value).padStart(2, '0')}
              </strong>
              <span class="mt-2 text-[0.62rem] leading-none tracking-[0.06em] uppercase sm:mt-3 sm:text-sm sm:tracking-[0.1em]">
                {labels[index]}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p class="countdown-message reveal-item">
          {countdown.status === 'wedding-day' ? 'Сегодня наш особенный день!' : 'Спасибо, что разделили этот день с нами!'}
        </p>
      )}
      <section class="countdown-calendar reveal-item !mt-4 sm:!mt-7" aria-label="Календарь свадьбы">
        <p class="m-0 font-script text-[clamp(2.25rem,5vw,3.75rem)] leading-none text-gold-deep">Август 2026</p>
        <div class="calendar" aria-label="Календарь на август 2026 года">
          {week.map((day) => <span class="calendar__weekday" key={day}>{day}</span>)}
          {days.map((day, index) => {
            const weddingDay = day === 15

            return (
              <span
                class={`calendar__day ${weddingDay ? 'relative isolate font-bold text-white' : ''}`}
                data-wedding-day={weddingDay ? 'true' : undefined}
                key={`${day ?? 'blank'}-${index}`}
              >
                {weddingDay ? (
                  <svg
                    class="pointer-events-none absolute -z-10 h-11 w-12 overflow-visible fill-current text-gold-deep drop-shadow-[0_3px_5px_rgba(122,80,24,0.22)]"
                    viewBox="0 0 48 44"
                    aria-hidden="true"
                  >
                    <path d="M24 42S3 29.7 3 14.6C3 6.8 8.7 2 15.7 2c4.2 0 7 2.1 8.3 4.5C25.3 4.1 28.1 2 32.3 2 39.3 2 45 6.8 45 14.6 45 29.7 24 42 24 42Z" />
                  </svg>
                ) : null}
                <span class={weddingDay ? 'relative -translate-y-0.5 tabular-nums' : undefined}>{day}</span>
              </span>
            )
          })}
        </div>
        <p class="section-copy">Мы очень ждём этот день и будем счастливы разделить его с вами.</p>
        <button
          type="button"
          class="wedding-button mt-1 min-h-11 transition-transform active:scale-[0.96]"
          onClick={() => calendarDialogRef.current?.showModal()}
        >
          Добавить в календарь
        </button>
      </section>
      <Ornament />

      <dialog
        ref={calendarDialogRef}
        class="m-auto w-[calc(100%_-_2rem)] max-w-[25rem] rounded-[2rem] bg-transparent p-0 text-ink shadow-[0_24px_80px_rgba(53,39,24,0.28)] backdrop:bg-ink/35 backdrop:backdrop-blur-[3px]"
        aria-labelledby="calendar-dialog-title"
        onClick={(clickEvent) => {
          if (clickEvent.target === clickEvent.currentTarget) closeCalendarDialog()
        }}
      >
        <div class="rounded-[2rem] bg-[#fffdf8]/98 p-4 shadow-soft outline-1 -outline-offset-1 outline-black/10 sm:p-5">
          <header class="mb-4 grid grid-cols-[1fr_2.75rem] items-start gap-3">
            <div>
              <p class="m-0 text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">15 августа 2026</p>
              <h3 id="calendar-dialog-title" class="mt-1 mb-0 font-script text-4xl leading-none font-normal text-balance">
                Куда добавить?
              </h3>
            </div>
            <button
              type="button"
              class="grid size-11 place-items-center rounded-full bg-white/85 text-xl text-ink-soft shadow-soft transition-[transform,background-color] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.96]"
              aria-label="Закрыть выбор календаря"
              onClick={closeCalendarDialog}
            >
              ×
            </button>
          </header>

          <nav class="grid gap-2" aria-label="Выберите календарь">
            {[
              { label: 'Google Calendar', detail: 'Подходит большинству Android', icon: 'G', href: event.googleUrl, tone: 'bg-[#4285f4] text-white', external: true },
              { label: 'Календарь телефона', detail: 'Apple, Samsung, Xiaomi и Huawei', icon: '♥', href: deviceCalendarUrl, tone: 'bg-gold-deep text-white', external: false },
            ].map((service) => (
              <a
                class="group grid min-h-16 grid-cols-[2.75rem_1fr_1.5rem] items-center gap-3 rounded-2xl bg-white/88 px-3 py-2.5 text-left text-ink no-underline shadow-soft outline-1 -outline-offset-1 outline-black/5 transition-[transform,background-color,box-shadow] hover:bg-white hover:shadow-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.96]"
                href={service.href}
                target={service.external ? '_blank' : undefined}
                rel={service.external ? 'noreferrer' : undefined}
                onClick={closeCalendarDialog}
                key={service.label}
              >
                <span class={`grid size-11 place-items-center rounded-xl text-base font-bold shadow-soft ${service.tone}`} aria-hidden="true">
                  {service.icon}
                </span>
                <span class="min-w-0">
                  <strong class="block font-semibold">{service.label}</strong>
                  <span class="block text-xs leading-snug text-pretty text-ink-soft">{service.detail}</span>
                </span>
                <span class="text-xl text-gold-deep transition-transform group-hover:translate-x-0.5" aria-hidden="true">›</span>
              </a>
            ))}
          </nav>

          <p class="mt-4 mb-0 text-center text-xs leading-relaxed text-pretty text-ink-soft">
            Телефон предложит добавить событие и настроить напоминания.
          </p>
        </div>
      </dialog>
    </SectionFrame>
  )
}
