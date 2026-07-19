import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export interface GuestRow {
  id: number
  name: string
  public_name: string
  normalized_name: string
  attendance: string
  ceremony: string
  photo_session: string
  guest_count: number
  drinks_alcohol: string
  alcohol_preferences: string
  alcohol_other: string
  dietary: string
  comment: string
  table_number: number | null
  seat_number: number | null
  created_at: string
  updated_at: string
}

const databasePath = process.env.DATABASE_PATH || './data/wedding.sqlite'
mkdirSync(dirname(databasePath), { recursive: true })

export const db = new Database(databasePath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    public_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL UNIQUE,
    attendance TEXT NOT NULL DEFAULT '',
    ceremony TEXT NOT NULL DEFAULT '',
    photo_session TEXT NOT NULL DEFAULT '',
    guest_count INTEGER NOT NULL DEFAULT 1,
    drinks_alcohol TEXT NOT NULL DEFAULT '',
    alcohol_preferences TEXT NOT NULL DEFAULT '[]',
    alcohol_other TEXT NOT NULL DEFAULT '',
    dietary TEXT NOT NULL DEFAULT '',
    comment TEXT NOT NULL DEFAULT '',
    table_number INTEGER CHECK (table_number BETWEEN 1 AND 4),
    seat_number INTEGER CHECK (seat_number BETWEEN 1 AND 6),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((table_number IS NULL AND seat_number IS NULL) OR (table_number IS NOT NULL AND seat_number IS NOT NULL))
  );
  CREATE UNIQUE INDEX IF NOT EXISTS guests_unique_seat
    ON guests(table_number, seat_number)
    WHERE table_number IS NOT NULL AND seat_number IS NOT NULL;
  CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

export function normalizeName(value: string) {
  return value.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/\s+/g, ' ').trim()
}

export function listGuests() {
  return db.prepare('SELECT * FROM guests ORDER BY name COLLATE NOCASE').all() as GuestRow[]
}

export function publicSeating() {
  return (db.prepare(`
    SELECT id, public_name AS name, table_number AS tableNumber, seat_number AS seatNumber
    FROM guests
    WHERE table_number IS NOT NULL AND seat_number IS NOT NULL
    ORDER BY table_number, seat_number
  `).all())
}
