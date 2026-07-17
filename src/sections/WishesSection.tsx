import { eyebrowClass, headingClass, Ornament, SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

export function WishesSection({ slide }: { slide: SlideMeta }) {
  return (
    <SectionFrame slide={slide}>
      <p class={eyebrowClass}>Самое главное — вы</p>
      <h2 id="slide-title-wishes" class={headingClass}>Пожелания</h2>
      <div class="reveal-item mt-6 max-w-[34rem] rounded-[1.2rem] bg-white/55 p-6 text-[clamp(1.12rem,2.4vw,1.45rem)] leading-relaxed shadow-soft">
        <p class="m-0">Самым главным подарком для нас будет ваше присутствие.</p>
        <p class="mt-4 mb-0">Если захотите поздравить нас, мы будем благодарны за вклад в наше семейное будущее.</p>
      </div>
      <Ornament />
    </SectionFrame>
  )
}
