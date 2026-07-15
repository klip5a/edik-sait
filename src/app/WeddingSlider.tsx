import { useEffect, useRef, useState } from 'preact/hooks'
import Swiper from 'swiper'
import { A11y, EffectFade, Keyboard, Mousewheel, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/a11y'
import 'swiper/css/effect-fade'
import { SlideNavigation } from '../components/navigation/SlideNavigation'
import { SlideProgress } from '../components/navigation/SlideProgress'
import { slides } from '../data/wedding'
import { InvitationSection } from '../sections/InvitationSection'
import '../styles/sections.css'
import '../styles/swiper.css'

interface SliderState {
  activeIndex: number
  isBeginning: boolean
  isEnd: boolean
}

const initialState: SliderState = {
  activeIndex: 0,
  isBeginning: true,
  isEnd: false,
}

export function WeddingSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const swiperRef = useRef<Swiper | null>(null)
  const [sliderState, setSliderState] = useState(initialState)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const syncState = (swiper: Swiper) => {
      setSliderState({
        activeIndex: swiper.activeIndex,
        isBeginning: swiper.isBeginning,
        isEnd: swiper.isEnd,
      })

      swiper.slides.forEach((slide, index) => {
        const isActive = index === swiper.activeIndex
        slide.inert = !isActive
        slide.setAttribute('aria-hidden', String(!isActive))
      })
    }

    const swiper = new Swiper(container, {
      modules: [A11y, EffectFade, Keyboard, Mousewheel, Navigation],
      slidesPerView: 1,
      speed: 820,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      allowTouchMove: true,
      touchAngle: 42,
      nested: true,
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      touchStartPreventDefault: false,
      keyboard: { enabled: true, onlyInViewport: true },
      mousewheel: { forceToAxis: true, releaseOnEdges: true },
      navigation: {
        prevEl: previousRef.current,
        nextEl: nextRef.current,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: 'Предыдущий экран',
        nextSlideMessage: 'Следующий экран',
        firstSlideMessage: 'Это первый экран',
        lastSlideMessage: 'Это последний экран',
        slideLabelMessage: '{{index}} из {{slidesLength}}',
      },
      on: {
        init: syncState,
        slideChange: syncState,
        reachBeginning: syncState,
        reachEnd: syncState,
        fromEdge: syncState,
      },
    })

    swiperRef.current = swiper
    syncState(swiper)

    return () => {
      swiper.destroy(true, true)
      swiperRef.current = null
    }
  }, [])

  const activeTitle = slides[sliderState.activeIndex]?.title ?? slides[0].title

  return (
    <div class="wedding-slider" data-active-slide={slides[sliderState.activeIndex]?.id}>
      <div ref={containerRef} class="swiper wedding-slider__viewport">
        <div class="swiper-wrapper">
          {slides.map((slide, index) => (
            <div class="swiper-slide wedding-slider__slide" key={slide.id}>
              <InvitationSection index={index} swiper={swiperRef.current} />
            </div>
          ))}
        </div>
      </div>

      <SlideProgress
        activeIndex={sliderState.activeIndex}
        titles={slides.map((slide) => slide.title)}
        onSelect={(index) => swiperRef.current?.slideTo(index)}
      />

      <SlideNavigation
        activeIndex={sliderState.activeIndex}
        total={slides.length}
        isBeginning={sliderState.isBeginning}
        isEnd={sliderState.isEnd}
        previousRef={previousRef}
        nextRef={nextRef}
      />

      <p class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        Экран {sliderState.activeIndex + 1} из {slides.length}: {activeTitle}
      </p>
    </div>
  )
}
