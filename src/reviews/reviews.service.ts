import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Review } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateReviewDto } from "./dto/create-review.dto"
import { ROLE_CONST } from "src/common/constants/user.constants"

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getReviews(userId: string): Promise<Review[]> {
    return await this.prisma.review.findMany({
      where: {
        OR: [{ patientId: userId }, { doctorId: userId }, { clinicId: userId }],
      },
    })
  }

  async createReview(
    userId: string,
    targetId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { value, text } = createReviewDto

    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { role: true },
    })

    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    const roleKey = ROLE_CONST[user.role]

    const whereCondition =
      roleKey === "doctor"
        ? { patientId_doctorId: { patientId: userId, doctorId: targetId } }
        : { patientId_clinicId: { patientId: userId, clinicId: targetId } }

    return await this.prisma.$transaction(async (tx) => {
      await tx.rating.update({
        where: whereCondition,
        data: {
          patientId: userId,
          [`${roleKey}Id`]: targetId,
          value,
        },
      })
      return await tx.review.create({
        data: {
          patientId: userId,
          [`${roleKey}Id`]: targetId,
          text,
          rating: {
            connect: whereCondition,
          },
        },
        include: {
          rating: true,
        },
      })
    })
  }
}
