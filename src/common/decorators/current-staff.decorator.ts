import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Staff } from "@prisma/client"
import { Request } from "express"

export const CurrentStaff = createParamDecorator((_, ctx: ExecutionContext) => {
  console.log("CURRENT STAFF")
  const request = ctx.switchToHttp().getRequest<Request & Staff>()
  return request.user
})
