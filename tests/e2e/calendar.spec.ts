import { expect, test } from '@playwright/test'

test('exports the wedding date as an ICS file', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '3. Август 2026' }).click()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Скачать .ics' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('svadba-anastasia-eduard.ics')
  await expect(page.getByRole('link', { name: 'Google Calendar' })).toHaveAttribute('href', /20260815T060000Z/)
})
