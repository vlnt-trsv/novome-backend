import { Prisma } from "@prisma/client"

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    auth: { omit: { hashedPassword: true; hashedRt: true } }
    patient: true
    clinic: true
    doctor: true
    moderation: true
  }
}>
