import type { ScheduleEvent } from '../types/wedding'

export const schedule: readonly ScheduleEvent[] = [
  { id: 'ceremony', time: '11:00', title: 'Торжественная регистрация', detail: 'Отделение ЗАГС Ленинского района', locationId: 'ceremony' },
  { id: 'reception', time: '14:30', title: 'Фуршет' },
  { id: 'banquet', time: '15:00', title: 'Праздничный банкет', locationId: 'banquet' },
  { id: 'cake', time: '20:30', title: 'Свадебный торт' },
  { id: 'finale', time: '23:00', title: 'Завершение вечера' },
] as const
