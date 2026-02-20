import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Prisma, Staff } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateStaffDto } from "./dto/create-staff.dto"
import { genSalt, hash } from "bcryptjs"

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findOne(where: Prisma.StaffWhereUniqueInput): Promise<Staff | null> {
    return this.prisma.staff.findUnique({
      where,
      include: {
        auth: { omit: { hashedPassword: true, hashedRt: true } },
        moderated: true,
      },
    })
  }

  async createStaff(createStaffDto: CreateStaffDto): Promise<Staff> {
    const { fullName, password, email } = createStaffDto
    const auth = await this.prisma.auth.findUnique({ where: { email } })
    if (auth) {
      throw new HttpException("Этот email уже существует", HttpStatus.BAD_REQUEST)
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    return await this.prisma.$transaction(async (tx) => {
      const staff = await tx.staff.create({
        data: {
          fullName,
          email,
          auth: {
            create: {
              email,
              hashedPassword,
              confirmed: true,
              type: "STAFF",
            },
          },
        },
      })
      await tx.moderation.create({ data: { moderator: { connect: { id: staff.id } } } })
      return staff
    })
  }
}
