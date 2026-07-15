import { useEffect, useState } from 'preact/hooks'
import { Ornament, SectionFrame } from '../components/slide/SectionFrame'
import { wedding } from '../data/wedding'
import { getCountdown } from '../lib/countdown'
import type { SlideMeta } from '../types/wedding'

const labels = ['дней', 'часов', 'минут', 'секунд'] as const

export function CountdownSection({ slide }: { slide: SlideMeta }) {
  const [countdown, setCountdown] = useState(() => getCountdown(wedding.startsAt, wedding.endsAt))

  useEffect(() => {
    const update = () => setCountdown(getCountdown(wedding.startsAt, wedding.endsAt))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]

  return (
    <SectionFrame slide={slide}>
      <p class="wedding-section__eyebrow reveal-item">15 августа 2026</p>
      <h2 id="slide-title-countdown" class="section-heading reveal-item">До нашей свадьбы осталось</h2>
      {countdown.status === 'before' ? (
        <div class="countdown-grid reveal-item" aria-label="Обратный отсчёт">
          {values.map((value, index) => (
            <div class="countdown-unit" key={labels[index]}>
              <strong>{String(value).padStart(2, '0')}</strong>
              <span>{labels[index]}</span>
            </div>
          ))}
        </div>
      ) : (
        <p class="countdown-message reveal-item">
          {countdown.status === 'wedding-day' ? 'Сегодня наш особенный день!' : 'Спасибо, что разделили этот день с нами!'}
        </p>
      )}
      <Ornament />
    </SectionFrame>
  )
}
