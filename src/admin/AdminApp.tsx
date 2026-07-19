import { useEffect, useState } from 'preact/hooks'
import { SeatingCanvas } from '../components/seating/SeatingCanvas'
import { buttonClass } from '../components/slide/SectionFrame'
import { weddingApi, type AdminGuest } from '../services/weddingApi'

export function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [guests, setGuests] = useState<AdminGuest[]>([])
  const [selectedGuest, setSelectedGuest] = useState<number | null>(null)
  const [status, setStatus] = useState('')

  const loadGuests = async () => {
    const result = await weddingApi.guests()
    setGuests(result.guests)
  }

  useEffect(() => {
    weddingApi.session().then(async ({ authenticated: active }) => {
      setAuthenticated(active)
      if (active) await loadGuests()
    }).catch(() => setAuthenticated(false))
  }, [])

  if (authenticated === null) return <AdminShell><p>Проверяем сессию…</p></AdminShell>
  if (!authenticated) return <Login onSuccess={async () => { setAuthenticated(true); await loadGuests() }} />

  const activeGuest = guests.find((guest) => guest.id === selectedGuest)
  const handleSeat = async (table: number, seat: number) => {
    if (!selectedGuest) { setStatus('Сначала выберите гостя.'); return }
    setStatus('Сохраняем место…')
    try {
      await weddingApi.assignSeat(table, seat, selectedGuest)
      await loadGuests()
      setStatus(`Гость размещён: стол ${table}, место ${seat}.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Не удалось сохранить место.') }
  }

  return (
    <AdminShell>
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div><p class="m-0 text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">Анастасия и Эдуард</p><h1 class="mt-1 mb-0 font-script text-5xl font-normal">Рассадка гостей</h1></div>
        <div class="flex gap-2">
          <a class="inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-ink no-underline shadow-soft" href="/api/admin/export">Экспорт JSON</a>
          <button class="min-h-11 rounded-xl bg-ink px-4 text-sm font-semibold text-white" onClick={async () => { await weddingApi.logout(); setAuthenticated(false) }}>Выйти</button>
        </div>
      </header>

      <div class="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
        <section class="rounded-3xl bg-white/70 p-3 shadow-soft sm:p-5">
          <SeatingCanvas
            admin
            guests={guests.map((guest) => ({ id: guest.id, name: guest.publicName, tableNumber: guest.tableNumber, seatNumber: guest.seatNumber }))}
            selectedSeat={activeGuest?.tableNumber && activeGuest.seatNumber ? { table: activeGuest.tableNumber, seat: activeGuest.seatNumber } : null}
            onSeatSelect={handleSeat}
          />
          <p class="mt-3 mb-0 min-h-6 text-center text-sm text-ink-soft" role="status">{status || (activeGuest ? `Выбран: ${activeGuest.name}. Нажмите на стул.` : 'Выберите гостя справа, затем нажмите на стул.')}</p>
        </section>

        <GuestPanel guests={guests} selectedGuest={selectedGuest} onSelect={setSelectedGuest} onChanged={loadGuests} />
      </div>
    </AdminShell>
  )
}

function GuestPanel({ guests, selectedGuest, onSelect, onChanged }: { guests: AdminGuest[]; selectedGuest: number | null; onSelect: (id: number) => void; onChanged: () => Promise<void> }) {
  const [name, setName] = useState('')
  const [filter, setFilter] = useState<'all' | 'unseated' | 'yes' | 'no'>('all')
  const visible = guests.filter((guest) => filter === 'all' || (filter === 'unseated' ? !guest.tableNumber : guest.attendance === filter))
  const active = guests.find((guest) => guest.id === selectedGuest)

  return (
    <aside class="rounded-3xl bg-white/80 p-4 shadow-soft sm:p-5">
      <form class="flex gap-2" onSubmit={async (event) => { event.preventDefault(); if (name.trim().length < 2) return; await weddingApi.addGuest(name); setName(''); await onChanged() }}>
        <input class="min-h-11 min-w-0 flex-1 rounded-xl border border-ink/20 bg-white px-3" value={name} onInput={(event) => setName(event.currentTarget.value)} placeholder="Имя нового гостя" />
        <button class={`${buttonClass} min-h-11 px-4 py-2`}>Добавить</button>
      </form>
      <div class="mt-3 flex flex-wrap gap-1.5">
        {([['all', 'Все'], ['unseated', 'Без места'], ['yes', 'Придут'], ['no', 'Не придут']] as const).map(([value, label]) => <button type="button" class={`min-h-10 rounded-full px-3 text-sm ${filter === value ? 'bg-gold-deep text-white' : 'bg-paper-deep text-ink'}`} onClick={() => setFilter(value)} key={value}>{label}</button>)}
      </div>
      <div class="mt-3 max-h-[45dvh] space-y-2 overflow-y-auto pr-1">
        {visible.map((guest) => (
          <button type="button" class={`w-full rounded-xl p-3 text-left transition-colors ${selectedGuest === guest.id ? 'bg-gold-deep text-white' : 'bg-white hover:bg-gold-pale/45'}`} onClick={() => onSelect(guest.id)} key={guest.id}>
            <strong class="block">{guest.name}</strong>
            <span class="text-xs opacity-75">{guest.tableNumber ? `Стол ${guest.tableNumber}, место ${guest.seatNumber}` : 'Место не назначено'} · {guest.attendance === 'yes' ? 'придёт' : guest.attendance === 'no' ? 'не придёт' : 'нет ответа'}</span>
          </button>
        ))}
      </div>
      {active ? (
        <div class="mt-4 rounded-2xl bg-paper p-4 text-sm">
          <strong class="text-base">Пожелания</strong>
          <p class="mt-2 mb-0"><b>Алкоголь:</b> {active.alcohol.join(', ') || 'не указано'}</p>
          <p class="mt-1 mb-0"><b>Питание:</b> {active.dietary || 'не указано'}</p>
          <p class="mt-1 mb-0"><b>Комментарий:</b> {active.comment || 'нет'}</p>
          <div class="mt-3 flex gap-2">
            {active.tableNumber && active.seatNumber ? <button class="min-h-10 rounded-lg bg-white px-3" onClick={async () => { await weddingApi.clearSeat(active.tableNumber!, active.seatNumber!); await onChanged() }}>Освободить место</button> : null}
            <button class="min-h-10 rounded-lg bg-[#8c3f35] px-3 text-white" onClick={async () => { if (confirm(`Удалить ${active.name}?`)) { await weddingApi.deleteGuest(active.id); onSelect(0); await onChanged() } }}>Удалить</button>
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function Login({ onSuccess }: { onSuccess: () => void | Promise<void> }) {
  const [status, setStatus] = useState('')
  return <AdminShell><form class="mx-auto mt-[12dvh] grid w-full max-w-sm gap-3 rounded-3xl bg-white/85 p-6 shadow-soft" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); try { await weddingApi.login(String(data.get('username')), String(data.get('password'))); await onSuccess() } catch (error) { setStatus(error instanceof Error ? error.message : 'Не удалось войти.') } }}><h1 class="m-0 font-script text-5xl font-normal">Вход в админку</h1><label class="grid gap-1 font-semibold">Логин<input class="min-h-12 rounded-xl border border-ink/25 px-3 font-normal" name="username" autocomplete="username" required /></label><label class="grid gap-1 font-semibold">Пароль<input class="min-h-12 rounded-xl border border-ink/25 px-3 font-normal" name="password" type="password" autocomplete="current-password" required /></label><button class={buttonClass}>Войти</button><p class="m-0 min-h-5 text-sm text-[#8c3f35]" role="status">{status}</p></form></AdminShell>
}

function AdminShell({ children }: { children: preact.ComponentChildren }) {
  return <main class="min-h-dvh bg-[radial-gradient(circle_at_top,#fffdf8,#efe3d1)] p-4 text-ink sm:p-7">{children}</main>
}
