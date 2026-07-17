import { fireEvent, render, screen } from '@testing-library/preact'
import { describe, expect, it } from 'vitest'
import { slides } from '../data/wedding'
import { RsvpSection } from './RsvpSection'

describe('RsvpSection', () => {
  const slide = slides.find((item) => item.id === 'rsvp')!

  it('reveals attendance and alcohol questions conditionally', () => {
    render(<RsvpSection slide={slide} />)

    expect(screen.queryByText('Приду на регистрацию *')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'С удовольствием приду' }))
    expect(screen.getByText('Приду на регистрацию *')).toBeVisible()

    const alcoholYes = screen.getAllByRole('radio', { name: 'Да', exact: true }).at(-1)!
    fireEvent.click(alcoholYes)
    expect(screen.getByText('Какой желаете алкоголь? Можно выбрать несколько вариантов')).toBeVisible()
    for (const option of ['Шампанское', 'Вино', 'Водка', 'Ликер', 'Коньяк', 'Виски']) {
      expect(screen.getByRole('checkbox', { name: option })).toBeVisible()
    }
  })
})
