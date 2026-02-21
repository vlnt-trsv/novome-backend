import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Appointment, APPOINTMENT_STATUS, SLOT_STATUS, User } from "@prisma/client"
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

  async getAppointment(user: User, appointmentId: string) {
    const { id, role } = user
    return await this.prisma.appointment.findUnique({
      where: { [`${ROLE_CONST[role]}Id`]: id, id: appointmentId },
    })
  }

  async createAppointment(
    user: User,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { doctorId, timeSlotId, reason } = createAppointmentDto
    const { id: patientId } = user
    return await this.prisma.$transaction(async (tx) => {
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
        where: { id: timeSlot.id },
        data: { status: SLOT_STATUS.BOOKED },
      })

      return await tx.appointment.create({
        data: {
          patientId,
          doctorId,
          timeSlotId: timeSlot.id,
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
    const { id: userId } = user
    if (status === APPOINTMENT_STATUS.PENDING || APPOINTMENT_STATUS.CONFIRMED) {
      return await this.prisma.appointment.update({
        where: {
          id: id,
          OR: [{ patientId: userId }, { doctorId: userId }],
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
          OR: [{ patientId: userId }, { doctorId: userId }],
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
