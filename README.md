# Свадебное приглашение Анастасии и Эдуарда

Адаптивное интерактивное приглашение на Preact, Tailwind CSS, Swiper и Vite.

Статические ресурсы организованы в `public/images`, `public/fonts`, `public/icons` и `public/calendar`.

## Запуск

```bash
npm ci
cp .env.example .env
npm run dev
```

Заполните переменные в `.env`:

- `VITE_YANDEX_MAPS_API_KEY` — ключ JavaScript API Яндекс Карт.
- `VITE_RSVP_ENDPOINT` — URL опубликованного Google Apps Script.
- `VITE_SEATING_ENDPOINT` — URL поиска рассадки; может совпадать с RSVP endpoint.

## Команды

```bash
npm run build
npm run test
npm run test:e2e
```

Настройка Google Apps Script описана в [`apps-script/README.md`](apps-script/README.md).
