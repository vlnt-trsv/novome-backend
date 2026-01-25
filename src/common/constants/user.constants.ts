import { ROLE } from "@prisma/client"

export const ROLE_CONST = {
  [ROLE.PATIENT]: "patient",
  [ROLE.DOCTOR]: "doctor",
  [ROLE.CLINIC]: "clinic",
} as const
