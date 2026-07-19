# Свадебное приглашение Анастасии и Эдуарда

Адаптивное приглашение и админка на Preact, Tailwind CSS, Swiper, Hono и SQLite.

Статические ресурсы организованы в `public/images`, `public/fonts`, `public/icons` и `public/calendar`.

## Запуск

```bash
mise use -g node@24.15.0
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

Проект зафиксирован на Node `24.15.0`. Если до этого зависимости ставились под другой версией Node, выполните:

```bash
pnpm rebuild better-sqlite3
```

Заполните переменные в `.env`:

- `VITE_YANDEX_MAPS_API_KEY` — ключ JavaScript API Яндекс Карт.
- `DATABASE_PATH` — путь к persistent SQLite-файлу.
- `ADMIN_USERNAME` — общий логин Эдика и Насти.
- `ADMIN_PASSWORD_HASH` — хеш пароля из команды `pnpm password:hash "пароль"`.
- `SESSION_SECRET` — случайная длинная строка для production.

## Команды

```bash
pnpm dev
pnpm build
pnpm test
pnpm test:e2e
pnpm start
```

`pnpm dev` запускает Vite и Hono вместе. Админка в разработке доступна на `http://localhost:5173/admin`, а API идёт через Vite proxy на Hono.

После `pnpm build` команда `pnpm start` запускает production-сервер Hono на порту `PORT`, раздаёт собранный сайт и API. Админка доступна по `/admin`.

## Проверка админки

Самый простой сценарий:

```bash
pnpm build
pnpm start
```

Откройте `http://localhost:3000/admin`.

Если `NODE_ENV` не равен `production` и `ADMIN_PASSWORD_HASH` не задан, локально работает тестовый вход:

- логин: `admin`
- пароль: `wedding2026`

Что проверить:

- вход в `/admin`
- добавление нового гостя
- посадку гостя на место на схеме
- очистку места
- отображение той же рассадки в публичном блоке сайта

Режим разработки:

```bash
pnpm dev
```

В этом режиме админка будет доступна на `http://localhost:5173/admin`, а API пойдёт через Vite proxy на Hono.
