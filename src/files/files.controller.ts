import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { FilesService } from "./files.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { User } from "@prisma/client"
import { AvatarValidationPipe } from "./pipe/avatar-validation.pipe"
import { ConsentsRequiredGuard } from "src/consent/guards/consents-required.guard"
import { FilesValidationPipe } from "./pipe/files-validation.pipe"

@Controller("files")
@UseGuards(JwtAuthGuard, ConsentsRequiredGuard)
export class FilesController {
  constructor(private filesServies: FilesService) {}

  @Post("download")
  async downloadFile(@Body("key") key: string) {
    return await this.filesServies.downloadFile(key)
  }

  @Post("upload")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFiles(
    @CurrentUser() user: User,
    @UploadedFiles(FilesValidationPipe) files: Express.Multer.File[],
  ) {
    return await this.filesServies.uploadFiles(files, user)
  }

  @Post("avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile(AvatarValidationPipe) avatar: Express.Multer.File,
  ) {
    return await this.filesServies.uploadAvatar(avatar, user)
  }

  @Delete()
  async deleteFile(@Body("key") key: string) {
    return await this.filesServies.deleteFile(key)
  }
}
