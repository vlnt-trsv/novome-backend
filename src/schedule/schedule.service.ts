/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import { BREAK_TYPE, Prisma, SLOT_STATUS, TimeSlot } from "@prisma/client"
import { addMinutes, endOfDay, hoursToMinutes } from "date-fns"
import { ROLE_CONST } from "src/common/constants/user.constants"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name)
  constructor(private prisma: PrismaService) {}

  async getSchedules(targetId: string, date?: Date) {
    return await this.prisma.$transaction(async (tx) => {
      if (date) {
        return await this._generateSlots(targetId, date)
      }

      return await tx.schedule.findMany({
        where: {
          OR: [{ doctorId: targetId }, { clinicId: targetId }],
        },
      })
    })
  }

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

  private async _generateSlots(targetId: string, date: Date, constraintId?: string) {
    const requestedDate = new Date(date)
    if (new Date() > requestedDate) {
      throw new HttpException("Нельзя получать прошедшие даты", HttpStatus.BAD_REQUEST)
    }
    const dayOfWeek = requestedDate.getUTCDay()

    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { role: true },
    })

    const targetBreak = await this._getBreak(targetId)
    const dailyRules = await this._getWorkRule(targetId)

    const targetSchedule = await this._getSchedule(targetId, dayOfWeek)
    if (!targetSchedule) return [] // В этот день врач не работает

    let limitStart = targetSchedule.startAt
    let limitEnd = targetSchedule.endAt

    if (constraintId) {
      const clinicSchedule = await this._getSchedule(constraintId, dayOfWeek)
      if (!clinicSchedule) return [] // Клиника закрыта - слотов не будет
      limitStart = limitStart > clinicSchedule.startAt ? limitStart : clinicSchedule.startAt
      limitEnd = limitEnd < clinicSchedule.endAt ? limitEnd : clinicSchedule.endAt
    }

    if (limitStart >= limitEnd) return [] // Врач и клиника не пересекаются по времени

    const startOfDay = new Date(requestedDate.setUTCHours(0, 0, 0, 0))
    const endOfDay = new Date(requestedDate.setUTCHours(23, 59, 59, 999))

    const busySlots = await this.prisma.timeSlot.findMany({
      where: {
        doctorId: targetId,
        startAt: { gte: startOfDay, lte: endOfDay },
        status: { not: SLOT_STATUS.AVAILABLE },
      },
      select: { startAt: true },
    })

    const busyTimestamps = new Set(busySlots.map((slot) => slot.startAt.getTime()))

    let currentSlotTime = this._combineDateAndTime(date, limitStart)
    const endTime = this._combineDateAndTime(date, limitEnd)
    const slotsToCreate: Prisma.TimeSlotCreateManyInput[] = []
    const roleKey = ROLE_CONST[user?.role ?? ""]

    while (currentSlotTime < endTime) {
      const nextSlotTime = addMinutes(currentSlotTime, targetSchedule.slotDuration)
      if (nextSlotTime > endTime) break

      const isBusy = busyTimestamps.has(currentSlotTime.getTime())

      const isDuringAbsolute = targetBreak.some((b) => {
        if (!b.startAt || !b.endAt) return false
        return currentSlotTime < b.endAt && nextSlotTime > b.startAt
      })

      const currentMinutes = this._getSlotMinutes(currentSlotTime)
      const isDuringRule = dailyRules.some((rule) => {
        return (
          currentMinutes >= this._timeToMinute(rule.startTime) &&
          currentMinutes < this._timeToMinute(rule.endTime)
        )
      })

      if (!isBusy && !isDuringAbsolute && !isDuringRule) {
        slotsToCreate.push({
          [`${roleKey}Id`]: targetId,
          clinicId: constraintId ?? null,
          startAt: currentSlotTime,
          endAt: nextSlotTime,
        })
      }

      currentSlotTime = nextSlotTime
    }

    if (slotsToCreate.length > 0) {
      return await this.prisma.$transaction(async (tx) => {
        await tx.timeSlot.deleteMany({
          where: {
            doctorId: targetId,
            status: SLOT_STATUS.AVAILABLE,
          },
        })
        await tx.timeSlot.createMany({
          data: slotsToCreate,
          skipDuplicates: true,
        })
        return await tx.timeSlot.findMany({
          where: {
            doctorId: targetId,
            startAt: { gte: startOfDay, lte: endOfDay },
          },
          orderBy: { startAt: "asc" },
        })
      })
    }
  }

  private async _getBreak(doctorId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prisma

    return await prisma.break.findMany({
      where: { doctorId },
    })
  }

  private async _getWorkRule(doctorId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prisma

    return await prisma.workRule.findMany({
      where: { doctorId },
    })
  }

  private async _getSchedule(targetId: string, dayOfWeek: number) {
    return await this.prisma.schedule.findFirst({
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

  private _timeToMinute(time: string) {
    const minutes = time.split(":")
    return hoursToMinutes(Number(minutes[0])) + Number(minutes[1])
  }

  private _getSlotMinutes(date: Date): number {
    return date.getUTCHours() * 60 + date.getUTCMinutes()
  }
}
