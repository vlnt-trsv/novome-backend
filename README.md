# Novome Backend - NestJS REST API

---

TODO:

- [x] Добавить проверку подтвержденной почты, чтобы войти
- [x] Добавить GUARD на проверку доступности к эндпоинту
- [ ] Добавить model Role {id,userId,user,role}

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
- [ ] `POST /auth/reset-password`
- [x] `POST /auth/logout` - Выход пользователя

### 2. Users Service

- [x] `GET /users/me` - Получение собственного профиля
- [x] `GET /users` - Получить пользователей (опц. с фильтрацией)
- [x] `GET /users/:id` - Получить пользователя
- [x] `POST /users` - Создать пользователя
- [x] `POST /user/change-password` - Изменение пароля
- [x] `POST /users/:id/profile` - Создать профиль пользователя
- [x] `PATCH /users/:id` - Обновление пользователя (опц. с профилем)
- [x] `DELETE /users/:id - Удаление пользователя`
- [ ] `POST /users/:id/documents`
- [ ] `GET /users/:id/documents`

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
