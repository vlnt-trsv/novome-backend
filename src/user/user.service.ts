import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Clinic, Doctor, Patient, Prisma, ROLE, User, USER_STATUS } from "@prisma/client"
import { compare, genSalt, hash } from "bcryptjs"

import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { EmailService } from "src/email/email.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserWithRelations } from "src/common/types/user.types"
import { FindUsersQueryDto } from "./dto/find-users-query.dto"
import { ROLE_CONST } from "src/common/constants/user.constants"
import { ChangePasswordDto } from "./dto/change-password.dto"

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<UserWithRelations | null> {
    const user = await this.prisma.user.findUnique({ where })
    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    return this.prisma.user.findUnique({
      where,
      include: {
        auth: { omit: { hashedPassword: true, hashedRt: true } },
        patient: user?.role === ROLE.PATIENT,
        doctor: user?.role === ROLE.DOCTOR,
        clinic: user?.role === ROLE.CLINIC,
        moderation: user?.role === ROLE.DOCTOR || user?.role === ROLE.CLINIC,
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, password, email, phone, role } = createUserDto
    const auth = await this.prisma.auth.findUnique({ where: { email } })
    if (auth) {
      throw new HttpException("Этот email уже существует", HttpStatus.BAD_REQUEST)
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    const confirmationToken = `${crypto.randomUUID()}-${new Date().getTime()}`
    const confirmationTokenExpiresAt = new Date(
      Date.now() + Number(process.env.CONFIRMATION_EMAIL_TOKEN_EXPIRES_AT) * 60 * 60 * 1000,
    )

    const newUser = await this.prisma.user.create({
      data: {
        role: role as ROLE,
        fullName,
        email,
        phone,
        auth: {
          create: {
            email,
            hashedPassword,
            confirmationToken,
            confirmationTokenExpiresAt,
            confirmationSentAt: new Date(),
            phone,
            type: "USER",
          },
        },
        moderation: {
          create: {
            status: role === ROLE.PATIENT ? USER_STATUS.APPROVED : USER_STATUS.PENDING,
          },
        },
      },
    })

    await this.emailService.sendConfirmationEmail(newUser.email, confirmationToken)
    return newUser
  }

  async createProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Patient | Doctor | Clinic> {
    const user = await this.findOne({ id })
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    if (user[ROLE_CONST[user.role]]) {
      throw new HttpException(`Профиль ${user.role} уже создан`, HttpStatus.CONFLICT)
    }

    if (!user.auth?.confirmed)
      throw new HttpException("Подтвердите почту, перед созданием профиля", HttpStatus.BAD_REQUEST)

    if (user.role === ROLE.PATIENT) {
      // if (!createProfileDto.patient) {
      //   throw new HttpException("Данные пациента не предоставлены", HttpStatus.BAD_REQUEST)
      // }
      const { birthdate, ...data } = createProfileDto.patient || {}

      return await this.prisma.patient.create({
        data: {
          user: {
            connect: {
              id,
            },
          },
          ...data,
          birthdate: birthdate ? new Date(birthdate) : undefined,
        },
      })
    }

    if (user.role === ROLE.DOCTOR) {
      if (!createProfileDto.doctor) {
        throw new HttpException("Данные доктора не предоставлены", HttpStatus.BAD_REQUEST)
      }

      const { documents, birthdate, ...data } = createProfileDto.doctor

      return await this.prisma.doctor.create({
        data: {
          user: {
            connect: {
              id,
            },
          },
          ...data,
          birthdate: birthdate ? new Date(birthdate) : undefined,
          documents: { create: documents },
        },
      })
    }

    if (user.role === ROLE.CLINIC) {
      if (!createProfileDto.clinic) {
        throw new HttpException("Данные клиники не предоставлены", HttpStatus.BAD_REQUEST)
      }

      const { documents, ...data } = createProfileDto.clinic

      return await this.prisma.clinic.create({
        data: {
          user: {
            connect: {
              id,
            },
          },
          ...data,
          documents: { create: documents },
        },
      })
    }

    throw new HttpException("Недопустимая роль", HttpStatus.BAD_REQUEST)
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ id })
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    if (Object.keys(updateUserDto).length === 0) {
      throw new HttpException(`Данные не предоставлены`, HttpStatus.BAD_REQUEST)
    }

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: updateUserDto.fullName,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        patient: {
          update: { data: updateUserDto[user.role] as Prisma.PatientUpdateWithoutUserInput },
        },
        doctor: {
          update: { data: updateUserDto[user.role] as Prisma.DoctorUpdateWithoutUserInput },
        },
        clinic: {
          update: { data: updateUserDto[user.role] as Prisma.ClinicUpdateWithoutUserInput },
        },
      },
      include: {
        patient: user.role === ROLE.PATIENT,
        doctor: user.role === ROLE.DOCTOR,
        clinic: user.role === ROLE.CLINIC,
      },
    })
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    })
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<HttpException> {
    const { oldPassword, newPassword } = changePasswordDto

    const auth = await this.prisma.auth.findUnique({ where: { id: userId } })
    const isPasswordMatch = await compare(oldPassword, auth?.hashedPassword as string)

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
