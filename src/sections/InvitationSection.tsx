import type Swiper from 'swiper'
import { slides } from '../data/wedding'
import { CountdownSection } from './CountdownSection'
import { FinaleSection } from './FinaleSection'
import { HeroSection } from './HeroSection'
import { LocationSection } from './LocationSection'
import { RsvpSection } from './RsvpSection'
import { ScheduleSection } from './ScheduleSection'
import { SeatingSection } from './SeatingSection'
import { WishesSection } from './WishesSection'

export function InvitationSection({ index, swiper }: { index: number; swiper: Swiper | null }) {
  const slide = slides[index]

  switch (slide.id) {
    case 'hero': return <HeroSection slide={slide} />
    case 'countdown': return <CountdownSection slide={slide} />
    case 'schedule': return <ScheduleSection slide={slide} />
    case 'location': return <LocationSection slide={slide} />
    case 'seating': return <SeatingSection slide={slide} />
    case 'wishes': return <WishesSection slide={slide} />
    case 'rsvp': return <RsvpSection slide={slide} />
    case 'finale': return <FinaleSection slide={slide} onRestart={() => swiper?.slideTo(0)} />
  }
}
