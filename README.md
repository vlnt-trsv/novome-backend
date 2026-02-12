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

### Staff Service - Сервис модераторов

- [x] `GET /staffs/me` - Получение собственного аккаунта модератора
- [x] `GET /staffs/tickets` - Получение всех тикетов от пользователей
- [x] `GET /staffs/tickets/:id` - Получение детали тикета от пользователя
- [x] `GET /staffs/reviews/:id` - Получение детали отзыва от пользователя
- [x] `GET /staffs/moderations` - Получение всех заявок на регистрацию пользователя (доктор, клиника)
- [x] `POST /staffs` - Создание модератора
- [x] `POST /staffs/users/:id` - Изменить статус пользователя
- [ ] `POST /staffs/tickets/:id` - Ответить на тикет, изменить статус
- [ ] `POST /staffs/reviews/:id` - Модерация отзыва (опубликовать/скрыть/удалить)

### Schedules Service - Сервис расписания врача или клиники

- [x] `GET /schedules/:id` - Получить расписание по id (?date=2026.02.20 - при получение конкретного расписания с слотами)

### Appointments Service - Сервис записи врача или клиники

- [x] `GET /appointments` - Получить информацию о записях на приём
- [x] `GET /appointments/:id` - Получить детальную информацию о записи на приём
- [x] `POST /appointments` - Создать запись на приём к врачу
- [x] `POST /appointments/:id` - Изменить статус записи (подтверждение/завершение/отмена)

### Catalog Service - Сервис каталога

- [x] `GET /catalog` - Получить каталог
- [x] `GET /catalog/specializations` - Получить дерево специализаций (для меню и фильтров)

### Rating Service - Сервис рейтинга

- [ ] `POST /ratings/doctors/:id` - Поставить оценку врачу
- [ ] `POST /ratings/clinics/:id` - Поставить оценку клинике

### Notifications Service - Сервис уведомлений

- [ ] `GET /notifications` - Получить уведомления
- [ ] `POST /notifications/mark-all-read` - Пометить все уведомления, как прочитанные
- [ ] `POST /notifications/:id/read` - Пометить уведомление, как прочитанное
- [ ] `DELETE /notifications/:id` - Удалить уведомление

### Support Service - Сервис поддержки

- [ ] `GET /support/tickets` - Получить тикеты
- [ ] `GET /support/tickets/:id` - Получить информацию о тиките
- [ ] `POST /support/tickets` - Создать тикет
- [ ] `POST /support/tickets/:id/replies` - Ответить сообщение в тикете
- [ ] `POST /support/tickets/:id/close` - Закрыть тикет (пользователь сам закрыл проблему)

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

- [ ] `GET /services` - Получить услуги
- [ ] `POST /services` - Создать услугу
- [ ] `PATCH /services/:id` - Обновить цену или описание услуги
- [ ] `DELETE /services/:id` - Архивизация услуги

### Portfolio Service - Сервис портфолио врача (Кейсы до/после)

- [ ] `GET /portfolios` - Лента работ (с фильтрами по типу операции)
- [ ] `GET /portfolios/:id` - Детальный просмотр кейса
- [ ] `GET /portfolios/doctor/:id` - Все работы конкретного врача
- [ ] `POST /portfolios` - Создать кейс (загрузка фото до/после, описание)
- [ ] `PATCH /portfolios/:id` - Редактирование кейса
- [ ] `DELETE /portfolios/:id` - Удаление кейса

### Relationships Service - Сервис связи между врачом и клиникой

- [ ] `POST /relationships/invite` - Клиника приглашает врача
- [ ] `PATCH /relationships/:id/status` - Подтверждение связи
- [ ] `DELETE /relationships/:id` - Уволнение/Удаление связи

### Dictionary Service - Сервис справочника

- [ ] `GET /dictionaries/cities` - Список городов присутствия
- [ ] `GET /dictionaries/languages` - Языки приема

### AI Visualization Service - Сервис AI визуализатора

- [ ] `GET /ai/visualizations` - История генераций
- [ ] `GET /ai/visualizations/:id` - Результат конкретной генерации
- [ ] `POST /ai/visualize` - Запуск процесса
- [ ] `DELETE /ai/visualizations/:id` - Удаление результатата из истории
