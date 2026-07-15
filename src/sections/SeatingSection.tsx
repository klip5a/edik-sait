import { useState } from 'preact/hooks'
import { SectionFrame } from '../components/slide/SectionFrame'
import { lookupSeat } from '../services/seatingClient'
import type { SlideMeta } from '../types/wedding'

const tables = Array.from({ length: 10 }, (_, index) => index + 1)

export function SeatingSection({ slide }: { slide: SlideMeta }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'found' | 'not-found' | 'error'>('idle')

  const handleLookup = async (event: SubmitEvent) => {
    event.preventDefault()
    const name = query.trim()
    if (name.length < 3) {
      setLookupState('error')
      setMessage('Введите имя и фамилию гостя.')
      return
    }

    setLookupState('loading')
    setMessage('')
    try {
      const result = await lookupSeat(name)
      if (result.status === 'unconfigured') {
        setLookupState('error')
        setMessage('Поиск готов, но Google Таблица ещё не подключена.')
      } else if (result.status === 'not-found') {
        setLookupState('not-found')
        setMessage('Гость с таким именем не найден. Проверьте написание или свяжитесь с молодожёнами.')
      } else {
        setLookupState('found')
        setSelected(Number(result.tableNumber) || null)
        setMessage(`${result.guestName}, ваш стол — ${result.tableNumber}.${result.note ? ` ${result.note}.` : ''}`)
      }
    } catch (error) {
      setLookupState('error')
      setMessage(error instanceof Error ? error.message : 'Не удалось выполнить поиск. Попробуйте ещё раз.')
    }
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
            <input id="guest-name" value={query} onInput={(event) => { setQuery(event.currentTarget.value); setLookupState('idle'); setMessage('') }} aria-describedby="guest-name-hint guest-lookup-status" autocomplete="name" required minlength={3} />
            <button class="wedding-button" type="submit" disabled={lookupState === 'loading'}>{lookupState === 'loading' ? 'Ищем…' : 'Найти'}</button>
          </div>
          <p id="guest-lookup-status" class="form-status" data-state={lookupState} role="status" aria-live="polite">{message || (selected ? `Вы выбрали стол ${selected} на схеме.` : '')}</p>
        </form>
      </div>
    </SectionFrame>
  )
}
