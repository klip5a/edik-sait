import { SectionFrame } from '../components/slide/SectionFrame'
import type { SlideMeta } from '../types/wedding'

export function HeroSection({ slide }: { slide: SlideMeta }) {
  return (
    <SectionFrame
      slide={slide}
      className="[&_.wedding-section__content]:max-w-[34rem] [&_.wedding-section__veil]:bg-[radial-gradient(circle_at_50%_45%,rgb(255_255_255/0.36),transparent_62%)]"
    >
      <h1
        id="slide-title-hero"
        class="reveal-item m-0 flex flex-col items-center font-script text-[clamp(4.25rem,12vw,8.25rem)] font-normal leading-[0.78] text-ink [text-wrap:balance]"
        aria-label="Анастасия и Эдуард"
      >
        <span>Анастасия</span>
        <span class="my-[0.32em] font-serif text-[0.3em] leading-none text-gold-deep" aria-hidden="true">♡</span>
        <span>Эдуард</span>
      </h1>

      <p class="reveal-item mt-[clamp(1.6rem,4dvh,2.4rem)] max-w-[25ch] text-[clamp(1rem,2vw,1.25rem)] leading-[1.35] text-ink [text-wrap:balance]">
        Приглашают вас
        <br />
        разделить самый счастливый день
        <br />
        их жизни
      </p>

      <p class="reveal-item mt-[clamp(1.25rem,3dvh,2rem)] font-serif text-[clamp(1.65rem,3.4vw,2.4rem)] tracking-[0.04em] text-gold-deep tabular-nums">
        15 августа 2026
      </p>
    </SectionFrame>
  )
}
