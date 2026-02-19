import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { FilesService } from "src/files/files.service"
import { CreateProfileDto } from "./dto/create-profile.dto"
import { Clinic, Doctor, Patient, ROLE, User } from "@prisma/client"
import { ROLE_CONST } from "src/common/constants/user.constants"
import { PrismaService } from "src/prisma/prisma.service"
import { PatientDto } from "./dto/patient.dto"
import { DoctorDto } from "./dto/doctor.dto"
import { ClinicDto } from "./dto/clinic.dto"
import { ScheduleService } from "src/schedule/schedule.service"

interface UploadedFileResult {
  key: string
  url: string
  originalName: string
  mimeType: string
  size: number
}

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
    const roleKey = ROLE_CONST[user.role]
    const profileData = createProfileDto[roleKey]
    const isProfileCreated = await this.prisma.user.findMany({
      where: { id: user.id },
      select: { [roleKey]: { include: { _count: true } } },
    })

    if (isProfileCreated[0][roleKey] !== null) {
      throw new HttpException(`Профиль ${roleKey} уже создан`, HttpStatus.CONFLICT)
    }

    if (!profileData) {
      throw new HttpException(`Данные ${roleKey} не предоставлены`, HttpStatus.BAD_REQUEST)
    }

    if (user.role === ROLE.PATIENT) {
      const { birthdate, ...data } = profileData as PatientDto
      return this.prisma.patient.create({
        data: {
          id: user.id,
          birthdate: birthdate ? new Date(birthdate) : undefined,
          ...data,
        },
      })
    }

    if (user.role === ROLE.DOCTOR) {
      let filesData: UploadedFileResult[] = []
      try {
        if (files && files.length > 0) {
          filesData = await this.fileService.processFiles(files, user)
        }

        return await this.prisma.$transaction(async (tx): Promise<Doctor> => {
          const { birthdate, ...data } = profileData as DoctorDto

          await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              status: "PENDING",
            },
          })

          const profile = await tx.doctor.create({
            data: {
              id: user.id,
              birthdate: birthdate ? new Date(birthdate) : null,
              ...data,
            },
          })

          for (const res of filesData) {
            const dbFile = await tx.file.create({
              data: {
                originalName: res.originalName,
                mimeType: res.mimeType,
                s3Key: res.key,
                size: res.size,
                url: res.url,
              },
            })

            await tx.document.create({
              data: {
                id: dbFile.id,
                doctorId: profile.id,
              },
            })
          }

          await this.scheduleService.createDefaultSchedule(profile.id, tx)

          return profile
        })
      } catch (error) {
        if (filesData.length > 0) {
          const keys = filesData.map((r: UploadedFileResult) => r.key)
          await this.fileService.deleteMany(keys)
        }
        throw error
      }
    }

    if (user.role === ROLE.CLINIC) {
      let filesData: UploadedFileResult[] = []
      try {
        if (files && files.length > 0) {
          filesData = await this.fileService.processFiles(files, user)
        }

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

          for (const res of filesData) {
            const dbFile = await tx.file.create({
              data: {
                originalName: res.originalName,
                mimeType: res.mimeType,
                s3Key: res.key,
                size: res.size,
                url: res.url,
              },
            })

            await tx.document.create({
              data: {
                id: dbFile.id,
                clinicId: profile.id,
              },
            })
          }

          await this.scheduleService.createDefaultSchedule(profile.id, tx)

          return profile
        })
      } catch (error) {
        if (filesData.length > 0) {
          const keys = filesData.map((r: UploadedFileResult) => r.key)
          await this.fileService.deleteMany(keys)
        }
        throw error
      }
    }

    throw new HttpException("Недопустимая роль", HttpStatus.BAD_REQUEST)
  }
}
