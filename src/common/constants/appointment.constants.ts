import { APPOINTMENT_STATUS, NOTIFICATION_TYPE } from "@prisma/client"

export const APPOINTMENT_NOTIFICATION_CONST = {
  [APPOINTMENT_STATUS.CONFIRMED]: {
    type: NOTIFICATION_TYPE.APPOINTMENT_MESSAGE,
    title: "Запись подтверждена",
    description: "Врач подтвердил ваш визит. Ждем вас в назначенное время.",
  },
  [APPOINTMENT_STATUS.CANCELED]: {
    type: NOTIFICATION_TYPE.APPOINTMENT_MESSAGE,
    title: "Запись отменена",
    description: "К сожалению, запись была отменена. Вы можете выбрать другое время.",
  },
  [APPOINTMENT_STATUS.PENDING]: {
    type: NOTIFICATION_TYPE.APPOINTMENT_MESSAGE,
    title: "Новая заявка на прием",
    description: "Ваша заявка принята и ожидает подтверждения врачом.",
  },
  [APPOINTMENT_STATUS.NO_SHOW]: {
    type: NOTIFICATION_TYPE.APPOINTMENT_MESSAGE,
    title: "Визит не состоялся",
    description: "Система зафиксировала, что прием не состоялся в назначенное время.",
  },
  [APPOINTMENT_STATUS.COMPLETED]: {
    type: NOTIFICATION_TYPE.APPOINTMENT_MESSAGE,
    title: "Приём завершён",
    description: "Благодарим за визит! Оставьте отзыв о посещении врача.",
  },
}
