import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { AiService } from "./ai.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { File, User } from "@prisma/client"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { VisualizeAiDto } from "./dto/visualize-ai.dto"
import { FileValidationPipe } from "src/files/pipe/file-validation.pipe"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller("ai-visualization")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Get()
  async history(@CurrentUser() user: User): Promise<File[]> {
    return await this.aiService.history(user)
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async visualize(
    @CurrentUser() user: User,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body() visualizeAiDto: VisualizeAiDto,
  ) {
    return await this.aiService.visualize(user, file, visualizeAiDto)
  }

  @Delete()
  async delete(@CurrentUser() user: User, @Body("key") key: string) {
    return await this.aiService.delete(user, key)
  }
}
