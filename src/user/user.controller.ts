import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { UserService } from "./user.service"
import { AUTH_TYPE, User } from "@prisma/client"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { CurrentUser } from "src/common/decorators/current-user.decorator"
import { FindUsersQueryDto } from "./dto/find-users-query.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { ConsentsRequiredGuard } from "src/consent/guards/consents-required.guard"
import { AccessGuard } from "src/auth/guards/access.guard"
import { Type } from "src/auth/decorators/type.decorator"
import { TypeGuard } from "src/auth/guards/type.guard"

@Controller("users")
@Type(AUTH_TYPE.USER)
@UseGuards(JwtAuthGuard, TypeGuard, AccessGuard, ConsentsRequiredGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  async getMe(@CurrentUser() user: User) {
    return await this.userService.findOne({ id: user.id })
  }

  @Get()
  @Type(AUTH_TYPE.STAFF)
  @UseGuards(TypeGuard)
  async getUsers(
    @Query() queryDto: FindUsersQueryDto,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return await this.userService.findUsers(queryDto)
  }

  @Get(":id")
  async getUser(@Param("id") id: string): Promise<User | null> {
    return await this.userService.findOne({ id })
  }

  @Post(":id")
  async addUserToFavorite(@CurrentUser() user: User, @Param("id") id: string) {
    return await this.userService.addUserToFavorite(user, id)
  }

  @Post("user")
  @Type(AUTH_TYPE.STAFF)
  @UseGuards(TypeGuard)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  @Patch("change-password")
  async changePassword(@CurrentUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(user.id, changePasswordDto)
  }

  @Patch("me")
  async updateUser(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(user.id, updateUserDto)
  }

  @Delete(":id")
  async deleteUser(@CurrentUser() user: User) {
    return await this.userService.deleteUser(user.id)
  }
}
