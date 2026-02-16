import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { Appointment } from "@prisma/client"
import { APPOINTMENT_NOTIFICATION_CONST } from "src/common/constants/appointment.constants"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class NotificationListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent("appointment.status.changed", { async: true })
  async appointmentStatusChanged(payload: { userId: string; appointment: Appointment }) {
    const { userId, appointment } = payload
    const meta = APPOINTMENT_NOTIFICATION_CONST[appointment.status]

    return await this.prisma.notification.create({
      data: {
        userId,
        type: meta.type,
        title: meta.title,
        description: meta.description,
        payload: appointment,
      },
    })
  }
}
