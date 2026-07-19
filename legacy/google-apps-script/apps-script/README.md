# Google Apps Script для свадебного приглашения

## Развёртывание

1. Создайте Google Таблицу по схеме из `docs/google-sheet-schema.md`.
2. Создайте standalone-проект Apps Script и перенесите `Code.gs` и `appsscript.json`.
3. В **Project Settings → Script Properties** добавьте:
   - `SPREADSHEET_ID` — ID таблицы из её URL;
   - `RSVP_DEADLINE` — `2026-08-10T23:59:59+05:00`.
4. Выберите **Deploy → New deployment → Web app**.
5. Выполнять от имени владельца; доступ — для всех, включая анонимных пользователей.
6. Скопируйте URL `/exec` в `VITE_RSVP_ENDPOINT` и `VITE_SEATING_ENDPOINT` локального `.env`.
7. После изменения кода создавайте новую версию deployment; тестовый URL `/dev` гостям не передавайте.

Endpoint принимает `POST` с `Content-Type: text/plain;charset=utf-8` и JSON:

```json
{"action":"lookupSeat","payload":{"name":"Иван Иванов"}}
```

```json
{"action":"submitRsvp","payload":{"name":"Иван Иванов","attendance":"no","website":""}}
```

Все ответы имеют форму `{ "ok": true, ... }` либо `{ "ok": false, "code": "...", "message": "..." }`.

## Проверка

- Откройте URL `/exec` браузером: должен вернуться health JSON.
- Выполните поиск точного имени из листа `Seating`.
- Отправьте тестовый RSVP и проверьте новую строку на листе `RSVP`.
- Проверьте неизвестное действие и невалидный payload — таблица не должна измениться.
