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
    <SectionFrame
      slide={slide}
      compact
      className="lg:pt-[max(2.7rem,calc(env(safe-area-inset-top)+1rem))] lg:pb-[max(4.75rem,calc(env(safe-area-inset-bottom)+3.7rem))] [&_.wedding-section__content]:gap-0"
    >
      <p class={`${eyebrowClass} mb-3 lg:mb-1.5 lg:text-[0.8rem]`}>Ваше место</p>
      <h2 id="slide-title-seating" class={`${headingClass} max-w-[12ch] text-[clamp(2.7rem,6vw,5rem)] lg:text-[clamp(2.8rem,5.2vw,4.5rem)] xl:text-[clamp(3rem,4.6vw,4.8rem)]`}>
        План рассадки гостей
      </h2>
      <div class="reveal-item swiper-no-swiping mt-2 w-full max-w-216 px-1 md:max-w-[calc(100%-7.5rem)] md:px-6 lg:mt-2 lg:max-w-176 xl:max-w-184">
        <SeatingCanvas guests={guests} />
        <p class="mt-1.5 mb-0 text-sm text-pretty text-ink-soft lg:mt-1 lg:text-[0.8rem]" role="status">
          {status || 'Наведите на стол или коснитесь его, чтобы увидеть гостей.'}
        </p>
      </div>
    </SectionFrame>
  )
}
