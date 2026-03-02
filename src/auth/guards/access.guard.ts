import {
  ForbiddenException,
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { MODERATION_STATUS, User } from "@prisma/client"
import { Request } from "express"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user: User }>()
    const user = request.user

    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    switch (user?.status) {
      case MODERATION_STATUS.PENDING:
        throw new ForbiddenException({
          message: "Ваш аккаунт ожидает подтверждения модератором",
          status: user.status,
          comment: user.moderationComment,
        })
      case MODERATION_STATUS.REJECTED:
        throw new ForbiddenException({
          message: "Ваш аккаунт отклонен модератором",
          status: user.status,
          comment: user.moderationComment,
        })
      case MODERATION_STATUS.BANNED:
        throw new ForbiddenException({
          message: "Ваш аккаунт забанен модератором",
          status: user.status,
          comment: user.moderationComment,
        })
    }

    return true
  }
}
