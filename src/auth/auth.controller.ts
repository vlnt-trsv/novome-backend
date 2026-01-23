import { Controller, Get, HttpException, Query } from "@nestjs/common"
import { AuthService } from "./auth.service"

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
}
