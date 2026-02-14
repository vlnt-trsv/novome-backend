import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Service } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateServiceDto } from "./dto/create-service.dto"
import { UpdateServiceDto } from "./dto/update-service.dto"
import { ArchiveServiceDto } from "./dto/archive-service.dto"

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async getServices(): Promise<Service[]> {
    return await this.prisma.service.findMany({ where: { archive: null, isActive: true } })
  }

  async createService(userId: string, createServiceDto: CreateServiceDto): Promise<Service> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: userId } })
    return await this.prisma.service.create({
      data: { doctorId: doctor?.id, ...createServiceDto },
    })
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    return await this.prisma.service.update({ where: { id }, data: { ...updateServiceDto } })
  }

  async archiveService(id: string, archiveServiceDto: ArchiveServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: { archive: true },
    })
    if (service?.archive)
      throw new HttpException("Услуга уже архивирована!", HttpStatus.BAD_REQUEST)

    return await this.prisma.$transaction(async (tx) => {
      await tx.service.update({
        where: { id },
        data: { isActive: false },
      })

      return await tx.serviceArchive.create({
        data: {
          id,
          ...archiveServiceDto,
        },
      })
    })
  }
}
