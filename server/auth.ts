import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { Context, Next } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { db } from './db.js'

const cookieName = 'wedding_admin_session'
const sessionDurationMs = 1000 * 60 * 60 * 24 * 14

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function verifyPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_HASH
  if (!encoded && process.env.NODE_ENV !== 'production') return password === (process.env.ADMIN_PASSWORD || 'wedding2026')
  if (!encoded) return false
  const [salt, expectedHex] = encoded.split(':')
  if (!salt || !expectedHex) return false
  const actual = scryptSync(password, salt, 32)
  const expected = Buffer.from(expectedHex, 'hex')
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function createSession(c: Context) {
  const token = randomBytes(32).toString('base64url')
  const id = randomBytes(12).toString('hex')
  const expiresAt = new Date(Date.now() + sessionDurationMs)
  db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(new Date().toISOString())
  db.prepare('INSERT INTO admin_sessions (id, token_hash, expires_at) VALUES (?, ?, ?)').run(id, hashToken(token), expiresAt.toISOString())
  setCookie(c, cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/', expires: expiresAt })
}

export function destroySession(c: Context) {
  const token = getCookie(c, cookieName)
  if (token) db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(hashToken(token))
  deleteCookie(c, cookieName, { path: '/' })
}

export function hasSession(c: Context) {
  const token = getCookie(c, cookieName)
  if (!token) return false
  return Boolean(db.prepare('SELECT 1 FROM admin_sessions WHERE token_hash = ? AND expires_at > ?').get(hashToken(token), new Date().toISOString()))
}

export async function requireAdmin(c: Context, next: Next) {
  if (!hasSession(c)) return c.json({ ok: false, message: 'Требуется вход.' }, 401)
  await next()
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`
}
