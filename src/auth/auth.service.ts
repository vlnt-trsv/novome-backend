import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Auth, User } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { LoginDto } from "./dto/login.dto"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "src/user/user.service"
import { JwtPayload } from "src/common/types/jwt-payload.interface"
import { CreateUserDto } from "src/user/dto/create-user.dto"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
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

  async login(loginDto: LoginDto): Promise<{ email?: string; token: { accessToken: string } }> {
    const auth = await this.userService.findByLogin(loginDto)
    if (!auth.confirmed) {
      throw new HttpException("Почта не подтверждена", HttpStatus.UNAUTHORIZED)
    }
    const { accessToken } = this._createToken(auth)

    return { email: auth.email, token: { accessToken } }
  }

  async register(createUserDto: CreateUserDto): Promise<HttpException> {
    await this.userService.createUser(createUserDto)
    throw new HttpException("Успешная регистрация", HttpStatus.OK)
  }

  private _createToken({ email, userId }: Auth): {
    expiresIn: string
    accessToken: string
  } {
    const expiresIn = process.env.JWT_KEY_EXPIRES_IN + ""
    const payload: JwtPayload = { email, sub: userId }
    const accessToken = this.jwtService.sign(payload)

    return {
      expiresIn,
      accessToken,
    }
  }
}
