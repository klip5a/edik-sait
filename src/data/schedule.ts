import type { ScheduleEvent } from '../types/wedding'

export const schedule: readonly ScheduleEvent[] = [
  { id: 'ceremony', time: '11:00', title: 'Торжественная регистрация', locationId: 'ceremony' },
  { id: 'photos', time: '12:30', title: 'Фотосессия и поздравления' },
  { id: 'banquet', time: '15:00', title: 'Праздничный банкет', locationId: 'banquet' },
  { id: 'party', time: '18:00', title: 'Конкурсы и танцы' },
  { id: 'cake', time: '20:30', title: 'Свадебный торт' },
  { id: 'first-dance', time: '22:00', title: 'Первый танец' },
  { id: 'finale', time: '23:00', title: 'Завершение вечера' },
] as const
