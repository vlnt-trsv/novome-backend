import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Auth, User } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { LoginDto } from "./dto/login.dto"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "src/user/user.service"
import { JwtPayload } from "src/common/types/jwt-payload.interface"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { compare, genSalt, hash } from "bcryptjs"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async confirmEmail(email: string, token: string): Promise<HttpException> {
    const user = await this.userService.findOne({ email })
    if (!user || !user.auth) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    if (user.auth.confirmationToken !== token) {
      throw new HttpException("Токен не совпадает", HttpStatus.BAD_REQUEST)
    }
    if (user.auth.confirmationTokenExpiresAt && new Date() > user.auth.confirmationTokenExpiresAt) {
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

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByPayload({ email: payload.email })
    if (!user || !user.auth) {
      throw new HttpException("Некорректный токен", HttpStatus.UNAUTHORIZED)
    }
    return user
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ email?: string; accessToken: string; refreshToken: string }> {
    const auth = await this.userService.findByLogin(loginDto)
    if (!auth.confirmed) {
      throw new HttpException("Почта не подтверждена", HttpStatus.BAD_REQUEST)
    }
    const { accessToken, refreshToken } = this._createTokens(auth)
    await this._updateRefreshTokenHash(auth.userId, refreshToken)

    return { email: auth.email, accessToken, refreshToken }
  }

  async register(createUserDto: CreateUserDto): Promise<HttpException> {
    await this.userService.createUser(createUserDto)
    throw new HttpException("Успешная регистрация", HttpStatus.OK)
  }

  async logout(userId: string): Promise<HttpException> {
    const auth = await this.prisma.auth.findUnique({ where: { userId } })
    if (!auth?.hashedRt) throw new HttpException("Пользователь уже вышел", HttpStatus.FORBIDDEN)
    await this.prisma.auth.update({ where: { userId }, data: { hashedRt: null } })
    throw new HttpException("Пользователь вышел", HttpStatus.OK)
  }

  async refresh(userId: string, rtFromCookie: string) {
    const auth = await this.prisma.auth.findFirstOrThrow({ where: { userId } })
    if (!auth.hashedRt) {
      throw new HttpException("Доступ запрещён", HttpStatus.FORBIDDEN)
    }
    await this.jwtService.verify(rtFromCookie, {
      secret: this.configService.get<string>("JWT_REFRESH_KEY"),
    })
    const isMatch = await compare(rtFromCookie, auth.hashedRt as string)

    if (!isMatch) {
      throw new HttpException("Доступ запрещён", HttpStatus.FORBIDDEN)
    }

    const tokens = this._createTokens(auth)
    await this._updateRefreshTokenHash(auth.userId, tokens.refreshToken)

    return { email: auth.email, tokens }
  }

  private async _updateRefreshTokenHash(userId: string, refreshToken: string) {
    const salt = await genSalt(10)
    const hashedRefreshToken = await hash(refreshToken, salt)
    await this.prisma.auth.update({ where: { userId }, data: { hashedRt: hashedRefreshToken } })
  }

  private _createTokens({ email, userId }: Auth): {
    accessToken: string
    refreshToken: string
  } {
    const payload: JwtPayload = { email, sub: userId }
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
}
