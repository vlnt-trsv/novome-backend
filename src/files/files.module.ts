import { Module } from "@nestjs/common"
import { FilesController } from "./files.controller"
import { FilesService } from "./files.service"
import { S3Service } from "src/s3/s3.service"

@Module({
  providers: [FilesService, S3Service],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
