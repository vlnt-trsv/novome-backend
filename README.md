# Novome Backend - NestJS REST API

---

TODO:

- [x] Добавить проверку подтвержденной почты, чтобы войти
- [x] Добавить ACCESS GUARD на проверку доступности (подтверждёна ли почта)
- [x] Добавить TYPE DECORATOR для размещения типа в класс
- [x] Добавить TYPE GUARD на проверку типа (USER, STAFF)
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

- [x] `GET /auth/confirm?email=email@mail.ru&token=token` - Подтверждение почты
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

### Staff Service - Сервис модераторов

- [x] `GET /staffs/me` - Получение собственного аккаунта модератора
- [x] `GET /staffs/tickets` - Получение всех обращений от пользователей
- [x] `GET /staffs/moderations` - Получение всех заявок на регистрацию пользователя (доктор, клиника)
- [x] `POST /staffs` - Создание модератора
- [x] `POST /staffs/moderate/users/123` - Изменить статус пользователя
- [ ] `POST /staffs/moderate/tickets/123` - Ответить на обращение, изменить статус

### Schedules Service - Сервис расписания врача или клиники

- [ ] `GET /schedules/doctor/:doctorId`
- [ ] `PUT /schedules/doctor/:doctorId`
- [ ] `GET /schedules/doctor/:doctorId/available-slots`

### Appointments Service - Сервис записи врача или клиники

- [ ] `POST /appointments`
- [ ] `GET /appointments`
- [ ] `GET /appointments/:id`
- [ ] `PATCH /appointments/:id`
- [ ] `DELETE /appointments/:id`
- [ ] `POST /appointments/:id/confirm`
- [ ] `POST /appointments/:id/complete`
- [ ] `POST /appointments/:id/cancel`

### Catalog Service - Сервис каталога

- [ ] `GET /catalog/doctors`
- [ ] `GET /catalog/doctors/:id`
- [ ] `GET /catalog/clinics`
- [ ] `GET /catalog/clinics/:id`

### Notifications Service - Сервис уведомлений 

- [ ] `GET /notifications`
- [ ] `PATCH /notifications/:id/read`
- [ ] `DELETE /notifications/:id`
- [ ] `POST /notifications/mark-all-read`

### Support Service - Сервис поддержки

- [ ] `GET /support/tickets`
- [ ] `POST /support/tickets`
- [ ] `GET /support/tickets/:id`
- [ ] `POST /support/tickets/:id/replies`
- [ ] `DELETE /support/tickets/:id`

### Files Service - Сервис файлов

- [x] `POST /files/:userId/upload?folder=documents`
- [ ] `GET /files/:id`
- [ ] `DELETE /files/:id`

### Consent Service - Сервис политики

- [ ] `GET /consents`
- [ ] `POST /consents`
- [ ] `PATCH /consents/:id`
- [ ] `DELETE /consents/:id`

### AI Visualization Service - Сервис AI визуализатора

- [ ] `POST /ai/visualize`
- [ ] `GET /ai/visualizations`
- [ ] `GET /ai/visualizations/:id`
- [ ] `DELETE /ai/visualizations/:id`
