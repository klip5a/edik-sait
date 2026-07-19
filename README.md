# Свадебное приглашение Анастасии и Эдуарда

Адаптивное приглашение и админка на Preact, Tailwind CSS, Swiper, Hono и SQLite.

Статические ресурсы организованы в `public/images`, `public/fonts`, `public/icons` и `public/calendar`.

## Запуск

```bash
npm ci
cp .env.example .env
npm run dev
```

Заполните переменные в `.env`:

- `VITE_YANDEX_MAPS_API_KEY` — ключ JavaScript API Яндекс Карт.
- `DATABASE_PATH` — путь к persistent SQLite-файлу.
- `ADMIN_USERNAME` — общий логин Эдика и Насти.
- `ADMIN_PASSWORD_HASH` — хеш пароля из команды `npm run password:hash -- "пароль"`.
- `SESSION_SECRET` — случайная длинная строка для production.

## Команды

```bash
npm run build
npm run test
npm run test:e2e
npm start
```

После `npm run build` команда `npm start` запускает production-сервер Hono на порту `PORT`, раздаёт собранный сайт и API. Админка доступна по `/admin`.

Для локальной разработки запустите `npm run dev` и `npm run dev:server` в двух терминалах. Vite проксирует `/api` на Hono.

## Проверка админки

Самый простой сценарий:

```bash
npm run build
npm start
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
npm run dev:server
npm run dev
```

В этом режиме админка будет доступна на `http://localhost:5173/admin`, а API пойдёт через Vite proxy на Hono.
