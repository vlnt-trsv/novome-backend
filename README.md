# Novome Backend - NestJS REST API

---

TODO:

- [x] Добавить проверку подтвержденной почты, чтобы войти
- [x] Добавить GUARD на проверку доступности к эндпоинту
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

### 1. Auth Service

- [x] `GET /auth/confirm?email=email@mail.ru&token=token` - Подтверждение почты
- [x] `POST /auth/login` - Вход пользователя
- [x] `POST /auth/register` - Регистрация пользователя
- [x] `POST /auth/refresh` - Обновление токена
- [x] `POST /auth/forgot-password` - Забыл пароль (Восстановление доступа)
- [x] `POST /auth/reset-password` - Изменение пароля
- [x] `POST /auth/logout` - Выход пользователя

### 2. Users Service

- [x] `GET /users/me` - Получение собственного аккаунта
- [x] `GET /users` - Получить пользователей (опц. с фильтрацией)
- [x] `GET /users/:id` - Получить пользователя
- [x] `POST /users/user` - Создать пользователя
- [x] `POST /user/change-password` - Изменение пароля
- [x] `POST /users/:id/profile` - Создать профиль пользователя
- [x] `PATCH /users/me` - Обновление собственного аккаунта (опц. с профилем)
- [x] `DELETE /users/:id - Удаление пользователя`
- [ ] `POST /users/:id/documents`
- [ ] `GET /users/:id/documents`

### 2.1 Staff Service

- [x] `GET /staffs/me` - Получение собственного аккаунта модератора
- [x] `GET /staffs/tickets` - Получение всех обращений от пользователей
- [x] `GET /staffs/moderations` - Получение всех заявок на регистрацию пользователя (доктор, клиника)
- [x] `POST /staffs` - Создание модератора
- [x] `POST /staffs/moderate/users/123` - Изменить статус пользователя
- [ ] `POST /staffs/moderate/tickets/123` - Ответить на обращение, изменить статус

### 3. Schedules Service

- [ ] `GET /schedules/doctor/:doctorId`
- [ ] `PUT /schedules/doctor/:doctorId`
- [ ] `GET /schedules/doctor/:doctorId/available-slots`

### 4. Appointments Service

- [ ] `POST /appointments`
- [ ] `GET /appointments`
- [ ] `GET /appointments/:id`
- [ ] `PATCH /appointments/:id`
- [ ] `DELETE /appointments/:id`
- [ ] `POST /appointments/:id/confirm`
- [ ] `POST /appointments/:id/complete`
- [ ] `POST /appointments/:id/cancel`

### 5. Catalog Service

- [ ] `GET /catalog/doctors`
- [ ] `GET /catalog/doctors/:id`
- [ ] `GET /catalog/clinics`
- [ ] `GET /catalog/clinics/:id`

### 6. Notifications Service

- [ ] `GET /notifications`
- [ ] `PATCH /notifications/:id/read`
- [ ] `DELETE /notifications/:id`
- [ ] `POST /notifications/mark-all-read`

### 7. Support Service

- [ ] `GET /support/tickets`
- [ ] `POST /support/tickets`
- [ ] `GET /support/tickets/:id`
- [ ] `POST /support/tickets/:id/replies`
- [ ] `DELETE /support/tickets/:id`

### 8. Files Service

- [ ] `POST /files/upload`
- [ ] `GET /files/:id`
- [ ] `DELETE /files/:id`

### 9. Consent Service

- [ ] `GET /consents`
- [ ] `POST /consents`
- [ ] `PATCH /consents/:id`
- [ ] `DELETE /consents/:id`

### 10. AI Visualization Service

- [ ] `POST /ai/visualize`
- [ ] `GET /ai/visualizations`
- [ ] `GET /ai/visualizations/:id`
- [ ] `DELETE /ai/visualizations/:id`
