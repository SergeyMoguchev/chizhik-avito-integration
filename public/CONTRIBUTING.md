# Contributing to Chizhik Avito Integration

Спасибо за интерес к проекту! Мы приветствуем любой вклад в развитие приложения.

## 🚀 Как начать

1. **Fork** репозитория
2. **Clone** своего fork локально
3. Создайте новую **feature branch**
4. Внесите изменения
5. **Commit** и **push**
6. Создайте **Pull Request**

## 📝 Процесс разработки

### Настройка окружения

```bash
# Клонировать fork
git clone https://github.com/YOUR_USERNAME/chizhik-avito-integration.git
cd chizhik-avito-integration

# Добавить upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/chizhik-avito-integration.git

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env
```

### Создание feature branch

```bash
# Обновить main branch
git checkout main
git pull upstream main

# Создать новую feature branch
git checkout -b feature/your-feature-name
```

### Commit сообщения

Используйте [Conventional Commits](https://conventionalcommits.org/):

```
feat: добавить новый фильтр по площади
fix: исправить ошибку авторизации
docs: обновить README
style: исправить форматирование
refactor: оптимизировать запросы к API
test: добавить тесты для поиска
chore: обновить зависимости
```

## 🧪 Тестирование

```bash
# Запустить все тесты
npm test

# Линтинг
npm run lint

# Проверить форматирование
npm run format:check

# Исправить форматирование
npm run format
```

## 📋 Checklist для PR

- [ ] Код протестирован локально
- [ ] Добавлены тесты для новой функциональности
- [ ] Документация обновлена
- [ ] Commit сообщения следуют конвенции
- [ ] PR имеет понятное описание
- [ ] Нет конфликтов с main branch

## 🐛 Reporting Issues

При создании issue включите:

- **Версию** приложения
- **Окружение** (браузер, OS)
- **Шаги** для воспроизведения
- **Ожидаемое поведение**
- **Актуальное поведение**
- **Скриншоты** (если применимо)

## 💡 Предложения

Для новых функций:

1. Сначала создайте **issue** с описанием
2. Дождитесь обратной связи от мейнтейнеров
3. Начинайте разработку после одобрения

## 📞 Контакты

Вопросы? Свяжитесь с нами:
- GitHub Issues
- Email: support@chizhik.club
- Telegram: @chizhik_support