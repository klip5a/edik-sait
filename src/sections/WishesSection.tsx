import { Ornament, SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

export function WishesSection({ slide }: { slide: SlideMeta }) {
  return (
    <SectionFrame slide={slide}>
      <p class="wedding-section__eyebrow reveal-item">Самое главное — вы</p>
      <h2 id="slide-title-wishes" class="section-heading reveal-item">Пожелания</h2>
      <div class="wishes-copy reveal-item">
        <p>Самым главным подарком для нас будет ваше присутствие.</p>
        <p>Если захотите поздравить нас, мы будем благодарны за вклад в наше семейное будущее.</p>
      </div>
      <Ornament />
    </SectionFrame>
  )
}
