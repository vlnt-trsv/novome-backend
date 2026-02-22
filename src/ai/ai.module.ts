import { Module } from "@nestjs/common"
import { AiService } from "./ai.service"
import { AiController } from "./ai.controller"
import { FilesModule } from "src/files/files.module"

@Module({
  imports: [FilesModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
