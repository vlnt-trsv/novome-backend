import { NOTIFICATION_TYPE, RELATIONSHIP_STATUS } from "@prisma/client"

export const RELATIONSHIP_NOTIFICATION_CONST = {
  [RELATIONSHIP_STATUS.APPROVED]: {
    type: NOTIFICATION_TYPE.RELATIONSHIP_MESSAGE,
    title: "Сотрудничество подтверждено",
    description: "Врач принял приглашение. Теперь он официально числится в штате вашей клиники.",
  },
  [RELATIONSHIP_STATUS.PENDING]: {
    type: NOTIFICATION_TYPE.RELATIONSHIP_MESSAGE,
    title: "Новое приглашение",
    description:
      "Вам поступило приглашение от клиники. Пожалуйста, подтвердите или отклоните его в личном кабинете.",
  },
  [RELATIONSHIP_STATUS.REJECTED]: {
    type: NOTIFICATION_TYPE.RELATIONSHIP_MESSAGE,
    title: "Приглашение отклонено",
    description: "Врач отклонил предложение о сотрудничестве с вашей клиникой.",
  },
  [RELATIONSHIP_STATUS.ARCHIVED]: {
    type: NOTIFICATION_TYPE.RELATIONSHIP_MESSAGE,
    title: "Связь расторгнута",
    description: "Сотрудничество между врачом и клиникой было прекращено и перенесено в архив.",
  },
}
