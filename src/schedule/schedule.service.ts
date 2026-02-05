/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { addMinutes } from "date-fns"
import { ROLE_CONST } from "src/common/constants/user.constants"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createDefaultSchedule(
    targetId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const prisma = tx ?? this.prisma
    const weekDays = [1, 2, 3, 4, 5, 6]

    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { role: true },
    })

    const roleKey = ROLE_CONST[user?.role ?? ""]

    return await prisma.schedule.createMany({
      data: weekDays.map((day) => ({
        [`${roleKey}Id`]: targetId,
        dayOfWeek: day,
        startAt: "09:00",
        endAt: "21:00",
      })),
    })
  }

  async generateSlots(
    targetId: string,
    date: Date,
    constraintId?: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prisma
    const dayOfWeek = new Date(date).getUTCDay()

    const targetSchedule = await this._getSchedule(targetId, dayOfWeek, prisma)
    if (!targetSchedule) return // В этот день врач не работает

    let limitStart = targetSchedule.startAt
    let limitEnd = targetSchedule.endAt

    if (constraintId) {
      const clinicSchedule = await this._getSchedule(constraintId, dayOfWeek, prisma)
      if (!clinicSchedule) return // Клиника закрыта - слотов не будет
      limitStart = limitStart > clinicSchedule.startAt ? limitStart : clinicSchedule.startAt
      limitEnd = limitEnd < clinicSchedule.endAt ? limitEnd : clinicSchedule.endAt
    }

    if (limitStart >= limitEnd) return // Врач и клиника не пересекаются по времени

    let currentSlotTime = this._combineDateAndTime(date, limitStart)
    const endTime = this._combineDateAndTime(date, limitEnd)
    const slotsToCreate: Prisma.TimeSlotCreateManyInput[] = []

    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { role: true },
    })
    const roleKey = ROLE_CONST[user?.role ?? ""]

    while (currentSlotTime < endTime) {
      const nextSlotTime = addMinutes(currentSlotTime, targetSchedule.slotDuration)
      if (nextSlotTime > endTime) break

      slotsToCreate.push({
        [`${roleKey}Id`]: targetId,
        clinicId: constraintId ?? null,
        startAt: currentSlotTime,
        endAt: nextSlotTime,
      })

      currentSlotTime = nextSlotTime
    }

    if (slotsToCreate.length > 0) {
      return await prisma.timeSlot.createMany({ data: slotsToCreate })
    }
  }

  private async _getSchedule(targetId: string, dayOfWeek: number, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prisma

    return await prisma.schedule.findFirst({
      where: {
        OR: [{ doctorId: targetId }, { clinicId: targetId }],
        dayOfWeek,
      },
    })
  }

  private _combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number)
    const targetDate = new Date(date)

    const combined = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        hours,
        minutes,
        0,
        0,
      ),
    )

    return combined
  }
}
