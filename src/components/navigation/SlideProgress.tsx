interface SlideProgressProps {
  activeIndex: number
  titles: readonly string[]
  onSelect: (index: number) => void
}

export function SlideProgress({ activeIndex, titles, onSelect }: SlideProgressProps) {
  return (
    <div class="slide-progress" aria-label="Выбор экрана">
      {titles.map((title, index) => (
        <button
          key={title}
          type="button"
          class="slide-progress__dot"
          data-active={index === activeIndex ? 'true' : 'false'}
          aria-label={`${index + 1}. ${title}`}
          aria-current={index === activeIndex ? 'step' : undefined}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  )
}
