import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Prisma, ROLE, User } from "@prisma/client"
import { compare, genSalt, hash } from "bcryptjs"

import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { FindUsersQueryDto } from "./dto/find-users-query.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { ROLE_CONST } from "src/common/constants/user.constants"

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where })
    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    return await this.prisma.user.findUnique({
      where,
      include: {
        auth: { omit: { hashedPassword: true, hashedRt: true } },
        patient: user?.role === ROLE.PATIENT,
        doctor: user?.role === ROLE.DOCTOR,
        clinic: user?.role === ROLE.CLINIC,
        tickets: true,
        userConsents: true,
        notifications: true,
      },
    })
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { skip = 0, take = 20, role, search, orderBy = "createdAt", sortBy = "desc" } = queryDto
    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
      ]
    }
    if (role) {
      where.role = role
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: sortBy },
        include: { patient: role === ROLE.PATIENT },
      }),

      this.prisma.user.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
    }
  }

  async createUser(createUserDto: CreateUserDto, tx?: Prisma.TransactionClient): Promise<User> {
    const prisma = tx ?? this.prisma
    const { fullName, password, email, phone, role } = createUserDto

    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    return await prisma.user.create({
      data: {
        role: role,
        fullName,
        email,
        phone,
        auth: {
          create: {
            email,
            hashedPassword,
            phone,
            type: "USER",
          },
        },
      },
    })
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ id })
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    const roleKey = ROLE_CONST[user.role]
    const roleData = updateUserDto[roleKey]

    if (!Object.entries(updateUserDto).some(([, value]) => value)) {
      throw new HttpException(`Данные не предоставлены`, HttpStatus.BAD_REQUEST)
    }

    const updatePayload: Prisma.UserUpdateInput = {
      fullName: updateUserDto.fullName,
      email: updateUserDto.email,
      phone: updateUserDto.phone,
    }

    if (roleData) {
      updatePayload[roleKey] = {
        update: {
          data: roleData,
        },
      }
    }

    return await this.prisma.user.update({
      where: { id: user.id },
      data: updatePayload,
      include: {
        patient: user.role === ROLE.PATIENT,
        doctor: user.role === ROLE.DOCTOR,
        clinic: user.role === ROLE.CLINIC,
      },
    })
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    })
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<HttpException> {
    const { oldPassword, newPassword } = changePasswordDto

    const auth = await this.prisma.auth.findUnique({ where: { id: userId } })
    const isPasswordMatch = await compare(oldPassword, auth?.hashedPassword ?? "")

    if (!isPasswordMatch) throw new HttpException("Неверный текущий пароль", HttpStatus.BAD_REQUEST)

    const salt = await genSalt(10)
    const newPasswordHashed = await hash(newPassword, salt)

    await this.prisma.auth.update({
      where: { id: userId },
      data: { hashedPassword: newPasswordHashed, lastChangePasswordAt: new Date() },
    })

    throw new HttpException("Пароль успешно изменен", HttpStatus.OK)
  }
}
