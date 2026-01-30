import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { Clinic, Doctor, Patient, User } from "@prisma/client"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { FindUsersQueryDto } from "./dto/find-users-query.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { AccessGuard } from "src/auth/guards/access.guard"

@Controller("users")
@UseGuards(JwtAuthGuard)
@SetMetadata("type", ["user"])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  getMe(@CurrentUser() user: User) {
    return { ...user }
  }

  @Get()
  @UseGuards(AccessGuard)
  async getUsers(
    @Query() queryDto: FindUsersQueryDto,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return await this.userService.findUsers(queryDto)
  }

  @Get(":id")
  @UseGuards(AccessGuard)
  async getUser(@Param("id") id: string): Promise<User | null> {
    return await this.userService.findOne({ id })
  }

  @Post("user")
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  @Post(":id/profile")
  @UseGuards(AccessGuard)
  async createProfile(
    @Param("id") id: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Patient | Doctor | Clinic> {
    return await this.userService.createProfile(id, createProfileDto)
  }

  @Patch("change-password")
  @UseGuards(AccessGuard)
  async changePassword(@CurrentUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(user.id, changePasswordDto)
  }

  @Patch("me")
  @UseGuards(AccessGuard)
  async updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(user.id, { ...updateUserDto })
  }

  @Delete(":id")
  @UseGuards(AccessGuard)
  async deleteUser(@Param("id") id: string): Promise<User> {
    return await this.userService.deleteUser(id)
  }
}
