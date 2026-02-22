import { FILE_TYPE } from "@prisma/client"

export const FILE_TYPE_CONST = {
  [FILE_TYPE.DOCUMENT]: "Документы",
  [FILE_TYPE.AI_RESULT]: "Результаты AI",
  [FILE_TYPE.OTHER]: "Другое",
} as const
