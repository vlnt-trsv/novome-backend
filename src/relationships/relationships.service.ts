import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Relationship, RELATIONSHIP_STATUS } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { InviteDoctorDto } from "./dto/invite-doctor.dto"

@Injectable()
export class RelationshipsService {
  constructor(private prisma: PrismaService) {}

  async getRelationships(userId: string): Promise<Relationship[]> {
    return await this.prisma.relationship.findMany({
      where: {
        OR: [{ doctorId: userId }, { clinicId: userId }],
        archive: null,
        status: { not: "ARCHIVED" },
      },
      include: { doctor: { include: { user: true } }, clinic: { include: { user: true } } },
    })
  }

  async inviteDoctor(inviteDoctorDto: InviteDoctorDto): Promise<Relationship> {
    const { clinicId, doctorId } = inviteDoctorDto

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true },
    })
    if (!doctor) throw new HttpException("Доктор не найден", HttpStatus.NOT_FOUND)

    const existingRelationship = await this.prisma.relationship.findUnique({
      where: { doctorId_clinicId: { doctorId, clinicId } },
    })

    if (existingRelationship) {
      if (existingRelationship.status !== RELATIONSHIP_STATUS.ARCHIVED) {
        throw new HttpException("Приглашение уже отправлено или активно", HttpStatus.CONFLICT)
      }

      return await this.prisma.$transaction(async (tx) => {
        await tx.relationshipArchive.delete({
          where: { id: existingRelationship.id },
        })

        return await tx.relationship.update({
          where: { id: existingRelationship.id },
          data: { status: RELATIONSHIP_STATUS.PENDING },
        })
      })
    }

    return await this.prisma.relationship.create({
      data: { doctorId, clinicId },
    })
  }

  async changeStatus(id: string, status: RELATIONSHIP_STATUS): Promise<Relationship> {
    if (!status) throw new HttpException("Статус связи обязателен", HttpStatus.BAD_REQUEST)
    const relationship = await this.prisma.relationship.update({
      where: { id },
      data: { status },
      include: { clinic: true },
    })

    if (relationship.status === "APPROVED") {
      await this.prisma.doctor.update({
        where: { id: relationship.doctorId },
        data: { workplace: relationship.clinic.brandName ?? "Клиника" },
      })
    }

    return relationship
  }

  async archiveRelationship(id: string) {
    const relationship = await this.prisma.relationship.findUnique({
      where: { id },
      select: { archive: true },
    })
    if (relationship?.archive)
      throw new HttpException("Услуга уже архивирована!", HttpStatus.BAD_REQUEST)

    return await this.prisma.$transaction(async (tx) => {
      const relationship = await tx.relationship.update({
        where: { id },
        data: { status: "ARCHIVED" },
      })

      await this.prisma.doctor.update({
        where: { id: relationship.doctorId },
        data: { workplace: null },
      })

      const relationshipArchive = await tx.relationshipArchive.create({
        data: { id },
      })
      return { ...relationship, relationshipArchive }
    })
  }
}
