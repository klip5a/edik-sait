import { expect, test } from '@playwright/test'

test('reveals conditional fields and submits a complete RSVP', async ({ page }) => {
  let submittedPayload: Record<string, unknown> | null = null
  await page.route('**/apps-script', async (route) => {
    submittedPayload = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })

  await page.goto('/')
  await page.getByRole('button', { name: '7. Подтверждение присутствия' }).click()
  await page.getByLabel('Ваши имя и фамилия *').fill('Иван Иванов')
  await page.getByRole('radio', { name: 'С удовольствием приду' }).check()

  await page.getByRole('group', { name: 'Приду на регистрацию *' }).getByRole('radio', { name: 'Да' }).check()
  await page.getByRole('group', { name: 'Желаете ли быть на фотосессии? *' }).getByRole('radio', { name: 'Да' }).check()
  await page.getByLabel('Сколько вас будет? *').selectOption('2')
  await page.getByRole('group', { name: 'Будете ли пить алкогольные напитки? *' }).getByRole('radio', { name: 'Да' }).check()
  await page.getByRole('checkbox', { name: 'Шампанское' }).check()
  await page.getByRole('checkbox', { name: 'Вино' }).check()
  await page.getByLabel('Ограничения по питанию').fill('Без орехов')
  await page.getByRole('button', { name: 'Подтвердить' }).click()

  await expect(page.getByRole('status').filter({ hasText: 'Ваш ответ отправлен' })).toBeVisible()
  expect(submittedPayload).toMatchObject({
    action: 'submitRsvp',
    payload: { name: 'Иван Иванов', attendance: 'yes', guestCount: '2', alcohol: ['Шампанское', 'Вино'] },
  })
})
