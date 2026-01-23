/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async confirmEmail(email: string, token: string): Promise<HttpException> {
    const auth = await this.prisma.auth.findUnique({
      where: {
        email,
      },
    })
    if (!auth) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    if (auth.confirmationToken !== token) {
      throw new HttpException("Токен не совпадает", HttpStatus.BAD_REQUEST)
    }
    if (auth.confirmationTokenExpiresAt && new Date() > auth.confirmationTokenExpiresAt) {
      throw new HttpException("Срок действия токена истек", HttpStatus.BAD_REQUEST)
    }

    await this.prisma.auth.update({
      where: { email },
      data: {
        confirmationToken: null,
        confirmationTokenExpiresAt: null,
        confirmationSentAt: null,
        confirmed: true,
        emailConfirmedAt: new Date(),
      },
    })

    throw new HttpException("Почта успешно подтверждена", HttpStatus.OK)
  }
}
