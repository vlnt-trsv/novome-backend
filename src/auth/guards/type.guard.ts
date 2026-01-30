import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AUTH_TYPE } from "@prisma/client"
import { Request } from "express"

@Injectable()
export class TypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const types = this.reflector.getAllAndOverride<string[]>("type", [
      context.getHandler(),
      context.getClass(),
    ])

    if (!types) return true

    const request = context.switchToHttp().getRequest<Request & { user: { type: AUTH_TYPE } }>()
    const user = request.user

    const hasType = types.includes(user.type)

    if (!hasType) {
      throw new HttpException("У вас нет прав доступа к этому разделу", HttpStatus.FORBIDDEN)
    }

    return true
  }
}
