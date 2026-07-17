import { useState } from 'preact/hooks'
import { SectionFrame } from '../components/slide/SectionFrame'
import { submitRsvp, type RsvpPayload } from '../services/rsvpClient'
import type { SlideMeta } from '../types/wedding'

const alcoholOptions = ['Шампанское', 'Вино', 'Водка', 'Ликер', 'Коньяк', 'Виски']

export function RsvpSection({ slide }: { slide: SlideMeta }) {
  const [drinksAlcohol, setDrinksAlcohol] = useState('')
  const [attendance, setAttendance] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const payload: RsvpPayload = {
      name: String(data.get('name') ?? ''),
      attendance: String(data.get('attendance') ?? ''),
      ceremony: String(data.get('ceremony') ?? ''),
      photoSession: String(data.get('photoSession') ?? ''),
      guestCount: String(data.get('guestCount') ?? ''),
      drinksAlcohol: String(data.get('drinksAlcohol') ?? ''),
      alcohol: data.getAll('alcohol').map(String),
      alcoholOther: String(data.get('alcoholOther') ?? ''),
      dietary: String(data.get('dietary') ?? ''),
      comment: String(data.get('comment') ?? ''),
      website: String(data.get('website') ?? ''),
    }

    setSubmitting(true)
    setStatus('')
    try {
      const mode = await submitRsvp(payload)
      setStatus(
        mode === 'remote'
          ? 'Спасибо! Ваш ответ отправлен.'
          : 'Тестовый режим: ответ сохранён только на этом устройстве. Для настоящей отправки нужно подключить Google Таблицу.',
      )
      if (mode === 'remote') form.reset()
    } catch {
      setStatus('Не удалось отправить ответ. Проверьте интернет и попробуйте ещё раз — введённые данные сохранены в форме.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SectionFrame slide={slide} compact>
      <p class="wedding-section__eyebrow reveal-item">Ждём ваш ответ</p>
      <h2 id="slide-title-rsvp" class="section-heading reveal-item">Подтверждение присутствия</h2>
      <p class="section-copy reveal-item">Пожалуйста, ответьте до 10 августа 2026 года.</p>

      <form class="rsvp-form reveal-item swiper-no-swiping" onSubmit={handleSubmit}>
        <div class="form-field form-field--wide">
          <label for="rsvp-name">Ваши имя и фамилия *</label>
          <input id="rsvp-name" name="name" autocomplete="name" required />
        </div>

        <fieldset class="form-field form-field--wide">
          <legend>Сможете присутствовать? *</legend>
          <div class="choice-row">
            <label><input type="radio" name="attendance" value="yes" required onChange={() => setAttendance('yes')} /> С удовольствием приду</label>
            <label><input type="radio" name="attendance" value="no" onChange={() => setAttendance('no')} /> К сожалению, не смогу</label>
          </div>
        </fieldset>

        {attendance === 'yes' ? (
          <>
            <fieldset class="form-field">
              <legend>Приду на регистрацию *</legend>
              <div class="choice-row"><label><input type="radio" name="ceremony" value="yes" required /> Да</label><label><input type="radio" name="ceremony" value="no" /> Нет</label></div>
            </fieldset>
            <fieldset class="form-field">
              <legend>Желаете ли быть на фотосессии? *</legend>
              <div class="choice-row"><label><input type="radio" name="photoSession" value="yes" required /> Да</label><label><input type="radio" name="photoSession" value="no" /> Нет</label></div>
            </fieldset>
            <div class="form-field">
              <label for="guest-count">Сколько вас будет? *</label>
              <select id="guest-count" name="guestCount" required defaultValue="">
                <option value="" disabled>Выберите</option>
                <option value="1">Один гость</option>
                <option value="2">Два гостя</option>
                <option value="3">Три гостя</option>
                <option value="4">Четыре гостя</option>
              </select>
            </div>
            <fieldset class="form-field">
              <legend>Будете ли пить алкогольные напитки? *</legend>
              <div class="choice-row"><label><input type="radio" name="drinksAlcohol" value="yes" required onChange={() => setDrinksAlcohol('yes')} /> Да</label><label><input type="radio" name="drinksAlcohol" value="no" onChange={() => setDrinksAlcohol('no')} /> Нет</label></div>
            </fieldset>
            {drinksAlcohol === 'yes' ? (
              <fieldset class="form-field form-field--wide alcohol-field">
                <legend>Какой желаете алкоголь? Можно выбрать несколько вариантов</legend>
                <div class="checkbox-grid">
                  {alcoholOptions.map((option) => <label key={option}><input type="checkbox" name="alcohol" value={option} /> {option}</label>)}
                </div>
              </fieldset>
            ) : null}
            <div class="form-field">
              <label for="dietary">Ограничения по питанию</label>
              <input id="dietary" name="dietary" placeholder="Аллергии, предпочтения" />
            </div>
            <div class="form-field">
              <label for="comment">Комментарий</label>
              <textarea id="comment" name="comment" rows={3} />
            </div>
          </>
        ) : null}

        <div class="form-field form-field--wide form-actions">
          <input class="honeypot" name="website" tabindex={-1} autocomplete="off" aria-hidden="true" />
          <button type="submit" class="wedding-button" disabled={submitting}>{submitting ? 'Отправляем…' : 'Подтвердить'}</button>
          <p class="form-status" role="status" aria-live="polite">{status}</p>
        </div>
      </form>
    </SectionFrame>
  )
}
