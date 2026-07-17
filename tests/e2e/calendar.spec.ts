import { expect, test } from '@playwright/test'

test('offers Google Calendar and the phone calendar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '2. До нашей свадьбы осталось' }).click()

  await page.getByRole('button', { name: 'Добавить в календарь' }).click()
  await expect(page.getByRole('link', { name: 'Google Calendar' })).toHaveAttribute('href', /20260815T060000Z/)
  await expect(page.getByRole('link', { name: 'Календарь телефона' })).toHaveAttribute('href', /wedding\.ics$/)
})
