import { Ornament, SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

export function HeroSection({ slide, onNext }: { slide: SlideMeta; onNext: () => void }) {
  return (
    <SectionFrame slide={slide}>
      <p class="wedding-section__eyebrow reveal-item">Приглашают вас разделить с ними счастливый день</p>
      <h1
        id="slide-title-hero"
        class="wedding-section__title wedding-section__title--hero reveal-item"
        aria-label="Анастасия и Эдуард"
      >
        <span>Анастасия</span>
        <span class="wedding-section__heart" aria-hidden="true">♡</span>
        <span>Эдуард</span>
      </h1>
      <p class="hero-date reveal-item">15 августа 2026</p>
      <Ornament />
      <button type="button" class="wedding-button wedding-button--ghost reveal-item" onClick={onNext}>
        Открыть приглашение
      </button>
    </SectionFrame>
  )
}
