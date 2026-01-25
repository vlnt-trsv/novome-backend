import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { CreateUserDto } from "src/user/dto/create-user.dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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
  ): Promise<{ email?: string; token: { accessToken: string } }> {
    return await this.authService.login(loginDto)
  }

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto): Promise<HttpException> {
    return await this.authService.register(createUserDto)
  }
}
