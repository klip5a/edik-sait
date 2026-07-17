interface SlideProgressProps {
  activeIndex: number
  titles: readonly string[]
  onSelect: (index: number) => void
}

export function SlideProgress({ activeIndex, titles, onSelect }: SlideProgressProps) {
  return (
    <div class="fixed top-[max(1rem,calc(env(safe-area-inset-top)+0.4rem))] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 transition-colors duration-300 md:top-1/2 md:right-6 md:left-auto md:translate-x-0 md:-translate-y-1/2 md:flex-col" aria-label="Выбор экрана">
      {titles.map((title, index) => (
        <button
          key={title}
          type="button"
          class="relative h-7 w-5 cursor-pointer border-0 bg-transparent p-0 after:absolute after:inset-x-0 after:top-1/2 after:h-0.5 after:-translate-y-1/2 after:scale-x-55 after:rounded-full after:bg-current after:opacity-25 after:transition-[transform,opacity,background-color] after:duration-300 data-[active=true]:after:scale-x-100 data-[active=true]:after:bg-gold-deep data-[active=true]:after:opacity-100 md:h-5 md:w-7 md:after:inset-y-0 md:after:left-1/2 md:after:h-auto md:after:w-0.5 md:after:-translate-x-1/2 md:after:translate-y-0 md:after:scale-x-100 md:after:scale-y-55 md:data-[active=true]:after:scale-y-100"
          data-active={index === activeIndex ? 'true' : 'false'}
          aria-label={`${index + 1}. ${title}`}
          aria-current={index === activeIndex ? 'step' : undefined}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  )
}
