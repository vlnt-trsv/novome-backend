import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from "@nestjs/common"
import { Request } from "express"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class ConsentsRequiredGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: { id: string } }>()
    const userId = request.user.id

    if (!userId) throw new HttpException("Пользователь не авторизован", HttpStatus.UNAUTHORIZED)

    const activeRequiredConsents = await this.prisma.consent.findMany({
      where: { isRequired: true },
    })

    if (activeRequiredConsents.length === 0) return true

    const signedConsents = await this.prisma.userConsent.findMany({
      where: { userId },
    })

    const signedIds = signedConsents.map((sc) => sc.consentId)

    const missingConsents = activeRequiredConsents.filter((rc) => !signedIds.includes(rc.id))

    if (missingConsents.length > 0) {
      throw new ForbiddenException({
        message: "Необходимо принять обновленные условия использования",
        error: "CONSENTS_REQUIRED",
        missingConsentIds: missingConsents,
      })
    }

    return true
  }
}
