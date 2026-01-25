import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import type { SignOptions } from "jsonwebtoken"
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
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>("JWT_KEY_EXPIRES_IN")
        return {
          secret: config.getOrThrow<string>("JWT_KEY"),
          signOptions: { expiresIn: expiresIn as SignOptions["expiresIn"] },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
