import { forwardRef, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"
import { EmailService } from "./email/email.service"
import { EmailModule } from "./email/email.module"
import { StaffService } from "./staff/staff.service"
import { StaffModule } from "./staff/staff.module"
import { FilesModule } from "./files/files.module"
import { S3Module } from "./s3/s3.module"
import { ProfileModule } from "./profile/profile.module"
import { ConsentModule } from "./consent/consent.module"
import { ScheduleModule } from "./schedule/schedule.module"

@Module({
  providers: [EmailService, StaffService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    EmailModule,
    StaffModule,
    FilesModule,
    S3Module,
    ProfileModule,
    ConsentModule,
    ScheduleModule,
  ],
})
export class AppModule {}
