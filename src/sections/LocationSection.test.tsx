import { render, screen } from '@testing-library/preact'
import { describe, expect, it, vi } from 'vitest'
import { slides } from '../data/wedding'
import { LocationSection } from './LocationSection'

vi.mock('../components/map/YandexMap', () => ({
  YandexMap: () => <div aria-label="Интерактивная карта с ЗАГСом и рестораном" />,
}))

describe('LocationSection', () => {
  const slide = slides.find((item) => item.id === 'location')!

  it('shows the map immediately and provides a route to both locations', () => {
    render(<LocationSection slide={slide} />)

    expect(screen.getByLabelText('Интерактивная карта с ЗАГСом и рестораном')).toBeVisible()
    expect(screen.queryByRole('button', { name: /Показать оба места/ })).not.toBeInTheDocument()

    for (const name of ['Маршрут до ЗАГСа', 'Маршрут до ресторана']) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', expect.stringContaining('mode=routes'))
      expect(link).toHaveAttribute('href', expect.stringContaining('rtext='))
    }
  })
})
