import { Module } from "@nestjs/common"
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule"
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
import { AppointmentModule } from './appointment/appointment.module';
import { CatalogModule } from './catalog/catalog.module';
import { ServiceModule } from './service/service.module';

@Module({
  providers: [EmailService, StaffService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    NestScheduleModule.forRoot(),
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
    AppointmentModule,
    CatalogModule,
    ServiceModule,
  ],
})
export class AppModule {}
