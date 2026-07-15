import { useState } from 'preact/hooks'
import { YandexMap } from '../components/map/YandexMap'
import { SectionFrame } from '../components/slide/SectionFrame'
import { wedding } from '../data/wedding'
import type { SlideMeta } from '../types/wedding'

function yandexUrl(query: string) {
  return `https://yandex.ru/maps/?mode=search&text=${encodeURIComponent(query)}`
}

export function LocationSection({ slide }: { slide: SlideMeta }) {
  const [activeId, setActiveId] = useState(wedding.locations[0].id)
  const [showMap, setShowMap] = useState(false)
  const location = wedding.locations.find((item) => item.id === activeId) ?? wedding.locations[0]

  return (
    <SectionFrame slide={slide} compact>
      <p class="wedding-section__eyebrow reveal-item">Как добраться</p>
      <h2 id="slide-title-location" class="section-heading reveal-item">Карта и адреса</h2>
      <div class="location-layout reveal-item swiper-no-swiping">
        <div class="location-tabs" role="group" aria-label="Выберите место">
          {wedding.locations.map((item) => (
            <button
              type="button"
              class="location-tab"
              data-active={item.id === activeId ? 'true' : 'false'}
              aria-pressed={item.id === activeId}
              onClick={() => setActiveId(item.id)}
              key={item.id}
            >
              <span>{item.startsAt.slice(11, 16)}</span>
              {item.id === 'ceremony' ? 'Церемония' : 'Банкет'}
            </button>
          ))}
        </div>
        <article class="location-card" aria-live="polite">
          <span class="location-pin" aria-hidden="true">⌖</span>
          <p>{location.title}</p>
          <h3>{location.venue}</h3>
          <address>{location.address}</address>
          <a class="wedding-button" href={yandexUrl(location.mapQuery)} target="_blank" rel="noreferrer">
            Открыть в Яндекс Картах
          </a>
        </article>
      </div>
      <p class="section-note reveal-item">Выберите точку — адрес и маршрут обновятся без перезагрузки страницы.</p>
      <button type="button" class="wedding-button wedding-button--secondary reveal-item swiper-no-swiping" aria-expanded={showMap} onClick={() => setShowMap((value) => !value)}>
        {showMap ? 'Скрыть общую карту' : 'Показать оба места на карте'}
      </button>
      {showMap ? <div class="map-reveal swiper-no-swiping"><YandexMap locations={wedding.locations} /></div> : null}
    </SectionFrame>
  )
}
