import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  console.log("CURRENT USER")
  const request = ctx.switchToHttp().getRequest<Request & User>()
  if (!request.user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
  return request.user
})
