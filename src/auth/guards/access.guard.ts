import {
  ForbiddenException,
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { User } from "@prisma/client"
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
      case "PENDING":
        throw new ForbiddenException("Ваш аккаунт ожидает подтверждения модератором")
      case "REJECTED":
        throw new ForbiddenException("Ваш аккаунт отклонен модератором")
      case "BANNED":
        throw new ForbiddenException("Ваш аккаунт забанен модератором")
    }

    return true
  }
}
