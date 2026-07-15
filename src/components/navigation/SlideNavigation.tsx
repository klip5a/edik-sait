import type { RefObject } from 'preact'

interface SlideNavigationProps {
  activeIndex: number
  total: number
  isBeginning: boolean
  isEnd: boolean
  previousRef: RefObject<HTMLButtonElement>
  nextRef: RefObject<HTMLButtonElement>
}

function ArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none">
      <path
        d={direction === 'previous' ? 'm14.5 6-6 6 6 6' : 'm9.5 6 6 6-6 6'}
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export function SlideNavigation({
  activeIndex,
  total,
  isBeginning,
  isEnd,
  previousRef,
  nextRef,
}: SlideNavigationProps) {
  return (
    <nav class="slide-navigation" aria-label="Навигация по приглашению">
      <button
        ref={previousRef}
        type="button"
        class="slide-navigation__button"
        disabled={isBeginning}
        aria-label="Предыдущий экран"
      >
        <ArrowIcon direction="previous" />
      </button>

      <p class="slide-navigation__counter" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <span class="slide-navigation__divider" />
        <span>{String(total).padStart(2, '0')}</span>
      </p>

      <button
        ref={nextRef}
        type="button"
        class="slide-navigation__button"
        disabled={isEnd}
        aria-label="Следующий экран"
      >
        <ArrowIcon direction="next" />
      </button>
    </nav>
  )
}
