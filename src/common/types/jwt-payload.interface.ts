import { AUTH_TYPE } from "@prisma/client"

export interface JwtPayload {
  email: string
  sub: string
  type: AUTH_TYPE
}
