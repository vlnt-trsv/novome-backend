import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Auth, Prisma, User } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { LoginDto } from "./dto/login.dto"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "src/user/user.service"
import { JwtPayload } from "src/common/types/jwt-payload.interface"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { compare, genSalt, hash } from "bcryptjs"
import { ConfigService } from "@nestjs/config"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { EmailService } from "src/email/email.service"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"
import { ConsentService } from "src/consent/consent.service"
import { Request } from "express"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private consentService: ConsentService,
  ) {}

  async confirmEmail(email: string, token: string) {
    const auth = await this.prisma.auth.findUnique({ where: { email } })
    if (!auth) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    if (auth.confirmationToken !== token) {
      throw new HttpException("Токен не совпадает", HttpStatus.BAD_REQUEST)
    }
    if (auth.confirmationTokenExpiresAt && new Date() > auth.confirmationTokenExpiresAt) {
      throw new HttpException("Срок действия токена истек", HttpStatus.BAD_REQUEST)
    }

    const updatedAuth = await this.prisma.auth.update({
      where: { email },
      data: {
        confirmationToken: null,
        confirmationTokenExpiresAt: null,
        confirmationSentAt: null,
        confirmed: true,
        emailConfirmedAt: new Date(),
        lastSignInAt: new Date(),
      },
    })

    const { accessToken, refreshToken } = this._createTokens(updatedAuth)
    await this._updateRefreshTokenHash(updatedAuth.id, refreshToken)

    return {
      email: updatedAuth.email,
      accessToken,
      refreshToken,
    }
  }

  async sendConfirmationEmail(user: User, tx?: Prisma.TransactionClient) {
    const { id: userId, email } = user
    const prisma = tx ?? this.prisma

    const auth = await prisma.auth.findUnique({
      where: { id: userId },
      select: { confirmationTokenExpiresAt: true, confirmationSentAt: true },
    })

    if (!auth) throw new HttpException("Данные аутентификации не найдены", HttpStatus.NOT_FOUND)

    if (
      auth.confirmationSentAt &&
      Date.now() - auth.confirmationSentAt.getTime() <
        this.configService.get<number>("MIN_RETRY_DELAY")!
    ) {
      throw new HttpException(
        "Попробуйте отправить письмо позже (через 1 минуту)",
        HttpStatus.BAD_REQUEST,
      )
    }

    const confirmationToken = `${crypto.randomUUID()}-${new Date().getTime()}`
    const expiresIn = Number(this.configService.get<number>("CONFIRMATION_EMAIL_TOKEN_EXPIRES_AT"))
    const confirmationTokenExpiresAt = new Date(Date.now() + expiresIn)

    const updatedAuth = await prisma.auth.update({
      where: { id: userId },
      data: {
        confirmationToken,
        confirmationTokenExpiresAt,
        confirmationSentAt: new Date(),
      },
    })

    try {
      await this.emailService.sendConfirmationEmail(email, confirmationToken)
    } catch (error) {
      throw new BadRequestException("Письмо не отправлено, попробуйте позже", { cause: error })
    }
    return {
      confirmationToken,
      confirmationSentAt: updatedAuth.confirmationSentAt,
      confirmationTokenExpiresAt: updatedAuth.confirmationTokenExpiresAt,
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ email?: string; accessToken: string; refreshToken: string }> {
    const auth = await this._findByLogin(loginDto)
    if (!auth.confirmed) {
      throw new HttpException("Почта не подтверждена", HttpStatus.BAD_REQUEST)
    }
    const { accessToken, refreshToken } = this._createTokens(auth)
    await this._updateRefreshTokenHash(auth.id, refreshToken)

    return { email: auth.email, accessToken, refreshToken }
  }

  async register(createUserDto: CreateUserDto, req: Request): Promise<HttpException> {
    const { acceptedConsentIds, email } = createUserDto
    const auth = await this.prisma.auth.findUnique({
      where: { email: email },
      select: { email: true },
    })

    if (auth?.email) throw new HttpException("Такой email уже занят", HttpStatus.BAD_REQUEST)

    const consents = await this.consentService.getConsents()

    for (const consent of consents) {
      if (!acceptedConsentIds.includes(consent.id) && consent.isRequired)
        throw new HttpException(
          "Необходимо принять обязательные соглашения",
          HttpStatus.BAD_REQUEST,
        )
    }

    await this.prisma.$transaction(
      async (tx) => {
        const user = await this.userService.createUser(createUserDto, tx)
        await this.consentService.signConsents(acceptedConsentIds, user.id, req, tx)
        await this.sendConfirmationEmail(user, tx)
      },
      { timeout: 10000 },
    )

    throw new HttpException(
      "Успешная регистрация. Подтвердите почту, чтобы войти в систему",
      HttpStatus.OK,
    )
  }

  async logout(userId: string): Promise<HttpException> {
    const auth = await this.prisma.auth.findUnique({ where: { id: userId } })
    if (!auth?.hashedRt) throw new HttpException("Пользователь уже вышел", HttpStatus.FORBIDDEN)
    await this.prisma.auth.update({ where: { id: userId }, data: { hashedRt: null } })
    throw new HttpException("Пользователь вышел", HttpStatus.OK)
  }

  async refresh(userId: string, rtFromCookie: string) {
    const auth = await this.prisma.auth.findFirstOrThrow({ where: { id: userId } })
    if (!auth.hashedRt) {
      throw new HttpException("Доступ запрещён", HttpStatus.FORBIDDEN)
    }
    await this.jwtService.verify(rtFromCookie, {
      secret: this.configService.get<string>("JWT_REFRESH_KEY"),
    })
    const isMatch = await compare(rtFromCookie, auth.hashedRt)

    if (!isMatch) {
      throw new HttpException("Доступ запрещён", HttpStatus.FORBIDDEN)
    }

    const tokens = this._createTokens(auth)
    await this._updateRefreshTokenHash(auth.id, tokens.refreshToken)

    return { email: auth.email, tokens }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<HttpException> {
    const auth = await this.prisma.auth.findUnique({ where: { email: forgotPasswordDto.email } })
    if (!auth)
      throw new HttpException(
        "Если такой пользователь существует, мы отправим письмо",
        HttpStatus.ACCEPTED,
      )

    const recoveryToken = `${crypto.randomUUID()}-${new Date().getTime()}`
    const recoveryTokenExpiresAt = new Date(
      new Date().getTime() +
        Number(process.env.CONFIRMATION_EMAIL_TOKEN_EXPIRES_AT) * 60 * 60 * 1000,
    )

    await this.emailService.sendRecoveryEmail(forgotPasswordDto.email, recoveryToken)
    await this.prisma.auth.update({
      where: { email: forgotPasswordDto.email },
      data: {
        recoveryToken,
        recoveryTokenExpiresAt,
        recoverySentAt: new Date(),
      },
    })
    throw new HttpException(
      "Если такой пользователь существует, мы отправим письмо",
      HttpStatus.ACCEPTED,
    )
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<HttpException> {
    const auth = await this.prisma.auth.findUnique({ where: { email: resetPasswordDto.email } })
    if (!auth) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    if (auth.recoveryToken !== resetPasswordDto.token)
      throw new HttpException("Токен не совпадает", HttpStatus.BAD_REQUEST)

    if (auth.recoveryTokenExpiresAt && new Date() > auth.recoveryTokenExpiresAt)
      throw new HttpException("Срок действия токена истек", HttpStatus.BAD_REQUEST)

    const salt = await genSalt(10)
    const hashedPassword = await hash(resetPasswordDto.newPassword, salt)

    await this.prisma.auth.update({
      where: { email: resetPasswordDto.email },
      data: {
        hashedPassword,
        recoveryToken: null,
        recoveryTokenExpiresAt: null,
        recoverySentAt: null,
        lastChangePasswordAt: new Date(),
      },
    })

    throw new HttpException("Пароль успешно изменен", HttpStatus.OK)
  }

  private async _updateRefreshTokenHash(userId: string, refreshToken: string) {
    const salt = await genSalt(10)
    const hashedRefreshToken = await hash(refreshToken, salt)
    await this.prisma.auth.update({
      where: { id: userId },
      data: { hashedRt: hashedRefreshToken },
    })
  }

  private _createTokens({ email, id, type }: Auth): {
    accessToken: string
    refreshToken: string
  } {
    const payload: JwtPayload = { email, sub: id, type }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_ACCESS_KEY"),
      expiresIn: this.configService.get("JWT_ACCESS_KEY_EXPIRES_IN"),
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_KEY"),
      expiresIn: this.configService.get("JWT_REFRESH_KEY_EXPIRES_IN"),
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  private async _findByLogin({ email, password }: LoginDto): Promise<Auth> {
    const auth = await this.prisma.auth.findUnique({ where: { email } })
    if (!auth) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    const comparePassword = await compare(password, auth.hashedPassword)
    if (!comparePassword) {
      throw new HttpException("Неправильные данные", HttpStatus.UNAUTHORIZED)
    }
    await this.prisma.auth.update({
      where: { id: auth.id },
      data: { lastSignInAt: new Date() },
    })
    return auth
  }
}
