import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { z } from 'zod'
import { createSession, destroySession, hasSession, requireAdmin, verifyPassword } from './auth.js'
import { db, listGuests, normalizeName, publicSeating, type GuestRow } from './db.js'

const app = new Hono()
app.use('*', secureHeaders())

const yesNo = z.enum(['yes', 'no', ''])
const guestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  publicName: z.string().trim().min(1).max(80).optional(),
  attendance: yesNo.default(''),
  ceremony: yesNo.default(''),
  photoSession: yesNo.default(''),
  guestCount: z.coerce.number().int().min(1).max(4).default(1),
  drinksAlcohol: yesNo.default(''),
  alcohol: z.array(z.string().max(40)).max(12).default([]),
  alcoholOther: z.string().max(120).default(''),
  dietary: z.string().max(500).default(''),
  comment: z.string().max(1000).default(''),
})

app.get('/api/health', (c) => c.json({ ok: true }))
app.get('/api/seating', (c) => c.json({ ok: true, guests: publicSeating() }))

app.post('/api/rsvp', async (c) => {
  const raw = await c.req.json().catch(() => null)
  if (raw?.website) return c.json({ ok: true })
  const parsed = guestSchema.safeParse(raw)
  if (!parsed.success) return c.json({ ok: false, message: 'Проверьте заполнение формы.' }, 400)
  const g = parsed.data
  db.prepare(`
    INSERT INTO guests (name, public_name, normalized_name, attendance, ceremony, photo_session, guest_count, drinks_alcohol, alcohol_preferences, alcohol_other, dietary, comment)
    VALUES (@name, @publicName, @normalizedName, @attendance, @ceremony, @photoSession, @guestCount, @drinksAlcohol, @alcohol, @alcoholOther, @dietary, @comment)
    ON CONFLICT(normalized_name) DO UPDATE SET
      name=excluded.name, public_name=excluded.public_name, attendance=excluded.attendance,
      ceremony=excluded.ceremony, photo_session=excluded.photo_session, guest_count=excluded.guest_count,
      drinks_alcohol=excluded.drinks_alcohol, alcohol_preferences=excluded.alcohol_preferences,
      alcohol_other=excluded.alcohol_other, dietary=excluded.dietary, comment=excluded.comment,
      updated_at=CURRENT_TIMESTAMP
  `).run({ ...g, publicName: g.publicName || g.name, normalizedName: normalizeName(g.name), alcohol: JSON.stringify(g.alcohol) })
  return c.json({ ok: true })
})

app.post('/api/admin/login', async (c) => {
  const body = await c.req.json().catch(() => null)
  const username = String(body?.username || '')
  const password = String(body?.password || '')
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
  if (username !== expectedUsername || !verifyPassword(password)) return c.json({ ok: false, message: 'Неверный логин или пароль.' }, 401)
  createSession(c)
  return c.json({ ok: true })
})
app.post('/api/admin/logout', (c) => { destroySession(c); return c.json({ ok: true }) })
app.get('/api/admin/session', (c) => c.json({ ok: true, authenticated: hasSession(c) }))

app.use('/api/admin/*', requireAdmin)
app.get('/api/admin/guests', (c) => c.json({ ok: true, guests: listGuests().map(serializeGuest) }))
app.post('/api/admin/guests', async (c) => {
  const parsed = guestSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ ok: false, message: 'Некорректные данные гостя.' }, 400)
  const g = parsed.data
  try {
    const result = db.prepare('INSERT INTO guests (name, public_name, normalized_name) VALUES (?, ?, ?)').run(g.name, g.publicName || g.name, normalizeName(g.name))
    return c.json({ ok: true, id: Number(result.lastInsertRowid) }, 201)
  } catch { return c.json({ ok: false, message: 'Гость с таким именем уже существует.' }, 409) }
})
app.patch('/api/admin/guests/:id', async (c) => {
  const current = db.prepare('SELECT * FROM guests WHERE id = ?').get(c.req.param('id')) as GuestRow | undefined
  if (!current) return c.json({ ok: false, message: 'Гость не найден.' }, 404)
  const raw = await c.req.json().catch(() => ({}))
  const name = String(raw.name ?? current.name).trim()
  const publicName = String(raw.publicName ?? current.public_name).trim()
  db.prepare('UPDATE guests SET name=?, public_name=?, normalized_name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(name, publicName, normalizeName(name), current.id)
  return c.json({ ok: true })
})
app.delete('/api/admin/guests/:id', (c) => {
  db.prepare('DELETE FROM guests WHERE id = ?').run(c.req.param('id'))
  return c.json({ ok: true })
})
app.put('/api/admin/seats/:table/:seat', async (c) => {
  const table = Number(c.req.param('table')); const seat = Number(c.req.param('seat'))
  const body = await c.req.json().catch(() => null); const guestId = Number(body?.guestId)
  if (table < 1 || table > 4 || seat < 1 || seat > 6 || !guestId) return c.json({ ok: false, message: 'Некорректное место.' }, 400)
  try {
    db.transaction(() => {
      db.prepare('UPDATE guests SET table_number=NULL, seat_number=NULL WHERE table_number=? AND seat_number=?').run(table, seat)
      db.prepare('UPDATE guests SET table_number=?, seat_number=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(table, seat, guestId)
    })()
    return c.json({ ok: true })
  } catch { return c.json({ ok: false, message: 'Место уже занято.' }, 409) }
})
app.delete('/api/admin/seats/:table/:seat', (c) => {
  db.prepare('UPDATE guests SET table_number=NULL, seat_number=NULL, updated_at=CURRENT_TIMESTAMP WHERE table_number=? AND seat_number=?').run(c.req.param('table'), c.req.param('seat'))
  return c.json({ ok: true })
})
app.get('/api/admin/export', (c) => c.json({ exportedAt: new Date().toISOString(), guests: listGuests().map(serializeGuest) }))

function serializeGuest(row: GuestRow) {
  return { id: row.id, name: row.name, publicName: row.public_name, attendance: row.attendance, ceremony: row.ceremony, photoSession: row.photo_session, guestCount: row.guest_count, drinksAlcohol: row.drinks_alcohol, alcohol: JSON.parse(row.alcohol_preferences), alcoholOther: row.alcohol_other, dietary: row.dietary, comment: row.comment, tableNumber: row.table_number, seatNumber: row.seat_number }
}

app.use('/*', serveStatic({ root: './dist' }))
app.get('*', serveStatic({ path: './dist/index.html' }))

const port = Number(process.env.PORT || 3000)
serve({ fetch: app.fetch, port }, ({ port: actualPort }) => console.log(`Wedding server: http://localhost:${actualPort}`))
