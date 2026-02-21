# Novome Backend - NestJS REST API

---

TODO:

- [x] Добавить проверку подтвержденной почты, чтобы войти
- [x] Добавить ACCESS GUARD на проверку доступности (подтверждёна ли почта)
- [x] Добавить TYPE DECORATOR для размещения типа в класс
- [x] Добавить TYPE GUARD на проверку типа (USER, STAFF)
- [x] Добавить ROLE DECORATOR для размещения роли
- [x] Добавить ROLE GUARD на проверку роли (PATIENT, DOCTOR, CLINIC)
- [ ] Поддержка: Если у пользователя проблема с созданием профиля, он создает Ticket (например, модальное окно после входа, на странице ожидания ответа модерации). Тикет падает в Moderation.tickets.

---

## 📋 Описание проекта

Backend для медицинского приложения, разрабатываемый на NestJS.

## 🎯 Цели проекта

- ✅ Централизованная бизнес-логика
- ✅ Валидация данных на уровне API
- ✅ Безопасность и авторизация
- ✅ Логирование и мониторинг
- ✅ Масштабируемость

---

## 📦 Технологический стек

- **Framework:** NestJS 10+
- **Language:** TypeScript 5+
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger/OpenAPI
- **Testing:** Jest

---

## 🚀 Чеклист разработки

### Auth Service - Сервис аутентификация

- [x] `GET /auth/confirm` - Подтверждение почты
- [x] `POST /auth/send-confirm` - Отправить ссылку на подтверждение почты
- [x] `POST /auth/login` - Вход пользователя
- [x] `POST /auth/register` - Регистрация пользователя
- [x] `POST /auth/refresh` - Обновление токена
- [x] `POST /auth/forgot-password` - Забыл пароль (Восстановление доступа)
- [x] `POST /auth/reset-password` - Изменение пароля
- [x] `POST /auth/logout` - Выход пользователя

### Users Service - Сервис пользователей

- [x] `GET /users/me` - Получение собственного аккаунта
- [x] `GET /users` - Получить пользователей (опц. с фильтрацией)
- [x] `GET /users/:id` - Получить пользователя
- [x] `POST /users/user` - Создать пользователя
- [x] `POST /user/change-password` - Изменение пароля
- [x] `PATCH /users/me` - Обновление собственного аккаунта (опц. с профилем)
- [x] `DELETE /users/:id - Удаление пользователя`

### Profile Service - Сервис пользовательского профиля

- [x] `POST /users/:id/profile` - Создать профиль пользователя

### Staff Service - Сервис персонала

- [x] `GET /staffs/me` - Получение собственного аккаунта модератора
- [x] `POST /staffs` - Создание модератора

### Moderation Service - Сервис модерации

- [x] `GET /moderation/users` - Получение всех заявок на регистрацию пользователя (доктор, клиника)
- [x] `GET /moderation/reviews` - Получение всех отзывов
- [x] `GET /moderation/tickets` - Получение всех тикетов от пользователей
- [x] `POST /moderation/users/:id` - Изменить статус пользователя
- [x] `POST /moderation/reviews/:id` - Модерация отзыва (опубликовать/скрыть/удалить)
- [x] `POST /moderation/tickets/:id` - Изменить статус тикета
- [x] `POST /moderation/tickets/:id/reply` - Ответить на тикет

### Schedules Service - Сервис расписания врача или клиники

- [x] `GET /schedules/:id` - Получить расписание по id (?date=2026.02.20 - при получение конкретного расписания с слотами)

### Appointments Service - Сервис записи врача или клиники

- [x] `GET /appointments` - Получить информацию о записях на приём
- [x] `GET /appointments/:id` - Получить детальную информацию о записи на приём
- [x] `POST /appointments` - Создать запись на приём к врачу
- [x] `POST /appointments/:id` - Изменить статус записи (подтверждение/завершение/отмена)

### Catalog Service - Сервис каталога

- [x] `GET /catalog` - Получить каталог
<!-- - [x] `GET /catalog/specializations` - Получить дерево специализаций (для меню и фильтров) -->

### Rating Service - Сервис рейтинга

- [x] `PATCH /ratings/:id` - Поставить оценку врачу или клинике

### Reviews Service - Сервис отзывов

- [x] `GET /reviews` - Получить список отзывов
- [x] `POST /reviews` - Отправить отзыв (Отзыв отправляет только пациент)

### Notifications Service - Сервис уведомлений

- [x] `GET /notifications` - Получить уведомления
- [x] `POST /notifications/mark-all-read` - Пометить все уведомления, как прочитанные
- [x] `POST /notifications/:id/read` - Пометить уведомление, как прочитанное
- [x] `DELETE /notifications/:id` - Удалить уведомление

TODO:

- [x] Добавить слушатель для связи между врачом и клиникой (когда клиника отправляет запрос врачу, то ему врачу приходит уведомление)
- [ ] Добавить системный слушатель (через GitHub Action настроить CICD, чтобы после релиза отправлялся запрос на эндпоинт system/webhooks/release)
- [ ] Добавить слушатель для рейтинга (например, для доктора, через cron отсылать уведоление, какой сейчас рейтинг)

### Support Service - Сервис поддержки

- [x] `GET /support/tickets` - Получить тикеты
- [x] `GET /support/tickets/:id` - Получить информацию о тиките
- [x] `POST /support/tickets` - Создать тикет
- [x] `POST /support/tickets/:id/reply` - Ответить сообщение в тикете
- [x] `POST /support/tickets/:id/close` - Закрыть тикет (пользователь сам закрыл проблему)

### Files Service - Сервис файлов

- [ ] `GET /files/:id` - Получить файл
- [x] `POST /files/avatar` - Поставить фото в профиль
- [ ] `DELETE /files/:id` - Удалить файл

### Consent Service - Сервис политики

- [x] `GET /consents` - Получение активных политик
- [x] `POST /consents` - Создание новой версии документа
- [x] `POST /consents/:id` - Публикация политики
- [x] `PATCH /consents/:id` - Редктирование политики

### Services & Prices - Сервис медицинских услуг

- [x] `GET /services` - Получить услуги
- [x] `POST /services` - Создать услугу
- [x] `PATCH /services/:id` - Обновить услуги
- [x] `DELETE /services/:id` - Архивизация услуги

### Portfolio Service - Сервис портфолио врача (Кейсы до/после)

- [ ] `GET /portfolios` - Лента работ (с фильтрами по типу операции)
- [ ] `GET /portfolios/:id` - Детальный просмотр кейса
- [ ] `GET /portfolios/doctor/:id` - Все работы конкретного врача
- [ ] `POST /portfolios` - Создать кейс (загрузка фото до/после, описание)
- [ ] `PATCH /portfolios/:id` - Редактирование кейса
- [ ] `DELETE /portfolios/:id` - Удаление кейса

### Relationships Service - Сервис связи между врачом и клиникой

- [x] `GET /relationships` - Получить связь
- [x] `POST /relationships/:doctorId/invite` - Клиника приглашает врача
- [x] `POST /relationships/:id` - Подтверждение связи
- [x] `DELETE /relationships/:id` - Уволнение/Удаление связи

### Resources Service - Сервис справочника/ресурсов

- [ ] `GET /resources/cities` - Список городов присутствия
- [ ] `GET /resources/languages` - Языки приема
- [x] `GET /resources/specializations` - Дерево специализаций (для меню и фильтров)
- [x] `GET /resources/services` - Категория услуг
- [x] `GET /resources/statuses` - Статусы

### AI Visualization Service - Сервис AI визуализатора

- [ ] `GET /ai/visualizations` - История генераций
- [ ] `GET /ai/visualizations/:id` - Результат конкретной генерации
- [ ] `POST /ai/visualize` - Запуск процесса
- [ ] `DELETE /ai/visualizations/:id` - Удаление результатата из истории
