import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"
import { EmailService } from "./email/email.service"
import { EmailModule } from "./email/email.module"

@Module({
  controllers: [],
  providers: [EmailService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    EmailModule,
  ],
})
export class AppModule {}
