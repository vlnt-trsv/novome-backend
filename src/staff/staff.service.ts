import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import {
  Prisma,
  Staff,
  Ticket,
  MODERATION_STATUS,
  Review,
  REVIEW_STATUS,
  User,
} from "@prisma/client"
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

  async getTickets(): Promise<Ticket[]> {
    return await this.prisma.ticket.findMany()
  }

  async getReviews(): Promise<Review[]> {
    return await this.prisma.review.findMany()
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async createStaff(createStaffDto: CreateStaffDto): Promise<Staff> {
    const { fullName, password, email } = createStaffDto
    const auth = await this.prisma.auth.findUnique({ where: { email } })
    if (auth) {
      throw new HttpException("Этот email уже существует", HttpStatus.BAD_REQUEST)
    }
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    return await this.prisma.staff.create({
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
  }

  async changeUserStatus(
    userId: string,
    status: MODERATION_STATUS,
    comment?: string,
  ): Promise<HttpException> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status, moderationComment: comment },
    })
    throw new HttpException(`Статус пользователя изменен на ${status}`, HttpStatus.OK)
  }

  async changeReviewStatus(reviewId: string, status: REVIEW_STATUS): Promise<HttpException> {
    await this.prisma.review.update({
      where: { id: reviewId, status: "PENDING" },
      data: { status },
    })
    throw new HttpException(`Статус отзыва изменен на ${status}`, HttpStatus.OK)
  }
}
