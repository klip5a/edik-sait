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
    <nav class="fixed bottom-[max(0.9rem,env(safe-area-inset-bottom))] left-1/2 z-20 grid -translate-x-1/2 grid-cols-[3rem_auto_3rem] items-center gap-3 rounded-full bg-paper/80 p-1.5 shadow-soft backdrop-blur-xl" aria-label="Навигация по приглашению">
      <button
        ref={previousRef}
        type="button"
        class="grid size-12 cursor-pointer place-items-center rounded-full border-0 bg-transparent transition-[transform,background-color,color,opacity] duration-200 hover:not-disabled:scale-104 hover:not-disabled:bg-white/65 hover:not-disabled:text-gold-deep disabled:cursor-default disabled:opacity-25"
        disabled={isBeginning}
        aria-label="Предыдущий экран"
      >
        <ArrowIcon direction="previous" />
      </button>

      <p class="m-0 flex min-w-16 items-center justify-center gap-1.5 text-xs tracking-[0.08em] tabular-nums" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <span class="h-px w-4 bg-current opacity-30" />
        <span>{String(total).padStart(2, '0')}</span>
      </p>

      <button
        ref={nextRef}
        type="button"
        class="grid size-12 cursor-pointer place-items-center rounded-full border-0 bg-transparent transition-[transform,background-color,color,opacity] duration-200 hover:not-disabled:scale-104 hover:not-disabled:bg-white/65 hover:not-disabled:text-gold-deep disabled:cursor-default disabled:opacity-25"
        disabled={isEnd}
        aria-label="Следующий экран"
      >
        <ArrowIcon direction="next" />
      </button>
    </nav>
  )
}
