import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Clinic, Doctor, Patient, Prisma, ROLE, User } from "@prisma/client"
import { hash } from "bcryptjs"

import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { EmailService } from "src/email/email.service"

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private smtp: EmailService,
  ) {}

  async findUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    const include = {
      auth: {
        select: {
          emailConfirmedAt: true,
          lastSignInAt: true,
          confirmed: true,
        },
      },
    } as Prisma.UserInclude

    switch (user.role) {
      case "PATIENT":
        include.patient = true
        break
      case "DOCTOR":
        include.doctor = true
        include.moderation = true
        break
      case "CLINIC":
        include.clinic = true
        include.moderation = true
        break
    }

    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include,
    })
  }

  async findUsers(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await hash(createUserDto.password, 10)
      const confirmationToken = `${crypto.randomUUID()}-${new Date().getTime()}`
      const confirmationTokenExpiresAt = new Date(
        new Date().getTime() +
          Number(process.env.CONFIRMATION_EMAIL_TOKEN_EXPIRES_AT) * 60 * 60 * 1000,
      )

      const user = await this.prisma.user.create({
        data: {
          role: createUserDto.role as ROLE,
          fullName: createUserDto.fullName,
          email: createUserDto.email,
          phone: createUserDto.phone,
          auth: {
            create: {
              password: hashedPassword,
              email: createUserDto.email,
              phone: createUserDto.phone,
              confirmationToken: confirmationToken,
              confirmationTokenExpiresAt: confirmationTokenExpiresAt,
              confirmationSentAt: new Date(),
            },
          },
        },
      })
      await this.smtp.sendConfirmationEmail(user.email, confirmationToken)
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new HttpException("Такой пользователь уже создан", HttpStatus.CONFLICT)
        }
      }
      throw error
    }
  }

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Patient | Doctor | Clinic> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    if (user.role === ROLE.PATIENT) {
      // if (!createProfileDto.patient) {
      //   throw new HttpException("Данные пациента не предоставлены", HttpStatus.BAD_REQUEST)
      // }
      const { birthDate, ...data } = createProfileDto.patient || {}

      return await this.prisma.patient.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          ...data,
          birthDate: birthDate ? new Date(birthDate).toDateString() : undefined,
        },
      })
    }

    if (user.role === ROLE.DOCTOR) {
      if (!createProfileDto.doctor) {
        throw new HttpException("Данные доктора не предоставлены", HttpStatus.BAD_REQUEST)
      }

      const { documents, birthDate, ...doctorData } = createProfileDto.doctor

      return await this.prisma.doctor.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          ...doctorData,
          birthDate: birthDate ? new Date(birthDate).toDateString() : undefined,
          documents: {
            create: documents || [],
          },
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
              id: userId,
            },
          },
          documents: { create: documents },
          ...data,
        },
      })
    }

    throw new HttpException("Недопустимая роль", HttpStatus.BAD_REQUEST)
  }

  // TODO: Протестировать
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return await this.prisma.user.update({
      data,
      where,
    })
  }

  // TODO: Протестировать
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
}
