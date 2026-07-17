import { buttonClass, eyebrowClass, Ornament, SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

export function FinaleSection({ slide, onRestart }: { slide: SlideMeta; onRestart: () => void }) {
  return (
    <SectionFrame slide={slide}>
      <p class={eyebrowClass}>С любовью</p>
      <h2 id="slide-title-finale" class="reveal-item m-0 max-w-[18ch] font-script text-[clamp(3.5rem,10vw,7rem)] leading-none font-normal text-balance text-white [text-shadow:0_4px_24px_rgb(0_0_0/0.42)]">До встречи<br />15 августа!</h2>
      <Ornament />
      <p class="reveal-item mt-4 mb-0 font-script text-[clamp(2rem,5vw,3.75rem)]">Анастасия и Эдуард</p>
      <button type="button" class={`${buttonClass} reveal-item mt-6 bg-none bg-white/90 text-night`} onClick={onRestart}>Вернуться в начало</button>
    </SectionFrame>
  )
}
