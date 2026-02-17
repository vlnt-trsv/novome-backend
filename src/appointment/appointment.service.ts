import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { APPOINTMENT_STATUS, SLOT_STATUS, User } from "@prisma/client"
import { ROLE_CONST } from "src/common/constants/user.constants"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async getAppointments(user: User) {
    const { id, role } = user
    return await this.prisma.appointment.findMany({ where: { [`${ROLE_CONST[role]}Id`]: id } })
  }

  async getAppointment(id: string) {
    return await this.prisma.appointment.findUnique({ where: { id } })
  }

  async createAppointment(user: User, createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, timeSlotId, reason } = createAppointmentDto
    return await this.prisma.$transaction(async (tx) => {
      const doctor = await tx.doctor.findUnique({
        where: { id: doctorId },
        select: { id: true },
      })
      if (!doctor) {
        throw new HttpException(`Доктор с ID ${doctorId} не найден`, HttpStatus.NOT_FOUND)
      }
      const timeSlot = await tx.timeSlot.findUnique({
        where: { id: timeSlotId },
        select: { id: true, status: true },
      })

      if (!timeSlot) {
        throw new HttpException("Выбранный временной слот не существует", HttpStatus.NOT_FOUND)
      }

      if (timeSlot.status !== SLOT_STATUS.AVAILABLE) {
        throw new HttpException("Этот слот уже занят или заблокирован", HttpStatus.CONFLICT)
      }

      await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { status: SLOT_STATUS.BOOKED },
      })

      return await tx.appointment.create({
        data: {
          patientId: user.id,
          doctorId: doctor?.id,
          timeSlotId: timeSlot?.id,
          reason: reason ?? null,
        },
        include: {
          timeSlot: true,
          doctor: { select: { id: true } },
        },
      })
    })
  }

  async updateAppointmentStatus(user: User, id: string, status: APPOINTMENT_STATUS) {
    if (status === APPOINTMENT_STATUS.PENDING || APPOINTMENT_STATUS.CONFIRMED) {
      return await this.prisma.appointment.update({
        where: {
          id: id,
          OR: [{ patientId: user.id }, { doctorId: user.id }],
        },
        data: {
          status,
        },
        include: {
          timeSlot: true,
        },
      })
    }
    return await this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.update({
        where: {
          id: id,
          OR: [{ patientId: user.id }, { doctorId: user.id }],
        },
        data: {
          status,
        },
      })
      await tx.timeSlot.update({
        where: { id: appointment.timeSlotId },
        data: { status: SLOT_STATUS.AVAILABLE },
      })
      return appointment
    })
  }
}
