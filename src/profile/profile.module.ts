import { Module } from "@nestjs/common"
import { ProfileService } from "./profile.service"
import { ProfileController } from "./profile.controller"
import { FilesModule } from "src/files/files.module"
import { ScheduleModule } from "src/schedule/schedule.module"

@Module({
  imports: [FilesModule, ScheduleModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
