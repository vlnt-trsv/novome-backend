import { NOTIFICATION_TYPE } from "@prisma/client"

export const NOTIFICATION_TYPE_CONST = {
  [NOTIFICATION_TYPE.SYSTEM_MESSAGE]: "Системное сообщение",
  [NOTIFICATION_TYPE.APPOINTMENT_MESSAGE]: "Сообщение о записи",
}
