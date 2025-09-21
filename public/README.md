# 🏪 Chizhik Avito Integration

API-приложение для автоматизированного поиска коммерческой недвижимости на Авито под сеть магазинов "Чижик".

## 🎯 Описание проекта

Приложение интегрируется с API Авито для поиска помещений под магазины сети "Чижик" с учетом специфических требований:
- Площадь: 50-200 кв.м
- Первый этаж с отдельным входом
- Жилые районы с высокой проходимостью
- Максимальная стоимость: 2000 руб/кв.м/месяц

## 🚀 Демо

🌐 **Живая демо:** [chizhik-avito-integration.vercel.app](https://your-app.vercel.app)

![App Screenshot](https://via.placeholder.com/800x400/22c55e/ffffff?text=Chizhik+Avito+Integration)

## ✨ Особенности

- 🔐 **OAuth2 авторизация** с API Авито
- 🗺️ **Поиск по регионам** на основе географических границ
- 🎛️ **Гибкие фильтры** для точного поиска
- 📱 **Адаптивный дизайн** для мобильных устройств
- 📊 **Экспорт результатов** в JSON/CSV
- 🔄 **Автоматическое обновление** токенов

## 🛠️ Технический стек

### Frontend
- **HTML5/CSS3/JavaScript** (Vanilla JS)
- **Bootstrap UI** для интерфейса
- **Responsive Design**

### Backend
- **Node.js** с Express.js
- **Axios** для HTTP запросов
- **CORS** для безопасности
- **dotenv** для переменных окружения

### API Integration
- **Avito API** для поиска объявлений
- **OAuth2 Client Credentials** для авторизации
- **RESTful API** архитектура

## 📦 Установка и запуск

### Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/chizhik-avito-integration.git
cd chizhik-avito-integration

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env

# Запустить в режиме разработки
npm run dev

# Открыть http://localhost:3000
```

### Переменные окружения

```env
AVITO_CLIENT_ID=kju3jpN2oROMhCaooINL
AVITO_CLIENT_SECRET=your_client_secret_here
NODE_ENV=development
PORT=3000
```

## 🌐 Деплой

### Vercel (рекомендуется)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/chizhik-avito-integration)

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

### Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

```bash
# Создать приложение Heroku
heroku create chizhik-avito-search

# Настроить переменные окружения
heroku config:set AVITO_CLIENT_ID=kju3jpN2oROMhCaooINL
heroku config:set AVITO_CLIENT_SECRET=your_secret_here

# Деплой
git push heroku main
```

### Docker

```bash
# Собрать образ
docker build -t chizhik-avito-integration .

# Запустить контейнер
docker run -p 3000:3000 --env-file .env chizhik-avito-integration
```

## 📊 API Endpoints

### Authentication
```http
POST /api/auth
Content-Type: application/json

{
  "grant_type": "client_credentials"
}
```

### Search Listings
```http
POST /api/search
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "region": "moscow",
  "filters": {
    "min_area": 50,
    "max_area": 200,
    "max_price": 2000,
    "ground_floor": true
  }
}
```

### Health Check
```http
GET /api/health
```

## 🗺️ Регионы поиска

Приложение поддерживает поиск в следующих регионах:

| Регион | Приоритет | Координаты |
|--------|-----------|------------|
| Москва и область | 1 | 56.223-60.684, 28.319-33.680 |
| Центральная Россия | 2 | 52.491-66.229, 32.999-60.179 |
| Краснодарский край | 3 | 43.514-47.557, 38.382-40.008 |
| Урал | 4 | 54.903-57.805, 60.003-66.221 |
| Сибирь | 5 | 54.483-56.974, 71.539-94.962 |

## 🔧 Разработка

### Структура проекта

```
chizhik-avito-integration/
├── public/                 # Frontend файлы
│   ├── index.html         # Главная страница
│   ├── style.css          # Стили
│   └── app.js            # Frontend логика
├── api/                   # API endpoints (Vercel)
│   ├── auth.js           # Авторизация
│   ├── search.js         # Поиск
│   └── health.js         # Health check
├── server.js             # Express сервер
├── package.json          # Зависимости
├── vercel.json           # Конфигурация Vercel
├── Dockerfile            # Docker образ
└── README.md             # Документация
```

### Запуск тестов

```bash
# Запустить тесты
npm test

# Линтинг
npm run lint

# Форматирование кода
npm run format
```

## 📝 Документация API Авито

- [Официальная документация](https://developers.avito.ru/api-catalog)
- [OAuth2 авторизация](https://developers.avito.ru/api-catalog/auth/documentation)
- [Поиск объявлений](https://developers.avito.ru/api-catalog/item/documentation)

## 🤝 Contributing

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл для деталей.

## 📞 Контакты

- **Email:** support@chizhik.club
- **Telegram:** [@chizhik_support](https://t.me/chizhik_support)
- **Website:** [chizhik.club](https://chizhik.club)

## 🔗 Полезные ссылки

- [Авито для бизнеса](https://www.avito.ru/business)
- [Сеть магазинов Чижик](https://chizhik.club)
- [Документация по аренде](https://chizhik.club/arenda)

---

⭐ **Понравился проект? Поставьте звездочку!**