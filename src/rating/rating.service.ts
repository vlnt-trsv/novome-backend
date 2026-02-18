import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { UpdateRatingDto } from "./dto/update-rating.dto"
import { ROLE_CONST } from "src/common/constants/user.constants"

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async updateRating(patientId: string, targetId: string, updateRatingDto: UpdateRatingDto) {
    const { value } = updateRatingDto
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    })

    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { role: true },
    })

    if (!patient) throw new HttpException("Пациент не найден", HttpStatus.NOT_FOUND)
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND)

    const roleKey = ROLE_CONST[user.role]

    const whereCondition =
      roleKey === "doctor"
        ? { patientId_doctorId: { patientId: patient.id, doctorId: targetId } }
        : { patientId_clinicId: { patientId: patient.id, clinicId: targetId } }

    return await this.prisma.$transaction(async (tx) => {
      const savedRating = await tx.rating.upsert({
        where: whereCondition,
        update: { value },
        create: {
          value,
          patientId: patient.id,
          [`${roleKey}Id`]: targetId,
        },
      })

      const aggregations = await tx.rating.aggregate({
        where: { [`${roleKey}Id`]: targetId },
        _avg: { value: true },
        _count: { value: true },
      })

      if (roleKey === "doctor") {
        await tx.doctor.update({
          where: { id: targetId },
          data: {
            rating: aggregations._avg.value ?? 0,
          },
        })
      } else {
        await tx.clinic.update({
          where: { id: targetId },
          data: {
            rating: aggregations._avg.value ?? 0,
          },
        })
      }

      return savedRating
    })
  }
}
