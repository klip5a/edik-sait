import { useState } from 'preact/hooks'
import { buttonClass, eyebrowClass, headingClass, SectionFrame } from '../components/slide/SectionFrame'
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
      <p class={eyebrowClass}>Ваше место</p>
      <h2 id="slide-title-seating" class={headingClass}>План рассадки гостей</h2>
      <div class="reveal-item swiper-no-swiping mt-5 grid w-full max-w-[58rem] gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div class="grid grid-cols-3 gap-2.5 rounded-[1.4rem] bg-white/60 p-4 shadow-soft md:grid-cols-4" aria-label="Схема столов">
          <div class="col-span-full rounded-lg bg-paper-deep p-2">Сцена</div>
          {tables.map((table) => (
            <button
              type="button"
              class="aspect-square min-h-[3.4rem] cursor-pointer rounded-full border-2 border-dotted border-gold bg-white/70 text-lg text-gold-deep transition-[transform,color,background-color] duration-200 active:scale-[0.96] data-[selected=true]:scale-106 data-[selected=true]:bg-gold-deep data-[selected=true]:text-white"
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
        <form class="grid content-center rounded-[1.4rem] bg-white/60 p-5 text-left shadow-soft" onSubmit={handleLookup} noValidate>
          <label class="text-xl font-bold" for="guest-name">Найти свой стол</label>
          <p class="mt-1 mb-3" id="guest-name-hint">Введите имя и фамилию так, как они указаны в приглашении.</p>
          <div class="grid gap-2.5">
            <input class="min-h-12 w-full rounded-lg border border-ink/30 bg-white/85 px-3 py-2" id="guest-name" value={query} onInput={(event) => { setQuery(event.currentTarget.value); setLookupState('idle'); setMessage('') }} aria-describedby="guest-name-hint guest-lookup-status" autocomplete="name" required minlength={3} />
            <button class={buttonClass} type="submit" disabled={lookupState === 'loading'}>{lookupState === 'loading' ? 'Ищем…' : 'Найти'}</button>
          </div>
          <p id="guest-lookup-status" class="mt-2 mb-0 min-h-[1.4em] text-ink-soft data-[state=found]:font-bold data-[state=found]:text-[#416844] data-[state=error]:text-[#8c3f35] data-[state=not-found]:text-[#8c3f35]" data-state={lookupState} role="status" aria-live="polite">{message || (selected ? `Вы выбрали стол ${selected} на схеме.` : '')}</p>
        </form>
      </div>
    </SectionFrame>
  )
}
