import { useState } from 'preact/hooks'
import { buttonClass, copyClass, eyebrowClass, headingClass, SectionFrame } from '../components/slide/SectionFrame'
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
      setStatus(mode === 'remote' ? 'Спасибо! Ваш ответ отправлен.' : 'Ответ сохранён.')
      if (mode === 'remote') form.reset()
    } catch {
      setStatus('Не удалось отправить ответ. Проверьте интернет и попробуйте ещё раз — введённые данные сохранены в форме.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SectionFrame slide={slide} compact>
      <p class={eyebrowClass}>Ждём ваш ответ</p>
      <h2 id="slide-title-rsvp" class={headingClass}>Подтверждение присутствия</h2>
      <p class={copyClass}>Пожалуйста, ответьте до 10 августа 2026 года.</p>

      <form class="reveal-item swiper-no-swiping mt-4 grid w-full max-w-[58rem] grid-cols-1 gap-4 rounded-3xl bg-white/90 p-[clamp(1rem,3vw,2rem)] text-left shadow-soft md:grid-cols-2 [&_.form-field]:m-0 [&_.form-field]:grid [&_.form-field]:min-w-0 [&_.form-field]:content-start [&_.form-field]:gap-2 [&_.form-field]:border-0 [&_.form-field]:p-0 [&_.form-field>label]:font-bold [&_.form-field>legend]:font-bold [&_.form-field--wide]:md:col-span-2 [&_.choice-row]:flex [&_.choice-row]:flex-wrap [&_.choice-row]:gap-x-4 [&_.choice-row]:gap-y-2 [&_.choice-row_label]:inline-flex [&_.choice-row_label]:min-h-11 [&_.choice-row_label]:cursor-pointer [&_.choice-row_label]:items-center [&_.choice-row_label]:gap-2 [&_.choice-row_label]:font-normal [&_.checkbox-grid]:grid [&_.checkbox-grid]:grid-cols-2 [&_.checkbox-grid]:gap-x-3 [&_.checkbox-grid_label]:inline-flex [&_.checkbox-grid_label]:min-h-11 [&_.checkbox-grid_label]:cursor-pointer [&_.checkbox-grid_label]:items-center [&_.checkbox-grid_label]:gap-2 [&_.checkbox-grid_label]:font-normal [&_input[type=radio]]:size-5 [&_input[type=radio]]:accent-gold-deep [&_input[type=checkbox]]:size-5 [&_input[type=checkbox]]:accent-gold-deep [&_input:not([type=radio]):not([type=checkbox])]:min-h-12 [&_input:not([type=radio]):not([type=checkbox])]:w-full [&_input:not([type=radio]):not([type=checkbox])]:rounded-lg [&_input:not([type=radio]):not([type=checkbox])]:border [&_input:not([type=radio]):not([type=checkbox])]:border-ink/30 [&_input:not([type=radio]):not([type=checkbox])]:bg-white/85 [&_input:not([type=radio]):not([type=checkbox])]:px-3 [&_input:not([type=radio]):not([type=checkbox])]:py-2 [&_select]:min-h-12 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-ink/30 [&_select]:bg-white/85 [&_select]:px-3 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-ink/30 [&_textarea]:bg-white/85 [&_textarea]:px-3 [&_textarea]:py-2" onSubmit={handleSubmit}>
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
          <input class="pointer-events-none absolute size-px opacity-0" name="website" tabindex={-1} autocomplete="off" aria-hidden="true" />
          <button type="submit" class={buttonClass} disabled={submitting}>{submitting ? 'Отправляем…' : 'Подтвердить'}</button>
          <p class="mt-2 mb-0 min-h-[1.4em] text-ink-soft" role="status" aria-live="polite">{status}</p>
        </div>
      </form>
    </SectionFrame>
  )
}
