import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  HttpStatus,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { JwtAuthGuard } from "./guards/jwt.guard"
import { Request, Response } from "express"
import { JwtService } from "@nestjs/jwt"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { User } from "@prisma/client"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get("confirm")
  async confirm(
    @Query("email") email: string,
    @Query("token") token: string,
  ): Promise<HttpException> {
    return await this.authService.confirmEmail(email, token)
  }

  @UsePipes(new ValidationPipe())
  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ email?: string; accessToken: string }> {
    const result = await this.authService.login(loginDto)

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })

    return {
      email: result.email,
      accessToken: result.accessToken,
    }
  }

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto): Promise<HttpException> {
    return await this.authService.register(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@CurrentUser() user: User): Promise<HttpException> {
    return await this.authService.logout(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies["refreshToken"]
    if (!refreshToken) throw new HttpException("Некорректный токен", HttpStatus.UNAUTHORIZED)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const { sub: userId } = this.jwtService.decode(refreshToken)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await this.authService.refresh(userId, refreshToken)

    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })
    return { accessToken: result.tokens.accessToken }
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<HttpException> {
    return await this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto)
  }
}
