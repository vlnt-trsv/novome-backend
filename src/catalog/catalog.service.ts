import { Injectable } from "@nestjs/common"
import { Clinic, Doctor, Prisma, ROLE, SPECIALIZATION } from "@prisma/client"
import { getAllSpecializations } from "src/common/constants/doctor.constants"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getCatalog(
    role: ROLE,
    search?: string,
    skip?: number,
    take?: number,
    specializations?: SPECIALIZATION[],
  ) {
    if (role === ROLE.DOCTOR) {
      const filters: Prisma.DoctorWhereInput[] = []

      if (search?.trim()) {
        filters.push({
          user: {
            fullName: {
              contains: search.trim(),
              mode: "insensitive",
            },
          },
        })
      }

      if (Array.isArray(specializations) && specializations.length > 0) {
        filters.push({
          specializations: {
            hasSome: specializations,
          },
        })
      }

      const where = filters.length > 0 ? { AND: filters } : undefined

      return await this._getDoctors(where, skip, take)
    }

    if (role === ROLE.CLINIC) {
      return await this._getClinics(
        {
          legalName: {
            contains: search,
            mode: "insensitive",
          },
        },
        skip,
        take,
      )
    }
  }

  getSpecializations() {
    return getAllSpecializations()
  }

  private async _getDoctors(
    where: Prisma.DoctorWhereInput = {},
    skip?: number,
    take?: number,
  ): Promise<Doctor[]> {
    return await this.prisma.doctor.findMany({
      where: {
        AND: [where, { isSearchable: true }],
      },
      skip,
      take,
      include: {
        user: {
          select: {
            avatar: true,
            clinic: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
          },
        },
        relationships: true,
      },
    })
  }

  private async _getClinics(
    where?: Prisma.ClinicWhereInput,
    skip?: number,
    take?: number,
  ): Promise<Clinic[]> {
    return await this.prisma.clinic.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            avatar: true,
            clinic: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
          },
        },
      },
    })
  }
}
