import { useState } from 'preact/hooks'
import { SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

const tables = Array.from({ length: 10 }, (_, index) => index + 1)

export function SeatingSection({ slide }: { slide: SlideMeta }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  const handleLookup = (event: SubmitEvent) => {
    event.preventDefault()
    setMessage(
      query.trim()
        ? 'Поиск подготовлен. Результат появится после подключения защищённой таблицы гостей.'
        : 'Введите имя и фамилию гостя.',
    )
  }

  return (
    <SectionFrame slide={slide} compact>
      <p class="wedding-section__eyebrow reveal-item">Ваше место</p>
      <h2 id="slide-title-seating" class="section-heading reveal-item">План рассадки гостей</h2>
      <div class="seating-layout reveal-item swiper-no-swiping">
        <div class="seating-chart" aria-label="Схема столов">
          <div class="seating-stage">Сцена</div>
          {tables.map((table) => (
            <button
              type="button"
              class="seating-table"
              data-selected={selected === table ? 'true' : 'false'}
              aria-pressed={selected === table}
              aria-label={`Стол ${table}`}
              onClick={() => setSelected(table)}
              key={table}
            >
              {table}
            </button>
          ))}
        </div>
        <form class="lookup-form" onSubmit={handleLookup} noValidate>
          <label for="guest-name">Найти свой стол</label>
          <p id="guest-name-hint">Введите имя и фамилию так, как они указаны в приглашении.</p>
          <div class="lookup-form__row">
            <input id="guest-name" value={query} onInput={(event) => setQuery(event.currentTarget.value)} aria-describedby="guest-name-hint" autocomplete="name" />
            <button class="wedding-button" type="submit">Найти</button>
          </div>
          <p class="form-status" aria-live="polite">{message || (selected ? `Вы выбрали стол ${selected} на схеме.` : '')}</p>
        </form>
      </div>
    </SectionFrame>
  )
}
