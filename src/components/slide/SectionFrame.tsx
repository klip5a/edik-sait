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
      class={`wedding-section wedding-section--${slide.id} ${compact ? 'wedding-section--compact' : ''} ${className}`}
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
      <div class="wedding-section__veil" aria-hidden="true" />
      <div class="wedding-section__content">{children}</div>
    </section>
  )
}

export function Ornament() {
  return (
    <div class="wedding-section__ornament reveal-item" aria-hidden="true">
      <span />
      <span>♡</span>
      <span />
    </div>
  )
}
