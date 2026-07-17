import type { JSX } from 'preact'
import type { SlideMeta } from '../../types/wedding'

interface SectionPreviewProps {
  slide: SlideMeta
  index: number
}

export function SectionPreview({ slide, index }: SectionPreviewProps) {
  const headingId = `slide-title-${slide.id}`
  const isHero = slide.id === 'hero'

  return (
    <section
      class={`wedding-section wedding-section--${slide.id}`}
      aria-labelledby={headingId}
      data-tone={slide.tone}
      style={
        slide.background
          ? ({ '--slide-background': `url(${slide.background})` } as JSX.CSSProperties)
          : undefined
      }
    >
      <div class="wedding-section__veil" aria-hidden="true" />
      <div class="wedding-section__content">
        <p class="wedding-section__eyebrow">{slide.eyebrow}</p>
        {isHero ? (
          <h1
            id={headingId}
            class="wedding-section__title wedding-section__title--hero"
            aria-label="Анастасия и Эдуард"
          >
            <span>Анастасия</span>
            <span class="wedding-section__heart" aria-hidden="true">
              ♡
            </span>
            <span>Эдуард</span>
          </h1>
        ) : (
          <h2 id={headingId} class="wedding-section__title">
            {slide.title}
          </h2>
        )}
        <p class="wedding-section__description">{slide.description}</p>
        <div class="wedding-section__ornament" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>
        {index !== 0 && index !== 8 ? (
          <p class="wedding-section__stage-note">Содержимое секции будет добавлено следующим этапом</p>
        ) : null}
      </div>
    </section>
  )
}
