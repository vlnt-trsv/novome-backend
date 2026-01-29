import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "../user/user.module"
import { EmailModule } from "src/email/email.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { StaffModule } from "src/staff/staff.module"

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    UserModule,
    StaffModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_ACCESS_KEY"),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
