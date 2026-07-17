import { expect, test } from '@playwright/test'

test('navigates through the invitation and returns to the beginning', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Анастасия и Эдуард' })).toBeVisible()

  await page.getByRole('button', { name: 'Следующий экран' }).click()
  await expect(page.getByRole('status')).toContainText('Экран 2 из 8')

  await page.getByRole('button', { name: '8. До встречи 15 августа' }).click()
  await expect(page.getByRole('heading', { name: /До встречи/ })).toBeVisible()

  await page.getByRole('button', { name: 'Вернуться в начало' }).click()
  await expect(page.getByRole('status')).toContainText('Экран 1 из 8')
})

test('supports keyboard arrows and edge states', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Предыдущий экран' })).toBeDisabled()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('status')).toContainText('Экран 2 из 8')
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('status')).toContainText('Экран 1 из 8')
})
