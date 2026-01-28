import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "../user/user.module"

@Module({
  imports: [
    UserModule,
    PassportModule,
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
      session: false,
    }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
