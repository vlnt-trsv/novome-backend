import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLE } from "@prisma/client"
import { Request } from "express"

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>("role", [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest<Request & { user: { role: ROLE } }>()

    const hasRole = requiredRoles.includes(user.role)

    if (!hasRole) {
      throw new HttpException(
        "Ваша роль не соотвествует для доступа к этому разделу",
        HttpStatus.FORBIDDEN,
      )
    }

    return true
  }
}
