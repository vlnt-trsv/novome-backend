import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { FilesService } from "./files.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { User } from "@prisma/client"
import { AvatarValidationPipe } from "./pipe/avatar-validation.pipe"

@Controller("files")
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesServies: FilesService) {}

  //   @Post("upload-documents")
  //   @UseInterceptors(FilesInterceptor("files", 10))
  //   async uploadDocument(
  //     @UploadedFiles(FileValidationPipe) files: Express.Multer.File[],
  //     @CurrentUser() user: User,
  //   ) {
  //     return await this.filesServies.processFiles(files, user)
  //   }

  @Post("avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async uploadAvatar(
    @UploadedFile(AvatarValidationPipe) avatar: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return await this.filesServies.uploadAvatar(avatar, user)
  }
}
