import {
  Body,
  Controller,
  Delete,
  Get,
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
import { FILE_TYPE, User } from "@prisma/client"
import { FileValidationPipe } from "./pipe/file-validation.pipe"
import { ConsentsRequiredGuard } from "src/consent/guards/consents-required.guard"
import { FilesValidationPipe } from "./pipe/files-validation.pipe"

@Controller("files")
@UseGuards(JwtAuthGuard, ConsentsRequiredGuard)
export class FilesController {
  constructor(private filesServies: FilesService) {}

  @Get()
  async getFiles(@CurrentUser() user: User) {
    return await this.filesServies.getFiles(user)
  }

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFiles(
    @CurrentUser() user: User,
    @Body("type") type: FILE_TYPE,
    @UploadedFiles(FilesValidationPipe) files: Express.Multer.File[],
  ) {
    return await this.filesServies.uploadFiles(files, type, user)
  }

  @Post("avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile(FileValidationPipe) avatar: Express.Multer.File,
  ) {
    return await this.filesServies.uploadAvatar(avatar, user)
  }

  @Delete()
  async deleteFile(@CurrentUser() user: User, @Body("key") key: string) {
    return await this.filesServies.deleteFile(user, key)
  }
}
