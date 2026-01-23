import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"
import { UserService } from "./user.service"
import { Clinic, Doctor, Patient, Prisma, User } from "@prisma/client"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateProfileDto } from "./dto/create-profile.dto"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId")
  async getUser(@Param("userId") userId: User["id"]): Promise<User | null> {
    return await this.userService.findUser({ id: userId })
  }

  @Get()
  async getUsers(@Query() query: Prisma.UserWhereInput): Promise<User[] | null> {
    return await this.userService.findUsers({ where: query })
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto)
  }

  // TODO: Доабить guard на проверку подверждения почты
  // TODO: Доабить guard на проверку авторизации
  // TODO: Доабить guard на проверку роли пользователя
  @Post(":userId/profile")
  async createProfile(
    @Param("userId") userId: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Patient | Doctor | Clinic> {
    return await this.userService.createProfile(userId, createProfileDto)
  }

  // TODO: Добавить 
}
