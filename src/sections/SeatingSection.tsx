import { useEffect, useState } from 'preact/hooks'
import { SeatingCanvas, type SeatedGuest } from '../components/seating/SeatingCanvas'
import { eyebrowClass, headingClass, SectionFrame } from '../components/slide/SectionFrame'
import { weddingApi } from '../services/weddingApi'
import type { SlideMeta } from '../types/wedding'

export function SeatingSection({ slide }: { slide: SlideMeta }) {
  const [guests, setGuests] = useState<SeatedGuest[]>([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    weddingApi.seating()
      .then((result) => setGuests(result.guests))
      .catch(() => setStatus('Схема доступна, но список гостей временно не загрузился.'))
  }, [])

  return (
    <SectionFrame slide={slide} compact>
      <p class={eyebrowClass}>Ваше место</p>
      <h2 id="slide-title-seating" class={`${headingClass} !text-[clamp(2.7rem,7vw,5.5rem)]`}>План рассадки гостей</h2>
      <div class="reveal-item swiper-no-swiping mt-4 w-full max-w-[54rem]">
        <SeatingCanvas guests={guests} />
        <p class="mt-3 mb-0 text-sm text-pretty text-ink-soft" role="status">
          {status || 'Наведите на стол или коснитесь его, чтобы увидеть гостей.'}
        </p>
      </div>
    </SectionFrame>
  )
}
