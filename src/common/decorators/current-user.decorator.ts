import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  console.log("CURRENT USER")
  const request = ctx.switchToHttp().getRequest<Request & User>()
  return request.user
})
