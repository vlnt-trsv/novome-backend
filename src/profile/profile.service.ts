import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { FilesService } from "src/files/files.service"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { Clinic, Doctor, Patient, ROLE, User } from "@prisma/client"
import { ROLE_CONST } from "src/common/constants/user.constants"
import { PrismaService } from "src/prisma/prisma.service"
import { PatientDto } from "./dto/patient.dto"
import { DoctorDto } from "./dto/doctor.dto"
import { ClinicDto } from "./dto/clinic.dto"
import { ScheduleService } from "src/schedule/schedule.service"

@Injectable()
export class ProfileService {
  constructor(
    private fileService: FilesService,
    private scheduleService: ScheduleService,
    private prisma: PrismaService,
  ) {}

  async createProfile(
    user: User,
    createProfileDto: CreateProfileDto,
    files: Express.Multer.File[],
  ): Promise<Patient | Doctor | Clinic> {
    const { id, role } = user
    const roleKey = ROLE_CONST[role]
    const profileData = createProfileDto[roleKey]
    const isProfileCreated = await this.prisma.user.findMany({
      where: { id },
      select: { [roleKey]: { include: { _count: true } } },
    })

    if (isProfileCreated[0][roleKey] !== null) {
      throw new HttpException(`Профиль ${roleKey} уже создан`, HttpStatus.CONFLICT)
    }

    if (!profileData) {
      throw new HttpException(`Данные ${roleKey} не предоставлены`, HttpStatus.BAD_REQUEST)
    }

    if (role === ROLE.PATIENT) {
      const { birthdate, ...data } = profileData as PatientDto
      return this.prisma.patient.create({
        data: {
          id,
          birthdate: birthdate ? new Date(birthdate + "T00:00:00Z") : undefined,
          ...data,
        },
      })
    }

    if (role === ROLE.DOCTOR) {
      try {
        return await this.prisma.$transaction(async (tx): Promise<Doctor> => {
          const { birthdate, ...data } = profileData as DoctorDto

          await tx.user.update({
            where: { id },
            data: {
              status: "PENDING",
            },
          })

          const profile = await tx.doctor.create({
            data: {
              id,
              birthdate: birthdate ? new Date(birthdate + "T00:00:00Z") : null,
              ...data,
            },
          })

          if (!files || files.length === 0) {
            throw new HttpException("Для данной роли документы обязательны", HttpStatus.BAD_REQUEST)
          }

          await this.fileService.uploadFiles(files, "DOCUMENT", user, tx)

          await this.scheduleService.createDefaultSchedule(profile.id, tx)

          return profile
        })
      } catch (error) {
        throw new BadRequestException({ cause: error })
      }
    }

    if (role === ROLE.CLINIC) {
      try {
        return await this.prisma.$transaction(async (tx): Promise<Clinic> => {
          const { ...data } = profileData as ClinicDto

          await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              status: "PENDING",
            },
          })

          const profile = await tx.clinic.create({
            data: {
              id: user.id,
              ...data,
            },
          })

          if (!files || files.length === 0) {
            throw new HttpException("Для данной роли документы обязательны", HttpStatus.BAD_REQUEST)
          }

          await this.fileService.uploadFiles(files, "DOCUMENT", user, tx)

          await this.scheduleService.createDefaultSchedule(profile.id, tx)

          return profile
        })
      } catch (error) {
        throw new BadRequestException({ cause: error })
      }
    }

    throw new HttpException("Недопустимая роль", HttpStatus.BAD_REQUEST)
  }
}
