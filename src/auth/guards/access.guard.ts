import {
  ForbiddenException,
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { Request } from "express"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: { id: string } }>()
    const userId = request.user.id

    if (!userId) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    const moderation = await this.prisma.moderation.findUnique({
      where: { userId },
    })

    switch (moderation?.status) {
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
