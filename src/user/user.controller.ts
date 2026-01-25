import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { Clinic, Doctor, Patient, User } from "@prisma/client"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { AuthGuard } from "@nestjs/passport"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { FindUsersQueryDto } from "./dto/find-users-query.dto"

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  getMe(@CurrentUser() user: User) {
    return { ...user }
  }

  @Get()
  async getUsers(
    @Query() queryDto: FindUsersQueryDto,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return await this.userService.findUsers(queryDto)
  }

  @Get(":id")
  async getUser(@Param("id", ParseUUIDPipe) id: string): Promise<User | null> {
    return await this.userService.findOne({ id })
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  @Post(":id/profile")
  async createProfile(
    @Param("id") id: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Patient | Doctor | Clinic> {
    return await this.userService.createProfile(id, createProfileDto)
  }

  @Patch(":id")
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(id, { ...updateUserDto })
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string): Promise<User> {
    return await this.userService.deleteUser(id)
  }
}
