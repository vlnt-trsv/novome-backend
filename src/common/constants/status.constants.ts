export const STATUS_CONST = {
  USER: {
    name: "Пользователи",
    items: {
      PENDING: { name: "На рассмотрении" },
      APPROVED: { name: "Подтвержден" },
      REJECTED: { name: "Отклонен" },
      BANNED: { name: "Заблокирован" },
    },
  },
  APPOINTMENT: {
    name: "Записи на прием",
    items: {
      PENDING: { name: "Ожидает" },
      CONFIRMED: { name: "Подтверждена" },
      COMPLETED: { name: "Завершена" },
      CANCELED: { name: "Отменена" },
    },
  },
  TICKET: {
    name: "Тикеты поддержки",
    items: {
      OPEN: { name: "Открыт" },
      IN_PROGRESS: { name: "В работе" },
      RESOLVED: { name: "Решен" },
      CLOSED: { name: "Закрыт" },
    },
  },
} as const
