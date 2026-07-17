import type { ComponentChildren, JSX } from 'preact'
import type { SlideMeta } from '../../types/wedding'

interface SectionFrameProps {
  slide: SlideMeta
  children: ComponentChildren
  className?: string
  compact?: boolean
}

export function SectionFrame({ slide, children, className = '', compact = false }: SectionFrameProps) {
  const headingId = `slide-title-${slide.id}`

  return (
    <section
      class={`relative grid h-dvh min-h-dvh place-items-center overflow-x-clip overflow-y-auto overscroll-contain bg-ivory bg-[image:var(--slide-background)] bg-cover bg-center bg-no-repeat px-[var(--page-gutter)] pt-[max(4.5rem,calc(env(safe-area-inset-top)+2.5rem))] pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] text-center text-ink [scrollbar-gutter:stable] data-[tone=dark]:bg-night data-[tone=dark]:text-paper [&_.reveal-item]:translate-y-2.5 [&_.reveal-item]:opacity-0 [&_.reveal-item]:transition-[opacity,transform] [&_.reveal-item]:duration-700 [&_.reveal-item]:ease-wedding [.swiper-slide-active_&_.reveal-item]:translate-y-0 [.swiper-slide-active_&_.reveal-item]:opacity-100 motion-reduce:[&_.reveal-item]:translate-y-0 motion-reduce:[&_.reveal-item]:opacity-100 ${compact ? 'py-[max(4rem,calc(env(safe-area-inset-top)+2rem))]' : ''} ${className}`}
      aria-labelledby={headingId}
      data-tone={slide.tone}
      style={
        slide.background
          ? ({
              '--slide-background': slide.backgroundFallback
                ? `image-set(url(${slide.background}) type("image/avif"), url(${slide.backgroundFallback}) type("image/png"))`
                : `url(${slide.background})`,
            } as JSX.CSSProperties)
          : undefined
      }
    >
      <div class={`wedding-section__veil pointer-events-none absolute inset-0 ${slide.tone === 'dark' ? 'bg-[linear-gradient(rgb(16_13_8/0.22),rgb(16_13_8/0.52))]' : 'bg-[radial-gradient(circle_at_50%_38%,rgb(255_255_255/0.91),rgb(247_242_234/0.56)_44%,transparent_76%),linear-gradient(rgb(247_242_234/0.24),rgb(247_242_234/0.42))]'}`} aria-hidden="true" />
      <div class="wedding-section__content relative z-1 flex w-full max-w-[68rem] flex-col items-center text-pretty">{children}</div>
    </section>
  )
}

export function Ornament() {
  return (
    <div class="reveal-item mt-[clamp(1.4rem,4dvh,2.7rem)] grid w-[min(16rem,72vw)] grid-cols-[1fr_auto_1fr] items-center gap-3 text-gold-deep" aria-hidden="true">
      <span class="h-px bg-linear-to-r from-transparent to-current" />
      <span>♡</span>
      <span class="h-px bg-linear-to-r from-current to-transparent" />
    </div>
  )
}

export const eyebrowClass = 'reveal-item mb-[clamp(1rem,3dvh,2rem)] text-[clamp(0.72rem,1.5vw,0.9rem)] font-semibold tracking-[0.2em] uppercase'
export const headingClass = 'reveal-item m-0 max-w-[18ch] font-script text-[clamp(3rem,8vw,6.25rem)] leading-none font-normal text-balance'
export const copyClass = 'reveal-item mt-4 mb-0 max-w-[46ch] text-[clamp(1rem,2vw,1.3rem)] leading-normal text-pretty'
export const buttonClass = 'inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[0.65rem] border-0 bg-linear-to-br from-gold to-gold-deep px-5 py-3 font-semibold text-white no-underline shadow-gold transition-[transform,box-shadow,opacity] duration-200 ease-wedding hover:shadow-[0_10px_36px_rgb(156_108_38/0.28)] active:scale-[0.96] disabled:cursor-wait disabled:opacity-60'
