import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Auth, Clinic, Doctor, Patient, Prisma, ROLE, User } from "@prisma/client"
import { compare, genSalt, hash } from "bcryptjs"

import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { EmailService } from "src/email/email.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { LoginDto } from "src/auth/dto/login.dto"
import { UserWithRelations } from "src/common/types/user.types"
import { FindUsersQueryDto } from "./dto/find-users-query.dto"
import { ROLE_CONST } from "src/common/constants/user.constants"

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private smtp: EmailService,
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

  async findByLogin({ email, password }: LoginDto): Promise<Auth> {
    const auth = await this.prisma.auth.findUnique({ where: { email } })
    if (!auth || !auth?.hashedPassword) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)
    }
    const comparePassword = await compare(password, auth.hashedPassword)
    if (!comparePassword) {
      throw new HttpException("Неправильные данные", HttpStatus.UNAUTHORIZED)
    }
    await this.prisma.auth.update({
      where: { userId: auth.userId },
      data: { lastSignInAt: new Date() },
    })
    return auth
  }

  async findByPayload({ email }: { email: string }): Promise<UserWithRelations | null> {
    return await this.findOne({ email })
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
        include: { patient: role === "PATIENT" },
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
    const userInDb = await this.prisma.user.findUnique({ where: { email: createUserDto.email } })
    if (userInDb) {
      throw new HttpException("Такой пользователь уже создан", HttpStatus.BAD_REQUEST)
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    const confirmationToken = `${crypto.randomUUID()}-${new Date().getTime()}`
    const confirmationTokenExpiresAt = new Date(
      new Date().getTime() +
        Number(process.env.CONFIRMATION_EMAIL_TOKEN_EXPIRES_AT) * 60 * 60 * 1000,
    )

    const user = await this.prisma.user.create({
      data: {
        role: role as ROLE,
        fullName: fullName,
        email: email,
        phone: phone,
        auth: {
          create: {
            hashedPassword: hashedPassword,
            email: email,
            phone: phone,
            confirmationToken: confirmationToken,
            confirmationTokenExpiresAt: confirmationTokenExpiresAt,
            confirmationSentAt: new Date(),
          },
        },
      },
    })

    await this.smtp.sendConfirmationEmail(user.email, confirmationToken)
    return user
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
}
