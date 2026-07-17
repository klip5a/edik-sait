import { expect, test } from '@playwright/test'

test('keeps every section inside the viewport width', async ({ page }) => {
  await page.goto('/')

  for (let index = 1; index <= 8; index += 1) {
    await page.getByRole('button', { name: new RegExp(`^${index}\\.`) }).click()
    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport)
  }
})

test('remains usable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: '2. До нашей свадьбы осталось' }).click()
  await expect(page.getByRole('heading', { name: 'До нашей свадьбы осталось' })).toBeVisible()
})
