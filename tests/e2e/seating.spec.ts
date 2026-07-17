import { expect, test } from '@playwright/test'

test('finds a guest without downloading the guest list', async ({ page }) => {
  await page.route('**/apps-script', async (route) => {
    const request = route.request().postDataJSON()
    expect(request).toEqual({ action: 'lookupSeat', payload: { name: 'Иван Иванов' } })
    await route.fulfill({ json: { ok: true, found: true, guestName: 'Иван Иванов', tableNumber: '4', note: 'Рядом с окном' } })
  })

  await page.goto('/')
  await page.getByRole('button', { name: '5. План рассадки гостей' }).click()
  await page.getByLabel('Найти свой стол').fill('Иван Иванов')
  await page.getByRole('button', { name: 'Найти' }).click()

  await expect(page.getByRole('status').filter({ hasText: 'ваш стол — 4' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Стол 4' })).toHaveAttribute('aria-pressed', 'true')
})
