# Novome Backend - NestJS REST API

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

- [ ] `POST /auth/signup`
- [ ] `POST /auth/signin`
- [ ] `POST /auth/refresh`
- [ ] `GET /auth/me`
- [x] `GET /auth/confirm?email=email@mail.ru&token=token` - Подтверждение почты 

### 2. Users Service
```
TODO: 
- [ ] Добавить GUARD на проверку подтвержденного аккаунта
- [ ] Добавить GUARD на проверку доступности к эндпоинту
```
- [x] `GET /users/:id` - Получить пользователя 
- [x] `POST /users` - Создать пользователя
- [x] `POST /users/:id/profile` - Создать профиль пользователя
- [ ] `PATCH /users/:id`
- [ ] `POST /users/:id/upload-documents`
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
