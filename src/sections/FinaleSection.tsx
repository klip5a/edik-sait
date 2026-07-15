import { Ornament, SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

export function FinaleSection({ slide, onRestart }: { slide: SlideMeta; onRestart: () => void }) {
  return (
    <SectionFrame slide={slide}>
      <p class="wedding-section__eyebrow reveal-item">С любовью</p>
      <h2 id="slide-title-finale" class="section-heading section-heading--finale reveal-item">До встречи<br />15 августа!</h2>
      <Ornament />
      <p class="finale-signature reveal-item">Анастасия и Эдуард</p>
      <button type="button" class="wedding-button wedding-button--light reveal-item" onClick={onRestart}>Вернуться в начало</button>
    </SectionFrame>
  )
}
