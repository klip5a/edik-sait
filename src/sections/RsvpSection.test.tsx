import { fireEvent, render, screen } from '@testing-library/preact'
import { describe, expect, it } from 'vitest'
import { slides } from '../data/wedding'
import { RsvpSection } from './RsvpSection'

describe('RsvpSection', () => {
  const slide = slides.find((item) => item.id === 'rsvp')!

  it('reveals attendance and alcohol questions conditionally', () => {
    render(<RsvpSection slide={slide} />)

    expect(screen.queryByText('Будете на церемонии? *')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'С удовольствием приду' }))
    expect(screen.getByText('Будете на церемонии? *')).toBeVisible()

    const alcoholYes = screen.getAllByRole('radio', { name: 'Да', exact: true }).at(-1)!
    fireEvent.click(alcoholYes)
    expect(screen.getByText('Что предпочитаете? Можно выбрать несколько вариантов')).toBeVisible()
    expect(screen.getByRole('checkbox', { name: 'Шампанское' })).toBeVisible()
  })
})
