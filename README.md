# Толе — шаманские зеркала ручной работы

Премиальный лендинг для авторского бренда зеркал Толе: символических артефактов, украшений и декоративных объектов ручной работы.

## Стек

- Next.js 14
- TypeScript
- App Router
- Tailwind CSS
- Framer Motion
- React Three Fiber
- Drei

## Запуск

```bash
npm install
npm run dev
```

Проект будет доступен по адресу:

```bash
http://localhost:3000
```

## Сборка

```bash
npm run build
npm run start
```

## Структура

- `app/` — страницы, layout, глобальные стили и mock API для заявки
- `components/` — секции лендинга и UI-компоненты
- `data/products.ts` — данные коллекции, FAQ и опции индивидуального заказа
- `lib/utils.ts` — утилиты и контактные ссылки

## Заявки

Форма отправляет данные в mock endpoint `app/api/contact/route.ts`. Позже его можно заменить на интеграцию с Telegram Bot API, email-сервисом или backend endpoint.
