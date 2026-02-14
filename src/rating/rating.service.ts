import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { UpdateRatingDto } from "./dto/update-rating.dto"

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async updateRating(patientId: string, targetId: string, updateRatingDto: UpdateRatingDto) {
    const { value } = updateRatingDto
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    })

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { role: true },
    })

    if (!patient) throw new HttpException("Пациент не найден", HttpStatus.NOT_FOUND)
    if (!targetUser) throw new HttpException("Таргет не найден", HttpStatus.NOT_FOUND)

    const isDoctor = targetUser.role === "DOCTOR"

    return await this.prisma.$transaction(async (tx) => {
      const whereRating = isDoctor
        ? { patientId: patient.id, doctorId: targetId }
        : { patientId: patient.id, clinicId: targetId }

      const ratingData = {
        value,
        patientId: patient.id,
        ...(isDoctor ? { doctorId: targetId } : { clinicId: targetId }),
      }

      const savedRating = await tx.rating.upsert({
        where: whereRating,
        update: { value },
        create: ratingData,
      })

      const aggregations = await tx.rating.aggregate({
        where: {
          [isDoctor ? "doctorId" : "clinicId"]: targetId,
        },
        _avg: { value: true },
        _count: { value: true },
      })

      const newAverageRating = aggregations._avg.value ?? 0

      if (isDoctor) {
        await tx.doctor.update({
          where: { id: targetId },
          data: {
            rating: newAverageRating,
          },
        })
      } else {
        await tx.clinic.update({
          where: { id: targetId },
          data: {
            rating: newAverageRating,
          },
        })
      }

      return savedRating
    })
  }
}
