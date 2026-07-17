import { useState } from 'preact/hooks'
import { YandexMap } from '../components/map/YandexMap'
import { SectionFrame } from '../components/slide/SectionFrame'
import { wedding } from '../data/wedding'
import { createYandexRouteUrl } from '../lib/yandexRoute'
import type { SlideMeta } from '../types/wedding'

export function LocationSection({ slide }: { slide: SlideMeta }) {
  const [activeId, setActiveId] = useState(wedding.locations[0].id)
  const location = wedding.locations.find((item) => item.id === activeId) ?? wedding.locations[0]

  return (
    <SectionFrame slide={slide} compact>
      <p class="reveal-item mb-2 text-xs font-semibold tracking-[0.2em] uppercase lg:mb-3">Как добраться</p>
      <h2 id="slide-title-location" class="reveal-item m-0 max-w-full font-script text-[clamp(2.75rem,6vw,5.5rem)] leading-none font-normal text-balance">
        Карта и адреса
      </h2>

      <div class="reveal-item swiper-no-swiping mt-4 grid w-full min-w-0 max-w-[72rem] gap-4 lg:h-[min(60dvh,34rem)] lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.8fr)]">
        <div class="order-1 h-[min(42dvh,22rem)] min-h-72 min-w-0 lg:order-none lg:h-full lg:min-h-0">
          <YandexMap locations={wedding.locations} />
        </div>

        <aside class="order-2 flex min-w-0 flex-col gap-3 rounded-[1.75rem] bg-white/42 p-3 shadow-soft backdrop-blur-[2px] lg:h-full lg:overflow-y-auto lg:p-4">
          <div class="grid grid-cols-2 gap-2" role="group" aria-label="Выберите место">
            {wedding.locations.map((item) => {
              const active = item.id === activeId
              return (
                <button
                  type="button"
                  class={`min-h-12 rounded-xl px-3 py-2 text-sm shadow-soft transition-[transform,background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.96] ${active ? 'bg-gold-deep text-white' : 'bg-white/78 text-ink hover:bg-white'}`}
                  aria-pressed={active}
                  onClick={() => setActiveId(item.id)}
                  key={item.id}
                >
                  <span class="block font-semibold tabular-nums">{item.startsAt.slice(11, 16)}</span>
                  {item.id === 'ceremony' ? 'Церемония' : 'Банкет'}
                </button>
              )
            })}
          </div>

          <article class="flex min-h-52 min-w-0 flex-1 flex-col items-center justify-center rounded-3xl bg-white/88 p-5 text-center shadow-soft lg:min-h-0" aria-live="polite">
            <span class="mb-1 text-3xl text-gold-deep" aria-hidden="true">⌖</span>
            <p class="m-0 text-sm text-gold-deep">{location.title}</p>
            <h3 class="my-2 max-w-full font-script text-4xl leading-[1.05] font-normal text-balance lg:text-[2rem] xl:text-[2.2rem]">{location.venue}</h3>
            <address class="m-0 text-base leading-snug not-italic text-ink-soft">{location.address}</address>
          </article>

          <div class="grid gap-2" aria-label="Построить маршрут">
            {wedding.locations.map((item, index) => (
              <a
                class={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold no-underline shadow-soft transition-[transform,box-shadow,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.96] ${index === 0 ? 'bg-gold-deep text-white hover:shadow-gold' : 'bg-white/88 text-gold-deep hover:bg-white'}`}
                href={createYandexRouteUrl(item.mapQuery)}
                target="_blank"
                rel="noreferrer"
                key={item.id}
              >
                Маршрут до {item.id === 'ceremony' ? 'ЗАГСа' : 'ресторана'}
                <span class="-translate-y-px text-lg" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <p class="m-0 text-sm leading-snug text-pretty text-ink-soft">Яндекс Карты построят путь от вашего текущего местоположения.</p>
        </aside>
      </div>
    </SectionFrame>
  )
}
