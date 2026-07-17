import { expect, test } from '@playwright/test'

test('shows both wedding places and offers two external Yandex routes', async ({ page }) => {
  await page.route('https://api-maps.yandex.ru/**', (route) => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: '4. Карта и адреса' }).click()

  await expect(page.getByLabel('Интерактивная карта с ЗАГСом и рестораном')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Маршрут до ЗАГСа' })).toHaveAttribute('href', /mode=routes.*rtext=/)
  await expect(page.getByRole('link', { name: 'Маршрут до ресторана' })).toHaveAttribute('href', /mode=routes.*rtext=/)
})
