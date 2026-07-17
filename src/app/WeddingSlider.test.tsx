import { fireEvent, render, screen } from '@testing-library/preact'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WeddingSlider } from './WeddingSlider'

vi.mock('swiper', () => {
  class SwiperMock {
    activeIndex = 0
    isBeginning = true
    isEnd = false
    slides: HTMLElement[]
    private options: {
      navigation?: {
        prevEl?: HTMLButtonElement | null
        nextEl?: HTMLButtonElement | null
      }
      on?: {
        init?: (swiper: SwiperMock) => void
        slideChange?: (swiper: SwiperMock) => void
      }
    }

    constructor(element: HTMLElement, options: SwiperMock['options']) {
      this.options = options
      this.slides = Array.from(element.querySelectorAll<HTMLElement>('.swiper-slide'))
      options.navigation?.prevEl?.addEventListener('click', () => this.slidePrev())
      options.navigation?.nextEl?.addEventListener('click', () => this.slideNext())
      this.options.on?.init?.(this)
    }

    slideNext() {
      this.slideTo(this.activeIndex + 1)
    }

    slidePrev() {
      this.slideTo(this.activeIndex - 1)
    }

    slideTo(index: number) {
      this.activeIndex = Math.max(0, Math.min(index, this.slides.length - 1))
      this.isBeginning = this.activeIndex === 0
      this.isEnd = this.activeIndex === this.slides.length - 1
      this.options.on?.slideChange?.(this)
    }

    destroy() {}
  }

  return { default: SwiperMock }
})
vi.mock('swiper/modules', () => ({
  A11y: {},
  EffectFade: {},
  Keyboard: {},
  Mousewheel: {},
  Navigation: {},
}))

describe('WeddingSlider', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders all eight sections and starts at the first one', () => {
    const { container } = render(<WeddingSlider />)

    expect(container.querySelectorAll('.swiper-slide')).toHaveLength(8)
    expect(screen.getByRole('heading', { level: 1, name: 'Анастасия и Эдуард' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Предыдущий экран' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Следующий экран' })).toBeEnabled()
  })

  it('moves to the next section and updates accessible status', () => {
    render(<WeddingSlider />)

    fireEvent.click(screen.getByRole('button', { name: 'Следующий экран' }))

    expect(screen.getByRole('status')).toHaveTextContent('Экран 2 из 8: До нашей свадьбы осталось')
    expect(screen.getByRole('button', { name: 'Предыдущий экран' })).toBeEnabled()
  })
})
