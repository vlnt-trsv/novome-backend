import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { AccessGuard } from "src/auth/guards/access.guard"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { Clinic, Doctor, Patient, User } from "@prisma/client"
import { ProfileService } from "./profile.service"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { FilesInterceptor } from "@nestjs/platform-express"
import { FilesValidationPipe } from "src/files/pipe/files-validation.pipe"
import { ConsentsRequiredGuard } from "src/consent/guards/consents-required.guard"

@Controller("profiles")
@UseGuards(JwtAuthGuard, ConsentsRequiredGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @UseGuards(AccessGuard)
  @UseInterceptors(FilesInterceptor("documents"))
  async createProfile(
    @CurrentUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFiles(FilesValidationPipe) files: Express.Multer.File[],
  ): Promise<Patient | Doctor | Clinic> {
    return await this.profileService.createProfile(user, createProfileDto, files)
  }
}
